import { useContextGlobal } from "../../utils/global.context";
import { CiEdit, CiTrash } from "react-icons/ci";
import { useState, useEffect } from "react";
import Pagination from "./Pagination";
import Modal from "./Modal";
import Message from "./Message";
import { FaTimes } from "react-icons/fa"; // Importar el ícono de cierre

const UserTable = () => {
	const { state, dispatch } = useContextGlobal(); // Usamos dispatch del contexto global
	const itemsPerPage = 5;
	const [currentPage, setCurrentPage] = useState(1);
	const [editingItem, setEditingItem] = useState(null);
	const [deletingItem, setDeletingItem] = useState(null); // For holding the item to be deleted
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const headers = ["ID", "Nombre", "Apellido", "Correo electrónico", "Rol"];

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = state.users.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(state.users.length / itemsPerPage);

	const userRole = state.loggedUser.rol;
	//state.loggedUser?.rol[0]?.authority
	const handleEdit = (user) => {
		// Solo permitir editar si el rol del usuario actual no es "COLAB" o si el usuario a editar no es "ADMIN"
		if (userRole !== "COLAB" || user.rol !== "ADMIN") {
			setEditingItem(user);
		} else {
			setErrorMessage(
				"No tienes permiso para editar usuarios con rol de ADMIN"
			);
		}
	};

	const handleDelete = (id) => {
		setDeletingItem(id); // Store the ID of the user to be deleted
	};

	const confirmDelete = () => {
		dispatch({ type: "DELETE_USER", payload: { id: deletingItem } });
		setSuccessMessage("El usuario se ha eliminado correctamente");
		setDeletingItem(null);
	};

	const handleSaveEdit = (updatedUser) => {
		dispatch({ type: "UPDATE_USER", payload: updatedUser });
		setSuccessMessage("Usuario actualizado con éxito");
		setEditingItem(null);
	};

	const handleRoleChange = (id, newRole) => {
		const updatedUser = state.users.find((user) => user.id === id);
		if (updatedUser) {
			updatedUser.rol = newRole;
			dispatch({ type: "UPDATE_USER", payload: updatedUser });
		}
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

	return (
		<div className="flex flex-col items-center grow max-h-screen pt-28 relative">
			<div className="rounded-lg border border-gray-200 max-h-screen mt-2">
				{editingItem ? (
					// Formulario de edición sobre la tabla
					<div className="w-[75vw] h-[70vh] overflow-y-scroll bg-white p-6 rounded-lg shadow-md relative">
						<button
							onClick={() => setEditingItem(null)} // Cerrar el formulario de edición
							className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
							aria-label="Cerrar"
						>
							<FaTimes />
						</button>
						<h2 className="text-xl font-semibold mb-4">
							Editar Usuario
						</h2>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleSaveEdit(editingItem);
							}}
						>
							<div className="mb-4">
								<label
									className="block text-sm font-semibold mb-2"
									htmlFor="nombre"
								>
									Nombre
								</label>
								<input
									type="text"
									id="nombre"
									value={editingItem.nombre}
									onChange={(e) =>
										setEditingItem({
											...editingItem,
											name: e.target.value,
										})
									}
									className="w-full p-2 border border-gray-300 rounded"
								/>
							</div>
							<div className="mb-4">
								<label
									className="block text-sm font-semibold mb-2"
									htmlFor="apellido"
								>
									Apellido
								</label>
								<input
									type="text"
									id="apellido"
									value={editingItem.apellido}
									onChange={(e) =>
										setEditingItem({
											...editingItem,
											lastname: e.target.value,
										})
									}
									className="w-full p-2 border border-gray-300 rounded"
								/>
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
									value={editingItem.email}
									onChange={(e) =>
										setEditingItem({
											...editingItem,
											email: e.target.value,
										})
									}
									className="w-full p-2 border border-gray-300 rounded"
								/>
							</div>

							<div className="mb-4">
								<label
									className="block text-sm font-semibold mb-2"
									htmlFor="rol"
								>
									Rol
								</label>
								<select
									id="rol"
									value={editingItem.rol}
									onChange={(e) =>
										setEditingItem({
											...editingItem,
											rol: e.target.value,
										})
									}
									className="w-full p-2 border border-gray-300 rounded"
								>
									{/* Solo mostrar "Colaborador" y "Usuario" si el loggedUser es COLAB */}
									{userRole !== "COLAB" && (
										<option value="ADMIN">
											Administrador
										</option>
									)}
									<option value="COLAB">Colaborador</option>
									<option value="USER">Usuario</option>
								</select>
							</div>
							<div className="flex justify-between">
								<button
									type="button"
									className="bg-gray-500 text-white py-2 px-4 rounded"
									onClick={() => setEditingItem(null)}
								>
									Cancelar
								</button>
								<button
									type="submit"
									className="bg-blue-600 text-white py-2 px-4 rounded"
								>
									Guardar Cambios
								</button>
							</div>
						</form>
					</div>
				) : (
					// Tabla de usuarios cuando no se está editando
					<div className="h-[70vh] w-[75vw] max-w-[75vw] flex flex-col">
						<h3 className="text-center text-white py-4 text-lg font-bold">
							Listado de Usuarios
						</h3>
						<div
							id="user-table"
							className="overflow-y-scroll overflow-x-hidden w-[75vw]"
						>
							<table className="divide-y-2 divide-gray-200 bg-white text-sm w-[75vw]">
								<thead>
									<tr>
										{headers.map((header, index) => (
											<th
												key={index}
												className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left"
											>
												{header}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{currentItems.map((user) => (
										<tr key={user.id}>
											<td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left">
												{user.id}
											</td>
											<td className="whitespace-nowrap px-4 py-2 text-gray-700 text-left">
												{user.name ||
													"Nombre no disponible"}
											</td>
											<td className="whitespace-nowrap px-4 py-2 text-gray-700 text-left">
												{user.lastname ||
													"Apellido no disponible"}
											</td>
											<td className="whitespace-nowrap px-4 py-2 text-gray-700 text-left">
												{user.email ||
													"Correo no disponible"}
											</td>
											<td className="whitespace-nowrap px-4 py-2 text-gray-700 text-left">
												{userRole === "COLAB" &&
												user.rol === "ADMIN" ? (
													// Mostrar el rol como texto si el usuario actual es COLAB y el rol del usuario es ADMIN
													<span>Administrador</span>
												) : (
													<select
														value={user.rol}
														onChange={(e) =>
															handleRoleChange(
																user.id,
																e.target.value
															)
														}
														className="px-2 py-1 rounded border border-gray-300"
														disabled={
															userRole ===
																"COLAB" &&
															user.rol === "ADMIN"
														}
													>
														{userRole !==
															"COLAB" && (
															<option value="ADMIN">
																Administrador
															</option>
														)}
														<option value="COLAB">
															Colaborador
														</option>
														<option value="USER">
															Usuario
														</option>
													</select>
												)}
											</td>
											<td className="whitespace-nowrap px-4 flex gap-2 py-2 text-left">
												<button
													onClick={() =>
														handleEdit(user)
													}
													className={`text-lg font-bold p-3 border-2 rounded ${
														userRole === "COLAB" &&
														user.rol === "ADMIN"
															? "text-gray-400 border-gray-400 cursor-not-allowed"
															: "text-blue-600 border-blue-600 hover:bg-blue-600/75 hover:text-white hover:border-blue-400"
													}`}
													disabled={
														userRole === "COLAB" &&
														user.rol === "ADMIN"
													}
												>
													<CiEdit />
												</button>
												<button
													onClick={() =>
														handleDelete(user.id)
													}
													className={`text-lg font-bold p-3 border-2 rounded ${
														userRole === "COLAB" &&
														user.rol === "ADMIN"
															? "text-gray-400 border-gray-400 cursor-not-allowed"
															: "text-red-600 border-red-600 hover:bg-red-600/75 hover:text-white hover:border-red-400"
													}`}
													disabled={
														userRole === "COLAB" &&
														user.rol === "ADMIN"
													}
												>
													<CiTrash />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<Pagination
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							totalPages={totalPages}
						/>
					</div>
				)}
			</div>

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

			{/* Modal de confirmación de eliminación */}
			{deletingItem && (
				<Modal
					type="delete"
					text="¿Realmente deseas eliminar este usuario? Esta acción no se puede deshacer."
					options={{
						confirmText: "Eliminar",
						cancelText: "Cancelar",
					}}
					isOpen={!!deletingItem}
					onClose={() => setDeletingItem(null)}
					onConfirm={confirmDelete}
				/>
			)}
		</div>
	);
};

export default UserTable;
