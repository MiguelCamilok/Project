import React, { useState, useEffect } from "react";
import "../../styles/perfil.css";
import { FaEdit } from "react-icons/fa";
import axios from "axios";

const Perfil = () => {
    const defaultData = {
        userID: "N/A",
        email: "N/A",
        key: "N/A",
        expires: "N/A",
        profilePic: "",
        coverPic: ""
    };

    const [userData, setUserData] = useState(defaultData);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(defaultData);
    const [fileData, setFileData] = useState({ profilePic: null, coverPic: null });
    const [userId, setUserId] = useState(null);  // Estado para almacenar el userId

    // Simulamos que el usuario ha iniciado sesión y obtenemos el userId
    // En tu caso, debes obtener este valor de la respuesta del login
    useEffect(() => {
        const fetchUserId = async () => {
            // Este debería ser el userId de la sesión activa
            const userFromSession = JSON.parse(localStorage.getItem("user")) || {};
            setUserId(userFromSession.userID);  // Guarda el userId del usuario en el estado
        };

        fetchUserId();
    }, []);

    // Cargar datos del perfil
    useEffect(() => {
        if (userId) {
            const fetchProfile = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/perfil/${userId}`); // Usamos el userId dinámico
                    const { userID, email, user_key, profilePic, coverPic, expires } = response.data.profile;
                    setUserData({ userID, email, key: user_key, profilePic, coverPic, expires });
                    setFormData({ userID, email, key: user_key, expires });
                } catch (error) {
                    console.error('Error al cargar perfil:', error);
                }
            };

            fetchProfile();
        }
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files[0]) {
            setFileData({ ...fileData, [name]: files[0] });
        }
    };

    const saveChanges = async () => {
        const updatedFormData = new FormData();
        updatedFormData.append("userID", formData.userID);
        updatedFormData.append("email", formData.email);
        updatedFormData.append("key", formData.key);
        updatedFormData.append("expires", formData.expires);
        if (fileData.profilePic) updatedFormData.append("profilePic", fileData.profilePic);
        if (fileData.coverPic) updatedFormData.append("coverPic", fileData.coverPic);

        try {
            await axios.put(`http://localhost:3001/perfil/${userId}`, updatedFormData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Perfil actualizado correctamente");
            setUserData({ ...formData, profilePic: fileData.profilePic?.name, coverPic: fileData.coverPic?.name });
            setEditMode(false);
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
        }
    };

    return (
        <div className="perfil-container">
            {/* Portada */}
            <div className="cover">
                <img src={userData.coverPic ? `http://localhost:3001/uploads/${userData.coverPic}` : "https://via.placeholder.com/600x200"} alt="Portada" />
            </div>

            {/* Foto de perfil */}
            <div className="profile-section">
                <img className="profile-picture" src={userData.profilePic ? `http://localhost:3001/uploads/${userData.profilePic}` : "https://via.placeholder.com/100"} alt="Perfil" />
                <FaEdit className="edit-icon" onClick={() => setEditMode(true)} />
            </div>

            {/* Información */}
            <div className="user-info">
                <p><strong>UserID:</strong> {userData.userID}</p>
                <p><strong>Correo Electrónico:</strong> {userData.email}</p>
                <p><strong>Key:</strong> {userData.key}</p>
                <p className="expire-key"><strong>Expira:</strong> {userData.expires}</p>
            </div>

            {/* Modal de edición */}
            {editMode && (
                <div className="edit-modal">
                    <h3>Editar Perfil</h3>
                    <label>Cambiar Foto de Perfil:</label>
                    <input type="file" name="profilePic" accept="image/*" onChange={handleFileChange} />
                    
                    <label>Cambiar Portada:</label>
                    <input type="file" name="coverPic" accept="image/*" onChange={handleFileChange} />

                    <label>UserID:</label>
                    <input type="text" name="userID" value={formData.userID} onChange={handleInputChange} />
                    
                    <label>Correo Electrónico:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                    
                    <label>Key:</label>
                    <input type="text" name="key" value={formData.key} onChange={handleInputChange} />
                    
                    <label>Expira:</label>
                    <input type="text" name="expires" value={formData.expires} onChange={handleInputChange} />

                    <button onClick={saveChanges}>Guardar Cambios</button>
                    <button onClick={() => setEditMode(false)} className="close-btn">Cancelar</button>
                </div>
            )}
        </div>
    );
};

export default Perfil;
