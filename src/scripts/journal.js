import React from "react";
import { stripURL, handleKeyDown, initKeyValues, initKeys, capitalize, br } from "./utils/utils.js";
import { ghosts, evidenceMap, info, PhasLabel } from "./utils/consts.js";

const actions = {"goto":goto, "strike":strike, "reset":reset};

//TODO: don't allow keybinds if slider is focused

const br2 = br(2);
var shifting = false;
var sani = 0;
var selected, nightmare, insanity;
var updateCallback, evidenceCallback, exclusionCallback, labelCallback;
const difficulties=["nightmare", "insanity"];
const selections={}, exclusions={}, evidence={}, striked={}, sanity={}, permanentEvidence={}, autoExcluded=[], actionButtons=[], checks=[];
const difficultyLabels = [];

function getPossibleGhosts(ret=3) {
    let first = [], second = [], third = [];

    first = applySelectionFilter();

    if(ret === 1) return first;

    second = applyExclusionFilter(first);

    if(ret === 2) return second;

    third = applySanityFilter(second);
    third = applyDifficultyFilters(third);

    if(third.length === 0) third.push("None");

    return third;
}

function applySelectionFilter() {
    let res = [];
    let evs = Object.keys(evidenceMap).filter(e => selections[e]);

    if(evs.length > 0) {
        ghosts.forEach(ghost => {
            let evi = evidence[ghost];
            let pass = true;

            evs.forEach(e => {
                if(!evi.includes(document.getElementById(e).value)) pass = false;
            });

            if(pass && !res.includes(ghost)) res.push(ghost);
        });
    } else {
        res = ghosts.slice();
    }

    return res;
}

function applyExclusionFilter(array, exc=Object.keys(evidenceMap).filter(e => exclusions[e])) {
    let res = [];

    if(exc.length > 0) {
        array.forEach(ghost => {
            let pass = true;

            for(let i = 0; i < exc.length; i++) {
                let e = exc[i];
                if(evidence[ghost].includes(document.getElementById(e).value)) {
                    pass = false;
                    break;
                }
            };

            if(pass && !res.includes(ghost)) res.push(ghost);
        });
    } else {
        res = array.slice();
    }

    return res;
}

function applySanityFilter(array) { return array.filter(e => sanity[e] >= sani); }
function applyNightmareFilter(array) { return nightmare ? difficultyCheck(array, 2, 1) : array; }
function applyInsanityFilter(array) { return insanity ? difficultyCheck(array, 1, 2) : array; }
function applyDifficultyFilters(array) { return applyInsanityFilter(applyNightmareFilter(array)); }

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

                if(count >= size - off) {                       
                    if(permanentEvidence[ghost]){
                        let ps = selections[reverseCheck(permanentEvidence[ghost])] === true;

                        if(!ps) rem.push(ghost);
                    }
                }
            }
        }
    }

    for(let i = 0; i < rem.length; i++) third.splice(third.indexOf(rem[i]), 1);

    return third;
}

function reverseCheck(checkFor) {
    let keys = Object.keys(evidenceMap);

    for(let i = 0; i < keys.length; i++) if(evidenceMap[keys[i]] === checkFor) return keys[i];

    return null;
}

function countSelections() {
    let count = 0;
    let keys = Object.keys(selections);

    for(let i = 0; i < keys.length; i++) if(selections[keys[i]] === true) count++;

    return count;
}

function goto() {
    if(!selected) return;

    window.location.href = window.location.href.split("/")[0] + "?ghost=" + selected.replaceAll(" ", "%20") + "#/ghosts";
}

function strike() {
    if(!selected) return;

    striked[selected] = !striked[selected];

    updateExclusions();
}

function reset() { window.location.reload(); }

function l(t, k=t) { return <JournalLabel onClick={labelCallback} key={k} text={t}></JournalLabel>; }

