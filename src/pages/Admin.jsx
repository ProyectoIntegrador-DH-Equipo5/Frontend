import { useContextGlobal } from "../utils/global.context";
import SubHeader from "../components/SubHeader";
import ProductTable from "../components/admin/ProductTable";
import UserTable from "../components/admin/UserTable";
import CategoryTable from "../components/admin/CategoryTable";
import IsMobile from "../components/admin/IsMobile";
import { useState, useEffect  } from "react";
import Sidebar from "../components/admin/Sidebar";
import Form from "../components/admin/Form";
import { FaTimes } from "react-icons/fa";
import { idCreator } from "../utils/formatFunctions";
import Message from "../components/admin/Message";
import { authService } from "../api/authService";
import { userService } from "../api/userService";

const Admin = () => {
	const { isMobile, state, dispatch } = useContextGlobal();
	const [isCreatingItem, setIsCreatingItem] = useState(null); // Maneja qué formulario se está mostrando (producto, usuario o categoría)
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [newUser, setNewUser] = useState({
		name: "",
		lastname: "",
		email: "",
		password: "password",
	});

	const [newCat, setNewCat] = useState({
		id: "",
		nombre: "",
		descripcion: "",
		url: "",
	});
	const handleAddItem = (itemType) => {
		setIsCreatingItem(itemType); // Establece el tipo de ítem que se va a crear
	};

	const handleListItems = () => {
		setIsCreatingItem(null); // Vuelve a la vista de lista
	};

	const activeSection = state.activeSection;

	const buttons = {
		obras: [
			{
				text: "Agregar producto",
				textColor: "primary",
				bgColor: "transparent",
				action: () => handleAddItem("producto"),
			},
			{
				text: "Lista de productos",
				textColor: "primary",
				bgColor: "transparent",
				action: handleListItems,
			},
		],
		usuarios: [
			{
				text: "Agregar usuario",
				textColor: "primary",
				bgColor: "transparent",
				action: () => handleAddItem("usuario"),
			},
			{
				text: "Lista de usuarios",
				textColor: "primary",
				bgColor: "transparent",
				action: handleListItems,
			},
		],
		categorias: [
			{
				text: "Agregar categoría",
				textColor: "primary",
				bgColor: "transparent",
				action: () => handleAddItem("categoria"),
			},
			{
				text: "Lista de categorías",
				textColor: "primary",
				bgColor: "transparent",
				action: handleListItems,
			},
		],
	};

	const buttonsToDisplay = { [activeSection]: buttons[activeSection] || [] };

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewUser({
			...newUser,
			[name]: value,
		});
	};
	// Efecto para ocultar los mensajes después de unos segundos
	useEffect(() => {
		if (successMessage || errorMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage(""); // Ocultar el mensaje de éxito
				setErrorMessage(""); // Ocultar el mensaje de error
			}, 3000); // Duración del mensaje en milisegundos

			return () => clearTimeout(timer); // Limpiar el temporizador al desmontar
		}
	}, [successMessage, errorMessage]);
	
	const handleSubmitUser = async(e) => {
		e.preventDefault(); // Previene el comportamiento predeterminado de envío del formulario

		if (!newUser.name || !newUser.lastname || !newUser.email) {
			setErrorMessage("Por favor, complete todos los campos.");
			return;
		}

		// Sólo enviamos los datos que pide Backend, no el objeto completo
		const newUserRegister = {
			name: newUser.name,
			lastname: newUser.lastname,
			email: newUser.email,
			password: "password",
		}
		// Agregar el nuevo usuario
		try {
			const createdUser = await authService.register(newUserRegister);
			// Actualizar el estado global con el usuario creado
			dispatch({ type: "ADD_USER", payload: createdUser });
			setSuccessMessage("Usuario creado con éxito");
			// Limpiar los campos después de la creación
			setNewUser({ name: "", lastname: "", email: ""});
			// Actualizar la lista de usuarios en la interfaz (si es necesario)
			handleListItems();
		} catch (error) {
			setErrorMessage("Hubo un error al crear el usuario. Intente nuevamente.");
		}
	};

	useEffect(() => {
    const fetchUsers = async () => {
        try {
            const users = await userService.getUsers();
            dispatch({ type: "GET_USERS", payload: users });
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };

    if (successMessage === "Usuario creado con éxito") {
        fetchUsers();
    }
}, [successMessage, dispatch]);



	//Categorias
	const handleInputChangeCat = (e) => {
		const { name, value } = e.target;
		setNewCat({
			...newCat,
			[name]: value,
		});
	};
	const submitCategory = (e)=>{
		e.preventDefault(); 


		// Asignar el ID
		const newCatWithId = {
			...newCat,
			id: idCreator(state.categories),
		};

		// Agregar el nuevo usuario
        console.log("admin: ",newCatWithId)
		dispatch({ type: "ADD_CATEGORY", payload: newCatWithId });
		setSuccessMessage("Categoría creada con éxito");

		// Limpiar los campos después de la creación
		setNewCat({ nombre: "", descripcion: "", url: ""});
        
		handleListItems();
	}

	return (
		<>
			{isMobile ? (
				<IsMobile />
			) : (
				<div className="min-h-screen pt-8 bg-black">
					<SubHeader
						title={"Panel de Administración"}
						buttons={buttonsToDisplay}
					/>
					{isCreatingItem ? (
						<section className="flex w-screen h-screen-28">
							<Sidebar />
							<div className="flex flex-col items-center grow max-h-screen pt-32 relative">
								{isCreatingItem === "producto" && (
									<Form
										edit={false}
										onClose={handleListItems}
										setSuccessMessage={setSuccessMessage}
										setErrorMessage={setErrorMessage}
										
									/>
								)}
								{isCreatingItem === "usuario" && (
									<div className="w-[75vw] h-[70vh] overflow-y-scroll bg-white p-6 rounded-lg shadow-md relative">
										<button
											onClick={handleListItems}
											className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
											aria-label="Cerrar"
										>
											<FaTimes />
										</button>
										<h2 className="text-xl font-semibold mb-4">
											Crear nuevo usuario
										</h2>
										<form onSubmit={handleSubmitUser}>
											<div className="flex space-x-4 mb-4">
												<div className="flex-1">
													<label
														className="block text-sm font-semibold mb-2"
														htmlFor="name"
													>
														Nombre
													</label>
													<input
														type="text"
														id="name"
														name="name"
														value={newUser.name}
														onChange={
															handleInputChange
														}
														className="w-full p-2 border border-gray-300 rounded"
														required
													/>
												</div>
												<div className="flex-1">
													<label
														className="block text-sm font-semibold mb-2"
														htmlFor="lastname"
													>
														Apellido
													</label>
													<input
														type="text"
														id="lastname"
														name="lastname"
														value={newUser.lastname}
														onChange={
															handleInputChange
														}
														className="w-full p-2 border border-gray-300 rounded"
														required
													/>
												</div>
											</div>
											<div className="mb-4">
												<label
													className="block text-sm font-semibold mb-2"
													htmlFor="email"
												>
													Correo electrónico
												</label>
												<input
													type="email"
													id="email"
													name="email"
													value={newUser.email}
													onChange={handleInputChange}
													className="w-full p-2 border border-gray-300 rounded"
													required
												/>
											</div>
											<div className="flex justify-between">
												<button
													type="button"
													className="bg-gray-500 text-white py-2 px-4 rounded"
													onClick={handleListItems}
												>
													Cancelar
												</button>
												<button
													type="submit"
													className="bg-blue-600 text-white py-2 px-4 rounded"
												>
													Crear Usuario
												</button>
											</div>
										</form>
									</div>
								)}
								{isCreatingItem === "categoria" && (
									<div className="w-[75vw] h-[70vh] overflow-y-scroll bg-white p-6 rounded-lg shadow-md relative">
										<button
											onClick={handleListItems}
											className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
											aria-label="Cerrar"
										>
											<FaTimes />
										</button>
										<h2 className="text-xl font-semibold mb-4">
											Crear nueva categoría
										</h2>
										<form onSubmit={submitCategory}>
											<div className="mb-4">
												<label
													className="block text-sm font-semibold mb-2"
													htmlFor="nombre"
												>
													Nombre de la categoría
												</label>
												<input
													type="text"
													id="nombre"
													className="w-full p-2 border border-gray-300 rounded"
													value={newCat.nombre}
													name="nombre"
													onChange={handleInputChangeCat}
													
												/>
											</div>
											<div className="mb-4">
												<label
													className="block text-sm font-semibold mb-2"
													htmlFor="descripcion"
												>
													Descripción
												</label>
												<textarea
													id="descripcion"
													name="descripcion"
													className="w-full p-2 border border-gray-300 rounded"
													onChange={handleInputChangeCat}
													
												/>
											</div>
											<div className="mb-4">
												<label
													className="block text-sm font-semibold mb-2"
													htmlFor="imagen"
												>
													Imagen (URL)
												</label>
												<input
													type="text"
													name="url"
													id="imagen"
													className="w-full p-2 border border-gray-300 rounded"
													onChange={handleInputChangeCat}
													
												/>
											</div>
											<div className="flex justify-between">
												<button
													type="button"
													className="bg-gray-500 text-white py-2 px-4 rounded"
													onClick={handleListItems}
												>
													Cancelar
												</button>
												<button
													type="submit"
													className="bg-blue-600 text-white py-2 px-4 rounded"
												>
													Crear Categoría
												</button>
											</div>
										</form>
									</div>
								)}
							</div>
						</section>
					) : (
						<section className="flex w-screen h-screen-28">
							<Sidebar />
							{activeSection === "obras" && <ProductTable />}
							{activeSection === "usuarios" && <UserTable />}
							{activeSection === "categorias" && (
								<CategoryTable />
							)}
						</section>
					)}
					{/* Mostrar mensajes */}
			{successMessage && (
				<div className="fixed bottom-16 right-4 z-50 mb-4">
					<Message
						type="success"
						text={successMessage}
						onClose={() => setSuccessMessage("")}
					/>
				</div>
			)}
			{errorMessage && (
				<div className="fixed bottom-4 right-4 z-50 mb-4">
					<Message
						type="danger"
						text={errorMessage}
						onClose={() => setErrorMessage("")}
					/>
				</div>
			)}
				</div>
			)}
		</>
	);
};

export default Admin;