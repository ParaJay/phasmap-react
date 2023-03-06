import { initWith } from "./Info.js";
import React from "react";
import { difficulties } from "./utils/consts.js";

class Difficulty extends React.Component {
    render() { return initWith(difficulties, "difficulty"); }
}

export default Difficulty;