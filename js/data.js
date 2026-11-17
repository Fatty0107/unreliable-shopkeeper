/* ============ DATA: behaviours, ingredients, formulas, quirks, customers ============ */
const BEH = {
  HUSH:     {c:'#9d8cf2', adj:'Hushed',     noun:['Hush Draught','Quietude'],        fx:'muffles every sound around the drinker', oops:'{c} could not be heard for six hours; ordered soup by interpretive dance'},
  HIDE:     {c:'#6e6a8f', adj:'Shadowy',    noun:['Vanishing Draught','Unseen Tonic'], fx:'makes the drinker very hard to notice', oops:'{c} went missing for an afternoon while standing in plain sight'},
  DREAM:    {c:'#c79bf2', adj:'Dreamy',     noun:['Reverie','Dream Syrup'],          fx:'fills the head with vivid daydreams', oops:'{c} spent the day convinced the canal was soup'},
  SLEEP:    {c:'#8a9be8', adj:'Drowsy',     noun:['Slumber Draught','Nap Cordial'],  fx:'brings on deep, heavy sleep', oops:'{c} fell asleep mid-sentence; sentence finished the next morning'},
  MEND:     {c:'#7fd6a0', adj:'Mending',    noun:['Mending Tonic','Patch-Up Elixir'], fx:'knits small hurts back together', oops:'{c} mended so thoroughly their trousers sealed shut'},
  SOOTHE:   {c:'#a7e0d6', adj:'Soothing',   noun:['Calming Cordial','Balm'],         fx:'calms irritation and frayed nerves', oops:'{c} became so calm they forgot why they came to town'},
  WARM:     {c:'#f2a35b', adj:'Toasty',     noun:['Hearth Brew','Ember Tonic'],      fx:'spreads a steady warmth through the body', oops:'{c} gently steamed all afternoon; local cats gathered'},
  COOL:     {c:'#9ed8f2', adj:'Frosted',    noun:['Chill Tonic','Frost Cordial'],    fx:'cools the drinker right down', oops:'{c} left a trail of tiny frost footprints down Bellwether Lane'},
  GLOW:     {c:'#f5d36a', adj:'Glowing',    noun:['Lumen Draught','Glow Syrup'],     fx:'makes the drinker glow softly', oops:'{c} glowed so brightly the moths held a meeting'},
  FLOAT:    {c:'#cfe6ff', adj:'Floaty',     noun:['Levity Elixir','Featherbrew'],    fx:'makes things lighter than air', oops:'{c} spotted drifting over the clocktower; "I specifically said no floating"'},
  BIND:     {c:'#c27ab8', adj:'Sticky',     noun:['Binding Syrup','Cling Tonic'],    fx:'makes things stick together firmly', oops:'{c} is now permanently attached to a bench. The bench seems happy'},
  REVEAL:   {c:'#f0f0ff', adj:'Revealing',  noun:['Truthwater','Clarity Drops'],     fx:'makes hidden things visible', oops:'{c} accidentally revealed every hidden thing in a three-street radius, including the mayor\'s toupée'},
  REMEMBER: {c:'#8fb8f5', adj:'Mnemonic',   noun:['Memory Cordial','Recall Tonic'],  fx:'brings old memories back sharply', oops:'{c} now remembers every embarrassing thing they did, aged six to forty'},
  CHEER:    {c:'#ffb3c7', adj:'Giggling',   noun:['Cheer Fizz','Merriment'],         fx:'lifts the mood, often too much', oops:'{c} laughed through a solemn ceremony; ceremony now "much improved"'},
  SPARK:    {c:'#6fd0ff', adj:'Fizzing',    noun:['Pep Draught','Zap Tonic'],        fx:'gives a jolt of crackling energy', oops:'{c} ran twelve laps of the market before breakfast and is still vibrating'},
  PROTECT:  {c:'#d6a65a', adj:'Warding',    noun:['Ward Oil','Shieldwater'],         fx:'forms a light protective layer', oops:'{c} became so well-protected that nobody could hug them'},
  RESONATE: {c:'#b9c7ff', adj:'Echoing',    noun:['Chime Draught','Resonance'],      fx:'makes the voice carry and ring', oops:'{c}\'s whisper was heard in the next village'},
  MISDIRECT:{c:'#e39cf0', adj:'Shifty',     noun:['Glamour Mist','Illusion Drops'],  fx:'creates a convincing illusion', oops:'{c} was mistaken for a lamppost by three dogs'},
  GROW:     {c:'#9bd66b', adj:'Sprouting',  noun:['Growth Tonic','Greenwater'],      fx:'makes living things grow eagerly', oops:'{c} sprouted a small but determined fern'},
  PRESERVE: {c:'#e8c98a', adj:'Lasting',    noun:['Keeping Syrup','Preserve'],       fx:'stops things spoiling or changing', oops:'{c}\'s hairstyle is now preserved exactly as it was, forever'},
  STEADY:   {c:'#b8a58f', adj:'Steady',     noun:['Steadying Tonic','Anchor Draught'], fx:'steadies hands, nerves and balance', oops:'{c} became so steady they could not be moved from the doorway'},
  GUIDE:    {c:'#f2c48f', adj:'Wayfinding', noun:['Compass Cordial','Pathfinder'],   fx:'points the drinker toward what they seek', oops:'{c} followed their nose to the bakery four times'}
};
const BEH_IDS = Object.keys(BEH);

/* Conflicting behaviours do not cancel: they become quirks. */
const QUIRKS = [
  {a:'HIDE',b:'REMEMBER', name:'Forget-Me-Lots',     fx:'perfectly visible, but everyone forgets they exist a moment later', head:'WHO? Local resident forgotten by entire town. Landlord also forgets the rent and calls it "a wash"'},
  {a:'HUSH',b:'RESONATE', name:'Private Broadcast',  fx:'only one chosen person can hear anything they say', head:'{c} spends day shouting secrets only the postman can hear. Postman "deeply informed"'},
  {a:'HIDE',b:'GLOW',     name:'Outline Only',       fx:'vanishes except for a bright glowing outline', head:'Glowing silhouette seen walking down Bellwether Lane. "It waved," report witnesses'},
  {a:'HIDE',b:'REVEAL',   name:'Selective Visibility', fx:'invisible to everyone except people they owe money to', head:'{c} invisible to all but creditors. Creditors "thrilled", {c} "less so"'},
  {a:'FLOAT',b:'BIND',    name:'Tethered Hover',     fx:'floats, but stays stuck to the nearest chair', head:'{c} and a kitchen chair seen orbiting the fountain together'},
  {a:'SLEEP',b:'SPARK',   name:'Sleep-Sprinting',    fx:'falls asleep instantly, then sleepwalks at tremendous speed', head:'Sleeping figure wins Gloambridge Canal Fun Run. Has no memory of entering'},
  {a:'WARM',b:'COOL',     name:'Thermal Hiccups',    fx:'flips between toasty and frosty with every hiccup', head:'{c}\'s hiccups alternately melt and freeze the town fountain'},
  {a:'GROW',b:'PRESERVE', name:'The Eternal Eyebrow',fx:'one eyebrow grows steadily and refuses to be trimmed', head:'{c}\'s left eyebrow reaches shoulder length. Barber hospitalised with exhaustion'},
  {a:'FLOAT',b:'STEADY',  name:'Two-Inch Hover',     fx:'hovers exactly two inches off the ground, extremely calmly', head:'{c} hovers two inches above the floor all day, "very serene about it"'},
  {a:'MISDIRECT',b:'REVEAL', name:'Wrong-Window Truth', fx:'reveals the truth, but to the wrong person', head:'{c}\'s private diary contents revealed to a confused goose'},
  {a:'GUIDE',b:'MISDIRECT', name:'Confident Compass', fx:'points with total certainty toward the nearest cheese', head:'{c} found the Lost Cheese of Gloambridge while looking for something else entirely'},
  {a:'SLEEP',b:'CHEER',   name:'Giggle Snore',       fx:'giggles loudly all night while sound asleep', head:'Neighbours of {c} report "sinister giggling" until dawn'},
  {a:'DREAM',b:'REMEMBER',name:'Dream Receipts',     fx:'remembers last night\'s dreams as real events', head:'{c} demands the bakery return the horse it never borrowed'},
  {a:'RESONATE',b:'CHEER',name:'Delayed Laughter',   fx:'every laugh echoes back three seconds later', head:'{c}\'s laugh still echoing around the Lantern Steps; tourists confused'},
  {a:'GLOW',b:'HUSH',     name:'Shushing Lamp',      fx:'glows, and shushes anyone who speaks nearby', head:'{c} hired by the library as a lamp. "Best hire we\'ve made," says librarian'},
  {a:'SPARK',b:'SOOTHE',  name:'Calm Static',        fx:'perfectly calm, but their hair stands straight up and crackles', head:'{c} serenely electrocutes three doorknobs'},
  {a:'HIDE',b:'GROW',     name:'Invisible Moss',     fx:'grows an invisible beard of moss (it can still be tripped over)', head:'Mystery trip hazard on Bellwether Lane traced to {c}\'s invisible beard'},
  {a:'SLEEP',b:'GUIDE',   name:'Sleep Errands',      fx:'sleepwalks to wherever they meant to go tomorrow', head:'{c} found asleep at tomorrow\'s appointment, a day early and very punctual'},
  {a:'BIND',b:'CHEER',    name:'Clingy Joy',         fx:'becomes so fond of objects they refuse to let go', head:'{c} refuses to release a lamppost, cites "a real connection"'},
  {a:'FLOAT',b:'SLEEP',   name:'Cloud Nap',          fx:'naps while drifting gently above the rooftops', head:'{c} found asleep on the weathervane. Weathervane "fine with it"'},
  {a:'PROTECT',b:'REVEAL',name:'Transparent Armour', fx:'grows a protective shell that is completely see-through', head:'{c} safe from all harm, but everyone can see what they had for lunch'}
];

