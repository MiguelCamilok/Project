import React, { useState, useEffect } from "react";
import "../../styles/perfil.css";
import { FaEdit } from "react-icons/fa";
import axios from "axios";

const Perfil = () => {
    const defaultData = {
        userID: "N/A",
        email: "N/A",
        user_key: "N/A",
        expires: "N/A",
        profilePic: "",
        coverPic: ""
    };

    const [userData, setUserData] = useState(defaultData);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(defaultData);
    const [fileData, setFileData] = useState({ profilePic: null, coverPic: null });
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const userFromSession = JSON.parse(localStorage.getItem("user"));
        if (userFromSession && userFromSession.id) {
            setUserId(userFromSession.id);
            fetchProfile(userFromSession.id);
        }
    }, []);

    const fetchProfile = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3001/perfil/${id}`);
            if (response.status === 200) {
                setUserData(response.data.profile);
            }
        } catch (error) {
            console.error("Error al obtener perfil:", error);
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setFileData({ ...fileData, [name]: files[0] });
            setFormData({ ...formData, [name]: URL.createObjectURL(files[0]) });
        }
    };

    return (
        <div className="perfil-container">
            <div className="cover">
                <img src={formData.coverPic || (userData.coverPic ? `http://localhost:3001/uploads/${userData.coverPic}` : "https://via.placeholder.com/600x200")} alt="Portada" />
            </div>

            <div className="profile-section">
                <img className="profile-picture" src={formData.profilePic || (userData.profilePic ? `http://localhost:3001/uploads/${userData.profilePic}` : "https://via.placeholder.com/100")} alt="Perfil" />
                <FaEdit className="edit-icon" onClick={() => setEditMode(true)} />
            </div>

            <div className="user-info">
                <p><strong>UserID:</strong> {userData.userID}</p>
                <p><strong>Correo Electrónico:</strong> {userData.email}</p>
                <p><strong>Key:</strong> {userData.user_key}</p>
                <p className="expire-key"><strong>Expira:</strong> {new Date(userData.expires).toLocaleDateString("es-ES")}</p>
            </div>

            {editMode && (
                <div className="edit-profile">
                    <h3>Editar Perfil</h3>
                    <input type="file" name="profilePic" accept="image/*" onChange={handleFileChange} />
                    <input type="file" name="coverPic" accept="image/*" onChange={handleFileChange} />
                    <button onClick={() => setEditMode(false)}>Cerrar</button>
                </div>
            )}
        </div>
    );
};

export default Perfil;
