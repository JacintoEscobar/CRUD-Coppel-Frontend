import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./table-polizas.css";

const TablePolizas = () => {
    const [polizas, setPolizas] = useState(null);

    const getPolizas = async () => {
        try {
            const data = await fetch("http://localhost:8080/poliza", {
                method: "GET",
            }).then((response) => response.json());
            setPolizas(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getPolizas();
    }, []);

    return (
        <>
            <section id="menu-polizas">
                <button className="btn btn-primary btn-sm" id="nuevo-polizas">
                    <FontAwesomeIcon icon={faPlus} />
                </button>
                <h2 id="titulo-polizas">Pólizas</h2>
            </section>
            <table id="table-polizas" className="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {polizas ? (
                        polizas.map((poliza) => {
                            return (
                                <tr key={poliza.idPoliza}>
                                    <th scope="row">{poliza.idPoliza}</th>
                                    <td>{poliza.cantidad}</td>
                                    <td>{poliza.fecha}</td>
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

export default TablePolizas;
