import { initWith } from "./Info.js";
import React from "react";
import { cursedItems } from "./utils/consts.js";

class CursedItem extends React.Component {
    render() { return initWith(cursedItems, "curseditem"); }
}

export default CursedItem;