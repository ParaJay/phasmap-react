import { readInfo, toUnSafeArray } from "./utils";

var expected = 0;
var processed = 0;

export const maps = [
    "bleasedale", "brownstone_high_school", "camp_woodwind", "edgefield", "grafton", "maple_lodge_campsite", "prison", 
    "ridgeview", "sunny_meadows", "sunny_meadows_restricted", "tanglewood", "willow"
]

export const unsafe_maps = toUnSafeArray(maps);

export const ghosts = [
    "Banshee", "Demon", "Deogen", "Goryo", "Hantu", "Jinn", "Mare", "Moroi", "Myling",
    "Obake", "Oni", "Onryo", "Phantom", "Poltergeist", "Raiju", "Revenant", "Shade",
    "Spirit", "Thaye", "The Mimic", "The Twins", "Wraith", "Yokai", "Yurei"
]

export const evidenceMap = {
    orbs: "Ghost Orbs",
    fingerprints: "Fingerprints",
    dots: "D.O.T.S",
    freezing: "Freezing",
    spiritBox: "Spirit Box",
    emf: "EMF 5",
    writing: "Ghost Writing"
};

export const equipment = [
    "DOTS Projector", "EMF Reader", "Ghost Writing Book", "Photo Camera", "Spirit Box", "UV Torch", "Video Camera",
     "Candle", "Crucifix", "Glowstick", "Head Mounted Camera", "Lighter", "Motion Sensor", "Parabolic Microphone", "Salt",
      "Sanity Pills", "Smudge Sticks", "Sound Sensor", "Strong Torch", "Thermometer", "Tripod", "Weak Torch"];

export const cursedItems = ["Haunted Mirror", "Monkey Paw", "Music Box", "Ouija Board", "Summoning Circle", "Tarot Cards", "Voodoo Doll"];
export const difficulties = ["Amateur", "Intermediate", "Professional", "Nightmare", "Insanity"];

export const info = {};

export function initInfo() {
    expected = ghosts.length + equipment.length + cursedItems.length + difficulties.length;
    processed = 0;
    clearInfo();

    loadAll(ghosts, "ghosts");
    loadAll(equipment, "equipment");
    loadAll(cursedItems, "cursed-items");
    loadAll(difficulties, "difficulties");
}

function loadAll(array, dir) { array.forEach(e => loadInfo(e, dir)); }

function loadInfo(el, dir) {
    readInfo(el.toLowerCase().replaceAll(" ", ""), dir).then(e => {
        info[el] = e;
        processed++;
    });
}

function clearInfo() { Object.keys(info).forEach(e => delete info[e]); }

export function isLoading() { return expected > processed; }

export function getProgress() { return processed + "/" + expected; }