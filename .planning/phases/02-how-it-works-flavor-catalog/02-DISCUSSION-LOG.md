# Phase 2 Discussion Log

**Date:** 2026-10-10

## Gray Areas Presented

User selected all 7 areas for discussion (no "planner's call" default):

1. How It Works visual style
2. How It Works copy depth
3. Flavor card density on `/flavors`
4. Flavor product images (now vs later)
5. Range filter UI + URL sync
6. Homepage flavor teaser scope
7. Nav evolution (hamburger?)

## Decisions Captured (see 02-CONTEXT.md)

- **D2-01** How It Works visuals = vector/SVG illustrations per step
- **D2-02** Copy depth = Hinglish beat only (TWIST / SHAKE / BOOM), no English explainer
- **D2-04** Flavor card = color-washed accentHex bg + shared cap SVG recolored per flavor + name + 1-line description + range tag
- **D2-05** Flavor images = ONE shared vector cap SVG recolored via accentHex per card (no photo production this phase)
- **D2-07** Range filter UI = pill chips at top (All | Fruity Blast | Desi & Cool | Premium Sports), wrap on narrow mobile
- **D2-08** URL sync = clean `/flavors` for All, `/flavors?range=<slug>` for filtered views
- **D2-09** Homepage teaser = 8 curated flavors (4 Fruity + 2 Desi + 2 Premium Sports)
- **D2-10** Teaser layout = horizontal scroller with "See all 16 flavors →" as the 17th card
- **D2-11/D2-12** Nav evolution = hamburger menu with Flavors / About / Contact + socials (slide-in panel, focus-trap, Escape to close)

## Scope Guardrails

- Phase 3 scroll choreography is NOT in Phase 2 (locked)
- Per-flavor detail pages NOT in v1 scope
- Real flavor photography deferred to Phase 4+ (studio shoot gated)
- Nutrition facts deferred to Phase 5 (GATE-NUTRITION)
- "Energy drink" phrasing forbidden (Phase 1 CI grep enforces)
