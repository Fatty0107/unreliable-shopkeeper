# The Unreliable Shopkeeper

*Run a magical shop. Have absolutely no idea what any of your products do.*

A cosy, chaotic potion-shop game set in Gloambridge. You inherit **The Crooked Cork** from Aunt Marigold, buy strange ingredients, throw them into a temperamental cauldron, and sell whatever comes out. A troll asks to be invisible for his mum's surprise party; you accidentally brew something that makes everyone forget he exists. The *Gloambridge Gazette* reports on it the next morning.

**Play it:** open `index.html`, or visit the GitHub Pages site once it's enabled.

## The core mechanic: emergent potion effects

- Every one of the 50 ingredients carries three **hidden behaviours** (HUSH, HIDE, FLOAT, REMEMBER, SPARK…).
- There are **no fixed slots**: add any number of ingredients, in any quantity (with diminishing returns).
- A behaviour shared by two or more ingredients becomes the potion's **main effect**; the next becomes its secondary.
- **Conflicting behaviours don't cancel, they become quirks** (33 of them). HIDE + REMEMBER gives *Forget-Me-Lots*.
- **Heat** (cold → flare) and **stir** (still, clockwise, counter, brisk, alternating) change potency, stability and which effect wins.
- 76 **named formulae** are recognised whenever their core ingredients are present, even with extras added. Many are **technique recipes**: the same three ingredients give a different potion over a different fire or with a different stir (Hearthmend Tonic becomes Ember Liniment at a brisk boil, or Morning Dew Compress when left cold and still).
- A shelf of adventurer's staples in the tabletop-fantasy tradition: giant strength, haste, water breathing, shrinking, flight, night-eyes, a philtre of fondness.
- Results are deterministic, so the system is learnable. Every brew reveals which ingredients caused which behaviour.

## What's in the game

| Screen | What you do |
| --- | --- |
| **Shop** | Serve a daily queue of customers, ask questions to find their real need, respect their boundary, set prices and haggle. Rearrange furniture in an isometric editor (with undo, rotation, and a path check so customers never get trapped). |
| **Brew** | Searchable ingredient library, a cauldron with unlimited ingredient tokens, heat and stir controls, the customer's brief, and an experiment log. |
| **Ingredients** | Database of every material; spend research notes to study undiscovered behaviours. |
| **Recipes** | Marigold's journal: known formulae, your experiments, and rumours that hint at undiscovered recipes. |
| **Market** | Nessa Nettle's stall. Rare stock unlocks with reputation or time. |
| **Ledger** | Revenue, customer outcomes, best sellers, regulars' rapport, and a Gazette archive of consequences. |

Six recurring characters (Maudie, Kest, Count Croakwell, Tavi, Patch, Sable) return across a week with evolving requests, plus a Guild inspection from Ada Quill and a dozen walk-in guests. After the first week the shop stays open.

## Presentation

A title screen over the live shop, settings with separate Music / Effects / Ambience volumes, brass-framed panels with filigree corners, inventory-style slots, a lit isometric shop (moonlight shafts, candle and cauldron glow), and a particle layer for splashes, coin flights, sparkles and confetti. Music is a generative music-box waltz synthesised live; see `ART_BIBLE.md` for the palette and style rules.

## 3D shop

The shop is a real-time 3D scene (three.js, vendored in `js/vendor/`) rendered behind the interface: stone walls, arched windows, shadow-casting moon and lantern light, a bubbling cauldron, and 3D customers who walk in from the door. The brewing screen is a close-up of the same cauldron, and character portraits are rendered from the 3D models. Without WebGL the game falls back to the flat illustrated shop. Add `#low` to the URL for a lighter graphics mode.

## Tech

Plain HTML, CSS and JavaScript: no build step; three.js is the only dependency and is included. All art (characters, ingredients, bottles, the isometric shop) is drawn as inline SVG; sound is synthesised with the Web Audio API. Progress saves to `localStorage`.

```
index.html
css/style.css  layout
css/skin.css   visual finish (frames, slots, buttons, title, transitions)
js/data.js     ingredients, behaviours, quirks, formulae, customers, furniture
js/art.js      SVG illustration: icons, ingredients, bottles, portraits, isometric furniture
js/engine.js   state, brewing resolver, customer evaluation, economy, layout rules
js/data2.js    extra behaviours, ingredients, technique recipes, guests
js/g3core.js   3D core: textures, materials, mesh baking, ink outlines, bloom and colour grade
js/chars3d.js  rigged 3D characters: outfits, props, painted faces, animation
js/scene3d.js  the 3D shop, furniture, cameras, picking, portrait renderer
js/fx.js       particles, easing, counters, frame ornaments, audio engine, title screen
js/ui.js       screens, interactions, modals, sound
```

Run locally by opening `index.html`, or serve the folder (`python3 -m http.server`).

## Deploying with GitHub Pages

Settings → Pages → *Deploy from a branch* → `main` / `(root)`. The included `.nojekyll` file serves the site as-is.
