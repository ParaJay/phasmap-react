import Nav from './Nav';
import Main from './Main';
import React from 'react';

class App extends React.Component {
    
    render() {
        return (
            <div className="App">
                <Nav/>
                <Main/>
            </div>
        );
    }
}

export default App;
