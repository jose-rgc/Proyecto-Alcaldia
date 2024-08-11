const mongoose = require('mongoose');
//definir esquema
const funcionarioSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    carnet_identidad: Number,
    zona: String,
    cargo: String,
    haber: Number,
    Secretaria: String,
    documentos: String,
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'}
});
const FuncionarioModel = mongoose.model("Funcionario", funcionarioSchema, 'funcionario');
module.exports = FuncionarioModel;