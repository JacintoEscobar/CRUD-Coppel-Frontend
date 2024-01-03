import { Link } from "react-router-dom";
import "./menu.css";

const Menu = () => {
    return (
        <nav className="navbar navbar-expand-lg">
            <ul id="menu" className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <Link
                        to="/polizas"
                        className="nav-link"
                        aria-current="page"
                    >
                        Polizas
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        to="/inventarios"
                        className="nav-link"
                        aria-current="page"
                    >
                        Inventarios
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        to="/empleados"
                        className="nav-link"
                        aria-current="page"
                    >
                        Empleados
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Menu;
