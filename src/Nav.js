import React from "react";
import {Link} from "react-router-dom";
import {unsafe_maps} from "./scripts/consts";

const maps = unsafe_maps;

const pages = ["Ghosts", "Index", "Journal", "Cursed Items", "Equipment", "Difficulty", "Photo Randomizer", "Photo Rewards"]

const names = {"Index" : "Maps"};

class Nav extends React.Component {
    render() {
        let mc = [], pc = [];

        for(let i = 0; i < maps.length; i++) {
            let p = "/phasmap-react/?map=" + maps[i].toLowerCase().replaceAll(" ", "%20") + "#/index";

            mc.push(<a key={maps[i]} href={p}>{maps[i]}</a>)
        }

        for(let i = 0; i < pages.length; i++) {
            let pg = pages[i];
            let n = names[pg] ? names[pg] : pg;
            let p = "/" + pg.toLowerCase().replace(" ", "");
            pc.push(<button key={"b" + i}><Link key={n} to={p}>{n}</Link></button>);
        }

        return (
            <nav id="nav" className="navbar">
                <div className="dropdown">
                    <button className="dropbtn">View Map</button>
                    
                    <div className="dropdown-content">{mc}</div>
                </div>
                {pc}
            </nav>
        )
    }
}

export default Nav;