const RARITY = {C:{n:'Common',c:'#b9b0a0'},U:{n:'Uncommon',c:'#7fd6a0'},R:{n:'Rare',c:'#8fb8f5'},V:{n:'Very rare',c:'#f5b06a'}};

/* t = icon template, p = palette [main, accent, dark] */
const ING = [
 {id:'mooncap',n:'Mooncap',t:'mushroom',p:['#7a8cf0','#e8ecff','#3b3f8f'],b:['HUSH','DREAM','SOOTHE'],r:'C',cost:4,src:'Found under old bridges after rain.',react:'Folds inward when heated; spores drift like slow snow.'},
 {id:'glassberry',n:'Glassberry',t:'berries',p:['#7fd8f0','#e6fbff','#2c6f8f'],b:['MISDIRECT','REVEAL','GLOW'],r:'U',cost:8,src:'Skin reflects a moment late.',react:'Trembles when a nervous customer is near.'},
 {id:'dewlily',n:'Dewlily',t:'lily',p:['#fbf6ee','#9bd66b','#c8b89a'],b:['MEND','SOOTHE','GROW'],r:'C',cost:3,src:'Picked before sunrise, cup full of dew.',react:'Petals cup around steam like a tiny umbrella.'},
 {id:'sunroot',n:'Sunroot',t:'root',p:['#f2b04b','#ffe39a','#8f5a1f'],b:['WARM','STEADY','SPARK'],r:'C',cost:4,src:'Knobbly golden root with a warm orange heart.',react:'Core brightens; scorched slices caramelise.'},
 {id:'emberpetal',n:'Emberpetal',t:'petal',p:['#e8503a','#ffd36a','#7a1f1f'],b:['WARM','SPARK','GLOW'],r:'C',cost:3,src:'A curled red petal shaped like a folded flame.',react:'Unfurls into a ribbon when stirred.'},
 {id:'cinderpepper',n:'Cinderpepper',t:'pod',p:['#3a1f2a','#ff7a3a','#1a0d12'],b:['SPARK','PROTECT','WARM'],r:'U',cost:7,src:'Black-red pod with three rattling ember seeds.',react:'Seeds pop at high heat and sneeze sparks.'},
 {id:'mossheart',n:'Mossheart',t:'moss',p:['#6fae4f','#e8e0c8','#2f5a26'],b:['BIND','GROW','PROTECT'],r:'C',cost:3,src:'A heart-shaped cushion of moss with a woody knot.',react:'Spreads across the bowl unless chopped.'},
 {id:'whisperleaf',n:'Whisperleaf',t:'leaf',p:['#9fb59a','#dfe8d8','#4a5f47'],b:['HUSH','RESONATE','MISDIRECT'],r:'C',cost:3,src:'Grey-green leaf with veins like sound waves.',react:'Vibrates when a familiar name is spoken.'},
 {id:'mirrorsalt',n:'Mirror Salt',t:'crystal',p:['#e8e6ff','#ffc8f0','#8f8fc8'],b:['REVEAL','GLOW','MISDIRECT'],r:'R',cost:18,src:'Faceted opal flakes reflecting several colours at once.',react:'Briefly shows a possible finished silhouette.'},
 {id:'tideglass',n:'Tideglass',t:'pebble',p:['#5fd0c0','#ffb3d0','#1f6f6a'],b:['STEADY','FLOAT','COOL'],r:'U',cost:9,src:'Sea-glass pebble shifting from teal to pink.',react:'Sinks slowly, then floats back up.'},
 {id:'lanternpollen',n:'Lantern Pollen',t:'dust',p:['#f5c04a','#fff1b0','#a8701f'],b:['GLOW','GUIDE','CHEER'],r:'C',cost:4,src:'Amber dust that glows like a cloud of fireflies.',react:'Particles orbit the nearest light.'},
 {id:'stormglass',n:'Stormglass',t:'shard',p:['#6a7cf0','#ffffff','#2a2f7a'],b:['SPARK','GLOW','RESONATE'],r:'R',cost:16,src:'A jagged shard with a white lightning thread inside.',react:'A tiny arc jumps toward metal tools.'},
 {id:'clover',n:'Laughing Clover',t:'clover',p:['#5fc06a','#d8ffb0','#2a6a30'],b:['CHEER','MISDIRECT','GROW'],r:'C',cost:3,src:'A three-leaf sprig that bounces even when laid flat.',react:'Makes bottles wobble with a faint chuckle.'},
 {id:'bluebellsage',n:'Bluebell Sage',t:'bell',p:['#7aa0f0','#cfe0ff','#3a5a8f'],b:['REMEMBER','STEADY','REVEAL'],r:'C',cost:4,src:'Soft blue leaves with a cool, minty smell.',react:'The flower rings once when a clue is near.'},
 {id:'frostmint',n:'Frostmint',t:'mint',p:['#9fe0d0','#ffffff','#3f8f80'],b:['COOL','PRESERVE','SOOTHE'],r:'C',cost:3,src:'Silver-green mint with frost under each leaf.',react:'Steam turns into little snowflakes.'},
 {id:'poppy',n:'Drowsy Poppy',t:'poppy',p:['#b38ff0','#2a1f3a','#6a4fa8'],b:['SLEEP','HUSH','DREAM'],r:'U',cost:7,src:'Drooping lilac poppy with a velvet-black centre.',react:'Pollen falls in slow, deliberate spirals.'},
 {id:'brambleplum',n:'Bramble Plum',t:'fruit',p:['#7a2f8f','#c070d0','#3a0f4a'],b:['BIND','CHEER','HIDE'],r:'C',cost:3,src:'Sticky deep purple fruit, tart and stubborn.',react:'Juice stretches into glossy threads.'},
 {id:'thyme',n:'Hearth Thyme',t:'sprig',p:['#8fae5f','#f2d39a','#4f6a2f'],b:['WARM','SOOTHE','STEADY'],r:'C',cost:3,src:'Smells like toasted bread and clean blankets.',react:'Steam curls into a little hearth shape.'},
 {id:'silverdill',n:'Silver Dill',t:'fronds',p:['#c8d8d0','#ffffff','#6f8f80'],b:['REVEAL','MEND','PRESERVE'],r:'U',cost:8,src:'Pale fronds with silver seeds that click together.',react:'Sediment gathers neatly at the bottom.'},
 {id:'anemone',n:'Tide Anemone',t:'anemone',p:['#ff9fb8','#ffe0e8','#a84f6a'],b:['FLOAT','GUIDE','COOL'],r:'U',cost:8,src:'Dried sea flower with ribbon-like tendrils.',react:'Tendrils wave in perfectly still liquid.'},
 {id:'morel',n:'Starlit Morel',t:'morel',p:['#8a6a4a','#fff2a0','#4a3420'],b:['SPARK','DREAM','GROW'],r:'R',cost:15,src:'Honeycomb mushroom with pinprick lights in its cap.',react:'Glows brighter when a new formula appears.'},
 {id:'inkcap',n:'Inkcap',t:'inkcap',p:['#2a2f4a','#5a7cf0','#10121f'],b:['HIDE','BIND','REMEMBER'],r:'C',cost:3,src:'Glossy dark mushroom that leaks blue-black ink.',react:'Ink curls into letters before dissolving.'},
 {id:'moonstone',n:'Moonstone Dust',t:'crescent',p:['#c8d8ff','#ffffff','#6a7ab8'],b:['DREAM','GLOW','REMEMBER'],r:'R',cost:14,src:'Pale powder with a faint moonlit shimmer.',react:'Settles into a crescent at the bottom.'},
 {id:'honeyamber',n:'Honey Amber',t:'drop',p:['#f0a83a','#fff0b0','#8f5a10'],b:['PRESERVE','BIND','WARM'],r:'U',cost:9,src:'Golden resin drop with tiny trapped bubbles.',react:'Bubbles rise and stop beneath a glassy skin.'},
 {id:'papermoon',n:'Paper Moon',t:'papermoon',p:['#f2ead8','#c8b8f0','#8f7f6a'],b:['MISDIRECT','DREAM','HIDE'],r:'U',cost:9,src:'A folded paper charm that casts a moon-shaped shadow.',react:'Its shadow moves independently of the light.'},
 {id:'griffindown',n:'Griffin Down',t:'feather',p:['#f5e6c8','#c8a06a','#8f6a3a'],b:['FLOAT','GUIDE','CHEER'],r:'R',cost:15,src:'A down tuft from a griffin\'s nesting ledge.',react:'Floats toward the highest point in the room.'},
 {id:'spidersilk',n:'Spider Silk',t:'spool',p:['#f0f0f8','#b8b8d0','#8a6a4a'],b:['BIND','MEND','PROTECT'],r:'C',cost:4,src:'Naturally abandoned strand from a garden spider.',react:'Pulls into a shining thread between tools.'},
 {id:'echobead',n:'Echo Bead',t:'bead',p:['#8fd0f0','#ffffff','#2f6a8f'],b:['RESONATE','REMEMBER','STEADY'],r:'U',cost:9,src:'A glass bead that repeats the last sound near it.',react:'A tiny sound-ring circles the rim.'},
 {id:'laughter',n:'Bottled Laughter',t:'phial',p:['#ffb3d0','#fff0a0','#a84f7a'],b:['CHEER','FLOAT','MISDIRECT'],r:'R',cost:14,src:'Donated by a willing performer. Corked tight.',react:'Escapes as a string of giggling bubbles.'},
 {id:'sirenpearl',n:'Siren Pearl',t:'pearl',p:['#f0e6ff','#b8f0ff','#8f7ab8'],b:['RESONATE','GUIDE','DREAM'],r:'R',cost:18,src:'A small pearl that hums when held near the ear.',react:'Makes the vessel ring like a distant bell.'},
 {id:'wool',n:'Cloudsheep Wool',t:'wool',p:['#f8f4ff','#d8d0f0','#9a90b8'],b:['WARM','PROTECT','FLOAT'],r:'U',cost:8,src:'A soft curl shed by a cloud-grazing sheep.',react:'Fibres drift upward before settling.'},
 {id:'sigh',n:'Borrowed Sigh',t:'jarwisp',p:['#bfe0f0','#ffffff','#6a8fa8'],b:['SOOTHE','STEADY','HUSH'],r:'U',cost:8,src:'A breath captured, with consent, after a long day.',react:'Makes the liquid exhale before it bubbles.'},
 {id:'drakescale',n:'Drakescale Shed',t:'scale',p:['#d8783a','#ffc070','#7a3a10'],b:['PROTECT','WARM','PRESERVE'],r:'U',cost:10,src:'A naturally shed copper scale, warm not hot.',react:'Edges glow like banked coals.'},
 {id:'sootquartz',n:'Soot Quartz',t:'crystal',p:['#4a4a5a','#f5f5ff','#1f1f2a'],b:['HIDE','HUSH','PROTECT'],r:'U',cost:9,src:'Matte charcoal crystal with a bright hidden line.',react:'Its surface drinks nearby colour.'},
 {id:'phoenixash',n:'Phoenix Ash',t:'ash',p:['#f07a3a','#ffe0a0','#5a2a1a'],b:['MEND','WARM','GLOW'],r:'V',cost:30,src:'Warm ash from a licensed renewal brazier.',react:'Rises in a spiral and falls as clean dust.'},
 {id:'keytooth',n:'Old Key Tooth',t:'key',p:['#c8a04a','#fff0b0','#6a4f1a'],b:['REVEAL','REMEMBER','GUIDE'],r:'R',cost:14,src:'Worn brass from a key that opened something important.',react:'Rotates toward the nearest hidden compartment.'},
 {id:'candlewick',n:'Candlewick',t:'candle',p:['#f5ead0','#ffc84a','#8f7a5a'],b:['GLOW','GUIDE','WARM'],r:'C',cost:3,src:'From a candle burned through a meaningful conversation.',react:'Its end glows without a flame.'},
 {id:'puffball',n:'Velvet Puffball',t:'puffball',p:['#f0e0c8','#fff8ee','#a8906a'],b:['PROTECT','HIDE','SOOTHE'],r:'C',cost:3,src:'Soft cream fungus that releases a cloud when tapped.',react:'A harmless puff forms a temporary tiny creature.'}
];
const INGM = Object.fromEntries(ING.map(i=>[i.id,i]));

