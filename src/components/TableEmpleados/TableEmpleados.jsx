import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

const TableEmpleados = () => {
    const [empleados, setEmpleados] = useState(null);

    const getEmpleados = async () => {
        try {
            const data = await fetch("http://localhost:8080/empleado", {
                method: "GET",
            }).then((response) => response.json());
            setEmpleados(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getEmpleados();
    }, []);

    return (
        <>
            <section id="menu-seccion">
                <button className="btn btn-primary btn-sm" id="nuevo-empleado">
                    <FontAwesomeIcon icon={faPlus} />
                </button>
                <h2 id="titulo-seccion">Empleados</h2>
            </section>
            <table id="table-empleados" className="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Apellido</th>
                        <th scope="col">Puesto</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empleados ? (
                        empleados.map((empleado) => {
                            return (
                                <tr key={empleado.idEmpleado}>
                                    <th scope="row">{empleado.idEmpleado}</th>
                                    <td>{empleado.nombre}</td>
                                    <td>{empleado.apellido}</td>
                                    <td>{empleado.puesto}</td>
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

export default TableEmpleados;
