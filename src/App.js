import React from 'react';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            N: ""
        }
        this.NChange = this.NChange.bind(this);
    }
    
    NChange(evnt) {
        this.setState( {N: evnt.target.value} )
    }

    displayWelcomeMessage(stringN) {
        if (stringN==="") {
            return (
                <p>Welcome! Please select a dihedral group.</p>
            )
        } else {
            return <div style={{height: "18px", margin: "16px"}}></div>
        }
    }

    displayTheGroup(stringN) {
        let N = Number(stringN)
        if (N%1!==0 || (N<3 && stringN!=="") || N.toString()==="NaN") {
            return (
                <p>Error: Please enter an integer greater than or equal to 3 for <em>n</em></p>
            )
        } else if (N>20) {
            return (
                <p>The <em>n</em> you selected is very large and is currently unsupported. Please enter <em>n</em> less than 21.</p>
            )
        } else if (stringN==="") {
            return null
        } else {
            let theGroup = dihedralGroup(N)

            let pointsArray = []
            let angle = 0
            for (let i = 0; i < N; i++) {
                pointsArray.push(Math.round((50*Math.cos(angle) + 70)) + "," + Math.round((-50*Math.sin(angle) + 70)))
                angle = angle + (2*Math.PI)/N
            }

            let listItems = []
            let i = 0;
            for (let element of theGroup) {
                let elementType;
                let elementNumber = (N - element[0])%N
                if ((element[1]-element[0] + N)%N === 1) {
                    elementType = "R"
                } else {
                    elementType = "S"
                }
                let topLine = []; let bottomLine = Array(element.length)
                for (let i = 0; i < element.length; i++) {
                    topLine.push(i)
                    bottomLine[element[i]] = i
                }
                let textElementArray = []
                angle = 0
                let j = 0
                for (let point of element) {
                    textElementArray.push(
                        <text
                            x={Math.round(60*Math.cos(angle) + 66)} y={Math.round(-60*Math.sin(angle) + 76)}
                            fontFamily="Times New Roman" fontSize="16px" fill="black" key={j}>{point}
                        </text>
                    )
                    angle = angle + (2*Math.PI)/N
                    j++
                }
                listItems.push(
                    <div className="element" key={i}>
                        <div>
                            <em>{elementType}</em><sub>{elementNumber}</sub>: [{element.join(", ")}]
                        </div>
                        <img
                            className="permutation" src={'http://latex.codecogs.com/svg.latex?$\\left(\\begin{matrix}' +
                            topLine.join("&") + '\\\\' + bottomLine.join("&") + '\\end{matrix}\\right)$'} alt="permutation"
                        />
                        <svg className="shape" height="140" width="140">
                            <polygon points={pointsArray.join(" ")} style={{fill: "none", stroke: "black", strokeWidth: "1"}} />
                            <polygon points="0,0 140,0 140,140 0,140" style={{fill: "none", stroke: "black", strokeWidth: "1"}} />
                            {textElementArray}
                        </svg>
                    </div>
                )
                i++
            }
            return (
                <div>
                    <p>List of elements in the group:</p>
                    <div id="the-elements">
                        <div id="rotations">
                            {listItems.slice(0, N)}
                        </div>
                        <div id="symmetries">
                            {listItems.slice(N, 2*N)}
                        </div>
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.displayWelcomeMessage(this.state.N)}
                <label>
                    <i>D<sub>n</sub> , n = </i> <input id="input-n" type="number" style={{display: "inline", width: "50px"}} onChange={this.NChange}/>
                </label>
                {this.displayTheGroup(this.state.N)}
            </div>
        )
    }
}

//----------------helper functions------------------//

function dihedralGroup(N) {
    if (N<3) return []
    let returnArray = []

    var n = N;

    function identity(inputArray) {
        let array;
        if (!inputArray) {
            array = []
            for (let i = 0; i < n; i++) {
                array.push(i)
            }
        } else {
            array = inputArray
        }
        return array
    }

    function rho(inputArray) {
        let array;
        if (!inputArray) {
            array = []
            for (let i = 0; i < n; i++) {
                array.push(i)
            }
        } else {
            array = inputArray
        }
        return array.map((num) => (num+n-1)%n)
    }

    function alpha(inputArray) {
        let array;
        if (!inputArray) {
            array = []
            for (let i = 0; i < n; i++) {
                array.push(i)
            }
        } else {
            array = inputArray
        }
        return array.reverse().map((num) => (num+1)%n)
    }

    for (let i = 0; i < n; i++) {        //rotations
        let returnFunction = identity()
        for (let j = 0; j < i; j++) {        //number of turns
            returnFunction = rho(returnFunction)
        }
        returnArray.push(returnFunction)
    }

    for (let i = 0; i < n; i++) {        //flips
        let returnFunction = identity()
        returnFunction = alpha(returnFunction) //for flips, before we turn a number of times we multiply by alpha
        for (let j = 0; j < i; j++) {        //number of turns
            returnFunction = rho(returnFunction)
        }
        returnArray.push(returnFunction)
    }
    return returnArray
}

export default App;