/* Named formulas (from Marigold's journal). core = required set; extras allowed. */
const FORMULAS = [
 {id:'hearthmend',n:'Hearthmend Tonic',core:['dewlily','sunroot','mossheart'],main:'MEND',sec:'WARM',col:'#7fd6a0',bottle:'round',val:26,fx:'Gentle recovery and warmth; smells of clean blankets.',side:'Drinker hums lullabies for ten minutes.',hint:'Marigold: "A lily, a root and a little green heart. For the tired ones."'},
 {id:'wintergreen',n:'Wintergreen Salve',core:['frostmint','dewlily','honeyamber'],main:'SOOTHE',sec:'PRESERVE',col:'#c8f0e0',bottle:'jar',val:30,fx:'Cools irritation and preserves delicate materials.',side:'Leaves a faint frost fern on the skin.',hint:'A doodle: a snowflake, a cup of dew, and a drop of something golden.'},
 {id:'steadyhand',n:'Steady-Hand Syrup',core:['spidersilk','dewlily','wool'],main:'STEADY',sec:'SOOTHE',col:'#d8dce8',bottle:'dropper',val:34,fx:'Calm, controlled hands during delicate work.',side:'Fingertips feel faintly woolly.',hint:'Margin note: "silk for patience, wool for comfort, dew for kindness."'},
 {id:'hearthguard',n:'Hearthguard Draught',core:['drakescale','emberpetal','sunroot'],main:'PROTECT',sec:'WARM',col:'#e8843a',bottle:'flat',val:36,fx:'A warming protective draught for cold work.',side:'Breath steams like a small kettle.',hint:'Grakka swears by "a dragon\'s cast-off, a hot petal and a sunny root."'},
 {id:'gentleday',n:'Gentle Day',core:['bluebellsage','clover','honeyamber'],main:'CHEER',sec:'STEADY',col:'#f5d36a',bottle:'round',val:28,fx:'Eases a tense morning without forcing cheer.',side:'Small blue motes follow the drinker.',hint:'"Something blue to remember, something green to laugh, something golden to keep."'},
 {id:'pillowmoon',n:'Pillowmoon',core:['poppy','mooncap','moonstone'],main:'SLEEP',sec:'DREAM',col:'#c8b0f0',bottle:'round',val:40,fx:'Restful sleep and softer dreams.',side:'Crescent-shaped foam ring on the pillow.',hint:'Three moons on a page: one flower, one mushroom, one dust.'},
 {id:'pocketquiet',n:'Pockets of Quiet',core:['mooncap','inkcap','whisperleaf'],main:'HUSH',sec:'HIDE',col:'#3a2f5a',bottle:'vial',val:32,fx:'A small hush around a person or object.',side:'Footsteps make no sound but a faint "pff".',hint:'"Two mushrooms and a leaf that listens. Shh."'},
 {id:'mirrorstep',n:'Mirrorstep Mist',core:['glassberry','mirrorsalt','papermoon'],main:'MISDIRECT',sec:'REVEAL',col:'#e0b8f0',bottle:'oddity',val:44,fx:'Brief visual misdirection; a doubled silhouette.',side:'Your reflection waves a second late.',hint:'A sketch of two silhouettes, one holding a paper moon.'},
 {id:'wisplantern',n:'Wisp Lantern',core:['lanternpollen','griffindown','morel'],main:'GLOW',sec:'GUIDE',col:'#f5c84a',bottle:'round',val:42,fx:'A floating guide-light that follows its owner.',side:'The light occasionally wanders off to look at moths.',hint:'Doodle: three drops orbiting a feather.'},
 {id:'borrowedvoice',n:'Borrowed Voice',core:['echobead','sirenpearl','whisperleaf'],main:'RESONATE',sec:'GUIDE',col:'#d8e8ff',bottle:'vial',val:46,fx:'Carries a chosen voice across a distance.',side:'Your voice arrives slightly before you do.',hint:'"A bead that repeats, a pearl that sings, a leaf that carries."'},
 {id:'lockwhisper',n:'Lockwhisper Oil',core:['keytooth','mirrorsalt','silverdill'],main:'REVEAL',sec:'REMEMBER',col:'#e0c070',bottle:'dropper',val:48,fx:'Reveals the outline of a hidden latch.',side:'The bottle points at every lock in the room.',hint:'Kest: "Old key, shiny salt, clever dill. Don\'t tell the Guild."'},
 {id:'featherfloat',n:'Featherfloat',core:['wool','griffindown','anemone'],main:'FLOAT',sec:'PROTECT',col:'#f5f0e6',bottle:'flat',val:40,fx:'Makes a light object drift gently down.',side:'Hair stands up as if underwater.',hint:'"Wool, down and a sea flower: the softest landing in town."'},
 {id:'courage',n:'Courage in a Cup',core:['clover','laughter','thyme'],main:'CHEER',sec:'STEADY',col:'#f0b84a',bottle:'round',val:38,fx:'A small lift before a difficult conversation.',side:'Drinker speaks in rhyme for ten minutes.',hint:'"A laugh, a clover, and something that smells like home."'},
 {id:'quietnight',n:'Quiet Night',core:['poppy','mooncap','sigh'],main:'SLEEP',sec:'SOOTHE',col:'#b8a8e0',bottle:'round',val:34,fx:'Softens restless thoughts; settles a room.',side:'The room exhales once at midnight.',hint:'"Poppy, mooncap, and a sigh someone no longer needed."'},
 {id:'clearhead',n:'Clear Head, Clear Glass',core:['silverdill','glassberry','moonstone'],main:'REVEAL',sec:'STEADY',col:'#f0f8ff',bottle:'vial',val:44,fx:'Separates muddled perceptions; clarifies a clue.',side:'A silver line appears down the middle of your vision.',hint:'Ada Quill keeps a recipe card: "dill, glassberry, moonstone. Measured."'},
 {id:'pocketwonder',n:'Pocket Wonder',core:['papermoon','laughter','morel'],main:'MISDIRECT',sec:'CHEER',col:'#9a6ae0',bottle:'oddity',val:46,fx:'A tiny harmless illusion for a playful moment.',side:'Small paper stars fall from your pockets.',hint:'Patch left a note: "PAPER. LAUGH. STAR-MUSHROOM. = WONDER."'},
 {id:'lanternheart',n:'Lanternheart',core:['candlewick','lanternpollen','honeyamber'],main:'GLOW',sec:'PRESERVE',col:'#f0a83a',bottle:'round',val:34,fx:'A long-lasting low-glare light.',side:'Smells faintly of birthday cake.',hint:'"A wick, some pollen, and amber to make it last all night."'},
 {id:'memorydew',n:'Memory Dew',core:['bluebellsage','moonstone','echobead'],main:'REMEMBER',sec:'DREAM',col:'#a8c8f5',bottle:'dropper',val:44,fx:'Helps recall a sound or sensory detail.',side:'Recalls the sound of rain rather than a face.',hint:'"Sage to keep, moon to dream, and an echo to bring it back."'},
 {id:'stagefright',n:'Stagefright Fog',core:['mooncap','lanternpollen','clover'],main:'HIDE',sec:'CHEER',col:'#d8c0f0',bottle:'flat',val:30,fx:'Stage mist that hides a performer at the edges.',side:'The fog giggles at punchlines.',hint:'Tamsin: "Mooncap, pollen and clover. The fog does the rest."'},
 {id:'softlanding',n:'Soft Landing',core:['wool','mossheart','griffindown'],main:'PROTECT',sec:'FLOAT',col:'#f5ecdc',bottle:'jar',val:38,fx:'Cushions a fall or protects fragile parcels.',side:'Everything you drop bounces once, politely.',hint:'"Wool, moss and down. Kest should keep a crate of this."'},
 {id:'sleepysunbeam',n:'Sleepy Sunbeam',core:['sunroot','poppy','lanternpollen'],main:'SLEEP',sec:'WARM',col:'#f5c890',bottle:'round',val:32,fx:'A warm nap-light that gently dims a room.',side:'Drinker yawns in harmony with others.',hint:'"A sunny root and a sleepy flower. A nap on a windowsill."'},
 {id:'keepsafe',n:'Keep This Safe',core:['honeyamber','spidersilk','drakescale'],main:'PRESERVE',sec:'PROTECT',col:'#f5d070',bottle:'jar',val:42,fx:'A protective seal around a small keepsake.',side:'The keepsake purrs when held.',hint:'"Amber to keep, silk to wrap, a dragon\'s scale to guard."'},
 {id:'soothe',n:'Soothe the Skin',core:['dewlily','spidersilk','sigh'],main:'SOOTHE',sec:'MEND',col:'#f5f0e0',bottle:'jar',val:30,fx:'Calms irritation from heat or overwork.',side:'Almost scentless. Almost.',hint:'Maudie: "Dewlily, silk and a good long sigh, dear."'},
 {id:'freshstart',n:'Fresh Start Wash',core:['phoenixash','dewlily','silverdill'],main:'MEND',sec:'REVEAL',col:'#fff4dc',bottle:'flat',val:60,fx:'Restores a material\'s useful surface.',side:'Everything it touches smells like Tuesday morning.',hint:'Nessa: "Ash from a renewal brazier, if you can afford it."'}
];
const FORMM = Object.fromEntries(FORMULAS.map(f=>[f.id,f]));

