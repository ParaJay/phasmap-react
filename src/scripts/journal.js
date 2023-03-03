import React from "react";
import { readInfo, stripURL } from "./utils.js";

const checks = [];

//TODO: arrow keys
//TODO: select by charKey
//TODO: auto exclude when evidence unavailable

const ghosts = [
    "Banshee", "Demon", "Deogen", "Goryo", "Hantu", "Jinn", "Mare", "Moroi", "Myling",
    "Obake", "Oni", "Onryo", "Phantom", "Poltergeist", "Raiju", "Revenant", "Shade",
    "Spirit", "Thaye", "The Mimic", "The Twins", "Wraith", "Yokai", "Yurei"
]

var updateCallback;
var evidenceCallback;
var labelCallback;
var sani = 0;
const selections = {}
const exclusions = {};
const evidence = {}
const striked = {};
const sanity = {};
var selected;

var shifting = false;

function getPossibleGhosts() {
    let evs = [];
    let exc = [];

    let sKeys = Object.keys(selections);

    sKeys.forEach(e => {
        let id = e;

        if(exclusions[e]) {
            exc.push(id);
        } else {
            if(selections[e]) evs.push(id);
        }
    });

    let first = [];

    if(evs.length > 0) {
        ghosts.forEach(ghost => {
            let evi = evidence[ghost];
            let pass = true;

            evs.forEach(e => {
                if(!evi.includes(document.getElementById(e).value)) pass = false;
            });

            if(pass) {
                if(!first.includes(ghost)) {
                    first.push(ghost);
                }
            }
        });
    } else {
        first = ghosts.slice();
    }

    let second = [];

    if(exc.length > 0) {
        first.forEach(ghost => {
            let pass = true;

            for(let i = 0; i < exc.length; i++) {
                let e = exc[i];
                if(evidence[ghost].includes(document.getElementById(e).value)) {
                    pass = false;
                    break;
                }
            };

            if(pass && !second.includes(ghost)) second.push(ghost);
        });
    } else {
        second = first.slice();
    }

    let third = [];

    second.forEach(ghost => {
        if(sanity[ghost] >= sani) third.push(ghost);
    });

    return third;
}

function goto() {
    if(!selected) return;

    let url = window.location.href.split("/")[0] + "?ghost=" + selected.replaceAll(" ", "%20") + "#/ghosts";

    window.location.href = url;
}

function strike() {
    if(!selected) return;

    striked[selected] = !striked[selected];

    updateCallback();
}

function reset() {
    window.location.reload();
}

class Slider extends React.Component {
    render() {
        return (
            <input id="slider" defaultValue="0" type="range" min="0" max="100" value={this.props.val} onInput={this.props.callback}/>
        )
    }
}

class CheckBox extends React.Component {
    render() {
        return this.check;
    }

    componentDidMount() {
        this.check = (<input type="checkbox" id={this.props.id} className="evidence journal-check-box" value={this.props.value} onChange={(e) => { 
            evidenceCallback(e);
        }}/>);

        if(!checks.includes(this.check.id))
            checks.push(this.check.id);
    }
}

class Label extends React.Component {
    render() {
        let text = this.props.text;
        let cn = "journal-defs journal-";

        if(selected === text) cn += "selected";
        
        if(striked[text]) cn = cn.replace("selected", "") + "striked";

        if(cn.endsWith("-")) cn += text.endsWith("_") ? "blank" : "label";

        return (<p value={this.props.text} onClick={labelCallback} className={cn}>{this.props.text}</p>)
    }
}

class CheckBoxLabel extends React.Component {
    render() {
        let f = this.props.htmlFor
        let text = this.props.text;
        if(exclusions[f]) text += " (NOT)";

        return <label className="journal-check-label" htmlFor={f}>{text}</label>;
    }
}

//TODO: fix
function p(am) {
    let text = "";

    for(let i = 0; i < am; i++) text += "_";

    return l(text, "blank");
}

function l(t, k=t) {
    return <Label key={k} text={t}></Label>;
}