function updateExclusions() {
    let keys = Object.keys(evidenceMap);

    for(let i = 0; i < keys.length; i++) {
        if(!isPossible(keys[i])) {
            exclusions[keys[i]] = true;
            autoExcluded.push(keys[i]);
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
    let ghosts = applySanityFilter(getPossibleGhosts(1)).slice();

    if(ghosts.length === 0 || ghosts[0] === "None") return true;

    let count = countSelections();

    for(let i = 0; i < ghosts.length; i++) {
        if(!found.includes(ghosts[i]) && evidence[ghosts[i]].includes(evidenceMap[evi])) found.push(ghosts[i]);
        if(found.includes(ghosts[i]) && striked[ghosts[i]]) found.splice(found.indexOf(ghosts[i]), 1);

        for(let j = 0; j < 2; j++) {
            let b = j === 0 ? nightmare : insanity;

            if(found.includes(ghosts[i]) && count > evidence[ghosts[i]].length - (j + 1) && b) found.splice(found.indexOf(ghosts[i]), 1);

            if(found.includes(ghosts[i]) && count === evidence[ghosts[i]].length - (j + 1) && b) {
                if(permanentEvidence[ghosts[i]]) {
                    if(selections[reverseCheck(permanentEvidence[ghosts[i]])] === false) found.splice(found.indexOf(ghosts[i]), 1);
                } else {
                    if(!evidence[ghosts[i]].includes(evidenceMap[evi])) found.splice(found.indexOf(ghosts[i]), 1);
                }
            }
    
        }
    }
    
    return found.length > 0;
}

class Slider extends React.Component {
    render() { return (<input id="slider" defaultValue="0" type="range" min="0" max="100" value={this.props.val} onInput={this.props.callback}/>) }
}

class CheckBox extends React.Component {
    render() { return this.check; }

    componentDidMount() {
        this.check = (<input type="checkbox" id={this.props.id} className="evidence journal-check-box" value={this.props.value} onClick={(e) => { evidenceCallback(e); }} onMouseUp={(e) => { if(e.button === 1) exclusionCallback(e); }} />);

        if(!checks.includes(this.check.id)) checks.push(this.check.id);
    }
}

export class JournalLabel extends React.Component {
    render() {
        let text = this.props.text;
        let cn = "journal-defs journal-";

        if(selected === text) cn += "selected";
        
        if(striked[text]) cn = cn.replace("selected", "") + "striked";

        if(cn.endsWith("-")) cn += text.endsWith("_") ? "blank" : "label";

        let tip = "";

        if(evidence[text]) tip = evidence[text].toString().replaceAll(",", ", ")

        return (
            <PhasLabel onClick={this.props.onClick} text={this.props.text} className={cn} tooltip={tip}></PhasLabel>
        )
    }
}

class CheckBoxLabel extends React.Component {
    render() {
        let f = this.props.htmlFor
        let text = this.props.text;
        if(exclusions[f]) text += " (NOT)";

        return <label className="journal-check-label" htmlFor={f} onMouseUp={(e) => {
            if(e.button === 1 && evidenceMap[f]) exclusionCallback(e);
        }}>{text}</label>;
    }
}

class ActionButton extends React.Component {
    render() {
        let action = this.props.action;

        return(<><br/><button id={action} onClick={actions[action]}>{capitalize(action)}</button></>)
    }
}

class Journal extends React.Component {
    constructor(props) {
        super(props);

        this.difficultyChecks = [
            <input type="checkbox" key="n" id={"nightmare"} onChange={this.onNightmareChange.bind(this)}></input>,
            <input type="checkbox" key="i" id={"insanity"} onChange={this.onInsanityChange.bind(this)}></input>
        ];

        updateCallback = this.forceUpdate.bind(this);
        evidenceCallback = this.onEvidenceChange.bind(this);
        exclusionCallback = this.onExclusionSwitch.bind(this);
        labelCallback = this.onSelectionChange.bind(this);

        this.keyUp = this.keyUp.bind(this);
        this.keyDown = this.keyDown.bind(this);

        initKeys(ghosts);
        stripURL();
        initInfo(this);
        this.preLoad();
    }

    preLoad() {
        if(!this.loaded || !this.mounted) setTimeout(() => this.preLoad(), 100);

        if(this.loaded && this.mounted) this.forceUpdate();
    }

    render() {
        if(!this.loaded) return;

        let ghosts = getPossibleGhosts().slice();

        let left = [], right = [], center = [];

        for(let i = 0; i < ghosts.length; i++) {
            let lbl = l(ghosts[i]);

            if(ghosts.length > 12) {
                (i % 2 === 0 ? left : right).push(lbl);
            } else {
                center.push(lbl);
            }
        }
        
        this.checks = [];
        this.labels = [];

        let keys = Object.keys(evidenceMap);

        for(let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = evidenceMap[key];
            
            if(!value) value = capitalize(key);

            this.checks.push(<CheckBox key={key} id={key} value={value}/>);  
            this.labels.push(<CheckBoxLabel key={"l-" + key} htmlFor={key} text={value}/>);
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
                    {br2}
                    <label htmlFor="slider" id="sliderLabel">Sanity: {sani}%</label>
                    {br2}
                    {this.difficultyChecks}
                                
                </div>
                
                <div className="btns-right">
                    {this.labels}
                    {br2}
                    <Slider callback={this.onSanityChange.bind(this)}/>
                    {br2}
                    {difficultyLabels}
                    <br/>
                    {actionButtons}
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

        let ghosts = getPossibleGhosts().slice();

        initKeyValues(ghosts.length > 12 ? 2 : 1);

        let sel = handleKeyDown(e, ghosts, true, selected);

        if(sel) {
            selected = sel;
            this.forceUpdate();
        }
    }

    componentDidMount() {
        this.mounted = true;

        document.addEventListener("keydown", this.keyDown, false);
        document.addEventListener("keyup", this.keyUp, false);
    }
    
    componentWillUnmount(){
        document.removeEventListener("keydown", this.keyDown, false);
        document.removeEventListener("keyup", this.keyUp, false);
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
            if(check.checked === true) selections[check.id] = true;
            else delete selections[check.id];
        }

        updateExclusions();
    }

    onExclusionSwitch(e) {
        let id = e.target.id ? e.target.id : e.target.htmlFor;

        exclusions[id] = !exclusions[id];

        updateExclusions();
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

function initInfo(inst) {
    for(let i = 0; i < ghosts.length; i++) {      
        let e = info[ghosts[i]]; 
        let lines = e.split("\n");

        for(let j = 0; j < lines.length; j++) {
            let line = lines[j];

            if(line.includes("Evidence: ")) evidence[ghosts[i]] = line.split(": ")[1].split(", ");

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
            }
        }
    }

    inst["loaded"] = true;
}

export default Journal;

let actionKeys = Object.keys(actions);

for(let i = 0; i < actionKeys.length; i++) actionButtons.push(<ActionButton key={"act" + i} action={actionKeys[i]}/>)
for(let i = 0; i < difficulties.length; i++) difficultyLabels.push(<CheckBoxLabel key={i} htmlFor={difficulties[i]} text={capitalize(difficulties[i] + "?")}></CheckBoxLabel>)