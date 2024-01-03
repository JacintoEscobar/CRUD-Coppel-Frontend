import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Swal from "sweetalert2";
import $ from "jquery";

const TableEmpleados = () => {
    const [empleados, setEmpleados] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(null);
    const [validacionFormulario, setValidacionFormulario] = useState(false);

    const mostrarFormularioHandle = () => setMostrarFormulario(true);
    const ocultarFormularioHandle = () => setMostrarFormulario(false);

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

    const crearEmpleadoHandle = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        crearEmpleado();
        setValidacionFormulario(true);
    };

    const crearEmpleado = async () => {
        const body = {
            nombre: $("#nombre").val(),
            apellido: $("#apellido").val(),
            puesto: $("#puesto").val(),
        };

        fetch("http://localhost:8080/empleado/crear", {
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
                        text: "Empleado creado exitosamente",
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

    useEffect(() => {
        getEmpleados();
    }, []);

    return (
        <>
            <section id="menu-seccion">
                <Button
                    variant="primary"
                    size="sm"
                    id="nuevo-empleado"
                    onClick={mostrarFormularioHandle}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </Button>
                <h2 id="titulo-seccion">Empleados</h2>
            </section>
            <table id="table-empleados" className="table">
                <thead>
                    <tr>
                        <th scope="col">IdEmpleado</th>
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

            <Modal
                show={mostrarFormulario}
                onHide={ocultarFormularioHandle}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo empleado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        noValidate
                        validated={validacionFormulario}
                        id="crear-empleado-form"
                        onSubmit={crearEmpleadoHandle}
                    >
                        <Row className="mb-3 mx-2">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control required type="text" id="nombre" />
                            <Form.Control.Feedback type="invalid">
                                Selecciona un nombre correcto
                            </Form.Control.Feedback>
                        </Row>
                        <Row className="mb-3 mx-2">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control required type="text" id="apellido" />
                            <Form.Control.Feedback type="invalid">
                                Selecciona un apellido correcto
                            </Form.Control.Feedback>
                        </Row>
                        <Row className="mb-3 mx-2">
                            <Form.Label>Puesto</Form.Label>
                            <Form.Control required type="text" id="puesto" />
                            <Form.Control.Feedback type="invalid">
                                Selecciona un puesto correcto
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
        </>
    );
};

export default TableEmpleados;
