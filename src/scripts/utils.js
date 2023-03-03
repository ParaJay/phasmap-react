import queryString from 'query-string';

const keys = {};

export var selected, info, def, kval;

export function initKeyValues(kvalMax=2) { kval = {ArrowUp:-kvalMax, ArrowDown:kvalMax, ArrowLeft: -1, ArrowRight: 1}; }

export function setSelected(sel) { selected = sel; }

export async function initInfoState(array, param, def=array[0]) {
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
    array.forEach(item => {
        let split = item.replaceAll("_", " ").split(" ");
        let val = [];

        split.forEach(e => val.push(e.charAt(0).toUpperCase()));

        keys[item] = val;
    });
}

export function setInfo(i) { info = i; }

export function readInfo(filename, dir) {
    filename = filename.toLowerCase().replaceAll(" ", "");

    return new Promise((resolve) => { fetch(require(`../res/${dir}/${filename}.txt`)).then((r)=>{r.text().then(d => {resolve(d); })}); });   
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

    let index = sel ? array.indexOf(sel) + 1 : 0;

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