import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiBarChart2, FiFileText, FiSettings, FiDatabase, FiServer, FiLogOut } from "react-icons/fi";
import "../../styles/styles.css";

const Sidebar = ({ toggleTheme, handleLogout }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Optimizer AI</h2>
            </div>

            <nav>
                <ul>
                    <li><Link to="/"><FiHome /> Inicio</Link></li>
                    <li><Link to="/perfil"><FiSettings /> Perfil</Link></li>
                    <li><Link to="/historial"><FiBarChart2 /> Historial</Link></li>
                    <li><Link to="/exportar"><FiFileText /> Exportar Datos</Link></li>
                    <li><Link to="/backup"><FiDatabase /> Copia de Seguridad</Link></li>
                    <li><Link to="/servidor"><FiServer /> Estado del Servidor</Link></li>
                    <li><Link to="/configuracion"><FiSettings /> Configuración</Link></li>
                </ul>
            </nav>

            <button className="theme-toggle" onClick={toggleTheme}>🌙</button>

            <button className="logout-btn" onClick={handleLogout}>
                <FiLogOut /> Cerrar Sesión
            </button>
        </div>
    );
};

export default Sidebar;
