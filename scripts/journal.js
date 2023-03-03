import _regeneratorRuntime from "babel-runtime/regenerator";

var init = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
        var _this = this;

        var _loop, i, _loop2, _i;

        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        window.onkeyup = function (e) {
                            if (!e.shiftKey && !e.ctrlKey) {
                                shifting = false;
                            }

                            if (e.key == " ") {
                                strike();
                            }
                        };

                        window.onkeydown = function (e) {
                            if (e.shiftKey || e.ctrlKey) {
                                shifting = true;
                            }
                        };

                        slider.oninput = function () {
                            sliderLabel.textContent = "Sanity: " + slider.value + "%";
                            update();
                        };

                        _loop = /*#__PURE__*/_regeneratorRuntime.mark(function _callee(i) {
                            return _regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            _context.next = 2;
                                            return readInfo(ghosts[i], "ghosts").then(function (e) {
                                                var lines = e.split("\n");

                                                for (var j = 0; j < lines.length; j++) {
                                                    var line = lines[j];

                                                    if (line.includes("Evidence: ")) {
                                                        evidence[ghosts[i]] = line.split(": ")[1].split(", ");
                                                    }

                                                    if (line.includes("Hunts from: ")) {
                                                        (function () {
                                                            var split = line.split("Hunts from: ")[1].split(" ");

                                                            var san = 0;

                                                            split.forEach(function (ee) {
                                                                if (ee.includes("%")) {
                                                                    var si = parseInt(ee.replace("%", "").replace("(", ""));

                                                                    if (si > san) {
                                                                        san = si;
                                                                    }
                                                                }
                                                            });

                                                            sanity[ghosts[i]] = san;
                                                        })();
                                                    }
                                                }
                                            });

                                        case 2:
                                        case "end":
                                            return _context.stop();
                                    }
                                }
                            }, _callee, _this);
                        });
                        i = 0;

                    case 5:
                        if (!(i < ghosts.length)) {
                            _context2.next = 10;
                            break;
                        }

                        return _context2.delegateYield(_loop(i), "t0", 7);

                    case 7:
                        i++;
                        _context2.next = 5;
                        break;

                    case 10:
                        ;

                        for (i = 0; i < labels.length; i++) {
                            labelMap[labels[i].htmlFor] = labels[i];
                        }

                        display(possible);

                        _loop2 = function _loop2(_i) {
                            var check = checks[_i];

                            check.oninput = function () {
                                if (shifting) {
                                    exclusions[check.id] = !exclusions[check.id];
                                    check.checked = !check.checked;

                                    updateCheckLabel(check.id);
                                } else {
                                    selections[check.id] = check.checked;
                                }

                                update();
                            };
                        };

                        for (_i = 0; _i < checks.length; _i++) {
                            _loop2(_i);
                        }

                    case 15:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function init() {
        return _ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import { readInfo } from "./utils.js";

var text = document.getElementById("text");
var ghostName = document.getElementById("ghostName");
var checks = document.getElementsByClassName("evidence");
var labels = document.getElementsByTagName("label");
var slider = document.getElementById("slider");
var sliderLabel = document.getElementById("sliderLabel");

//TODO: arrow keys
//TODO: select by charKey
//TODO: auto exclude when evidence unavailable

var ghosts = ["Banshee", "Demon", "Deogen", "Goryo", "Hantu", "Jinn", "Mare", "Moroi", "Myling", "Obake", "Oni", "Onryo", "Phantom", "Poltergeist", "Raiju", "Revenant", "Shade", "Spirit", "Thaye", "The Mimic", "The Twins", "Wraith", "Yokai", "Yurei"];

var selections = {};
var exclusions = {};
var evidence = {};
var striked = {};
var labelMap = {};
var sanity = {};

var shifting = false;
var selected = "";
var possible = ghosts.slice();

function update() {
    var pp = getPossibleGhosts();
    possible = pp[2];

    display(possible);
}

function getPossibleGhosts() {
    var evs = [];
    var exc = [];

    var sKeys = Object.keys(selections);

    sKeys.forEach(function (e) {
        var id = e;

        if (labelMap[id].textContent.includes("NOT")) {
            exc.push(id);
        } else {
            if (selections[e]) {
                evs.push(id);
            }
        }
    });

    var first = [];

    if (evs.length > 0) {
        ghosts.forEach(function (ghost) {
            var evi = evidence[ghost];
            var pass = true;

            evs.forEach(function (e) {
                if (!evi.includes(document.getElementById(e).value)) {
                    pass = false;
                }
            });

            if (pass) {
                if (!first.includes(ghost)) {
                    first.push(ghost);
                }
            }
        });
    } else {
        first = ghosts.slice();
    }

    var second = [];

    if (exc.length > 0) {
        first.forEach(function (ghost) {
            var pass = true;

            for (var i = 0; i < exc.length; i++) {
                var e = exc[i];
                if (evidence[ghost].includes(document.getElementById(e).value)) {
                    pass = false;
                    break;
                }
            };

            if (pass) {
                if (!second.includes(ghost)) {
                    second.push(ghost);
                }
            }
        });
    } else {
        second = first.slice();
    }

    var third = [];

    second.forEach(function (ghost) {
        var san = sanity[ghost];

        if (san >= slider.value) {
            third.push(ghost);
        }
    });

    //TODO: sanity and nightmare check

    return [first, second, third];
}

function select(ghostId) {
    selected = ghostId;
    updateLabels();
}

function updateCheckLabel(checkId) {
    var label = labelMap[checkId];

    if (exclusions[checkId]) {
        label.textContent = label.textContent.replace(" (NOT)", "") + " (NOT)";
    } else {
        label.textContent = label.textContent.replace(" (NOT)", "");
    }
}

function updateLabels() {
    possible.forEach(function (e) {
        var gg = document.getElementById(e);

        if (selected === e) {
            gg.style.color = "orange";
        } else {
            gg.style.color = "rgb(202, 201, 201)";
        }

        if (striked[e]) {
            gg.style.color = "rgb(128, 128, 128)";
            gg.style.textDecoration = "line-through";
        } else {
            gg.style.textDecoration = "none";
        }
    });
}

function removeAll(elem) {
    while (elem.childElementCount > 0) {
        elem.removeChild(elem.lastElementChild);
    }
}

function m(s, am) {
    var res = "";

    for (var i = 0; i < am; i++) {
        res += s;
    }

    return res;
}

//TODO: fix
function p(am) {
    var pp = document.createElement("p");
    pp.textContent = m("_", am);
    pp.style.color = "rgb(60, 63, 65)";
    pp.style.fontSize = "30px";
    return pp;
}

function display() {
    var ghosts = possible.slice();

    if (ghosts.length == 0) {
        ghosts = ["None"];
    }

    var left = document.getElementsByClassName("jleft")[0];
    var right = document.getElementsByClassName("jright")[0];
    var center = document.getElementsByClassName("jcenter")[0];

    removeAll(left);
    removeAll(right);
    removeAll(center);

    var x = 0;
    var highest = 0;

    ghosts.forEach(function (e) {
        if (e.length > highest) {
            highest = e.length;
        }
    });

    var _loop3 = function _loop3(i) {
        var g = document.createElement("p");

        g.textContent = ghosts[i];
        g.id = ghosts[i];
        g.onclick = function () {
            select(ghosts[i]);
        };
        g.style.fontFamily = "October Crow";
        g.style.fontSize = "24px";
        g.style.margin = "6px 6px";
        g.style.textAlign = "center";

        //count highest charlen make add, 30
        if (ghosts.length > 12) {
            if (i % 2 == 0) {
                left.appendChild(g);
            } else {
                right.appendChild(g);
            }

            if (x == 0) {
                center.appendChild(p(10));

                x++;
            }
        } else {
            if (x == 0) {
                var cl = (30 - highest) / 2 - 1;
                var cl2 = cl % 2 == 0 ? cl : cl - 1;

                left.appendChild(p(cl));
                right.appendChild(p(cl2));

                x++;
            }

            center.appendChild(g);
        }
    };

    for (var i = 0; i < ghosts.length; i++) {
        _loop3(i);
    }
}

function goto() {
    if (!selected) return;

    var url = window.location.href.replace("journal", "ghosts") + "?ghost=" + selected.replaceAll(" ", "%20");

    window.location.href = url;
}

function strike() {
    if (selected) {
        striked[selected] = !striked[selected];
        updateLabels();
    }
}

function falsify(dict) {
    Object.keys(dict).forEach(function (e) {
        return dict[e] = false;
    });
}

function reset() {
    for (var i = 0; i < checks.length; i++) {
        checks[i].checked = false;
    }

    selected = undefined;

    falsify(striked);
    falsify(selections);
    falsify(exclusions);

    for (var _i2 = 0; _i2 < labels.length; _i2++) {
        labels[_i2].textContent = labels[_i2].textContent.replace(" (NOT)", "");
    }

    slider.value = 0;

    updateLabels();
    update();
}

document.getElementById("goto").onclick = goto;
document.getElementById("strike").onclick = strike;
document.getElementById("reset").onclick = reset;

init();