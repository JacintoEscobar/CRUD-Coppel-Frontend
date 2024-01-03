import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const TablePolizas = () => {
    const [polizas, setPolizas] = useState(null);

    const getPolizas = async () => {
        try {
            const data = await fetch("http://localhost:8080/poliza", {
                method: "GET",
            }).then((response) => response.json());

            if (data.meta.status === "FAILURE") {
                return Swal.fire({
                    icon: "error",
                    title: "¡ERROR!",
                    text: data.data.mensaje.idMensaje,
                });
            }

            if (data.meta.status === "OK" && data.data.mensaje) {
                return setPolizas(data.data.mensaje.idMensaje);
            }

            setPolizas(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const eliminarPolizaHandler = async (idPoliza) => {
        try {
            const respuesta = await fetch(
                `http://localhost:8080/poliza/eliminar/${idPoliza}`,
                {
                    method: "DELETE",
                }
            ).then((response) => response.json());

            let typeResponse = "success";
            if (respuesta.meta.status === "FAILURE") {
                typeResponse = "error";
            }

            return Swal.fire({
                icon: typeResponse,
                title: "¡HECHO!",
                text: respuesta.data.mensaje.idMensaje,
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getPolizas();
    }, []);

    return (
        <>
            <section id="menu-seccion">
                <button className="btn btn-primary btn-sm" id="nueva-poliza">
                    <FontAwesomeIcon icon={faPlus} />
                </button>
                <h2 id="titulo-seccion">Pólizas</h2>
            </section>
            <table id="table-polizas" className="table">
                <thead>
                    <tr>
                        <th scope="col">IdPoliza</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {polizas && typeof polizas !== "string" ? (
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
                                            onClick={() =>
                                                eliminarPolizaHandler(
                                                    poliza.idPoliza
                                                )
                                            }
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
                                {polizas}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
};

export default TablePolizas;
