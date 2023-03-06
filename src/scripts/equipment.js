import { initWith } from "./Info.js";
import React from "react";
import { equipment } from "./utils/consts.js";

class Equipment extends React.Component {
    render() {  return initWith(equipment, "equipment"); }
}

export default Equipment;