import React from "react";
import Random from "../random";
import { costMult, currentEquipment, points, randomItem, setPoints, updateCallback, remaining, starMult, difficulty, setRemaining, setStarMult, difficulties } from "./PhotoRandomizer";
import { incrementTarot, setFoolChance } from "./TarotCards";

var wishesRemaining;

class MonkeyPawButton extends React.Component {
    render() {
        let text = this.props.text;
        return (
            <>
                <button onClick={() => useWish(text)}>I wish for {text}</button>
            </>
        )
    }
}

export function resetWishes() { wishesRemaining = difficulties.indexOf(difficulty) + 2; }

function showWishes() {
    if(wishesRemaining <= 0) return;
    let dropContent = document.getElementsByClassName("photo-rando-dropdown-content");

    for(let i = 0; i < dropContent.length; i++) {
        let cont = dropContent[i];

        cont.style.display = "flex";
        cont.style.flexDirection = "column";
    }
}

export function hideWishes() {
    let dropContent = document.getElementsByClassName("photo-rando-dropdown-content");

    for(let i = 0; i < dropContent.length; i++) {
        let cont = dropContent[i];

        cont.style.display = "none";
    }
}

function useWish(wish) {
    if(wishesRemaining <= 0) {
        hideWishes();
        return;
    }

    wish = wish.replace("I wish for ", "");
    let ppoints = points;
    let cm = costMult;

    if(wish === "points") {
        let random = new Random().nextInt(100);

        if(random < 40) {
            ppoints = -50
        } else if(random > 40 && random < 80) {
            ppoints += 50;
        }

        cm *= 2;
    } else if(wish === "cheaper items") {
        let random = new Random().nextInt(100);

        if(random < 40) {
            cm *= 2;
        } else if(random > 40 && random < 80) {
            cm /= 2;
        }
    } else if(wish === "tarot") {
        incrementTarot();
        setFoolChance(50);
    } else if(wish === "item") {
        randomItem(true);

        currentEquipment.splice(new Random().intFromArray(currentEquipment), 1, "...");
    } else if(wish === "photo") {
        setRemaining(remaining + 1);

        if(new Random().nextInt(100) < 40) {
            setStarMult(starMult / 2);
        }
    }

    wishesRemaining--;

    setPoints(ppoints, cm);

    updateCallback();
}

export function getDropdown() {
    return (
        <div key="dr" className="photo-rando-dropdown-content">
        <MonkeyPawButton text="points"></MonkeyPawButton>
        <MonkeyPawButton text="cheaper items"></MonkeyPawButton>
        <MonkeyPawButton text="tarot"></MonkeyPawButton>
        <MonkeyPawButton text="item"></MonkeyPawButton>
        <MonkeyPawButton text="photo"></MonkeyPawButton>
    </div>
    )
}

export default class MonkeyPaw extends React.Component {
    render() {
        let monkeyPawClassName = wishesRemaining <= 0 ? " disabled" : "";

        return (
            <button className={"photo-rando-dropbtn" + monkeyPawClassName} onClick={showWishes}>Monkey Paw</button>
        )
    }
}