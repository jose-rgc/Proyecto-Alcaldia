const express = require('express');
const request = require('supertest');
const funcionarioRutas = require('../../rutas/funcionarioRutas');
const FuncionarioModel = require('../../models/Funcionario');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use('/funcionarios', funcionarioRutas);

describe('Pruebas Unitarias para Funcionarios', () => {
//Se ejecuta antes de iniciar las pruebas
    beforeEach(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/appfuncionarios',{
            useNewUrlParser : true,
        });
        await FuncionarioModel.deleteMany({});
    });
    //Al finalizar las pruebas
    afterAll(() => {
        return mongoose.connection.close();
    });
//1er Test
test('Deberia traer todos los funcionarios: GET: traerFuncionarios', async() =>{
    await FuncionarioModel.create({nombre: 'Rosaicela', apellido: 'Isla Chura', carnet_identidad: 8536984,
        zona: 'San Roque', cargo: 'Secretaria', haber: 3200, Secretaria: 'Secretaria Administrativa y Financiera',
        documentos: 'completo' });
    await FuncionarioModel.create({nombre: 'Lia', apellido: 'Carrasco Serrudo', carnet_identidad: 10502630,
        zona: 'Vila Victoria', cargo: 'Bienestar Social', haber: 6200, Secretaria: 'Secretaria Administrativa y Financiera',
        documentos: 'completo' });
        //solicitud - request
        const res = await request(app).get('/funcionarios/traerFuncionarios');
        //verificar la respuesta
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
},10000);

 test('Deberia agregar un nuevo Funcionario: POST: /crear', async() => {
    const nuevoFuncionario = {
        nombre: 'German',
        apellido: 'Jorge Mamani',
        carnet_identidad: 8652034,
        zona: 'Villa Canterias',
        cargo: 'Director de Recursos Humanos',
        haber: 10000,
        Secretaria: 'Secretaria Administrativa y Financiera',
        documentos: 'completo'
    };
    const res = await request(app)
                            .post('/funcionarios/crear')
                            .send(nuevoFuncionario);
    expect(res.statusCode).toEqual(201);
    expect(res.body.nombre).toEqual(nuevoFuncionario.nombre);
 });

 test('Deberia actualizar una tarea que ya existe: PUT /editar/:id', async()=>{
    const funcionarioCreado = await FuncionarioModel.create(
                            {nombre: 'Lia', 
                            apellido: 'Carrasco Serrudo', 
                            carnet_identidad: 10502630,
                            zona: 'Vila Victoria',
                            cargo: 'Bienestar Social', 
                            haber: 6200, 
                            Secretaria: 'Secretaria Administrativa y Financiera',
                            documentos: 'completo' });
    const funcionarioActualizar ={
        nombre: 'Lia (editable)',
        apellido: 'Carrasco Serrudo (editado)',
        haber: 7500 
    };
    const res = await request(app)
                            .put('/funcionarios/editar/'+funcionarioCreado._id)
                            .send(funcionarioActualizar);
    expect(res.statusCode).toEqual(200);
    expect(res.body.nombre).toEqual(funcionarioActualizar.nombre);
 })

 test('Deberia eliminar una funcionario existente: DELETE /eliminar/:id', async()=>{
    const funcionarioCreado = await FuncionarioModel.create(
        {nombre: 'Lia', 
        apellido: 'Carrasco Serrudo', 
        carnet_identidad: 10502630,
        zona: 'Vila Victoria',
        cargo: 'Bienestar Social', 
        haber: 6200, 
        Secretaria: 'Secretaria Administrativa y Financiera',
        documentos: 'completo' });

    const res = await request(app)
                        .delete('/funcionarios/eliminar/' + funcionarioCreado._id)
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({mensaje:'Funcionario Eliminado'});
 })
});