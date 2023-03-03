import { initWith } from "./info.js";
import React from "react";


let equipment = [
    "DOTS Projector", "EMF Reader", "Ghost Writing Book", "Photo Camera", "Spirit Box", "UV Torch", "Video Camera",
     "Candle", "Crucifix", "Glowstick", "Head Mounted Camera", "Lighter", "Motion Sensor", "Parabolic Microphone", "Salt",
      "Sanity Pills", "Smudge Sticks", "Sound Sensor", "Strong Torch", "Thermometer", "Tripod", "Weak Torch"];

class Equipment extends React.Component {
    render() {
        return initWith(equipment, "equipment");
    }
}

export default Equipment;