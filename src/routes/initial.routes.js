/* ============= INICIO DE ROUTEO ============= */
const express = require('express');
const routerInitial = express.Router();
const Contenedor = require('../pages/Contenedor.js')

/* ============ Creacion de objeto ============ */
const caja = new Contenedor('DB/products.json');

/* ============= Routing y metodos ============= */
routerInitial.get('/', async (req, res) => {
    const DB_PRODUCTOS = await caja.getAll()
    const DB_MENSAJES = await caja.getAll()
    res.render('vista', {DB_PRODUCTOS, DB_MENSAJES})
})

routerInitial.post('/', async (req, res) => {
    const DB_PRODUCTOS = await caja.getAll()
    res.render('vista', {DB_PRODUCTOS})
})

/* ============= Error de Routing ============= */
routerInitial.get('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})
routerInitial.post('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})
routerInitial.delete('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})
routerInitial.put('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})

/* =========== Exportacion de modulo =========== */
module.exports = routerInitial;