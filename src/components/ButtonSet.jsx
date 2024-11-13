import Button from "./Button";

const ButtonSet = ({ buttons }) => {
  return (
    <div className="flex gap-5 px-5">
      {Object.values(buttons).map((buttonGroup, index) => {
        // Check if buttonGroup is an array before calling map
        if (Array.isArray(buttonGroup)) {
          return buttonGroup.map((button, btnIndex) => (
            <Button
              key={`${index}-${btnIndex}`}
              text={button.text}
              bgColor={button.bgColor}
              textColor={button.textColor}
              action={button.action}
              textSize={button.textSize}
            />
          ));
        }
        // Handle the case where buttonGroup is not an array
        return null;
      })}
    </div>
  );
};

export default ButtonSet;