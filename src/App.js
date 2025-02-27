import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/dashboard/Sidebar";
import "./styles/styles.css";

import Registro from "./components/dashboard/Registro";
import Login from "./components/Login";
import Historial from "./components/dashboard/Historial";
import Exportar from "./components/dashboard/Exportar";
import Espacio from "./components/dashboard/Espacio";
import Informe from "./components/dashboard/Informe";
import Backup from "./components/dashboard/Backup";
import Servidor from "./components/dashboard/Servidor";
import Configuracion from "./components/dashboard/Configuracion";
import Perfil from "./components/dashboard/Perfil";

function App() {
    console.log("🚀 Aplicación iniciada");

    // Cargar el tema desde localStorage o usar "dark" por defecto
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    useEffect(() => {
        // Aplicar la clase al body
        document.body.classList.remove("dark", "light");
        document.body.classList.add(theme);
        
        // Guardar el tema en localStorage
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

    // Verificamos si hay autenticación en localStorage
    const storedAuth = sessionStorage.getItem("auth");
    const [isAuthenticated, setIsAuthenticated] = useState(storedAuth === "true");
    
    // Cambiar localStorage por sessionStorage
    const handleLogin = () => {
        console.log("✅ Usuario autenticado");
        sessionStorage.setItem("auth", "true"); // Guardamos solo en sessionStorage
        setIsAuthenticated(true);
    };
    
    const handleLogout = () => {
        console.log("🚪 Usuario cerró sesión");
        sessionStorage.removeItem("auth"); // Eliminamos de sessionStorage
        setIsAuthenticated(false);
    };

    return isAuthenticated ? (
        <>
            <Sidebar toggleTheme={toggleTheme} handleLogout={handleLogout} />
            <div className="content">
                <div className="content-box">
                <Routes>
                    <Route path="/" element={<Navigate to="/servidor" />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/historial" element={<Historial />} />
                    <Route path="/exportar" element={<Exportar />} />
                    <Route path="/espacio" element={<Espacio />} />
                    <Route path="/informe" element={<Informe />} />
                    <Route path="/backup" element={<Backup />} />
                    <Route path="/servidor" element={<Servidor />} />
                    <Route path="/configuracion" element={<Configuracion />} />
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="*" element={<Navigate to="/servidor" />} />
                </Routes>
                </div>
            </div>
        </>
    ) : (
        <Routes>
            <Route path="/login" element={<Login handleLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;
