import Button from "./Button";
import PropTypes from 'prop-types';

const ButtonSet = ({ buttons }) => {
	if (!Array.isArray(buttons)) {
		console.error("El prop 'buttons' debe ser un array");
		return null;
	}

	ButtonSet.propTypes = {
		buttons: PropTypes.array.isRequired,
	}

	return (
		<div className="flex gap-5 px-5">
			{buttons.map((button, index) => (
				<Button
					key={index}
					text={button.text}
					bgColor={button.bgColor}
					textColor={button.textColor}
					action={button.action} 
					textSize={button.textSize}
				/>
			))}
		</div>
	);
};

export default ButtonSet;
