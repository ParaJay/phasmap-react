import { toUnSafeArray } from "./utils";

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