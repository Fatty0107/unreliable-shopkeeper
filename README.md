# The Unreliable Shopkeeper

*Run a magical shop. Have absolutely no idea what any of your products do.*

A cosy, chaotic potion-shop game set in Gloambridge. You inherit **The Crooked Cork** from Aunt Marigold, buy strange ingredients, throw them into a temperamental cauldron, and sell whatever comes out. A troll asks to be invisible for his mum's surprise party; you accidentally brew something that makes everyone forget he exists. The *Gloambridge Gazette* reports on it the next morning.

**Play it:** open `index.html`, or visit the GitHub Pages site once it's enabled.

## The core mechanic: emergent potion effects

- Every one of the 38 ingredients carries three **hidden behaviours** (HUSH, HIDE, FLOAT, REMEMBER, SPARK…).
- There are **no fixed slots**: add any number of ingredients, in any quantity (with diminishing returns).
- A behaviour shared by two or more ingredients becomes the potion's **main effect**; the next becomes its secondary.
- **Conflicting behaviours don't cancel, they become quirks** (21 of them). HIDE + REMEMBER gives *Forget-Me-Lots*.
- **Heat** (cold → flare) and **stir** (still, clockwise, counter, brisk, alternating) change potency, stability and which effect wins.
- 24 **named formulae** from Marigold's journal are recognised whenever their core ingredients are present, even with extras added.
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

## Tech

Plain HTML, CSS and JavaScript: no build step, no dependencies. All art (characters, ingredients, bottles, the isometric shop) is drawn as inline SVG; sound is synthesised with the Web Audio API. Progress saves to `localStorage`.

```
index.html
css/style.css
js/data.js     ingredients, behaviours, quirks, formulae, customers, furniture
js/art.js      SVG illustration: icons, ingredients, bottles, portraits, isometric furniture
js/engine.js   state, brewing resolver, customer evaluation, economy, layout rules
js/ui.js       screens, interactions, modals, sound
```

Run locally by opening `index.html`, or serve the folder (`python3 -m http.server`).

## Deploying with GitHub Pages

Settings → Pages → *Deploy from a branch* → `main` / `(root)`. The included `.nojekyll` file serves the site as-is.