const HEATS = [
 {id:'cold',n:'Cold infusion',s:'Cold'},{id:'gentle',n:'Gentle warmth',s:'Gentle'},{id:'simmer',n:'Simmer',s:'Simmer'},{id:'boil',n:'Rolling boil',s:'Boil'},{id:'flare',n:'Quick flare',s:'Flare'}
];
const STIRS = [
 {id:'still',n:'Still',s:'Still'},{id:'cw',n:'Slow clockwise',s:'Clock'},{id:'ccw',n:'Counter-clockwise',s:'Counter'},{id:'brisk',n:'Brisk',s:'Brisk'},{id:'alt',n:'Alternating',s:'Alt'}
];
const SIDE_EFFECTS = [
 'Foams over and smells of burnt toast','Whispers your secrets when shaken','Has grown a small, harmless face','Turned Mallow the cat lilac for an hour',
 'Crystallises around the cork','Hums sea shanties after dark','Gets warm when someone lies nearby','Separates into two moody layers',
 'Occasionally knocks from inside the bottle','Leaves the drinker\'s shadow slightly late','Tastes different to everyone, mostly of pennies','Fizzes in time to nearby music'
];

/* ---------- Portraits ---------- */
const PORTRAITS = {
 maudie:{skin:'#f6c9a8',hair:'#f4f1ec',hairStyle:'curls',eyes:'glasses',ears:'round',clothes:'#e98aa5',clothes2:'#f7d0dc',bg:'#5a3f7a',extra:['blush'],nose:'round'},
 kest:{skin:'#a8c98a',hair:'#5a3a24',hairStyle:'messy',eyes:'goggles',ears:'goblin',clothes:'#b8743a',clothes2:'#e8c07a',bg:'#3f5a6a',extra:['freckles']},
 croak:{skin:'#6fbf5a',frog:true,eyes:'frog',clothes:'#1f1a2a',clothes2:'#c8343a',hat:'tophat',bg:'#2a2140',extra:['fangs','cape']},
 tavi:{skin:'#c69c74',hair:'#5f8f4a',hairStyle:'braids',eyes:'normal',ears:'round',clothes:'#6f8f4a',clothes2:'#a8c08a',bg:'#3a5a3f',extra:['leaf','freckles']},
 patch:{skin:'#e8d8c0',stitched:true,eyes:'button',clothes:'#6a4f9a',clothes2:'#e8a83a',hat:'witch',hatCol:'#7a5ab8',bg:'#4a3a6a',extra:['stitch']},
 sable:{skin:'#f2c6a0',hair:'#c8502f',hairStyle:'long',eyes:'normal',ears:'elf',clothes:'#3f6a3a',clothes2:'#8fae5f',bg:'#2f4a3a',hat:'hood',hatCol:'#3a5a34',extra:['freckles']},
 ada:{skin:'#e8b894',hair:'#3a2a24',hairStyle:'bun',eyes:'spectacles',ears:'round',clothes:'#2a3a6a',clothes2:'#e8e0c8',bg:'#2a3550',extra:['quill']},
 gorvin:{skin:'#8a9ab0',hair:'#4a4a5a',hairStyle:'tuft',eyes:'small',ears:'big',clothes:'#8f6a4a',clothes2:'#c8a06a',bg:'#4a4a6a',extra:['tusks','bigjaw']},
 bramble:{skin:'#c8a07a',spiky:true,hairStyle:'quills',hair:'#6a4a2f',eyes:'beady',ears:'round',clothes:'#f2ece0',clothes2:'#e8a0a0',bg:'#6a4a3a',extra:['snout','apron']},
 miri:{skin:'#f8d8e8',hair:'#8fe0f0',hairStyle:'pixie',eyes:'big',ears:'elf',clothes:'#d880c0',clothes2:'#ffe0f0',bg:'#5a3a6a',extra:['wings','sparkle']},
 tallow:{skin:'#f2e6c8',candle:true,eyes:'small',clothes:'#a8906a',clothes2:'#e8d8b0',bg:'#5a4a3a',extra:['flame','drips']},
 puddle:{skin:'#7ab8d8',hair:'#3a7a9a',hairStyle:'wave',eyes:'big',ears:'fin',clothes:'#2f5a7a',clothes2:'#9fd8f0',bg:'#244a60',extra:['droplets']},
 bellmaker:{skin:'#c8a06a',bird:true,eyes:'gear',clothes:'#8f6a3a',clothes2:'#f0d08a',bg:'#4a3a2a',extra:['beak','crest']},
 tamsin:{skin:'#f07a4a',hair:'#ffd04a',hairStyle:'flame',eyes:'normal',ears:'round',clothes:'#7a2a4a',clothes2:'#ffd04a',bg:'#5a2a3a',extra:['scales','sparkle']},
 grakka:{skin:'#7fa86a',hair:'#2a2a2a',hairStyle:'mohawk',eyes:'small',ears:'goblin',clothes:'#6a5a4a',clothes2:'#a89070',bg:'#4a3a2a',extra:['tusks','brow','beard']},
 wobble:{skin:'#f2c6a0',hair:'#d8b070',hairStyle:'none',eyes:'normal',ears:'round',clothes:'#a8b0c0',clothes2:'#d8e0f0',hat:'helm',bg:'#3a4a5a',extra:['mustache','sweat']},
 penny:{skin:'#f0c8b0',hair:'#a85a8a',hairStyle:'bun',eyes:'normal',ears:'round',clothes:'#8f4a7a',clothes2:'#f0c0e0',hat:'feather',bg:'#5a3a5a',extra:['blush','lashes']},
 fennick:{skin:'#f2d0b0',hair:'#f0e0a0',hairStyle:'swoop',eyes:'normal',ears:'round',clothes:'#4a2a6a',clothes2:'#f0c84a',bg:'#3a2a5a',extra:['mustache','monocle']},
 nib:{skin:'#d0605a',hair:'#2a1a1a',hairStyle:'none',eyes:'big',ears:'goblin',clothes:'#3a5a8a',clothes2:'#f0d08a',hat:'cap',bg:'#4a2f3a',extra:['horns','grin']}
};

