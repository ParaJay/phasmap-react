import React from "react";
import {initWith} from "./info.js";

const ghosts = [
    "Banshee", "Demon", "Deogen", "Goryo", "Hantu", "Jinn", "Mare", "Moroi", "Myling",
    "Obake", "Oni", "Onryo", "Phantom", "Poltergeist", "Raiju", "Revenant", "Shade",
    "Spirit", "Thaye", "The Mimic", "The Twins", "Wraith", "Yokai", "Yurei"
]

class Ghost extends React.Component {
    render() {
        return initWith(ghosts, "ghosts", "ghost");
    }
}

export default Ghost;

