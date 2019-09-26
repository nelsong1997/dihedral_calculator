import React from 'react';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            property: true
        }
    }
    //this.function = this.function.bind(this);
    


    render() {
        return (
            <div>
                <p>Welcome! Please select a dihedral group.</p>
                <label>
                    <i>D<sub>n</sub> , n = </i> <input id="input-n" type="number" style={{display: "inline", width: "50px"}}></input>
                </label>
            </div>
        )
    }
}

export default App;