/* ---------- Customers ----------
 needs: {BEH: weight}; bound: forbidden behaviour; clue: revealed when asked (adds needs / reveals bound) */
const CAST = {
 maudie:{n:'Maudie Thimbleglass',role:'Retired master tailor, gnome',stages:[
  {day:1,topic:'trembling hands',say:'My hands have started to tremble, dear. I\'d like something to steady them, but nothing that makes me drowsy. I have a wedding hem to finish.',needs:{STEADY:2,SOOTHE:1},bound:'SLEEP',boundSay:'Nothing drowsy.',clue:'She rubs her knuckles: "They ache terribly in the cold."',clueNeeds:{WARM:1},budget:42,
   good:'Steady as a spool! I finished the hem in one sitting.',bad:'Well. That was certainly a… potion.',
   gaz:{good:'Wedding hem of the season completed by Maudie Thimbleglass, 81. "Not a wobble," she reports',bad:'Maudie Thimbleglass\'s wedding hem "has a personality now"'}},
  {day:3,topic:'remembering her methods',say:'The hem is done! Now I want to write down my methods before they slip away. Something to help me remember the exact stitch counts? Real numbers, mind. No daydreams.',needs:{REMEMBER:2,STEADY:1},bound:'DREAM',boundSay:'No daydreams.',clue:'"My notebooks are full of half-faded pencil. If I could only see it again…"',clueNeeds:{REVEAL:1},budget:48,
   good:'Forty years of stitches, all written down. I wept a little on page nine.',bad:'I now remember a great deal, dear. Not all of it was mine.',
   gaz:{good:'Maudie Thimbleglass publishes "Every Stitch I Know"; Guild requests three copies',bad:'Maudie Thimbleglass\'s memoir now includes a chapter about being a seagull'}},
  {day:5,topic:'nerves before teaching',say:'I\'ve agreed to take a student. She arrives Thursday. I\'m nervous, isn\'t that silly at my age? I want her to see me as I really am, though.',needs:{CHEER:1,STEADY:2,SOOTHE:1},bound:'MISDIRECT',boundSay:'No illusions.',clue:'"I haven\'t taught anyone since my hands started shaking."',clueNeeds:{},budget:50,
   good:'She called me "Master Thimbleglass". I\'ve been smiling all week.',bad:'The lesson went… sideways. She still wants to come back, bless her.',
   gaz:{good:'Gloambridge tailoring school reopens under Maudie Thimbleglass',bad:'Tailoring lesson ends with both teacher and student "unexpectedly airborne"'},gift:{ing:'spidersilk',qty:4,note:'Maudie leaves you a spool of fine silk and her steady-hand notes.'}}
 ]},
 kest:{n:'Kest Brindlepin',role:'Courier & tinkerer, goblin-touched',stages:[
  {day:1,topic:'focus for deliveries',say:'Forty deliveries, one bird, zero focus! I need a pep tonic, something with a kick! Just… please don\'t make me float again. Long story.',needs:{SPARK:2,STEADY:1},bound:'FLOAT',boundSay:'No floating.',clue:'Kest admits the bird keeps delivering parcels to the wrong doors.',clueNeeds:{GUIDE:1},budget:30,
   good:'All forty delivered! Thirty-nine to the right doors, which is a personal best!',bad:'I delivered everything to the same house. They were very confused.',
   gaz:{good:'Courier Kest Brindlepin breaks record: 39 of 40 parcels to correct address',bad:'Every parcel in Gloambridge delivered to one bewildered widow on Copper Row'}},
  {day:3,topic:'a message home',say:'I need to send a message to my sister in Harrowmere, but I can\'t get there in person. Can a voice travel in a bottle? It needs to be loud enough to reach her.',needs:{RESONATE:2,GUIDE:1},bound:'HUSH',boundSay:'It must be heard.',clue:'"We haven\'t spoken since I left. I just want her to hear me say sorry."',clueNeeds:{REMEMBER:1},budget:44,
   good:'She heard me! She wrote back! She says I still sound like a kettle.',bad:'The message reached… someone. A goat, I think. The goat seems sympathetic.',
   gaz:{good:'Harrowmere woman receives apology "carried on the wind"; describes it as "very Kest"',bad:'Goat in Harrowmere received heartfelt apology meant for someone else'}},
  {day:6,topic:'a self-winding street lamp',say:'So. I promised the town a self-winding street lamp. It\'s basically finished. I just need it to glow and keep a bit of zip. Don\'t make it invisible, the mayor already thinks I made it up.',needs:{GLOW:2,SPARK:1},bound:'HIDE',boundSay:'Must be visible.',clue:'"Honestly it\'s mostly string. And optimism."',clueNeeds:{PRESERVE:1},budget:52,
   good:'It works! The whole lane is lit! I\'m never doing that again!',bad:'The lamp works, technically. It just also sings.',
   gaz:{good:'Bellwether Lane gets its first self-winding lamp, "only partly string"',bad:'New street lamp on Bellwether Lane refuses to stop performing opera'},gift:{ing:'stormglass',qty:2,note:'Kest leaves two shards of Stormglass "for emergencies (fun ones)".'}}
 ]},
 croak:{n:'Count Croakwell',role:'Night librarian, frog vampire',stages:[
  {day:2,topic:'sleep for library bats',say:'*GONG* The Count Croakwell requires… a sleeping draught. Not for ME. For the bats in my library. They keep reading past dawn. And nothing jolly. Bats are a serious people.',needs:{SLEEP:2,SOOTHE:1},bound:'CHEER',boundSay:'Nothing jolly.',clue:'He lowers his parasol: "The house is very large. Very quiet. One sleeps poorly."',clueNeeds:{DREAM:1},budget:60,
   good:'The bats slept! And so, ahem, did I. Most dignified.',bad:'The bats are now awake AND giggling. This is a disaster of the highest order.',
   gaz:{good:'Croakwell Library bats achieve "full and dignified slumber"',bad:'Croakwell Library closed after bats "simply would not stop laughing"'}},
  {day:4,topic:'a gentle reading light',say:'A night-time light for my reading room. Gentle, mind. My readers are very small and very easily startled.',needs:{GLOW:2,HUSH:1},bound:'SPARK',boundSay:'Nothing startling.',clue:'"Mice, moths, a dormouse who reads poetry. Delicate souls."',clueNeeds:{SOOTHE:1},budget:58,
   good:'The dormouse finished an entire volume of sonnets. Wept, then slept.',bad:'The light did something. The moths have formed a union.',
   gaz:{good:'Croakwell Library hosts first "Night of Gentle Reading", attendance 41 small creatures',bad:'Moths at Croakwell Library form union, demand "less sparkle"'}},
  {day:6,topic:'a memorable gathering',say:'I am hosting… a gathering. Guests! Real ones! I require something to make the evening memorable. And for once, nobody falls asleep.',needs:{CHEER:2,REMEMBER:1},bound:'SLEEP',boundSay:'Nobody sleeps.',clue:'"I have not had guests in eleven years. I bought new napkins."',clueNeeds:{GLOW:1},budget:70,
   good:'They stayed until dawn! Someone called me "Croaky"! I have never been happier!',bad:'Memorable, yes. For reasons I would rather not discuss.',
   gaz:{good:'Count Croakwell\'s soirée declared "event of the season"',bad:'Croakwell soirée remembered chiefly for "the incident with the punch bowl"'},gift:{ing:'moonstone',qty:3,note:'The Count sends a velvet pouch of Moonstone Dust with a wax-sealed thank-you.'}}
 ]},
 tavi:{n:'Tavi Mossfoot',role:'Mosskin wanderer, seed-keeper',stages:[
  {day:2,topic:'protecting a seed',say:'I carry a seed from where I was born. It needs to survive the road, but don\'t seal it away. A seed that can\'t breathe isn\'t a seed. It\'s a souvenir.',needs:{PRESERVE:2,PROTECT:1},bound:'BIND',boundSay:'Don\'t seal it shut.',clue:'"Frost is coming over the ridge. It hates the cold, like me."',clueNeeds:{WARM:1},budget:36,
   good:'The seed made it through two frosts and a goat. It\'s still breathing.',bad:'The seed is safe. So safe I can\'t get it out of the bottle.',
   gaz:{good:'Rare seed survives journey through the Ridge, thanks to "a very good little bottle"',bad:'Mosskin traveller seen arguing with a jar'}},
  {day:4,topic:'waking the seed',say:'The seed\'s safe. But I\'m not sure it can still grow. Can you wake it a little? Gently. It\'s had a long trip.',needs:{GROW:2,WARM:1},bound:'SPARK',boundSay:'Gently.',clue:'"If it grows, I might have to stay. I\'ve never stayed anywhere."',clueNeeds:{SOOTHE:1},budget:38,
   good:'It sprouted! Two little leaves, like it\'s waving.',bad:'It sprouted. Then it ran away. I\'m choosing to see it as independent.',
   gaz:{good:'First sprout from the far valley seen on Gloambridge windowsill',bad:'Sapling seen sprinting down the canal path; owner "not worried"'}},
  {day:7,topic:'a garden for everyone',say:'There\'s an empty lot by the canal. What if it became a garden? For everyone. Make it something people can see and want to join.',needs:{GROW:2,CHEER:1},bound:'HIDE',boundSay:'Everyone should see it.',clue:'"I could leave a map, for the next traveller."',clueNeeds:{GUIDE:1},budget:46,
   good:'Twelve neighbours came with shovels. Twelve! I\'m staying a while.',bad:'The garden grew. It also grew opinions.',
   gaz:{good:'Canal-side community seed library opens; founder "staying, for now"',bad:'New canal garden "flourishing and slightly argumentative"'},gift:{ing:'morel',qty:3,note:'Tavi leaves Starlit Morels and a hand-drawn map of the ridge.'}}
 ]},
 patch:{n:'Patch',role:'Stitched curio-collector',note:true,stages:[
  {day:3,topic:'which buttons remember',say:'HELLO. I AM PATCH. I would like to know which of my buttons remember someone. (Please do not unstitch me.) (Also no sticky. Last time I got stuck to a cat.)',needs:{REMEMBER:2,REVEAL:1},bound:'BIND',boundSay:'No sticky.',clue:'Patch writes: "My maker went away. I do not know if I am finished."',clueNeeds:{SOOTHE:1},budget:24,
   good:'NOTE: Third button from the top remembers a lullaby. I am keeping it. Thank you.',bad:'NOTE: I am now stuck to a different cat. It is a nicer cat. Still.',
   gaz:{good:'Small stitched resident seen humming outside the Crooked Cork',bad:'Cat and stitched resident "inseparable", literally'}},
  {day:5,topic:'being noticed on name-day',say:'NEW NOTE: Today is my name-day. I picked the name myself. I would like to be noticed. Just a little. Not hidden. Not too much.',needs:{CHEER:2,GLOW:1},bound:'HIDE',boundSay:'Not hidden.',clue:'Patch adds a postscript: "Nobody has ever said happy name-day to me."',clueNeeds:{},budget:26,
   good:'NOTE: 14 people said HAPPY NAME-DAY. I counted. I have saved the number.',bad:'NOTE: Nobody noticed me. But one person noticed the glowing hat. That counts?',
   gaz:{good:'Lantern Steps erupt in surprise name-day song for "Patch, age: uncertain"',bad:'Hat of unknown owner seen celebrating alone; town apologises'},gift:{ing:'papermoon',qty:3,note:'Patch leaves three folded Paper Moons and a note: "FOR YOU. FRIEND."'}}
 ]},
 sable:{n:'Sable Thorn',role:'Elf ranger & trail scout',stages:[
  {day:3,topic:'reading a shifting trail',say:'The forest trail keeps changing. I need something that sharpens the senses without dulling my judgement. No visions. I\'ve had enough of those.',needs:{REVEAL:2,GUIDE:1},bound:'DREAM',boundSay:'No visions.',clue:'She studies the exits. "I go alone. Easier that way. For them."',clueNeeds:{STEADY:1},budget:40,
   good:'Found the old path in an hour. Saw three things that weren\'t meant to be seen.',bad:'I followed the trail perfectly. Straight into a lake.',
   gaz:{good:'Lost forest trail re-mapped by local scout',bad:'Scout emerges from Mirewood Lake "on schedule, but damp"'}},
  {day:5,topic:'slipping past a goose-dragon',say:'There\'s a very territorial goose-dragon on the ridge. I need to slip past it. Quietly. And no glowing, obviously.',needs:{HUSH:2,HIDE:1},bound:'GLOW',boundSay:'No glowing.',clue:'"It isn\'t evil. It\'s just guarding its eggs. I don\'t want to upset it."',clueNeeds:{SOOTHE:1},budget:44,
   good:'Walked right past it. It was snoring. Adorable, honestly.',bad:'The goose-dragon saw me. It saw me VERY clearly.',
   gaz:{good:'Goose-dragon of the Ridge "undisturbed for once", say rangers',bad:'Ridge goose-dragon chases glowing elf for three miles'}},
  {day:7,topic:'asking someone along',say:'I… want to ask someone to come with me next time. On the trail. Is there a brew for that? Not to trick them. Just so I can say it out loud.',needs:{STEADY:2,CHEER:1},bound:'MISDIRECT',boundSay:'No tricks.',clue:'"It\'s Kest. Don\'t tell Kest."',clueNeeds:{RESONATE:1},budget:46,
   good:'I asked. They said yes before I finished. I\'m going to need more rope.',bad:'I asked. Unfortunately I asked a lamppost. Trying again tomorrow.',
   gaz:{good:'Two-person expedition departs for the Ridge; "one ranger, one courier, one bird"',bad:'Ranger seen proposing a hiking trip to a lamppost'},gift:{ing:'griffindown',qty:3,note:'Sable leaves Griffin Down from the high ledges.'}}
 ]},
 ada:{n:'Ada Quill',role:'Guild inspector',stages:[
  {day:4,topic:'a Guild inspection',inspect:true,say:'Guild inspection. I\'ll purchase one item and evaluate it honestly. I need clarity for my case files. And I do not appreciate illusions on the premises.',needs:{REVEAL:2,STEADY:1},bound:'MISDIRECT',boundSay:'No illusions.',clue:'She taps her clipboard: "I also review your experiment journal. Honest records matter."',clueNeeds:{},budget:50,
   good:'Clear. Measured. Properly labelled. I\'ll note that in my report.',bad:'Interesting. I\'ve written "interesting" four times. That is not a compliment.',
   gaz:{good:'Guild Inspector Quill rates Crooked Cork "unusual, but honest"',bad:'Guild Inspector Quill\'s report on the Crooked Cork runs to eleven pages'}}
 ]}
};

