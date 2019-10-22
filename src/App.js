import React from 'react';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            N: "",
            compInput: ""
        }
        this.NChange = this.NChange.bind(this);
        this.compInputChange = this.compInputChange.bind(this);
    }
    
    NChange(evnt) {
        this.setState( {N: evnt.target.value} )
    }

    compInputChange(evnt) {
        this.setState( {compInput: evnt.target.value} )
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
                let elementNumber;
                if ((element[1]-element[0] + N)%N === 1) {
                    elementType = "R"
                    elementNumber = (N - element[0])%N
                } else {
                    elementType = "S"
                    elementNumber = element[0]
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
                    <p>Input some composition of elements!</p>
                    <input type="text" placeholder="e.g. s1*r1*s4" onChange={this.compInputChange}/>
                    {this.displayFormattedInput(this.state.N, this.state.compInput)}
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

    displayFormattedInput(stringN, compInput) {
        let N = Number(stringN)
        let LHS = "..."
        let RHSElementType = "..."
        let RHSElementNumber = null
        let compInputArray = compInput.split("*")

        let checkPassed = true;
        for (let element of compInputArray) {
            if (
                element.length < 2 ||
                !(element[0].toLowerCase()==="r" || element[0].toLowerCase()==="s") ||
                !(typeof(Number(element.slice(1, element.length)))==="number") ||
                Number(element.slice(1, element.length)) >= N
            ) {
                checkPassed = false;
                break
            }
        }
        if (checkPassed) {
            LHS = []              //-----------LHS
            let k = 0
            for (let element of compInputArray) {
                LHS.push(
                    <label key={k}><em>{element[0].toUpperCase()}</em><sub>{element.slice(1, element.length)}</sub></label>
                )
                LHS.push(
                    <label key = {k + 1}>○</label>
                )
                k = k + 2
            }
            LHS = LHS.slice(0,-1) //don't include the final o

            let identity = []      //-------------RHS
            for (let j = 0; j < N; j++) {
                identity.push(j)    
            }

            let previousElement = identity;
            let reverseCompInput = compInputArray.reverse()

            for (let i = 0; i < compInputArray.length; i++) {
                let newElement = Array(N);
                let currentElementString = reverseCompInput[i]
                let currentElement = [];

                if (currentElementString[0].toLowerCase()==="r") { //----transforming string "r2" to element in array form
                    for (let j = 0; j < N; j++) {
                        let firstPoint = N - Number(currentElementString.slice(1, currentElementString.length))
                        currentElement.push((firstPoint + j)%N)
                    }
                } else if (currentElementString[0].toLowerCase()==="s") {
                    for (let j = 0; j < N; j++) {
                        let firstPoint = Number(currentElementString.slice(1, currentElementString.length))
                        currentElement.push((firstPoint - j + N)%N)
                    }
                }

                for (let j = 0; j < N; j++) {  //------multiplying the current element by the previous running product
                    newElement[j] = previousElement[currentElement[j]]
                }
                previousElement = newElement;
            }

            let RHSArray = previousElement
            if ((RHSArray[1]-RHSArray[0] + N)%N === 1) {
                RHSElementType = "R"
                RHSElementNumber = (N - RHSArray[0])%N
            } else {
                RHSElementType = "S"
                RHSElementNumber = RHSArray[0]
            }
        }
        return(
            <p>{LHS} = <em>{RHSElementType}</em><sub>{RHSElementNumber}</sub> </p>
        )

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

    for (let i = 0; i < N; i++) {               //rotations
        let currentElement = []                 //each value of i gives an element
        for (let j = 0; j < N; j++) {           //each value of j adds a point to the element
            currentElement.push(((N-i)+j)%N)    //every point in a rotation is 1 greater than the previous point mod N
        }
        returnArray.push(currentElement)
    }

    for (let i = 0; i < N; i++) {                   //symmetries
        let currentElement = []                     //each value of i gives an element
        for (let j = 0; j < N; j++) {               //each value of j adds a point to the element
            currentElement.push(((2*N+i)-j)%N)      //every point in a symmetry is 1 less than the previous point mod N
        }
        returnArray.push(currentElement)
    }

    return returnArray
}

function compose(secondElement, firstElement, N) { // r1*r2 ... r1 is the second element since the operation happens second
    let secondElementType = secondElement[0].toLowerCase()
    let secondElementIndex = Number(secondElement.slice(1, secondElement.length))
    let firstElementType = firstElement[0].toLowerCase()
    let firstElementIndex = Number(firstElement.slice(1, firstElement.length))

    let resultType;
    let resultIndex;

    if (secondElementType===firstElementType) {
        resultType = "r"
    } else {
        resultType = "s"
    }

    if (secondElementType==="r") {
        resultIndex = (firstElementIndex + secondElementIndex)%N
    } else if (secondElementType==="s") {
        resultIndex = (secondElementIndex - firstElementIndex + N)%N
    }

    return resultType + resultIndex
}

export default App;