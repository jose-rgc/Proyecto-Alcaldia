const express = require('express');
const rutas = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Registro
rutas.post('/registro', async (req, res) => {
    try {
        const { nombreusuario, correo, contrasenia} = req.body;
        const usuario = new Usuario({ nombreusuario, correo, contrasenia});
        await usuario.save();
        res.status(201).json({mensaje: 'Usuario Registrado'});
    }
    catch(error){
        res.status(500).json({mensaje: error.message});
    }
});
//Iniciar Sesion
rutas.post('/iniciarsesion', async (req, res) => {
    try {
        const { correo, contrasenia} = req.body;
        const usuario = await Usuario.findOne({ correo });
        if(!usuario)
            return res.status(401).json({error: 'Correo Invalido!!!'});
        const validarContrasenia = await usuario.compararContrasenia(contrasenia);
        if(!validarContrasenia)
            return res.status(401).json({error: 'Contrasenia Invalido!!!'});
        //Creacion token
        const token = jwt.sign({ usuarioId: usuario._id}, 'clave_secreta', {expiresIn: '5h'});
        res.json({token});
    }
    catch(error){
        res.status(500).json({mensaje: error.message});
    } 
}); 
rutas.post('/cerrarsesion', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        invalidTokens.push(token);
    }
    res.status(200).json({ mensaje: 'Sesión cerrada exitosamente' });
});
module.exports = rutas;