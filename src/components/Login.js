import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/login.css";

const Login = ({ handleLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [key, setKey] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/login', {
                email,
                password,
                key
            });

            if (response.status === 200) {
                // Guardamos el estado de autenticación
                handleLogin();
                // Redirigimos al servidor o al perfil
                navigate("/servidor");
            }
        } catch (error) {
            console.error('Error al hacer login', error);
            alert("Credenciales incorrectas");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Correo" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <input 
                        type="text" 
                        placeholder="Key" 
                        value={key} 
                        onChange={(e) => setKey(e.target.value)} 
                        required 
                    />
                    <button type="submit">Ingresar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
