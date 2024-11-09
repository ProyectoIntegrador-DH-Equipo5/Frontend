import ButtonSet from "./ButtonSet";

const SubHeader = ({ title, buttons }) => {
	

	return (
		<div className="flex bg-white/50 fixed top-24 w-screen h-12 text-sm">
			<div className="flex bg-black/75 justify-between items-center fixed top-24 w-screen h-12 text-sm px-20">
				<h2 className="text-white px-2">{title}</h2>
				<ButtonSet buttons={buttons} />
			</div>
		</div>
	);
};

export default SubHeader;
