import queryString from 'query-string';

var keys = {};

export var selected, info, def, kval;

export function initKeyValues(kvalMax=2) { kval = {ArrowUp:-kvalMax, ArrowDown:kvalMax, ArrowLeft: -1, ArrowRight: 1}; }

export function setSelected(sel) { selected = sel; }

export function initInfoState(array, param, def=array[0]) {
    initKeyValues(2);

    initKeys(array);
    initParams(param, def);

    selectDef();
}

export function initParams(param, deff, repA, repB) {   
    def = deff;

    let query = window.location.search;

    if(query) {
        let params = queryString.parse(query);
        let item = params[param];

        if(repA && repB) item = item.replaceAll(repA, repB);

        if(item) def = item;
    }
}

export function selectDef() { select(def); }

export function initAll(array) { initKeys(array); }

export function initKeys(array) {
    keys = {};

    for(let i = 0; i < array.length; i++) {
        let item = array[i];

        let split = item.replaceAll("_", " ").split(" ");
        let val = [];

        split.forEach(e => val.push(e.charAt(0).toUpperCase()));

        keys[item] = val;
    }
}

export function setInfo(i) { info = i; }

export function readInfo(filename, dir) {
    filename = filename.toLowerCase().replaceAll(" ", "");

    return new Promise((resolve) => { fetch(require(`../../res/${dir}/${filename}.txt`)).then((r)=>{r.text().then(d => {resolve(d); })}); });   
}

function getFromKey(key) {
    let res = [];
    let okeys = Object.keys(keys);

    for(let i = 0; i < okeys.length; i++) {
        let okey = okeys[i];
        let val = keys[okey];

        if(val.includes(key)) res.push(okey);
    }

    return res;
}

export function handleKeyDown(e, array, ret=false, sel=selected) {
    if(!kval) initKeyValues();

    let key = e.key;
    let am = kval[key];
    let s = am ? getNext(array, am, ret, sel) : handleKey(key, ret, sel);

    if(s && ret) return s;
}

export function handleKey(key, ret=false, sel=selected) {
    if(key.length !== 1) return;
    if(!key.match("[a-zA-Z]")) return;

    let array = getFromKey(key.toUpperCase());

    if(array.length === 0) return;

    if(array.length === 1) {
        if(ret) {
            return array[0];
        } else {
            select(array[0]);
        }

        return;
    }

    let index = array.indexOf(sel) + 1;

    if(index === array.length) index = 0;

    if(ret) {
        return array[index];
    } else {
        select(array[index]);
    }
}

export function getNext(array, am, ret=false, sel=selected) {
    let index = array.indexOf(sel);

    if(sel) {
        for(let i = 0; i < Math.abs(am); i++) {
            let ii = am < 0 ? -1 : 1;

            index += ii;

            if(index === array.length) index = 0;

            if(index < 0) index = array.length - 1;
        }
    } else {
        index = 0;
    }

    if(ret) {
        return array[index];
    } else {
        select(array[index]);
    }
}

export function select(item) { selected = item; }

//TODO: only take non-excluded
export function stripURL() {
    let href = window.location.href;

    if(href.includes("?")) {
        let params = "?" + href.split("?")[1].split("#")[0];

        window.location = href.replace(params, "");
    }
}

export function capitalize(string) { return (string.charAt(0).toUpperCase() + string.slice(1)); }

export function capitalizeAll(string, seperator=" ") {
    if(!string.includes(seperator)) return capitalize(string);

    let split = string.split(seperator);
    let res = "";

    for(let i = 0; i < split.length; i++) res += (res.length === 0 ? "" : seperator) + capitalize(split[i]);

    return res;
}

export function capitalizeArrayToString(array, start=0, seperator="") {
    let result = "";

    if(start !== 0) result = array.slice(0, start).toString().replaceAll(",", seperator);

    for(let i = start; i < array.length; i++) {
        let e = array[i];

        if(result.length > 0) result += seperator;

        result += capitalize(e);
    }

    return result;
}

export function capitalizeInArray(arr, start=0, end=arr.length, seperator="") {
    let array = arr.slice();
    for(let i = start; i < end; i++) array[i] = capitalizeAll(array[i], seperator);
    return array;
}

export function toSafeString(str) {
    return str.toLowerCase().replaceAll(" ", "_");
}

export function toUnsafeString(str) {
    return capitalizeArrayToString(str.replaceAll("_", " ").split(" "), 0, " ");
}

export function toSafeArray(arr) {
    let array = arr.slice();
    for(let i = 0; i < array.length; i++) array[i] = toSafeString(array[i]);
    return array;
}

export function toUnSafeArray(arr) {
    let array = arr.slice();
    for(let i = 0; i < array.length; i++) array[i] = toUnsafeString(array[i]);
    return array;
}

export function br(amount=1) {
    let res = [];

    for(let i = 0; i < amount; i++) res.push(<br key={i}/>);

    return res;
}