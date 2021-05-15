import React, { useEffect, useState } from "react";
import "./scss/App.scss";
import Header from "./components/Header";
import Calculator from "./components/Calculator";
import Converter from "./components/Converter";

function App() {
	const [data, setData] = useState(null);
	const [units, setUnits] = useState(null);
	const [converters, setConverters] = useState(null);

	const fetchData = async () => {
		try {
			const res = await fetch("./data.json");
			const json = await res.json();
			setData(json);
		} catch (err) {
			console.error(err);
		}
	};

	const setSettings = (i, v) => {
		const newValue = converters;
		newValue[i] = v;

		setConverters(newValue);
		localStorage.setItem("converters", JSON.stringify(newValue));
	};

	const deleteConverter = i => {
		const newValue = converters.slice(0, i).concat(converters.slice(i + 1, converters.length));
		setConverters(newValue);
	};

	useEffect(() => {
		let savedData = localStorage.getItem("converters") || "{}";
		savedData = JSON.parse(savedData);

		if (Object.keys(savedData).length > 0) {
			setConverters(savedData);
		} else {
			setConverters([{}]);
		}

		fetchData();
	}, []);

	useEffect(() => {
		if (data == null) return;
		let t = {};
		const metric = data
			.filter(v => v.system[0] === 0)
			.map(v => v.to)
			.filter(((t = {}), a => !(t[a] = a in t)))
			.sort((a, b) => (a < b ? -1 : 1));
		const imperial = data
			.filter(v => v.system[0] === 1)
			.map(v => v.to)
			.filter(((t = {}), a => !(t[a] = a in t)))
			.sort((a, b) => (a < b ? -1 : 1));
		const other = data
			.filter(v => v.system[0] === 2)
			.map(v => v.to)
			.filter(((t = {}), a => !(t[a] = a in t)))
			.sort((a, b) => (a < b ? -1 : 1));

		setUnits({ metric: metric, imperial: imperial, other: other });
	}, [data]);

	if (data === null || units == null || converters == null) return <></>;
	return (
		<div className="App">
			<Header />
			<div className="converter_container">
				{converters.map((v, i) => (
					<Converter
						units={units}
						converters={data}
						key={i}
						setSettings={setSettings}
						index={i}
						data={v}
						deleteConverter={deleteConverter}
					/>
				))}
				<button className="button convert_button" onClick={() => setConverters(prevVal => [...prevVal, {}])}>
					<i className="fas fa-plus icon"></i>
					Dodaj przelicznik
				</button>
			</div>
			<Calculator />
		</div>
	);
}

export default App;
