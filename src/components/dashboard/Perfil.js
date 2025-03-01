import React, { useState, useEffect, useRef } from "react";
import "../../styles/perfil.css";
import { FaEdit, FaTimes, FaSave } from "react-icons/fa";
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
    const modalRef = useRef(null);

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

    const handleSave = async () => {
        if (!userId) return;

        const formDataToSend = new FormData();
        if (fileData.profilePic) formDataToSend.append("profilePic", fileData.profilePic);
        if (fileData.coverPic) formDataToSend.append("coverPic", fileData.coverPic);

        try {
            await axios.put(`http://localhost:3001/perfil/${userId}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            fetchProfile(userId);
            setEditMode(false);
            setFileData({ profilePic: null, coverPic: null });
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
        }
    };

    const handleClose = () => {
        setEditMode(false);
        setFormData((prevData) => ({
            ...prevData,
            profilePic: fileData.profilePic ? userData.profilePic : prevData.profilePic,
            coverPic: fileData.coverPic ? userData.coverPic : prevData.coverPic,
        }));
        setFileData({ profilePic: null, coverPic: null });
    };

        // Permitir que el modal sea movible
        useEffect(() => {
            const modal = modalRef.current;
            if (!modal) return;
    
            let isDragging = false, startX, startY, initialX, initialY;
    
            const handleMouseDown = (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialX = modal.offsetLeft;
                initialY = modal.offsetTop;
            };
    
            const handleMouseMove = (e) => {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                modal.style.left = `${initialX + dx}px`;
                modal.style.top = `${initialY + dy}px`;
            };
    
            const handleMouseUp = () => {
                isDragging = false;
            };
    
            modal.addEventListener("mousedown", handleMouseDown);
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
    
            return () => {
                modal.removeEventListener("mousedown", handleMouseDown);
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }, [editMode]);
    
    return (
        <div className="perfil-container">
            <div className="cover">
                <img src={fileData.coverPic ? formData.coverPic : (userData.coverPic ? `http://localhost:3001/uploads/${userData.coverPic}` : "https://via.placeholder.com/600x200")} alt="Portada" />
            </div>

            <div className="profile-section">
                <img className="profile-picture" src={fileData.profilePic ? formData.profilePic : (userData.profilePic ? `http://localhost:3001/uploads/${userData.profilePic}` : "https://via.placeholder.com/100")} alt="Perfil" />
                <FaEdit className="edit-icon" onClick={() => setEditMode(true)} />
            </div>

            <div className="user-info">
                <p><strong>UserID:</strong> {userData.userID}</p>
                <p><strong>Correo Electrónico:</strong> {userData.email}</p>
                <p><strong>Key:</strong> {userData.user_key}</p>
                <p className="expire-key"><strong>Expira:</strong> {new Date(userData.expires).toLocaleDateString("es-ES")}</p>
            </div>

            {editMode && (
                <div ref={modalRef} className="edit-modal">
                    <h3>Editar Perfil</h3>
                    <label>Cambiar Foto de Perfil</label>
                    <input type="file" name="profilePic" accept="image/*" onChange={handleFileChange} />

                    <label>Cambiar Portada</label>
                    <input type="file" name="coverPic" accept="image/*" onChange={handleFileChange} />

                    <div className="modal-buttons">
                        <button className="close-btn" onClick={handleClose}><FaTimes /> Cerrar</button>
                        <button className="save-btn" onClick={handleSave}><FaSave /> Guardar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Perfil;
