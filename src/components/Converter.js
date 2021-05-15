import React, { useState, useEffect, useCallback } from "react";
import { parse, eval as eeval } from "expression-eval";
import "../scss/layout/Converter.scss";
import Select from "./Select";

const Converter = ({ units, converters, setSettings, deleteConverter, ...props }) => {
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState("defalut");
	const [precision, setPrecision] = useState("defalut");
	const [unit1, setUnit1] = useState("defalut");
	const [unit2, setUnit2] = useState("defalut");
	const [input, setInput] = useState(0);
	const [output, setOutput] = useState(0);
	const [filteredUnits, setFilteredUnits] = useState(units);

	const arrayIncludes = (array, value) => {
		let arrayMached = false;

		array.forEach(val => {
			if (JSON.stringify(val) === JSON.stringify(value)) arrayMached = true;
		});

		return arrayMached;
	};

	const swap = () => {
		const [unitTemp, outputTemp] = [unit1, input];
		setUnit1(unit2);
		setUnit2(unitTemp);
		setInput(output);
		setOutput(outputTemp);
	};

	const reset = () => {
		setSelectedCategory("defalut");
		setPrecision("defalut");
		setUnit1("defalut");
		setUnit2("defalut");
		setInput(0);
		setOutput(0);
	};

	const round = useCallback(
		num => {
			if (precision === "defalut") return num;
			return parseFloat(num.toFixed(precision));
		},
		[precision]
	);

	const areSameSystem = useCallback(
		(unit1, unit2) => {
			const unit1System = converters.find(converter => converter.to[1] === unit1).system[0];
			const unit2System = converters.find(converter => converter.to[1] === unit2).system[0];
			return [unit1System === unit2System, unit1System, unit2System];
		},
		[converters]
	);

	const checkUnit = useCallback(
		(unit, system) => {
			const unitSystem = converters.find(converter => converter.to[1] === unit).system;
			return unitSystem[0] === system;
		},
		[converters]
	);

	const convert = useCallback(
		(unit1, unit2, value = input, ifReturn = false) => {
			if (isNaN(value) || unit1 === "defalut" || unit2 === "defalut") return;
			const obj = converters.find(converter => converter.from[1] === unit1 && converter.to[1] === unit2);
			const [sameSystem, unit1System, unit2System] = areSameSystem(unit1, unit2);

			if (obj == null && !sameSystem) {
				const unitConvertObj = converters.find(converter => {
					if (converter.system[0] === unit2System) {
						return checkUnit(converter.from[1], unit1System);
					}
					return false;
				});

				const unitInCurrSystem = unitConvertObj.from[1];
				const unitInNextSystem = unitConvertObj.to[1];
				const valueInDafalutUnit = convert(unit1, unitInCurrSystem, value, true) * unitConvertObj.val;
				setOutput(round(convert(unitInNextSystem, unit2, valueInDafalutUnit, true)));
				return;
			}

			if ((obj == null && sameSystem) || unit1 === unit2) {
				setOutput(round(value));
				return ifReturn ? value : undefined;
			}

			if (obj.equation) {
				const evaluated = eeval(parse(obj.val), { x: parseFloat(value) });
				setOutput(round(evaluated));
				return;
			}

			setOutput(round(value * obj.val));
			if (ifReturn) return value * obj.val;
		},
		[converters, input, areSameSystem, checkUnit, round]
	);

	//convert
	useEffect(() => {
		convert(unit1, unit2);
	}, [input, unit1, unit2, convert]);

	//categories
	useEffect(() => {
		const categories = converters.reduce((acc, converter) => {
			if (arrayIncludes(acc, converter.category)) return acc;
			return [converter.category, ...acc];
		}, []);

		setCategories(categories);
	}, [converters]);

	// filter units based on categories
	useEffect(() => {
		const metric = units.metric.filter(v => {
			const category = converters.find(converter => converter.from[1] === v[1] || converter.to[1] === v[1]).category;
			return category[0] === parseInt(selectedCategory);
		});

		const imperial = units.imperial.filter(v => {
			const category = converters.find(converter => converter.from[1] === v[1] || converter.to[1] === v[1]).category;
			return category[0] === parseInt(selectedCategory);
		});

		const other = units.other.filter(v => {
			const category = converters.find(converter => converter.from[1] === v[1] || converter.to[1] === v[1]).category;
			return category[0] === parseInt(selectedCategory);
		});

		setFilteredUnits({ metric: metric, imperial: imperial, other: other });
	}, [selectedCategory, converters, units]);

	useEffect(() => {
		if (Object.keys(props.data).length <= 0) return;

		setSelectedCategory(props.data.category);
		setPrecision(props.data.precision);
		setUnit1(props.data.unit1);
		setUnit2(props.data.unit2);
		setInput(props.data.input || 0);
		setOutput(props.data.output || "");
	}, [props.data]);

	useEffect(() => {
		const nevVal = {
			category: selectedCategory,
			precision: precision,
			unit1: unit1,
			unit2: unit2,
			input: input,
			output: output
		};
		setSettings(props.index, nevVal);
	}, [selectedCategory, precision, unit1, unit2, input, output, props.index, setSettings]);

	if (categories == null) return <></>;
	return (
		<div className="converter">
			<div>
				<select className="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
					<option value="defalut" disabled>
						-- Wybierz kategorię --
					</option>
					{categories.map(category => (
						<option key={Math.random()} value={category[0]}>
							{category[1]}
						</option>
					))}
				</select>

				<select className="precision center" value={precision} onChange={e => setPrecision(e.target.value)}>
					<option value="defalut">-- Wybierz dokładność --</option>
					<option value="0">zaokrąglij do całości</option>
					<option value="1">zaokrąglij do części dziesiątych</option>
					<option value="2">zaokrąglij do części setnych</option>
					<option value="3">zaokrąglij do części tysięcznych</option>
					<option value="4">zaokrąglij do części dziesięciotysięcznych</option>
					<option value="5">zaokrąglij do części stutysięcznych</option>
				</select>

				<div className="options">
					<i className="fas fa-undo-alt" onClick={reset}></i>
					{props.index !== 0 ? (
						<i className="fas fa-trash delete" onClick={() => deleteConverter(props.index)}></i>
					) : (
						<></>
					)}
				</div>
			</div>
			<div>
				<Select units={filteredUnits} value={unit1} setCurrUnit={setUnit1} />
				<input type="number" value={input} onChange={e => setInput(e.target.value)} />
				<i className="fas fa-exchange-alt swap_units" onClick={swap}></i>
				<input type="number" value={output} disabled />
				<Select units={filteredUnits} value={unit2} setCurrUnit={setUnit2} />
			</div>
		</div>
	);
};

export default Converter;
