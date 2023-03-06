import Nav from './Nav';
import Main from './Main';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { initInfo, isLoading } from './utils/consts';

class App extends React.Component {
    state = {loaded: false};

    constructor(props) {
        super(props);

        this.loaded = false;

        initInfo();

        this.init();
    }

    init() {
        if(isLoading() || !this.mounted) {
            setTimeout(() => {this.init()}, 100);
        } else {
            this.loaded = true;
        }

        if(this.mounted) this.forceUpdate();
    }

    componentDidMount() { this.mounted = true; }
    
    render() {
        if(!this.loaded) return;

        return (
            <HashRouter>
                <Nav/>
                <Main/>
            </HashRouter>
        );
    }
}

export default App;
