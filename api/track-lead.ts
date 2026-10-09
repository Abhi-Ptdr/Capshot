/**
 * Phase 1 Plan 03 — Vercel Edge Function: Meta Conversions API relay
 * (CONV-01, INFRA-06).
 *
 * Receives: POST /api/track-lead with JSON body:
 *   { event_id: string, event_source_url: string, event_name: 'Lead' }
 *
 * Forwards to Meta Graph API v21.0:
 *   POST https://graph.facebook.com/v21.0/{DATASET_ID}/events
 *     ?access_token={ACCESS_TOKEN}
 *   body: { data: [{ event_name, event_time, event_id,
 *                    event_source_url, action_source: 'website',
 *                    user_data: { client_ip_address, client_user_agent }}]}
 *
 * The shared `event_id` matches the client-side Pixel fbq('track','Lead',
 * {event_id}) call so Meta Events Manager dedups to one Lead event per
 * click (research/SUMMARY §4). The `client_ip_address` + `client_user_agent`
 * are secondary dedup keys Meta uses when event_id matching fails.
 *
 * Security posture (threat register T-03-01, T-03-02):
 *   - META_CAPI_ACCESS_TOKEN is server-side ONLY — never prefixed with
 *     VITE_. Vite only inlines VITE_* vars at build time, so this value
 *     never reaches the client bundle (asserted by Task 2 verify-block
 *     grep: `grep -r META_CAPI_ACCESS_TOKEN dist/` → 0 matches).
 *   - The token is placed in the Graph API URL query string (per Meta
 *     docs). It is NEVER logged, NEVER echoed in the response body.
 *   - Missing-env deploys return 200 with `{skipped:true, reason:'env-
 *     missing'}` so the client-side fire-and-forget fetch's promise never
 *     rejects due to our config state. Meta errors return 200 to the
 *     client with `{ok:false, status, text}` for the same reason — the
 *     client is fire-and-forget and must not treat its fetch result as
 *     authoritative for UX purposes.
 */

export const config = { runtime: 'edge' };

interface TrackLeadRequestBody {
  event_id: string;
  event_source_url: string;
  event_name?: string;
}

interface MetaEventsPayload {
  data: Array<{
    event_name: string;
    event_time: number;
    event_id: string;
    event_source_url: string;
    action_source: 'website';
    user_data: {
      client_ip_address: string;
      client_user_agent: string;
    };
  }>;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ ok: false, error: 'method-not-allowed' }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  let body: TrackLeadRequestBody;
  try {
    body = (await req.json()) as TrackLeadRequestBody;
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'invalid-json' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  if (!body.event_id || !body.event_source_url) {
    return new Response(
      JSON.stringify({ ok: false, error: 'missing-required-fields' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  // Edge runtime globals: process.env is NOT available; Vercel Edge exposes
  // env vars via `process.env` under Node compat layer, OR via the global
  // `env` binding depending on runtime version. We prefer `process.env` for
  // compat with Vercel's latest edge runtime (2026).
  const envRef = (globalThis as unknown as {
    process?: { env?: Record<string, string | undefined> };
  }).process?.env;
  const accessToken = envRef?.META_CAPI_ACCESS_TOKEN;
  const datasetId = envRef?.META_CAPI_DATASET_ID;

  if (!accessToken || !datasetId) {
    // Graceful degradation: deploys without env vars still return 200 so
    // the client's fire-and-forget fetch promise does not reject.
    return new Response(
      JSON.stringify({ skipped: true, reason: 'env-missing' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
  const clientUa = req.headers.get('user-agent') ?? '';

  const metaPayload: MetaEventsPayload = {
    data: [
      {
        event_name: body.event_name ?? 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.event_id,
        event_source_url: body.event_source_url,
        action_source: 'website',
        user_data: {
          client_ip_address: clientIp,
          client_user_agent: clientUa,
        },
      },
    ],
  };

  const metaUrl = `https://graph.facebook.com/v21.0/${encodeURIComponent(datasetId)}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const metaRes = await fetch(metaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metaPayload),
    });
    if (!metaRes.ok) {
      const text = await metaRes.text();
      // Return 200 to the client even on Meta error — the client is
      // fire-and-forget. Do NOT include the request URL (would leak the
      // access_token). The `text` field is Meta's response body which does
      // not echo the token per Meta's API behavior.
      return new Response(
        JSON.stringify({ ok: false, status: metaRes.status, text }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    // Network failure to Meta. Still return 200 to the client — the Pixel
    // call already fired, so losing CAPI drops dedup but not the event.
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'meta-unreachable',
        message: e instanceof Error ? e.message : 'unknown',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
