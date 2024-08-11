const express = require('express');
const rutas = express.Router();
const FuncionarioModel = require('../models/funcionario');
const UsuarioModel = require('../models/Usuario');

//endpoint 1. traer todos los funcionarios
rutas.get('/traerFuncionarios', async (req, res) => {
    try {
        const funcionario = await FuncionarioModel.find();
        res.json(funcionario)
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
})
//endpoint 2. Crear un Nuevo Funcionario
rutas.post ('/crear', async (req, res) => {
    const funcionario = new FuncionarioModel({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        carnet_identidad: req.body.carnet_identidad,
        zona: req.body.zona,
        cargo: req.body.cargo,
        haber: req.body.haber,
        Secretaria: req.body.Secretaria,
        documentos: req.body.documentos,
        usuario: req.body.usuario //asignar el id del usuario
    })
    try {
        const nuevoFuncionario = await funcionario.save();
        res.status(201).json(nuevoFuncionario);
    }catch (error) {
        res.status(400).json({mensaje: error.message})
    }
});
//endopin 3. Editar datos de Funcionario
rutas.put('/editar/:id',async (req, res) => {
    try {
        const funcioanrioEditado = await FuncionarioModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!funcioanrioEditado)
            return res.status(404).json({ mensaje: 'Funcionario no entcontrado'});
        else
        return res.json(funcioanrioEditado);
    }catch (error) {
        res.status(400).json({mensaje: error.message})
    }
});
//endopion 4. Eliminar Funcionario
rutas.delete('/eliminar/:id', async (req, res) => {
    try {
        const funcionarioEliminado = await FuncionarioModel.findByIdAndDelete(req.params.id);
        if (!funcionarioEliminado)
            return res.status(404).json({ mensaje: 'Funcionario no entcontrado'});
        else
        return res.json({mensaje : 'Funcionario Eliminado'})
    } catch (error) { 
        res.status(500).json({mensaje: error.message})
    }
});
//endpoint 5. obtener funcionario por su ID
rutas.get('/funcionario/:id', async (req, res) => {
    try {
        const funcionario = await FuncionarioModel.findById(req.params.id);
        if (!funcionario)
            return res.status(404).json({ mensaje: 'Funcionario no encontrado'});
        else
            return res.json(funcionario);
        } catch(error){  
        return res.status(500).json({mensaje: error.message})
        }
    });
//endpoint 6. Obtener funcionario por su haber basico
rutas.get('/funcionarioPorHaber/:haber', async (req, res) =>{
    try {
        const funcionarios = await FuncionarioModel.find({ haber: req.params.haber});
        res.status(200).json(funcionarios);
    } catch(error) {
        res.status(500).json({mensaje: error.message})
    }
});
//endpoint 7. ELiminar todos los funcionarios
rutas.get('/eliminarTodos', async (req, res) => {
    try{
        await FuncionarioModel.deleteMany({});
        return res.json({mensaje: "Todos los funcionarios fueron eliminados"});
    } catch(error) {
        res.status(500).json({mensaje: error.message})
    }
});
//endpoint 8. Contar total de funcionarios
rutas.get('/totalFuncionarios', async (req, res) => {
    try {
        const total = await FuncionarioModel.countDocuments();
        return res.json({totalFuncionarios: total});
    } catch(error) {
        res.status(500).json({mensaje: error.message})
    }
});
//endpoint 9. Ordenar funcionarios por apellido ascendente
rutas.get('/ordenarFuncionarios', async (req, res) => {
    try {
        const funcionariosOrdenados = await FuncionarioModel.find().sort({ apellido: 1});
        res.status(200).json(funcionariosOrdenados);
    } catch(error) {
        res.status(500).json({mensaje: error.message})
    }
});

//Reportes 1
rutas.get('/funcionariosPorUsuario/:usuarioId', async (req, res) => {
    const {usuarioId} = req.params;
    console.log(usuarioId)
    try{
        const usuario = await UsuarioModel.findById(usuarioId);
        if(!usuario)
            return res.status(404).json({mensaje: 'Usuario no encontrado'});
        const funcionarios = await FuncionarioModel.find({ usuario: usuarioId }).populate('usuario');
        res.json(funcionarios)
    } catch(error) {
        res.status(500).json({mensaje: error.message})
    }
})
//reporte 2
//sumar todos los haberes por usuario
rutas.get('/haberPorUsuario', async (req, res) => {
    try {
        const usuarios = await UsuarioModel.find();
        const reporte = await Promise.all(
            usuarios.map( async (usuario1) => {
                const funcionarios = await FuncionarioModel.find({ usuario: usuario1._id });
                const totalHaber = funcionarios.reduce((sum, funcionario) => sum + funcionario.haber, 0);
                return {
                    usuario: {
                        _id: usuario1._id,
                        nombreusuario: usuario1.nombreusuario
                    },
                    totalHaber,
                    funcionarios: funcionarios.map(r => ({
                        _id: r._id,
                        nombre: r.nombre,
                        apellido: r.apellido,
                        cargo: r.cargo,
                        haber: r.haber, 
                    }))
                }
            })
        )
        res.json(reporte);
    } catch(error) {
        res.status(500).json({mensaje: error.message})
    }
})
module.exports = rutas;