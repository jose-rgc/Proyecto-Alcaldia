//importacion de librerias
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRutas = require('./rutas/authRutas');
const Usuario = require('./models/Usuario')
require('dotenv'). config();
const app = express();
// Lista de tokens inválidos
let invalidTokens = [];
//rutas
const funcionarioRutas = require('./rutas/funcionarioRutas');
//configuracion de enviroment
const PORT = process.env.PORT || 3200;
const MONGO_URI = process.env.MONGO_URI;
// manejo de JSON
app.use(express.json());
//Conexion con la base de datos MongoDB
mongoose.connect(MONGO_URI)
.then(
    () => {
        console.log('Conexion exitosa')
        app.listen(PORT, () => {console.log("Servidor express corriendo en el puerto " + PORT)})
    }
).catch( error => console.log('error de conexion', error));

const autenticar = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            res.status(401).json({mensaje: 'No existe el token de autentificacion'});
        if (invalidTokens.includes(token)) {
            return res.status(401).json({ mensaje: 'Token inválido!' });
        }
        const decodificar = jwt.verify(token, 'clave_secreta');
        req.usuario = await Usuario.findById(decodificar.usuarioId);
        next();
    }
    catch(error){
        res.status(400).json({ error: 'token invalido!!'})
    }
};
// Ruta para cerrar sesión
app.post('/auth/cerrarsesion', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        invalidTokens.push(token);
    }
    res.status(200).json({ mensaje: 'Sesión cerrada exitosamente' });
});
app.use('/auth', authRutas);
app.use('/funcionarios', autenticar, funcionarioRutas);

//utilizar las rutas de funcionarios
//app.use('/funcionarios', funcionarioRutas)