const GUESTS = {
 gorvin:{n:'Gorvin the Conspicuous',role:'Troll, nine feet tall',topic:'invisibility',say:'I\'m throwing my mum a surprise party and I\'m nine feet tall. I need to be invisible. I still need to shout SURPRISE though, so no going quiet.',needs:{HIDE:2},bound:'HUSH',boundSay:'Must shout SURPRISE.',clue:'"And I need to find the cake in the dark. I always lose the cake."',clueNeeds:{GUIDE:1},budget:38,
  good:'She screamed! Then she laughed! Then she ate the cake! Best party ever!',bad:'Well. Mum was surprised. Just not the way I planned.'},
 bramble:{n:'Brambleback',role:'Hedgehog baker',topic:'stale buns',say:'My buns go stale by noon. Also I\'d like them to rise. Not me. The buns. Last time I rose.',needs:{PRESERVE:2,GROW:1},bound:'FLOAT',boundSay:'Nothing floats.',clue:'"It\'s for the Harvest Fair. Grandma\'s recipe."',clueNeeds:{WARM:1},budget:30,
  good:'Soft till sundown! The queue went round the block!',bad:'The buns are lovely. They are also, technically, on the roof.'},
 miri:{n:'Miri Flicker',role:'Moth-fae dancer',topic:'sparkling wings',say:'The Moth Ball is tonight and my wings look like old curtains! Make them sparkle! And I mustn\'t fall asleep, I\'ve a waltz booked.',needs:{GLOW:2,CHEER:1},bound:'SLEEP',boundSay:'Stay awake.',clue:'"There\'s a lantern-moth there I want to impress."',clueNeeds:{FLOAT:1},budget:34,
  good:'I sparkled! He asked me to dance! Three times!',bad:'I was certainly the talk of the Ball. Not quite how I hoped.'},
 tallow:{n:'Old Tallow',role:'Retired candle golem',topic:'not melting',say:'I\'m melting a bit in this weather. Something cooling, please. Not too cooling. I\'m a candle, not an ice lolly. And nothing warm, obviously.',needs:{COOL:2,PROTECT:1},bound:'WARM',boundSay:'Nothing warm.',clue:'"My wick\'s been burning seventy years. I\'d like a few more."',clueNeeds:{PRESERVE:1},budget:32,
  good:'Haven\'t dripped all day. Feel forty again. Well, sixty.',bad:'I\'m now significantly shorter. Still, could be worse.'},
 puddle:{n:'Puddle Saint',role:'River-folk canal keeper',topic:'a quiet canal',say:'The canal\'s too loud at night. The water argues with itself. I\'d like quiet water. Nothing that zaps the fish.',needs:{HUSH:2,SOOTHE:1},bound:'SPARK',boundSay:'Don\'t zap the fish.',clue:'"The little ones can\'t sleep for the noise."',clueNeeds:{SLEEP:1},budget:36,
  good:'The canal hasn\'t been this quiet in a hundred years. The ducks are suspicious.',bad:'The fish are now very, very energetic. I\'m told they\'ve formed a band.'},
 bellmaker:{n:'The Bellmaker',role:'Clockwork bird-person',topic:'flat chimes',say:'My chimes have gone flat. Flat! A bell that cannot ring is just a cup. I\'d like to ring true again. Do not hush me, I beg you.',needs:{RESONATE:2,MEND:1},bound:'HUSH',boundSay:'Do not hush.',clue:'"I chimed for the old market. Before the Guild sealed it."',clueNeeds:{REMEMBER:1},budget:44,
  good:'*DING* Did you hear that? DING! Perfect fifth!',bad:'I now ring at a pitch only dogs appreciate.'},
 tamsin:{n:'Tamsin Embercoil',role:'Salamander performer',topic:'stage illusions',say:'Opening night! I need the audience to see a dragon behind me. There is no dragon. Do NOT let them see the stagehands.',needs:{MISDIRECT:2,CHEER:1},bound:'REVEAL',boundSay:'Hide the stagehands.',clue:'"The critic from the Gazette is coming."',clueNeeds:{GLOW:1},budget:42,
  good:'A standing ovation! The critic cried! The dragon took a bow!',bad:'The audience saw everything. The stagehands got a standing ovation.'},
 grakka:{n:'Grakka Ashjaw',role:'Orc blacksmith',topic:'cracked forge hands',say:'Long days at the forge. Hands are cracked to bits. Something to mend \'em, and warm \'em on the walk home. Can\'t be sleepy, I\'ve a late shift.',needs:{MEND:2,WARM:1},bound:'SLEEP',boundSay:'Late shift.',clue:'"I make little toys for my niece. Need steady fingers for that."',clueNeeds:{STEADY:1},budget:34,
  good:'Hands like new. Made a tin bird for the niece. She named it Grakka Jr.',bad:'Hands are fine. Did sleep through the shift, mind.'},
 wobble:{n:'Sir Wobblesworth',role:'Very nervous knight',topic:'knocking knees',say:'I must give a speech to the Dragon-Slaying Committee and my knees are knocking. Audibly. Do not make me float. I\'m in full plate. I\'d be a weathervane.',needs:{STEADY:2,HUSH:1},bound:'FLOAT',boundSay:'No floating.',clue:'"I\'ve never actually slain a dragon. I just like the hats."',clueNeeds:{CHEER:1},budget:46,
  good:'Not a single knock! I was elected treasurer! I don\'t know what a treasurer does!',bad:'The speech went… upward. I could see my house from there.'},
 penny:{n:'Mrs. Pennywhistle',role:'Neighbourhood enthusiast',topic:'a neighbour\'s secret',say:'My neighbour has a SECRET and I simply must know it. For their own good. Discreetly, mind. Nothing that echoes about.',needs:{REVEAL:2},bound:'RESONATE',boundSay:'Discreetly.',clue:'"Fine. I\'m worried. Their curtains haven\'t opened in a week."',clueNeeds:{SOOTHE:1},budget:40,
  good:'Turns out she was knitting me a scarf. I feel terrible. It\'s lovely.',bad:'Everyone now knows everyone\'s secrets. It\'s been a very long day.'},
 fennick:{n:'Lord Fennick',role:'Extremely important man',topic:'being remembered forever',say:'I wish to be remembered. Forever. By everyone. And I must glow with significance. Under no circumstances am I to be overlooked.',needs:{REMEMBER:2,GLOW:1},bound:'HIDE',boundSay:'Never overlooked.',clue:'His monocle drops: "My portrait was taken down from the Guild hall."',clueNeeds:{CHEER:1},budget:80,
  good:'They remember me! They point! I\'ve never been so pointed at!',bad:'Remembered, yes. Chiefly as "the shiny one who fell in the fountain".'},
 nib:{n:'Nib',role:'Courier imp',topic:'a runaway parcel',say:'Got a parcel that won\'t stop floating away. Need it to stay put. Stick it down, nail it, whatever. NO floating stuff, it\'s floaty enough.',needs:{BIND:2,STEADY:1},bound:'FLOAT',boundSay:'No floating.',clue:'"It\'s a birthday present. Inside\'s a balloon. Long story."',clueNeeds:{PROTECT:1},budget:28,
  good:'Delivered! Stuck to the doormat, but delivered!',bad:'The parcel left. So did I. We\'re over the canal now.'}
};

