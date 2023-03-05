import React from "react";
import { equipment, photoRewards, InfoHeader, PhasLabel, Separator } from "./consts";
import { JournalLabel } from "./journal";
import Random from "./random";
import { br } from "./utils";

var usables = trimAvailable(equipment.slice());
var equipmentList;
var currentEquipment = [];
var points, difficulty, remaining;

var updateCallback, onDifficultyChange;

function trimAvailable(array) {
    for(let i = 0; i < array.length; i++) {
        let e = array[i];

        if(e == "Photo Camera" || e == "Weak Torch" || e == "Lighter") {
            array.splice(i, 1);
        }
    }

    return array;
}

function randomItem() {
    if(difficulty == "Hard" && points < 5) {
        return;
    }

    if(currentEquipment.length !== usables.length) {
        let randint = new Random().intFromArray(equipmentList);
        console.log(randint + "|" + equipmentList[randint]);
        let equipment = equipmentList.splice(randint, 1);
        currentEquipment.push(equipment);
    }

    updateCallback();
}

function reset(call=true) { 
    points = 0;
    currentEquipment.splice(0, currentEquipment.length);
    equipmentList = usables.slice();
    console.log("done");
    remaining = 10;

    if(call)
        updateCallback();
 }

function getPoints() {
   return (difficulty === "Normal" ? (<>&infin;</>) : points.toString());
}

function getDifficultyExtras() {
    let center = [];
    if(difficulty == "Hard") {
        center.push(<p className="phas-label" key="c2">{"Photos Remaining: " + remaining}</p>)
        center.push(<Separator key="c1"/>);
    }
    return center;
}

class PhotoRandoLabel extends React.Component {
    render() {
        let cn = "photo-rando-label " + this.props.className; 

        return (
            <PhasLabel className={cn} text={this.props.text}></PhasLabel>
        );
    }
}

class BlankLabel extends React.Component {
    render() {
        let txt = equipment.toString().replaceAll(",", ", ");

        if(currentEquipment.length > 0) txt = txt + ", ";
        // if(currentEquipment.length == 0) text += "               ";
        // else txt = "____";

        for(let i = 0; i < currentEquipment.length; i++) {
            let eq = currentEquipment[i];

            if(txt.includes(eq) + ", ") {
                txt = txt.replace(eq + ", ", "");
            }

            if(txt.includes(eq) + " ") {
                txt = txt.replace(eq + " ", "");
                // txt = txt.replace(", ");
            }
        }

        console.log(currentEquipment.toString().replaceAll(",", ", ").length + "|" + txt.length);

        // console.log(metrics);
        
        // console.log(currentEquipment.toString().replaceAll(",", ", "));
        // if(currentEquipment.length > 0) {
        //     console.log("_");
        //     console.log(txt);
        // }

        return (
            <>
            <PhotoRandoLabel text={"_"} className="journal-blank"/>
            {/* <PhotoRandoLabel text={"_"} className="journal-blank"/> */}
            </>
        )
    }
}

class PhotoRandoPanelDefs extends React.Component {
    render() {
        return (
            <>
                <button className={this.props.btnClassName + " photo-rando-item"} onClick={randomItem}>Random Item</button>
                <p className="photo-rando-item">{"Difficulty: " + difficulty}</p>
                <input className="photo-rando-item" type="range" min="0" max="1" value={Object.keys(panelMap).indexOf(difficulty)}onChange={onDifficultyChange}/>
                <button className="photo-rando-item" onClick={reset}>Reset</button>
            </>
        );
    }
}

class PhotoRandoNormal extends React.Component {
    render() {
        let randomItemBtnClassName = "";
        if(currentEquipment.length == usables.length) {
            randomItemBtnClassName = "disabled";
        }

        return (
            <>
                <div className="btns-left">
                    <br/>
                </div>

                <div className="btns-right">
                    <PhotoRandoPanelDefs btnClassName={randomItemBtnClassName}/>
                </div>
            </>
        )
    }
}

class PhotoRandoHard extends React.Component {
    render() {
        let randomItemBtnClassName = "";
        if(remaining == 0) {
            randomItemBtnClassName = "disabled";
        }

        let left = [], right = [];

        for(let i = 0; i < photoRewards.length; i++) {
            (i % 2 == 0 ? left : right).push(<button className="photo-rando-item" key={i}>{photoRewards[i]}</button>)
        }

        let oleft = [];

        for(let i = 0; i < 4; i++) {
            if(i == 1) oleft.push(<p className="photo-rando-item journal-blank" key={i + "be"}>_</p>);
            oleft.push(<button className="photo-rando-item journal-blank" key={i + "vg"}>_</button>);
        }

        oleft = oleft.concat(left);

        return (
            <>
                <div className="btns-left">
                    {oleft}
                </div>

                <div className="btns-right">
                    <PhotoRandoPanelDefs btnClassName={randomItemBtnClassName}/>
                    <p id="draw tarot"></p>
                    {right}
                </div>
            </>
        )
    }
}

const panelMap = {
    "Normal": <PhotoRandoNormal/>,
    "Hard": <PhotoRandoHard/>
}

class PhotoRandomizer extends React.Component {
    // state = {difficulty: "Normal"};

    constructor(props) {
        super(props);

        difficulty = "Normal";
        updateCallback = this.forceUpdate.bind(this);
        onDifficultyChange = this.onDifficultyChange.bind(this);

        reset(false);
    }

    render() {
        let center = [];
        let str = "";

        for(let i = 0; i < currentEquipment.length; i++) {
            if(i !== 0 && i % 3 == 0) {
                center.push(<PhotoRandoLabel key={i + "-x"} text={str}/>);
                str="";
            }
            str += (str.length == 0 ? "" : ", ") + currentEquipment[i];
        }
    
        if(str) center.push(<PhotoRandoLabel key={"g-x"} text={str}/>);

        let end = Math.ceil((usables.length - currentEquipment.length) / 3);

        for(let i = 0; i < end; i++) {
            center.push(<PhotoRandoLabel key={"x" + i + "-x"} text={"______"} className={"journal-blank"}/>);
        }
        
        return (
            <div className="wrapper">       
                <div className="sub-wrapper">
                    <div className="photo-rando-wrapper">
                        <div className="jtop">
                            <Separator/>
                            <p className="phas-label">{"Points: "}{getPoints()}</p>
                            <Separator/>
                            {getDifficultyExtras()}
                        </div>

                        <div className="jcenter">
                            {center}
                        </div>

                        <div className="jbottom">
                            <Separator key="s"/>
                            <PhotoRandoLabel key="-h" text={"Photo Camera, Weak Torch and Lighter always available"}/>
                        </div>
                    </div>
                </div>

                {panelMap[difficulty]}                
            </div>
        )
    }

    onDifficultyChange(e) {
        let index = e.target.value;

        let newDifficulty = Object.keys(panelMap)[index];

        if(newDifficulty !== difficulty) {
            difficulty = newDifficulty;

            reset();
        }
    }
}

export default PhotoRandomizer;