import { Routes, Route } from "react-router-dom";
import TablePolizas from "./components/TablePolizas/TablePoliza";
import TableInventarios from "./components/TableInventarios/TableInventarios";
import TableEmpleados from "./components/TableEmpleados/TableEmpleados";
import Menu from "./components/Menu/Menu";
import "./App.css";

function App() {
    return (
        <main>
            <h1>Crud Coppel</h1>

            <Menu></Menu>

            <Routes>
                <Route path="/polizas" element={<TablePolizas />} />
                <Route path="/inventarios" element={<TableInventarios />} />
                <Route path="/empleados" element={<TableEmpleados />} />
            </Routes>
        </main>
    );
}

export default App;
