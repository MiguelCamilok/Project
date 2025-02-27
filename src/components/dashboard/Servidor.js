import React, { useState, useEffect } from "react";
import "../../styles/styles.css";


const Servidor = () => {
    const [estado, setEstado] = useState({
        online: null,
        tiempoRespuesta: "Cargando...",
        ultimaActualizacion: "Cargando...",
        historial: []
    });

    const servidorIP = "play.hypixel.net"; // Servidor de ejemplo

    const verificarEstado = async () => {
        try {
            const respuesta = await fetch(`https://api.mcsrvstat.us/2/${servidorIP}`);
            const datos = await respuesta.json();

            const estaOnline = datos.online;
            const tiempoMs = estaOnline && datos.debug?.ping ? `${datos.debug.ping} ms` : "N/A";
            const fechaActual = new Date().toLocaleTimeString();

            setEstado(prevState => {
                const nuevoHistorial = !estaOnline
                    ? [{ fecha: new Date().toLocaleDateString(), status: "🔴 Servidor caído" }, ...prevState.historial].slice(0, 5)
                    : prevState.historial; // Máximo 5 eventos

                return {
                    ...prevState,
                    online: estaOnline,
                    tiempoRespuesta: tiempoMs,
                    ultimaActualizacion: `Hace pocos segundos (${fechaActual})`,
                    historial: nuevoHistorial
                };
            });
        } catch (error) {
            console.error("Error obteniendo el estado del servidor:", error);
            setEstado(prevState => ({
                ...prevState,
                online: false,
                tiempoRespuesta: "N/A",
                ultimaActualizacion: "Error al obtener datos"
            }));
        }
    };

    useEffect(() => {
        verificarEstado(); // Primera consulta
        const interval = setInterval(verificarEstado, 10000); // Actualiza cada 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="servidor-container">
            <h2>📡 Estado del Servidor</h2>
            <p>Consulta la disponibilidad de nuestros servidores y recibe información en tiempo real.</p>

            <div className={`servidor-status card ${estado.online ? "online" : "offline"}`}>
                <p>📊 Última actualización: <strong>{estado.ultimaActualizacion}</strong></p>
                <p>
                    {estado.online ? "🟢 Servidor en línea" : "🔴 Servidor fuera de línea"} – 
                    Tiempo de respuesta: <strong>{estado.tiempoRespuesta}</strong>
                </p>
            </div>

            <div className="servidor-historial card">
                <h3>📜 Historial reciente:</h3>
                <ul>
                    {estado.historial.length > 0 ? (
                        estado.historial.map((evento, index) => (
                            <li key={index}>{evento.status} ({evento.fecha})</li>
                        ))
                    ) : (
                        <li>No hay eventos recientes</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Servidor;
