import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

const TableInventarios = () => {
    const [inventarios, setInventarios] = useState(null);

    const getInventarios = async () => {
        try {
            const data = await fetch("http://localhost:8080/inventario", {
                method: "GET",
            }).then((response) => response.json());
            setInventarios(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getInventarios();
    }, []);

    return (
        <>
            <section id="menu-seccion">
                <button className="btn btn-primary btn-sm" id="nuevo-empleado">
                    <FontAwesomeIcon icon={faPlus} />
                </button>
                <h2 id="titulo-seccion">Inventarios</h2>
            </section>
            <table id="table-inventarios" className="table">
                <thead>
                    <tr>
                        <th scope="col">SKU</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {inventarios ? (
                        inventarios.map((inventario) => {
                            return (
                                <tr key={inventario.sku}>
                                    <th scope="row">{inventario.sku}</th>
                                    <td>{inventario.nombre}</td>
                                    <td>{inventario.cantidad}</td>
                                    <td>
                                        <button
                                            id="button-editar"
                                            className="btn btn-warning btn-sm"
                                        >
                                            <FontAwesomeIcon icon={faPencil} />
                                        </button>
                                        <button
                                            id="button-eliminar"
                                            className="btn btn-danger btn-sm"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={4} align="center">
                                Cargando datos...
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
};

export default TableInventarios;
