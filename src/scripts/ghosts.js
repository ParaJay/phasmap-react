import React from "react";
import {initWith} from "./Info.js";
import { ghosts } from "./utils/consts.js";

class Ghost extends React.Component {
    render() { return initWith(ghosts, "ghost"); }
}

export default Ghost;

