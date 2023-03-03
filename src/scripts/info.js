import { initInfoState, setSelected, selected, readInfo, handleKeyDown, stripURL } from "./utils.js";
import * as Utils from "./utils.js";
import React from "react";

const info = {};
var array, dir, def;

class InfoButton extends React.Component {
    render() {
        let cn = selected === this.props.text ? "selectedButton" : "infoButton";

        return (
            <button className={cn} id={this.props.text} onClick={() => {
                setSelected(this.props.text);
                this.props.callback();
            }}>{this.props.text}</button>
        )
    }
}

class InfoHeader extends React.Component {
    render() { return (<p id="infoHeader">{this.props.text}</p>) }
}

class Info extends React.Component {
    state = {};
    cb = this.handleSelectionChange.bind(this);

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

    async componentDidMount() {
        let done = [];
        for(let i = 0; i < array.length; i++) {
            info[array[i]] = await readInfo(array[i].toLowerCase().replaceAll(" ", ""), dir);

            done.push(true);

            if(done.length === array.length) this.setState({selection: def});
        };

        document.addEventListener("keydown", (e) => {
            this.keyDown(e, () => this.setState({selection: selected}));
        }, false);
    }
    
    componentWillUnmount(){
        document.removeEventListener("keydown", (e) => {
            this.keyDown(e, () => this.setState({selection: selected}));
        }, false);
    }

    keyDown(e, cb) {
        handleKeyDown(e, array);

        cb();
    }

    handleSelectionChange() {
        this.setState({selection: selected});
    }
}

export default Info

export function initWith(arr, dr, param=dr, de=arr[0]) {   
    array = arr;
    dir = dr;

    initInfoState(arr, param, de);

    if(window.location.href.includes("?") && !window.location.href.includes("?" + param)) stripURL();

    def = Utils.def;

    return <Info></Info>
}