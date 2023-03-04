import { initWith } from "./info.js";
import React from "react";
import { equipment } from "./consts.js";

class Equipment extends React.Component {
    render() {  return initWith(equipment, "equipment"); }
}

export default Equipment;