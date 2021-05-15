import React from "react";

const Select = ({ units: { metric, imperial, other }, setCurrUnit, ...props }) => {
	return (
		<select className="center" onChange={e => setCurrUnit(e.target.value)} value={props.value}>
			<option value="defalut" disabled>
				-- Wybierz jednostkę --
			</option>

			{metric.length > 0 ? <option disabled>-- System metryczny ---</option> : <></>}
			{metric.map((v, i) => {
				const id = Math.random() * Math.random() * 125;
				return (
					<option value={v[1]} key={id}>
						{v[0]} ({v[1]})
					</option>
				);
			})}

			{imperial.length > 0 ? <option disabled>-- System imperialny ---</option> : <></>}
			{imperial.map((v, i) => {
				const id = Math.random() * Math.random() * 125;
				return (
					<option value={v[1]} key={id}>
						{v[0]} ({v[1]})
					</option>
				);
			})}

			{other.length > 0 ? <option disabled>-- Inne ---</option> : <></>}
			{other.map((v, i) => {
				const id = Math.random() * Math.random() * 125;
				return (
					<option value={v[1]} key={id}>
						{v[0]} ({v[1]})
					</option>
				);
			})}
		</select>
	);
};

export default Select;
