import React from "react";
import { readInfo, stripURL, handleKeyDown, initKeyValues, initKeys } from "./utils.js";

const checks = [];

//TODO: arrow keys
//TODO: select by charKey
//TODO: auto exclude when evidence unavailable

const ghosts = [
    "Banshee", "Demon", "Deogen", "Goryo", "Hantu", "Jinn", "Mare", "Moroi", "Myling",
    "Obake", "Oni", "Onryo", "Phantom", "Poltergeist", "Raiju", "Revenant", "Shade",
    "Spirit", "Thaye", "The Mimic", "The Twins", "Wraith", "Yokai", "Yurei"
];

const permanentEvidence = {};

const checkVals = {
    orbs: "Ghost Orbs",
    fingerprints: "Fingerprints",
    dots: "D.O.T.S",
    freezing: "Freezing",
    spiritBox: "Spirit Box",
    emf: "EMF 5",
    writing: "Ghost Writing"
};

var possible;
var updateCallback;
var evidenceCallback;
var exclusionCallback;
var labelCallback;
var sani = 0;
const selections = {}
const exclusions = {};
const autoExcluded = [];
const evidence = {}
const striked = {};
const sanity = {};
var nightmare;
var insanity;
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

    if(nightmare) third = difficultyCheck(third, 2, 1);
    
    if(insanity) third = difficultyCheck(third, 1, 2);

    if(third.length == 0) third.push("None");

    return third;
}

function difficultyCheck(third, max, off) {
    let count = countSelections();

    let rem = [];

    if(count > max && !third.includes("The Mimic")) {
        third = [];
    } else {
        for(let i = 0; i < third.length; i++) {
            let ghost = third[i];

            if(ghost !== "The Mimic" && count > max) {
                rem.push(ghost);
            } else {
                let size = evidence[ghost].length;

                if(count == size - off) {                       
                    if(permanentEvidence[ghost]){
                        let ps = selections[reverseCheck(permanentEvidence[ghost])];

                        if(!ps) {
                            rem.push(ghost);
                        }
                    }
                } else if(count > size - off) {
                    if(permanentEvidence[ghost]){
                        let ps = selections[reverseCheck(permanentEvidence[ghost])];

                        if(!ps) {
                            rem.push(ghost);
                        }
                    }
                }
            }
        }
    }

    for(let i = 0; i < rem.length; i++) {
        third.splice(third.indexOf(rem[i]), 1);
    }

    return third;
}

function reverseCheck(checkFor) {
    let keys = Object.keys(checkVals);

    for(let i = 0; i < keys.length; i++) {
        let value = checkVals[keys[i]];

        if(value == checkFor) {
            return keys[i];
        }
    }

    return null;
}

function countSelections() {
    let count = 0;

    let keys = Object.keys(selections);

    for(let i = 0; i < keys.length; i++) {
        let selection = selections[keys[i]];

        if(selection) count++;
    }

    return count;
}

function goto() {
    if(!selected) return;

    let url = window.location.href.split("/")[0] + "?ghost=" + selected.replaceAll(" ", "%20") + "#/ghosts";

    window.location.href = url;
}

