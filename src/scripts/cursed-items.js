import { initWith } from "./info.js";
import React from "react";

const cursedItems = ["Haunted Mirror", "Monkey Paw", "Music Box", "Ouija Board", "Summoning Circle", "Tarot Cards", "Voodoo Doll"]

class CursedItem extends React.Component {
    render() {
        return initWith(cursedItems, "cursed-items", "curseditem");
    }
}

export default CursedItem;