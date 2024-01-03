import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Swal from "sweetalert2";
import $ from "jquery";

const TableInventarios = () => {
    const [inventarios, setInventarios] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(null);
    const [validacionFormulario, setValidacionFormulario] = useState(false);

    const mostrarFormularioHandle = () => setMostrarFormulario(true);
    const ocultarFormularioHandle = () => setMostrarFormulario(false);

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

    const crearInventarioHandle = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        crearInventario();
        setValidacionFormulario(true);
    };

    const crearInventario = async () => {
        const body = {
            sku: $("#sku").val(),
            nombre: $("#nombre").val(),
            cantidad: $("#cantidad").val(),
        };

        fetch("http://localhost:8080/inventario/crear", {
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
                        text: "Inventario creado exitosamente",
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
        getInventarios();
    }, []);

    return (
        <>
            <section id="menu-seccion">
                <Button
                    variant="primary"
                    size="sm"
                    id="nuevo-inventario"
                    onClick={mostrarFormularioHandle}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </Button>
                <h2 id="titulo-seccion">Inventarios</h2>
            </section>
            <table id="table-inventarios" className="table">
                <thead>
                    <tr>
                        <th scope="col">SKU</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Cantidad</th>
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
                    <Modal.Title>Nuevo inventario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        noValidate
                        validated={validacionFormulario}
                        id="crear-inventario-form"
                        onSubmit={crearInventarioHandle}
                    >
                        <Row className="mb-3 mx-2">
                            <Form.Label>SKU</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                min={1}
                                id="sku"
                            />
                            <Form.Control.Feedback type="invalid">
                                Selecciona un SKU correcto
                            </Form.Control.Feedback>
                        </Row>
                        <Row className="mb-3 mx-2">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control required type="text" id="nombre" />
                            <Form.Control.Feedback type="invalid">
                                Selecciona un nombre correcto
                            </Form.Control.Feedback>
                        </Row>
                        <Row className="mb-3 mx-2">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                min={1}
                                id="cantidad"
                            />
                            <Form.Control.Feedback type="invalid">
                                Selecciona una cantidad correcta
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

export default TableInventarios;
