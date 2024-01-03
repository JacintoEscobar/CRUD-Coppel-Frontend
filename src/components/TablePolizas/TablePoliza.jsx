import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Swal from "sweetalert2";
import $ from "jquery";

const TablePolizas = () => {
    const [polizas, setPolizas] = useState(null);
    const [mostrarFormularioCrear, setMostrarFormularioCrear] = useState(false);
    const [mostrarFormularioEditar, setMostrarFormularioEditar] =
        useState(false);
    const [validacionFormularioCrear, setValidacionFormularioCrear] =
        useState(false);
    const [validacionFormularioEditar, setValidacionFormularioEditar] =
        useState(false);
    const [empleados, setEmpleados] = useState(null);
    const [inventarios, setInventarios] = useState(null);
    const [polizaEditar, setPolizaEditar] = useState(null);

    const fecha = new Date();
    const dia = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
    const mes =
        fecha.getMonth() + 1 < 10
            ? `0${fecha.getMonth() + 1}`
            : fecha.getDate() + 1;

    const mostrarFormularioCrearHandle = () => setMostrarFormularioCrear(true);
    const ocultarFormularioCrearHandle = () => setMostrarFormularioCrear(false);

    const mostrarFormularioEditarHandle = () =>
        setMostrarFormularioEditar(true);
    const ocultarFormularioEditarHandle = () =>
        setMostrarFormularioEditar(false);

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

    const getEmpleados = async () => {
        try {
            const response = await fetch("http://localhost:8080/empleado", {
                method: "GET",
            }).then((response) => response.json());

            if (response.meta.status === "FAILURE") {
                return Swal.fire({
                    icon: "error",
                    title: "¡ERROR!",
                    text: response.data.mensaje.idMensaje,
                });
            }

            if (response.meta.status === "OK" && response.data.mensaje) {
                return setPolizas(response.data.mensaje.idMensaje);
            }

            setEmpleados(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getInventarios = async () => {
        try {
            const response = await fetch("http://localhost:8080/inventario", {
                method: "GET",
            }).then((response) => response.json());

            if (response.meta.status === "FAILURE") {
                return Swal.fire({
                    icon: "error",
                    title: "¡ERROR!",
                    text: response.data.mensaje.idMensaje,
                });
            }

            if (response.meta.status === "OK" && response.data.mensaje) {
                return setPolizas(response.data.mensaje.idMensaje);
            }

            setInventarios(response.data);
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

            if (respuesta.meta.status === "OK") {
                return Swal.fire({
                    icon: "success",
                    title: "HECHO!",
                    text: respuesta.data.mensaje.idMensaje,
                }).then(() => {
                    window.location.reload();
                });
            }

            return Swal.fire({
                icon: "error",
                title: "ERROR!",
                text: respuesta.data.mensaje.idMensaje,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const editarPolizaHandle = async (idPoliza) => {
        try {
            const respuesta = await fetch(
                `http://localhost:8080/poliza/${idPoliza}`,
                {
                    method: "GET",
                }
            ).then((response) => response.json());

            if (respuesta.meta.status === "OK") {
                setPolizaEditar(respuesta.data);
                setMostrarFormularioEditar(true);
                return;
            }

            return Swal.fire({
                icon: "error",
                title: "ERROR!",
                text: respuesta.data.mensaje.idMensaje,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const submitEditarPolizaHandle = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        actualizarPoliza();
        setValidacionFormularioEditar(true);
    };

    const actualizarPoliza = () => {
        const body = {
            idPoliza: $("#id-poliza").val(),
            cantidad: $("#cantidad").val(),
            empleado: {
                nombre: $("#nombre-empleado").val(),
                apellido: $("#apellido-empleado").val(),
            },
            inventario: {
                sku: $("#inventarios-select").val(),
            },
        };

        fetch(
            `http://localhost:8080/poliza/actualizar-campos/${body.idPoliza}`,
            {
                method: "PUT",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((response) => response.json())
            .then((respuesta) => {
                if (respuesta.meta.status === "OK") {
                    return Swal.fire({
                        icon: "success",
                        title: "¡HECHO!",
                        text: respuesta.data.mensaje.idMensaje,
                    }).then(() => {
                        window.location.reload();
                    });
                }

                return Swal.fire({
                    icon: "error",
                    title: "ERROR!",
                    text: respuesta.data.mensaje.idMensaje,
                });
            })
            .catch((error) => console.error(error));
    };

    const crearPoliza = async () => {
        const body = {
            cantidad: $("#cantidad").val(),
            fecha: $("#fecha").val(),
            empleado: {
                idEmpleado: $("#empleados-select").val(),
            },
            inventario: {
                sku: $("#inventarios-select").val(),
            },
        };

        fetch("http://localhost:8080/poliza/crear", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((respuesta) => {
                if (respuesta.meta.status === "OK") {
                    return Swal.fire({
                        icon: "success",
                        title: "¡HECHO!",
                        text: "Póliza creada exitosamente",
                    }).then(() => {
                        window.location.reload();
                    });
                }

                return Swal.fire({
                    icon: "error",
                    title: "ERROR!",
                    text: respuesta.data.mensaje.idMensaje,
                });
            })
            .catch((error) => console.error(error));
    };

    const crearPolizaHandle = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        crearPoliza();
        setValidacionFormularioCrear(true);
    };

    useEffect(() => {
        getPolizas();
        getEmpleados();
        getInventarios();
    }, []);

    return (
        <>
            <section id="menu-seccion">
                <Button
                    variant="primary"
                    size="sm"
                    id="nueva-poliza"
                    onClick={mostrarFormularioCrearHandle}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </Button>
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
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            id="button-editar"
                                            onClick={() => {
                                                editarPolizaHandle(
                                                    poliza.idPoliza
                                                );
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faPencil} />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            id="button-eliminar"
                                            onClick={() => {
                                                eliminarPolizaHandler(
                                                    poliza.idPoliza
                                                );
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
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

            <Modal
                show={mostrarFormularioCrear}
                onHide={ocultarFormularioCrearHandle}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Nueva póliza</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        noValidate
                        validated={validacionFormularioCrear}
                        id="crear-poliza-form"
                        onSubmit={crearPolizaHandle}
                    >
                        <Row className="mb-3 mx-2">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                min={1}
                                placeholder="Cantidad"
                                id="cantidad"
                            />
                            <Form.Control.Feedback type="invalid">
                                Selecciona una cantidad correcta
                            </Form.Control.Feedback>
                        </Row>
                        <Row className="mb-3 mx-2">
                            <Form.Label>Fecha</Form.Label>
                            <Form.Control
                                required
                                type="date"
                                placeholder="Fecha"
                                min={"2001-01-01"}
                                max={`${fecha.getFullYear()}-${mes}-${dia}`}
                                id="fecha"
                            />
                            <Form.Control.Feedback type="invalid">
                                Selecciona una fecha correcta
                            </Form.Control.Feedback>
                        </Row>
                        <Row className="mb-3 mx-2">
                            <Form.Label>Empleado</Form.Label>
                            <Form.Select id="empleados-select">
                                {empleados &&
                                    empleados.map((empleado) => {
                                        return (
                                            <option
                                                key={empleado.idEmpleado}
                                                value={empleado.idEmpleado}
                                            >
                                                {empleado.nombre}
                                            </option>
                                        );
                                    })}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Selecciona un empleado correcto
                            </Form.Control.Feedback>
                        </Row>
                        <Row className="mb-3 mx-2">
                            <Form.Label>Inventario</Form.Label>
                            <Form.Select id="inventarios-select">
                                {inventarios &&
                                    inventarios.map((inventario) => {
                                        return (
                                            <option
                                                key={inventario.sku}
                                                value={inventario.sku}
                                            >
                                                {inventario.nombre}
                                            </option>
                                        );
                                    })}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Selecciona un inventario correcto
                            </Form.Control.Feedback>
                        </Row>
                        <div id="div-buttons-crear">
                            <Button type="submit" className="m-2">
                                Crear
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal
                show={mostrarFormularioEditar}
                onHide={ocultarFormularioEditarHandle}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Editar póliza</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        noValidate
                        validated={validacionFormularioEditar}
                        id="crear-poliza-form"
                        onSubmit={submitEditarPolizaHandle}
                    >
                        <Row className="mb-3 mx-2">
                            <Form.Label>ID</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                id="id-poliza"
                                readOnly
                                defaultValue={
                                    polizaEditar && polizaEditar.poliza.idPoliza
                                }
                            />
                        </Row>
                        <Row className="mb-3 mx-2">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                min={1}
                                placeholder="Cantidad"
                                id="cantidad"
                                defaultValue={
                                    polizaEditar && polizaEditar.poliza.cantidad
                                }
                            />
                            <Form.Control.Feedback type="invalid">
                                Selecciona una cantidad correcta
                            </Form.Control.Feedback>
                        </Row>
                        <Row className="mb-3 mx-2">
                            <Form.Label>Nombre empleado</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Nombre empleado"
                                id="nombre-empleado"
                                defaultValue={
                                    polizaEditar && polizaEditar.empleado.nombre
                                }
                            />
                            <Form.Control.Feedback type="invalid">
                                Escribe un nombre correcto
                            </Form.Control.Feedback>
                        </Row>
                        <Row className="mb-3 mx-2">
                            <Form.Label>Apellido empleado</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Apellido empleado"
                                id="apellido-empleado"
                                defaultValue={
                                    polizaEditar &&
                                    polizaEditar.empleado.apellido
                                }
                            />
                            <Form.Control.Feedback type="invalid">
                                Escribe un nombre correcto
                            </Form.Control.Feedback>
                        </Row>
                        <Row className="mb-3 mx-2">
                            <Form.Label>Inventario</Form.Label>
                            <Form.Select
                                id="inventarios-select"
                                defaultValue={
                                    polizaEditar &&
                                    polizaEditar.detalleArticulo.sku
                                }
                            >
                                {inventarios &&
                                    inventarios.map((inventario) => {
                                        return (
                                            <option
                                                key={inventario.sku}
                                                value={inventario.sku}
                                            >
                                                {inventario.nombre}
                                            </option>
                                        );
                                    })}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Selecciona un inventario correcto
                            </Form.Control.Feedback>
                        </Row>
                        <div id="div-buttons-crear">
                            <Button type="submit" className="m-2">
                                Actualizar
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default TablePolizas;
