import { initWith } from "./info.js";
import React from "react";
import { cursedItems } from "./consts.js";

class CursedItem extends React.Component {
    render() { return initWith(cursedItems, "curseditem"); }
}

export default CursedItem;