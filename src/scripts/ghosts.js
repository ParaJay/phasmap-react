import React from "react";
import {initWith} from "./info.js";
import { ghosts } from "./consts.js";

class Ghost extends React.Component {
    render() {
        return initWith(ghosts, "ghosts", "ghost");
    }
}

export default Ghost;

