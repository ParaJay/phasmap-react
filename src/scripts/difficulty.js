import { initWith } from "./info.js";
import React from "react";

let difficulties = ["Amateur", "Intermediate", "Professional", "Nightmare", "Insanity"]

class Difficulty extends React.Component {
    render() {
        return initWith(this.props, difficulties, "difficulties", "difficulty");
    }
}

export default Difficulty;