class Journal extends React.Component {
    render() {
        if(!evidenceCallback) evidenceCallback = this.onEvidenceChange.bind(this);

        let ghosts = getPossibleGhosts();

        let left = [], right = [], center = [];
        let x = 0;
        let highest = 0;

        for(let i = 0; i < ghosts.length; i++) {
            let g = ghosts[i];

            if(ghosts.length > 12) {
                (i % 2 === 0 ? left : right).push(l(g));
                
                if(x === 0) {
                    center.push(p(10));
    
                    x++;
                }
            } else {
                if(x === 0) {
                    let cl = ((30 - highest) / 2) - 1;
                    let cl2 = cl % 2 === 0 ? cl : cl - 1;
                    
                    left.push(p(cl));
                    right.push(p(cl2));
                    
                    x++;
                }
    
                center.push(l(g));
            }
        }

        let checkVals = {
            orbs: "Ghost Orbs",
            fingerprints: "",
            dots: "D.O.T.S",
            freezing: "",
            spiritBox: "Spirit Box",
            emf: "EMF 5",
            writing: "Ghost Writing"
        };
        
        this.checks = [];
        this.labels = [];

        let keys = Object.keys(checkVals);

        for(let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = checkVals[key];
            
            if(!value) value = key.charAt(0).toUpperCase() + key.slice(1);

            this.checks.push(<CheckBox key={key} id={key} value={value}/>);  

            this.labels.push(<CheckBoxLabel key={"l" + key} htmlFor={key} text={value}/>);
        }

        return (
            <div className="journal-wrapper">
                <div className="sub-wrapper">
                    <div className="journal-wrapper">
                        <div className="jleft">{left}</div>
                        <div className="jcenter">{center}</div>
                        <div className="jright">{right}</div>
                    </div>
                </div>

                <div className="btns-left">
                    {this.checks}
                    <br/><br/><br/>
                    <label htmlFor="slider" id="sliderLabel">Sanity: {sani}%</label>
                                    
                </div>
                
                <div className="btns-right">
                    {/* <br/> */}
                    {this.labels}
                    <br/><br/><br/>
                    <Slider callback={this.onSanityChange.bind(this)}/>
                    <br/>
                    <br/>
                    <button id="goto" onClick={goto}>Goto</button>
                    <br/>
                    <button id="strike" onClick={strike}>Strike</button>
                    <br/>
                    <button id="reset" onClick={reset}>Reset</button>
                </div>           
            </div>
        )
    }

    keyUp(e, cb) {
        if(!e.shiftKey && !e.ctrlKey) shifting = false;

        if(e.key === " ") strike();
    }

    keyDown(e) {
        if(e.shiftKey || e.ctrlKey) shifting = true;
    }

    strike() {
        striked[selected] = !striked[selected];

        this.forceUpdate();
    }

    componentDidMount() {
        stripURL();

        document.addEventListener("keydown", this.keyDown, false);
        document.addEventListener("keyup", (e) => this.keyUp(e, this.strike.bind(this)), false);
        
        updateCallback = this.forceUpdate.bind(this);
        evidenceCallback = this.onEvidenceChange.bind(this);
        labelCallback = this.onSelectionChange.bind(this);

        initInfo(this.forceUpdate.bind(this));
    }
    
    componentWillUnmount(){
        document.removeEventListener("keydown", this.keyDown, false);
        document.removeEventListener("keyup", (e) => this.keyUp(e, this.strike.bind(this)), false);
    }

    onEvidenceChange(e) {
        let check = e.target;

        if(shifting) {
            exclusions[check.id] = !exclusions[check.id];
            check.checked = !check.checked;
        } else {
            selections[check.id] = check.checked;
        }

        this.forceUpdate();
    }

    onSanityChange(e) {
        sani = e.target.value;
        this.forceUpdate();
    }

    onSelectionChange(e) {
        selected = e.target.textContent;
        this.forceUpdate();
    }
}

function initInfo(callback) {
    for(let i = 0; i < ghosts.length; i++) {       
        readInfo(ghosts[i], "ghosts").then(e => {
            let lines = e.split("\n");

            for(let j = 0; j < lines.length; j++) {
                let line = lines[j];

                if(line.includes("Evidence: ")) evidence[ghosts[i]] = line.split(": ")[1].split(", ");

                if(line.includes("Hunts from: ")) {
                    let split = line.split("Hunts from: ")[1].split(" ");

                    let san = 0;

                    split.forEach(ee => {
                        if(ee.includes("%")) {
                            let si = parseInt(ee.replace("%", "").replace("(", ""));

                            if(si > san) san = si;
                        }
                    });

                    sanity[ghosts[i]] = san;

                    if(Object.keys(sanity).length === ghosts.length) callback();
                }
            }
        });
    }
}

export default Journal;