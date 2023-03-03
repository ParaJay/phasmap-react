import { initWith } from "./info.js";
import React from "react";

const difficulties = ["Amateur", "Intermediate", "Professional", "Nightmare", "Insanity"]

class Difficulty extends React.Component {
    render() {
        return initWith(difficulties, "difficulties", "difficulty");
    }
}

export default Difficulty;