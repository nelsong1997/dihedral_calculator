import "./style.css"
import React from 'react';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            N: "",
            compInput: "",
            conjClInput: ""
        }
        this.NChange = this.NChange.bind(this);
        this.compInputChange = this.compInputChange.bind(this);
        this.conjClInputChange = this.conjClInputChange.bind(this);

    }
    
    NChange(evnt) {
        this.setState( {N: evnt.target.value} )
    }

    compInputChange(evnt) {
        this.setState( {compInput: evnt.target.value} )
    }

    conjClInputChange(evnt) {
        this.setState( {conjClInput: evnt.target.value} )
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
                <p>Error: Please enter an integer greater than or equal to 3 for <em>n</em>.</p>
            )
        } else if (N>20) {
            return (
                <div>
                    {this.displayCompositionInput(this.state.N, this.state.compInput)}
                    <p>The elements of the group are not listed for <em>n</em> larger than 20. :(</p>
                </div>
            )
        } else if (stringN==="") {
            return null
        } else {
            let theGroup = dihedralGroup(N)

            let pointsArray = []
            let lineArray = []
            let angle = 0
            for (let i = 0; i < N; i++) {                      
                pointsArray.push(Math.round((50*Math.cos(angle) + 70)) + "," + Math.round((-50*Math.sin(angle) + 70)))  //creates an array of points that form the polygon
                lineArray.push(                                                                                         //creates symmetry lines for the symmetries
                    <polyline
                    points={Math.round((55*Math.cos(angle/2) + 70)) + "," + Math.round((-55*Math.sin(angle/2) + 70)) + " " +
                    Math.round((-55*Math.cos(angle/2) + 70)) + "," + Math.round((55*Math.sin(angle/2) + 70))}
                        fill="none" stroke="rgb(190, 190, 190)" strokeWidth="2px" strokeDasharray="4"
                    />
                )
                angle = angle + (2*Math.PI)/N
            }

            function symmetryLine(theLine, type) {
                if (type==="R") {
                    return null
                } else {
                    return theLine
                }
            }
            function theElements(elementArray, n) {
                if (n<=12) {
                    return (
                        <div id="the-elements">
                            <div id="rotations">
                                {elementArray.slice(0, N)}
                            </div>
                            <div id="symmetries">
                                {elementArray.slice(N, 2*N)}
                            </div>
                        </div>
                    )
                } else if (n>12) {
                    return (
                        <div id="the-elements">
                            <div id="all-elements">
                                {elementArray}
                            </div>
                        </div>
                    )
                }
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
                    textElementArray.push( //creates an array of text elements which are the labels for the points of the polygon
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
                            className="permutation" src={'http://latex.codecogs.com/svg.latex?\\left(\\begin{matrix}' +
                            topLine.join("&") + '\\\\' + bottomLine.join("&") + '\\end{matrix}\\right)'} alt="permutation"
                        />
                        <svg className="shape" height="140" width="140">
                            <polygon points={pointsArray.join(" ")} style={{fill: "none", stroke: "black", strokeWidth: "1"}} />
                            {symmetryLine(lineArray[i-N], elementType)}
                            <polygon points="0,0 140,0 140,140 0,140" style={{fill: "none", stroke: "black", strokeWidth: "1"}} />
                            {textElementArray}
                        </svg>
                    </div>
                )
                i++
            }
            return (
                <div>
                    {this.displayCompositionInput(this.state.N, this.state.compInput)}
                    <p>List of elements in the group:</p>
                    {theElements(listItems, N)}
                    {this.displayCayleyTable(N)}
                    {this.displayConjugacyClass(N)}
                </div>
            )
        }
    }

    displayCompositionInput(stringN, compInput) {
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

            //-------------RHS

            let reverseCompInput = compInputArray.reverse()
            let previousElement = "r0"

            for (let element of reverseCompInput) {
                let newElement = compose(element, previousElement, N)
                previousElement = newElement;
            }

            RHSElementType = previousElement[0].toUpperCase()
            RHSElementNumber = previousElement.slice(1, previousElement.length)
        }
        return(
            <div>
                <p>Input some composition of elements!</p>
                <input type="text" placeholder="e.g. s1*r1*s2" onChange={this.compInputChange}/>
                <p>{LHS} = <em>{RHSElementType}</em><sub>{RHSElementNumber}</sub> </p>
            </div>
        )

    }

    displayCayleyTable(n) {
        let theStringGroup = stringGroup(n)
        let theRows = []
        for (let i = 0; i < 2*n+1; i++) {
            let leftElement;
            if (i===0) {
                leftElement = "R0"
            } else {
                leftElement = theStringGroup[i-1]
            }
            let theColumns = []
            for (let j = 0; j < 2*n+1; j++) {
                let result;
                if (i===0 && j===0) {
                    result = "○ "
                } else if (j===0) {
                    result = compose(leftElement, "R0", n)
                } else {
                    result = compose(leftElement, theStringGroup[j-1], n)
                }
                let resultType = result[0].toUpperCase()
                let resultIndex = result.slice(1, result.length)
                if (i===0 || j===0) {
                    theColumns.push(
                        <th key={j}>
                            <em>{resultType}</em><sub>{resultIndex}</sub>
                        </th>
                    )
                } else {
                    theColumns.push(
                        <td key={j}>
                            <em>{resultType}</em><sub>{resultIndex}</sub>
                        </td>
                    )
                }
            }
            theRows.push(
                <tr key={i}>
                    {theColumns}
                </tr>
            )
        }
        return (
            <div>
                <p>Here is a nice Cayley Table for <em>D</em><sub>{n}</sub>:</p>
                <table>
                    <tbody>
                        {theRows}
                    </tbody>
                </table>
            </div>
        )
    }

    displayConjugacyClass(n) {
        let maximumLength = (n-1).toString().length + 1
        let theElement = this.state.conjClInput
        let LHS = "..."
        let RHS = "..."
        let theStringGroup = stringGroup(n)
        let stringGroupInverses = []
        let RHSStringSet = []
        let RHSSet = []
        for (let i = 0; i < theStringGroup.length; i++) {
            stringGroupInverses.push(findInverse(theStringGroup[i], n))
        }
        if (checkElementValidity(theElement, n)) {
            for (let i = 0; i < theStringGroup.length; i++) {
                let j = 2*i
                let newElement = compose(theStringGroup[i], compose(theElement, stringGroupInverses[i], n), n)
                console.log(newElement)
                let newElementType = newElement[0].toUpperCase()
                let newElementIndex = newElement.slice(1, newElement.length)
                if (!(RHSStringSet.includes(newElement))) {
                    RHSStringSet.push(newElement)
                    RHSSet.push(
                        <label key={j}>
                            <em>{newElementType}</em><sub>{newElementIndex}</sub>
                        </label>
                    )
                    RHSSet.push(<label key={j+1}>, </label>)
                }
                LHS = []
                LHS.push(
                    <label key={i}>
                        <em>{theElement[0].toUpperCase()}</em><sub>{theElement.slice(1, theElement.length)}</sub>
                    </label>
                );
                RHS = RHSSet.slice(0, -1)
            }
        }
        return (
            <div>
                <p>Input an element to find its conjugacy class!</p>
                <label>
                    <input type="text" placeholder="e.g. s2" maxLength={maximumLength} onChange={this.conjClInputChange}/>
                </label>
                <p>cl({LHS}) = {"{"}{RHS}{"}"}</p>
            </div>
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

function checkElementValidity(element, n) {
    if (typeof(element)!=="string" || element.length < 2 || element.length > ((n-1).toString().length + 1)) return false
    let elementType = element[0].toLowerCase()
    let elementIndex = Number(element.slice(1, element.length))
    if (!(elementType==="r" || elementType==="s") || elementIndex > n - 1) return false
    return true
}

function stringGroup(n) {
    let theRotations = []
    let theSymmetries = []
    for (let i = 0; i < n; i++) {
        theRotations.push("R" + i)
        theSymmetries.push("S" + i)
    }
    return theRotations.concat(theSymmetries)
}

function findInverse(element, n) {
    let elementType = element[0].toLowerCase()
    let elementIndex = Number(element.slice(1, element.length))
    let theInverse;
    if (elementType==="r") {
        theInverse = "R" + (2*n - elementIndex)%n
    } else if (elementType==="s") {
        theInverse = "S" + elementIndex
    }
    return theInverse
}

export default App;