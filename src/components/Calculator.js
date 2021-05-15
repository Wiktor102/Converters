import React, { useState } from "react";
import "../scss/layout/Calculator.scss";

const Calculator = () => {
	const [calculatorActive, setCalculatorActive] = useState(false);
	const [action, setAction] = useState(null);
	const [currVal, setCurrVal] = useState(0);
	const [tmpVal, setTmpVal] = useState(0);
	const reference = {
		add: "+",
		subtract: "-",
		multiply: "×",
		divide: "÷"
	};

	const toggleCalculator = () => {
		if (!calculatorActive) {
			document.querySelector(".calculator").style.transform = "translateY(0)";
		} else {
			document.querySelector(".calculator").style.transform = "translateY(100%)";
		}

		setCalculatorActive(prevVal => !prevVal);
	};

	const insertNumber = num => {
		if (currVal === 0 || currVal === "0" || !/\d/.test(currVal)) {
			setCurrVal(num);
			return;
		}

		setCurrVal(prevVal => prevVal.toString() + num);
	};

	const chooseAction = action => {
		setAction(action);
		setTmpVal(currVal);
		setCurrVal(reference[action] || 0);
	};

	const countDecimals = value => {
		if (value % 1 !== 0) return value.toString().split(".")[1].length;
		return 0;
	};

	const reset = () => {
		setAction(null);
		setCurrVal(0);
		setTmpVal(0);
	};

	const calcuate = () => {
		if (action == null) return;

		if (action === "add") {
			setCurrVal(add(tmpVal, currVal));
		} else if (action === "subtract") {
			setCurrVal(subtract(tmpVal, currVal));
		} else if (action === "multiply") {
			setCurrVal(multiply(tmpVal, currVal));
		} else {
			setCurrVal(divide(tmpVal, currVal));
		}

		if (countDecimals(currVal) > 10) setCurrVal(prevVal => parseFloat(prevVal.toFixed(10)));
	};

	const add = (num1, num2) => parseFloat(num1) + parseFloat(num2);
	const subtract = (num1, num2) => num1 - num2;
	const multiply = (num1, num2) => num1 * num2;
	const divide = (num1, num2) => num1 / num2;
	const addDecimal = () => setCurrVal(prevVal => prevVal.toString() + ".");

	return (
		<div className="calculator">
			<div className="toggle" onClick={toggleCalculator}>
				<i className="fas fa-calculator"></i>
			</div>
			<input type="text" value={currVal} onChange={e => setCurrVal(e.target.value)} />
			<div className="numpad">
				<button className="function add" onClick={() => chooseAction("add")}>
					<i className="fas fa-plus"></i>
				</button>
				<button className="function subtract" onClick={() => chooseAction("subtract")}>
					<i className="fas fa-minus"></i>
				</button>
				<button className="function multiply" onClick={() => chooseAction("multiply")}>
					<i className="fas fa-times"></i>
				</button>
				<button className="function divide" onClick={() => chooseAction("divide")}>
					<i className="fas fa-divide"></i>
				</button>
				<button className="equals" onClick={calcuate}>
					<i className="fas fa-equals"></i>
				</button>
				<button
					className="number"
					onClick={() => {
						insertNumber(7);
					}}
				>
					7
				</button>
				<button
					className="number"
					onClick={() => {
						insertNumber(8);
					}}
				>
					8
				</button>
				<button
					className="number"
					onClick={() => {
						insertNumber(9);
					}}
				>
					9
				</button>
				<button
					className="number"
					onClick={() => {
						insertNumber(4);
					}}
				>
					4
				</button>
				<button
					className="number"
					onClick={() => {
						insertNumber(5);
					}}
				>
					5
				</button>
				<button
					className="number"
					onClick={() => {
						insertNumber(6);
					}}
				>
					6
				</button>
				<button
					className="number"
					onClick={() => {
						insertNumber(1);
					}}
				>
					1
				</button>
				<button
					className="number"
					onClick={() => {
						insertNumber(2);
					}}
				>
					2
				</button>
				<button
					className="number"
					onClick={() => {
						insertNumber(3);
					}}
				>
					3
				</button>
				<button
					className="number"
					onClick={() => {
						insertNumber(0);
					}}
				>
					0
				</button>
				<button className="function reset" onClick={reset}>
					C
				</button>
				<button className="function decimal" onClick={addDecimal}>
					.
				</button>
			</div>
		</div>
	);
};

export default Calculator;