/* ---------- Shop furniture ---------- */
const FURN = {
 counter:{n:'Counter',w:2,h:1,ht:34,cost:0,fixed:true,col:'#8f5a34',top:'#b87a4a',stats:{},desc:'Where the magic (and the haggling) happens.'},
 cauldron:{n:'Cauldron',w:1,h:1,ht:26,cost:0,fixed:true,col:'#3a2f4a',top:'#5a4a6a',stats:{},desc:'Old, temperamental, beloved.'},
 shelf:{n:'Potion Shelf',w:1,h:1,ht:62,cost:30,col:'#7a4a2a',top:'#9a6a3a',stats:{display:4},desc:'+4 potions on display for walk-ins.'},
 cabinet:{n:'Tall Cabinet',w:2,h:1,ht:70,cost:55,col:'#6a3f24',top:'#8f5a34',stats:{display:7},desc:'+7 potions on display.'},
 table:{n:'Display Table',w:1,h:1,ht:26,cost:20,col:'#9a6a3a',top:'#c08a50',stats:{display:2,charm:1},desc:'+2 display, a little charm.'},
 plant:{n:'Potted Fern',w:1,h:1,ht:30,cost:12,col:'#b8683a',top:'#5f9f4a',stats:{charm:2,traffic:1},desc:'Attracts botanists and mosskin.'},
 bench:{n:'Cosy Bench',w:2,h:1,ht:18,cost:35,col:'#7a4a6a',top:'#a86a8f',stats:{comfort:3},desc:'Longer conversations: +rapport.'},
 rug:{n:'Moon Rug',w:2,h:2,ht:1,cost:25,col:'#5a3a8a',top:'#6a4a9a',flat:true,stats:{charm:3},desc:'Soft underfoot. Charm +3.'},
 candles:{n:'Candelabra',w:1,h:1,ht:40,cost:18,col:'#c8a04a',top:'#e8c06a',stats:{charm:2,comfort:1},desc:'Warm light: charm and comfort.'},
 window:{n:'Window Display',w:1,h:1,ht:48,cost:40,col:'#6a4a8a',top:'#8f6ab8',stats:{traffic:3,display:2},desc:'Curious walk-ins +3 traffic.'},
 catbed:{n:'Mallow\'s Bed',w:1,h:1,ht:12,cost:15,col:'#a85a5a',top:'#e8c0a0',stats:{comfort:2,charm:1},desc:'Mallow naps here and offers hints.'},
 lantern:{n:'Lantern Post',w:1,h:1,ht:56,cost:16,col:'#4a3a2a',top:'#f5c04a',stats:{traffic:1,charm:1},desc:'Draws the evening crowd.'}
};
const GRID_W = 10, GRID_H = 8;
const DOOR = {x:0,y:7}; // entrance tile
