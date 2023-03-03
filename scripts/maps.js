import { handleKeyDown, initParams, def, initKeys, initKeyValues, setSelected, getNext } from "./utils.js";

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var image = document.createElement("img");

var scale, x, y, clickX, clickY, clicking, xoffset, yoffset;

// canvas.width = screen.availWidth * 0.8;

console.log("MAPS");

var iw = canvas.width;
var ih = canvas.height;

var maps = ["bleasedale", "brownstone_high_school", "camp_woodwind", "edgefield", "grafton", "maple_lodge_campsite", "prison", "ridgeview", "sunny_meadows", "sunny_meadows_restricted", "tanglewood", "willow"];

function init() {
    initKeyValues(1);
    initParams("map", "grafton");
    initKeys(maps);

    select(def);
}

function select(map) {
    map = map.toLowerCase().replaceAll(" ", "_");

    setSelected(map);

    scale = 1;
    x = 0;
    y = 0;
    xoffset = 0;
    yoffset = 0;
    clicking = false;

    image.src = "./res/maps/" + map + ".png";

    image.onload = draw;
}

function draw() {
    context.fillStyle = "rgb(60, 63, 65)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, xoffset, yoffset, iw * scale, ih * scale);
}

window.onload = init;

function change(am) {
    var s = getNext(maps, am, true);

    if (s) select(s);
}

document.getElementById("next").onclick = function () {
    return change(1);
};
document.getElementById("previous").onclick = function () {
    return change(-1);
};

window.onkeydown = function (e) {
    var s = handleKeyDown(e, maps, true);

    if (s) select(s);
};

window.onmousemove = function (e) {
    if (clicking) {
        e.preventDefault();

        var _x = e.x - clickX;
        var _y = e.y - clickY;

        xoffset += _x;
        yoffset += _y;

        clickX = e.x;
        clickY = e.y;

        draw();
    }
};

window.onwheel = function (e) {
    var am = e.deltaY < 0 ? 1.1 : 0.9;

    scale *= am;

    draw();
};

window.onmousedown = function (e) {
    var x = e.x;
    var y = e.y;

    if (x < canvas.offsetLeft || x > canvas.offsetLeft + (xoffset + iw * scale)) return;

    if (y < canvas.offsetTop || y > canvas.offsetTop + yoffset + ih * scale) return;

    clicking = true;
    clickX = x;
    clickY = y;
};

window.onmouseup = function () {
    return clicking = false;
};