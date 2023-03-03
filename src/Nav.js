import React from "react";
import {Link} from "react-router-dom";

const maps = [
    "Bleasedale", "Brownstone High School", "Camp Woodwind", "Edgefield", "Grafton", "Maple Lodge Campsite", "Prison", 
    "Ridgeview", "Sunny Meadows", "Sunny Meadows Restricted", "Tanglewood", "Willow"
]

const pages = [
    "Ghosts", "Index", "Journal", "Cursed Items", "Equipment", "Difficulty"
]

const names = {"Index" : "Maps"};

class Nav extends React.Component {
    render() {
        let mc = [];
        let pc = [];

        for(let i = 0; i < maps.length; i++) {
            let p = "/phasmap-react/?map=" + maps[i].toLowerCase().replaceAll(" ", "%20") + "#/index";

            mc.push(<a key={maps[i]} href={p}>{maps[i]}</a>)
        }

        for(let i = 0; i < pages.length; i++) {
            let pg = pages[i];
            let n = names[pg] ? names[pg] : pg;
            let p = "/" + pg.toLowerCase().replace(" ", "");
            pc.push(<button key={"b" + i}><Link key={n} to={p} onClick={(e) => {
                // e.preventDefault();

                // window.location = window.location.toString().split("/")[0] + "/#/" + p;
            }}>{n}</Link></button>);
        }

        return (
            <nav id="nav" className="navbar">
                <div className="dropdown">
                    <button className="dropbtn">
                        View Map
                    </button>
                    
                    <div className="dropdown-content">
                        {mc}
                    </div>
                </div>

                {pc}
            </nav>
        )
    }
}

export default Nav;