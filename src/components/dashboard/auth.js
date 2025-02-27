// auth.js - Manejo de autenticación
const usuarios = [
    { correo: "admin@example.com", password: "123456", key: "OPTIMIZER2024" }
];

export const autenticarUsuario = (correo, password, key) => {
    return usuarios.some(user => user.correo === correo && user.password === password && user.key === key);
};