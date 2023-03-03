import _regeneratorRuntime from "babel-runtime/regenerator";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

export var text = document.getElementById("text");
export var infoHeader = document.getElementById("infoHeader");
export var buttons = document.getElementsByTagName("button");

var keys = {};

export var selected;
export var info;
export var def;
export var kval;

export function initKeyValues() {
    var kvalMax = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;

    kval = { ArrowUp: -kvalMax, ArrowDown: kvalMax, ArrowLeft: -1, ArrowRight: 1 };
}

export function setSelected(sel) {
    selected = sel;
}

export var initInfoState = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(array, dir, param) {
        var _this = this;

        var def = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : array[0];

        var info, _loop, i;

        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        initKeyValues(2);

                        info = {};
                        _loop = /*#__PURE__*/_regeneratorRuntime.mark(function _callee(i) {
                            var a;
                            return _regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            a = array[i];
                                            _context.next = 3;
                                            return readInfo(array[i], dir).then(function (e) {
                                                return info[a] = e;
                                            });

                                        case 3:
                                        case "end":
                                            return _context.stop();
                                    }
                                }
                            }, _callee, _this);
                        });
                        i = 0;

                    case 4:
                        if (!(i < array.length)) {
                            _context2.next = 9;
                            break;
                        }

                        return _context2.delegateYield(_loop(i), "t0", 6);

                    case 6:
                        i++;
                        _context2.next = 4;
                        break;

                    case 9:
                        ;

                        initAll(array);
                        initParams(param, def);

                        setInfo(info);

                        selectDef();

                        window.onkeydown = function (e) {
                            handleKeyDown(e, array);
                        };

                    case 15:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function initInfoState(_x3, _x4, _x5) {
        return _ref.apply(this, arguments);
    };
}();

export function initParams(param, deff, repA, repB) {
    def = deff;

    var query = window.location.search;

    if (query) {
        var params = new URLSearchParams(query);
        var item = params.get(param);

        if (item) def = item;

        if (repA && repB) {
            item = item.replaceAll(repA, repB);
        }
    }
}

export function selectDef() {
    select(def);
}

export function initAll(array) {
    initKeys(array);
    initButtons(array);
}

export function initKeys(array) {
    array.forEach(function (item) {
        var split = item.split(" ");
        var val = [];
        split.forEach(function (e) {
            val.push(e.charAt(0).toUpperCase());
        });

        keys[item] = val;
    });
}

export function setInfo(i) {
    info = i;
}

export function createButton(text) {
    var button = document.createElement("button");

    button.textContent = text;
    button.style.margin = "6px 6px";
    button.style.borderRadius = "12%";
    button.style.color = "rgb(202, 201, 201)";
    button.style.backgroundColor = "rgb(78, 80, 82)";
    button.style.borderColor = "rgb(94, 97, 98)";
    button.style.padding = "5px 4px";

    return button;
}

export function readInfo(filename, dir) {
    filename = filename.toLowerCase().replaceAll(" ", "");

    return new Promise(function (resolve) {
        var request = new XMLHttpRequest();
        request.open('GET', "./res/" + dir + "/" + filename + ".txt", true);
        request.send();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                var type = request.getResponseHeader('Content-Type');

                if (type.indexOf("text") !== 1) {
                    resolve(request.responseText);
                }
            }
        };
    });
}

function getFromKey(key) {
    var res = [];
    var okeys = Object.keys(keys);

    for (var i = 0; i < okeys.length; i++) {
        var okey = okeys[i];
        var val = keys[okey];

        if (val.includes(key)) {
            res.push(okey);
        }
    }

    return res;
}

export function handleKeyDown(e, array) {
    var ret = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!kval) initKeyValues();

    var s = void 0;
    var key = e.key;
    var am = kval[key];

    if (am) {
        s = getNext(array, am, ret);
    } else {
        s = handleKey(key, ret);
    }

    if (s && ret) {
        return s;
    }
}

export function handleKey(key) {
    var ret = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (key.length != 1) return;
    if (!key.match("[a-zA-Z]")) return;

    var array = getFromKey(key.toUpperCase());

    if (array.length == 0) return;

    if (array.length == 1) {
        if (ret) {
            return array[0];
        } else {
            select(array[0]);
        }
        return;
    }

    var index = array.indexOf(selected) + 1;

    if (index == array.length) index = 0;

    if (ret) {
        return array[index];
    } else {
        select(array[index]);
    }

    // select(cursedItems[index]);
}

export function getNext(array, am) {
    var ret = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var index = array.indexOf(selected);

    for (var i = 0; i < Math.abs(am); i++) {
        var ii = am < 0 ? -1 : 1;

        index += ii;

        if (index == array.length) index = 0;

        if (index < 0) index = array.length - 1;
    }

    if (ret) {
        return array[index];
    } else {
        select(array[index]);
    }
}

export function select(item) {
    if (selected == item) return;

    selected = item;
    text.textContent = info[item];
    infoHeader.textContent = item;

    updateButtons();
}

export function updateButtons() {
    for (var i = 0; i < buttons.length; i++) {
        var _text = buttons[i].textContent;

        if (_text == selected) {
            buttons[i].style.color = "orange";
        } else {
            buttons[i].style.color = "rgb(202, 201, 201)";
        }
    }
}

export function initButtons(names) {
    var left = document.getElementsByClassName("btns-left")[0];
    var right = document.getElementsByClassName("btns-right")[0];

    var _loop2 = function _loop2(i) {
        var name = names[i];
        var button = createButton(name);

        button.onclick = function () {
            return select(name);
        };

        if (i % 2 == 0) {
            left.appendChild(button);
        } else {
            right.appendChild(button);
        }
    };

    for (var i = 0; i < names.length; i++) {
        _loop2(i);
    }
}