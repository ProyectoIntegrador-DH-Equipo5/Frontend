import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useContextGlobal } from "../../utils/global.context"; // Importa el contexto
import FormField from "./FormField";
import ImageUpload from "./ImageUpload";

const Form = ({ edit, obra = {}, onClose, setSuccessMessage, setErrorMessage }) => {
    const { state, dispatch } = useContextGlobal(); // Obtiene las categorías del estado global
    const initialFormData = {
        nombre: "",
        descripcion: "",
        disponibilidad: true,
        tecnicaObra: { nombre: "" },
        artista: { nombre: "" },
        movimientoArtistico: { nombre: "" },  // Inicializa como un objeto vacío con una propiedad nombre
    };

    const [formData, setFormData] = useState(edit ? { ...obra } : initialFormData);
    const [priceRangeSymbol, setPriceRangeSymbol] = useState("");
    const [isAddingCategory, setIsAddingCategory] = useState(false); // Nuevo estado para manejar la creación de categoría
    const [newCategory, setNewCategory] = useState({
        nombre: "",
        descripcion: "",
        imagen: "",
    });

    useEffect(() => {
        if (edit) {
            setFormData({ ...obra });
            updatePriceRangeSymbol(obra.precioRenta || "");
        }
    }, [edit, obra]);

    const onFilesAdded = (file) => {
        console.log("Archivo añadido:", file);
        setFormData((prevData) => ({
            ...prevData,
            imagenes: [...(prevData.imagenes || []), file], // Agregar el archivo al array de imágenes
        }));
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "precioRenta") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
            updatePriceRangeSymbol(value);
        } else if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prevData) => ({
                ...prevData,
                [parent]: {
                    ...prevData[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setNewCategory((prevCategory) => ({
            ...prevCategory,
            [name]: value,
        }));
    };

    const updatePriceRangeSymbol = (value) => {
        if (!value) {
            setPriceRangeSymbol("");
        } else if (value < 100) {
            setPriceRangeSymbol("$");
        } else if (value < 500) {
            setPriceRangeSymbol("$$");
        } else {
            setPriceRangeSymbol("$$$");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Verificar si se ha seleccionado o creado una categoría
        const isCategoryValid = formData.movimientoArtistico?.nombre || (isAddingCategory && newCategory.nombre);
    
        if (!isCategoryValid) {
            setErrorMessage("Por favor, seleccione o cree una categoría.");
            return;
        }
    
        const existingProduct = false;  // Aquí deberías validar si la obra ya existe
        if (existingProduct) {
            setErrorMessage("El nombre del producto ya existe.");
            return;
        }
    
        console.log("Form data:", formData);
        if (edit) {
            // Actualiza la obra en el estado global (o en el backend)
            dispatch({ type: "UPDATE_ART", payload: formData });
        } else {
            // Crear nueva obra en el estado global
            dispatch({ type: "ADD_ART", payload: formData });
        }
        setSuccessMessage(edit ? "La obra se ha editado correctamente." : "La obra se ha creado correctamente.");
        onClose();
    };

    const handleCreateCategory = () => {
        // Simulación de creación de la categoría
        console.log("Nueva categoría creada:", newCategory);
        setIsAddingCategory(false); // Oculta los campos de nueva categoría después de la creación
    };

    const handleCategorySelect = (e) => {
        const { value } = e.target;
    if (value === "agregar") {
        setIsAddingCategory(true);
    } else {
        setIsAddingCategory(false);
        setFormData((prevData) => ({
            ...prevData,
            movimientoArtistico: {
                nombre: value || "", // Asegúrate de que el valor esté siempre definido
            },
        }));
    }
};

    const fieldsToRender = edit
        ? Object.keys(obra).filter(
              (field) =>
                  field !== "img" &&
                  field !== "id" &&
                  field !== "tecnicaObra" &&
                  field !== "movimientoArtistico" &&
                  field !== "artista" &&
                  field !== "precioRenta" &&
                  field !== "fechaCreacion" &&
                  field !== "tamano"
          )
        : Object.keys(initialFormData).filter(
              (field) => field !== "tecnicaObra" && field !== "movimientoArtistico" && field !== "artista"
          );

    const renderFields = (fields) => {
        return fields.map((field) => {
            const fieldValue = formData[field] || "";
            const fieldType = field === "descripcion" ? "textarea" : field === "disponibilidad" ? "select" : field === "fechaCreacion" ? "date" : "input";

            return (
                <FormField key={field} element={fieldType} name={field} value={fieldValue} onChange={handleChange} label={field}>
                    {fieldType === "select" && (
                        <>
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </>
                    )}
                </FormField>
            );
        });
    };

    const renderNestedFields = () => {
        return (
            <>
                <fieldset className="border border-primary p-3 mt-4 rounded">
                    <legend className="text-sm font-semibold">Características</legend>
                    <div className="flex items-center space-x-4 justify-between w-full">
                        <div className="flex items-center w-1/2">
                            <FormField
                                element="input"
                                name="precioRenta"
                                value={formData.precioRenta}
                                onChange={handleChange}
                                label="Precio Renta"
                            />
                            {priceRangeSymbol && (
                                <span className="ml-2 bg-green-600 text-white px-2 py-1 rounded mt-2">
                                    {priceRangeSymbol}
                                </span>
                            )}
                        </div>
                        <div className="w-1/2">
                            <FormField
                                element="date"
                                name="fechaCreacion"
                                value={formData.fechaCreacion}
                                onChange={handleChange}
                                label="Fecha Creación"
                            />
                        </div>
                    </div>
                    <FormField
                        element="select"
                        name="tamano"
                        value={formData.tamano}
                        onChange={handleChange}
                        label="Tamaño"
                    >
                        <option value="">Seleccione un tamaño</option>
                        <option value="GRANDE">GRANDE</option>
                        <option value="MEDIANO">MEDIANO</option>
                        <option value="PEQUEÑO">PEQUEÑO</option>
                    </FormField>
                    {[{ label: "Técnica", name: "tecnicaObra.nombre", value: formData.tecnicaObra?.nombre || "" },
                        { label: "Artista", name: "artista.nombre", value: formData.artista?.nombre || "" }
                    ].map(({ label, name, value }) => (
                        <FormField key={name} element="input" name={name} value={value} onChange={handleChange} label={label} />
                    ))}
                </fieldset>

                <fieldset className="border border-primary p-3 mt-4 rounded">
                    <legend className="text-sm font-semibold">Categoría</legend>
                    <FormField
                        element="select"
                        name="movimientoArtistico.nombre"
                        value={formData.movimientoArtistico?.nombre || ""}
                        onChange={handleCategorySelect} // Cambié esto para que se active el "agregar nueva categoría"
                        label="Movimiento Artístico"
                    >
                        <option value="">Seleccione un movimiento</option>
                        {state.categories.map((category) => (
                            <option key={category.id} value={category.nombre}>
                                {category.nombre}
                            </option>
                        ))}
                        <option value="agregar">Agregar nueva categoría</option>
                    </FormField>

                    {isAddingCategory && (
                        <div className="mt-4">
                            <FormField
                                element="input"
                                name="nombre"
                                value={newCategory.nombre}
                                onChange={handleCategoryChange}
                                label="Nombre de la nueva categoría"
                            />
                            <FormField
                                element="textarea"
                                name="descripcion"
                                value={newCategory.descripcion}
                                onChange={handleCategoryChange}
                                label="Descripción de la nueva categoría"
                            />
                            <FormField
                                element="input"
                                name="imagen"
                                value={newCategory.imagen}
                                onChange={handleCategoryChange}
                                label="Imagen (URL)"
                            />
                            <button
                                type="button"
                                className="bg-blue-600 text-white py-2 px-4 mt-2 rounded"
                                onClick={handleCreateCategory}
                            >
                                Crear Categoría
                            </button>
                        </div>
                    )}
                </fieldset>
            </>
        );
    };

    return (
        <div className="w-[75vw] h-[65vh] overflow-y-scroll relative bg-white p-6 rounded-lg shadow-md">
            <button
                onClick={onClose}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                aria-label="Cerrar"
            >
                <FaTimes />
            </button>
            <h2 className="text-xl font-semibold mb-4">{edit ? "Editar obra" : "Crear nueva obra"}</h2>
            <form onSubmit={handleSubmit}>
                {renderFields(fieldsToRender)}
                {renderNestedFields()}
                <ImageUpload onFilesAdded={onFilesAdded} existingImage={obra.imagen} />

                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        className="bg-gray-500 text-white py-2 px-4 rounded mt-4"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-4 rounded mt-4"
                    >
                        {edit ? "Actualizar obra" : "Crear obra"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Form;