function strike() {
    if(!selected) return;

    striked[selected] = !striked[selected];

    updateExclusions();

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
        this.check = (<input type="checkbox" id={this.props.id} className="evidence journal-check-box" value={this.props.value} onClick={(e) => { 
            evidenceCallback(e);
        }}
        onMouseUp={(e) => {
            if(e.button == 1) {
                exclusionCallback(this.props.id);
            }
        }}
        />);

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

        return <label className="journal-check-label" htmlFor={f} onMouseUp={(e) => {
            if(e.button == 1 && checkVals[f]) {
                exclusionCallback(f);
            }
        }}>{text}</label>;
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

//TODO: nightmare/insanity
function updateExclusions() {
    // console.log("updating exclusions");

    let keys = Object.keys(checkVals);
    let selected = [];

    for(let i = 0; i < keys.length; i++) {
        if(selections[keys[i]]) {
            selected.push(keys[i]);
        }
    }

    possible = getPossibleGhosts();

    for(let i = 0; i < keys.length; i++) {
        if(!isPossible(keys[i], selected)) {
            // console.log("not: " + keys[i]);
            exclusions[keys[i]] = true;
            autoExcluded.push(keys[i]);
            // selections[keys[i]] = false;
        } else {
            while(autoExcluded.includes(keys[i])) {
                exclusions[keys[i]] = false;
                autoExcluded.splice(autoExcluded.indexOf(keys[i]), 1);
            }
        }
    }

    updateCallback();
}

function isPossible(evi) {
    let found = [];
    let ghosts = possible.slice();

    if(ghosts.length == 0 || ghosts[0] == "None") return true;
    let count = countSelections();

    // if(count == 2 && nightmare && !selections[evi]) return false;
    // if(count == 1 && insanity && !selections[evi]) return false;

    for(let i = 0; i < ghosts.length; i++) {
        if(!found.includes(ghosts[i]) && evidence[ghosts[i]].includes(checkVals[evi])) {
            found.push(ghosts[i]);
        }

        if(found.includes(ghosts[i]) && striked[ghosts[i]]) {
            found.splice(found.indexOf(ghosts[i]), 1);
        }

        if(found.includes(ghosts[i]) && count > evidence[ghosts[i]].length - 1 && nightmare) {
            found.splice(found.indexOf(ghosts[i]), 1);
        }

        if(found.includes(ghosts[i]) && count > evidence[ghosts[i]].length - 2 && insanity) {
            found.splice(found.indexOf(ghosts[i]), 1);
        }

        if(found.includes(ghosts[i]) && count == evidence[ghosts[i]].length - 1 && nightmare) {
            if(permanentEvidence[ghosts[i]]) {
                if(!selections[reverseCheck(permanentEvidence[ghosts[i]])]) {
                    found.splice(found.indexOf(ghosts[i]), 1);
                }
            } else {
                if(!evidence[ghosts[i]].includes(checkVals[evi])) found.splice(found.indexOf(ghosts[i]), 1);
            }
        }

        if(found.includes(ghosts[i]) && count == evidence[ghosts[i]].length - 2 && insanity) {
            if(permanentEvidence[ghosts[i]]) {
                if(!selections[reverseCheck(permanentEvidence[ghosts[i]])]) {
                    found.splice(found.indexOf(ghosts[i]), 1);
                }
            } else {
                if(!evidence[ghosts[i]].includes(checkVals[evi])) found.splice(found.indexOf(ghosts[i]), 1);
            }
        }
    }

    return found.length > 0;
}

class Journal extends React.Component {
    render() {
        if(!evidenceCallback) evidenceCallback = this.onEvidenceChange.bind(this);
        if(!exclusionCallback) exclusionCallback = this.onExclusionSwitch.bind(this);

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
                    <br/><br/>
                    <label htmlFor="slider" id="sliderLabel">Sanity: {sani}%</label>
                    <br/><br/>
                    <input type="checkbox" id={"nightmare"} value={this.props.value} onChange={this.onNightmareChange.bind(this)}></input>
                    <input type="checkbox" id={"insanity"} value={this.props.value} onChange={this.onInsanityChange.bind(this)}></input>
                                
                </div>
                
                <div className="btns-right">
                    {/* <br/> */}
                    {this.labels}
                    <br/><br/>
                    <Slider callback={this.onSanityChange.bind(this)}/>
                    <br/>
                    <br/>
                    <CheckBoxLabel htmlFor="nightmare" text="Nightmare?"></CheckBoxLabel>
                    <CheckBoxLabel htmlFor="insanity" text="Insanity?"></CheckBoxLabel>
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

        if(possible[0] == "None") possible = getPossibleGhosts();

        let ghosts = possible.slice();

        initKeyValues(ghosts.length > 12 ? 2 : 1);

        let sel = handleKeyDown(e, ghosts, true, selected);
        console.log(sel);

        if(sel) {
            selected = sel;
            this.forceUpdate();
        }
    }

    componentDidMount() {
        possible = getPossibleGhosts();

        initKeys(ghosts);
        stripURL();

        document.addEventListener("keydown", this.keyDown.bind(this), false);
        document.addEventListener("keyup", (e) => this.keyUp(e, strike), false);
        
        updateCallback = this.forceUpdate.bind(this);
        evidenceCallback = this.onEvidenceChange.bind(this);
        exclusionCallback = this.onExclusionSwitch.bind(this);
        labelCallback = this.onSelectionChange.bind(this);

        initInfo(this.forceUpdate.bind(this));
    }
    
    componentWillUnmount(){
        document.addEventListener("keydown", this.keyDown.bind(this), false);
        document.removeEventListener("keyup", (e) => this.keyUp(e, strike), false);
    }

    onNightmareChange(e) {
        nightmare = e.target.checked;
        updateExclusions();
    }

    onInsanityChange(e) {
        insanity = e.target.checked;
        updateExclusions();
    }

    onEvidenceChange(e) {
        let check = e.target;

        if(shifting) {
            exclusions[check.id] = !exclusions[check.id];
            check.checked = !check.checked;
        } else {
            selections[check.id] = check.checked;
        }

        updateExclusions();
    }

    onExclusionSwitch(id) {
        exclusions[id] = !exclusions[id];

        this.forceUpdate();
    }

    onSanityChange(e) {
        sani = e.target.value;
        updateExclusions();
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

                //Always gives Freezing evidence in Nightmare
                if(line.includes("Always gives") && line.includes("evidence in Nightmare")) permanentEvidence[ghosts[i]] = line.split("gives ")[1].split(" evidence")[0];

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