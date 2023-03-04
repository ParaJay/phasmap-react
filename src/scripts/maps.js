import { handleKeyDown, initParams, def, initKeys, initKeyValues, setSelected, getNext, selected, stripURL } from "./utils.js";
import React from "react";
import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch"
import { maps } from "./consts.js";

function init() {
    initKeyValues(1);
    initKeys(maps);
    initParams("map", "camp_woodwind");
    select(def);
}

function select(map) {
    map = map.toLowerCase().replaceAll(" ", "_");

    setSelected(map);
}

function change(am) {
    let s = getNext(maps, am, true);

    if(s) select(s);

    return selected;
}

class Button extends React.Component {
    render() { return <button onClick={this.props.onclick}>{this.props.text}</button> }
}

class Map extends React.Component {
    state = {}

    constructor(props) {
        super(props);

        this.onKeyDown = this.keyDown.bind(this);
    }

    render() {
        if(!this.state.map) return;
        
        return (
            <div className="img-wrapper">
                <div className="centered">
                    <TransformWrapper id="centered">
                        <TransformComponent id="centered">
                            <img id="centered" src={require("../res/maps/" + this.state.map + ".png")} alt="oops" width="600" height="400"></img>
                        </TransformComponent>
                    </TransformWrapper>
                </div>

                <div className="wrapper">
                    <Button onclick={() => {
                        change(-1);
                        this.handleMapChange();
                        }} text={"Previous"}></Button>

                    <Button onclick={() => {
                        change(1); 
                        this.handleMapChange();
                        }} text={"Next"}></Button>
                    <p>all map images from: <a href="https://imgur.com/a/iEI0tJo">here</a> made <a href="https://www.reddit.com/user/Fantismal/">by</a></p>
                </div>
            </div>
            
        );
    }

    handleMapChange() { this.setState({map: selected}); }

    keyDown(e, cb) {
        let s = handleKeyDown(e, maps, true, selected);

        if(s) select(s);

        this.setState({map: selected})
    }

    componentDidMount(){
        if(window.location.href.includes("?") && !window.location.href.includes("?map")) stripURL();

        init();

        this.setState({map: selected});

        document.addEventListener("keydown", this.onKeyDown, false);
    }
    
    componentWillUnmount(){
        document.removeEventListener("keydown", this.onKeyDown, false);
    }
}

export default Map;