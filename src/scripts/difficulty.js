import { initWith } from "./info.js";
import React from "react";
import { difficulties } from "./consts.js";

class Difficulty extends React.Component {
    render() { return initWith(difficulties, "difficulty"); }
}

export default Difficulty;