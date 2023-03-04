import { initInfoState, setSelected, selected, handleKeyDown, stripURL } from "./utils.js";
import * as Utils from "./utils.js";
import React from "react";
import { info } from "./consts.js";
import { Tooltip } from "react-tooltip";

// const info = {};
var array, def;

class InfoButton extends React.Component {
    render() {
        let cn = selected === this.props.text ? "selectedButton" : "infoButton";
        let text = this.props.text;
        return (
            <>
                 <button className={cn} id={text} onClick={() => {
                    setSelected(text);
                    this.props.callback();
                }}
                data-tooltip-id={text}
                // data-tooltip-html={info[text].replaceAll("\n", "<br/>")}
                >{text}</button>

                <Tooltip id={text} title="he"/>
            </>
        )
    }
}

class InfoHeader extends React.Component {
    render() { return (<p id="infoHeader">{this.props.text}</p>) }
}

class Info extends React.Component {
    constructor(props) {
        super(props);

        this.keyDown = this.keyDown.bind(this);
        this.cb = this.handleSelectionChange.bind(this);
    }

    state = {};

    render() {
        let left = [], right = [];

        for(let i = 0; i < array.length; i++) (i % 2 === 0 ? left : right).push(<InfoButton key={array[i]} text={array[i]} callback={this.cb}></InfoButton>)

        return (
            <div id="main-wrapper">       
                <div className="wrapper">
                    <div className="info-wrapper">
                        <InfoHeader text={this.state.selection}></InfoHeader>
                        <textarea id="text" cols="96" rows="32" readOnly={true} value={info[this.state.selection]}></textarea>
                    </div>

                    <div className="btns-left">
                        <br/><br/><br/><p className="breaker"/>
                        {left}
                    </div>

                    <div className="btns-right">
                        <br/><br/><br/><p className="breaker"/>
                        {right}
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.setState({selection: def});
        document.addEventListener("keydown", this.keyDown, false);
    }
    
    componentWillUnmount(){
        document.removeEventListener("keydown", this.keyDown, false);
    }

    keyDown(e) {
        handleKeyDown(e, array);

        this.setState({selection: selected})
    }

    handleSelectionChange() {
        this.setState({selection: selected});
    }
}

export default Info

export function initWith(arr, param, de=arr[0]) {   
    array = arr;

    initInfoState(arr, param, de);

    if(window.location.href.includes("?") && !window.location.href.includes("?" + param)) stripURL();

    def = Utils.def;

    return <Info></Info>
}