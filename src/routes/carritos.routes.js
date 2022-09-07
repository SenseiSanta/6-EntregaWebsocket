/* ============= INICIO DE ROUTEO ============= */
const express = require('express');
const routerCarritos = express.Router();
const Contenedor = require('../pages/Contenedor.js')

/* ============ Creacion de objeto ============ */
const cajaCarritos = new Contenedor('DB/carts.json');
const cajaProductos = new Contenedor('DB/products.json');

/* ============= Routing y metodos ============= */
routerCarritos.post('/', async (req, res) => {
    res.status(200).send(await cajaCarritos.save( {productos: []} ));
})

routerCarritos.delete('/:id', async (req, res) => {
    const id = parseInt(req.params['id']);
    const eliminado = await cajaCarritos.deleteById(id)
    if (eliminado) {
        res.status(200).json({msg: 'Eliminado con exito'});
    } else {
        res.status(400).json({error: `No se elimino nada: Carrito #${id} no encontrado`})
    }
})

routerCarritos.get('/:id/productos', async (req, res) => {
    const id = parseInt(req.params['id']);
    const carrito = await cajaCarritos.getById(id);
    res.status(200).json(carrito.productos)
}) 

routerCarritos.post('/:id/productos', async (req, res) => {
    const id = parseInt(req.params['id']);
    const carrito = await cajaCarritos.getById(id);
    const producto = await cajaProductos.getById(req.body.id);
    carrito.productos.push(producto)
    await cajaCarritos.updateCart(carrito, id)
    res.status(200).json({msg: "Agregado exitosamente",
                        obj: carrito});
})

routerCarritos.delete('/:id/productos/:id_prod', async (req, res) => {
    const idCart = parseInt(req.params['id']);
    const idProd = parseInt(req.params['id_prod']);
    const carrito = await cajaCarritos.getById(idCart);
    const producto = await cajaProductos.getById(idProd);
    const eliminado = await cajaCarritos.deleteProductById(carrito, producto)
    if (eliminado) {
        res.status(200).json({msg: 'Eliminado con exito'});
    } else {
        res.status(400).json({error: 'No se elimino nada: Producto no encontrado'})
    }
})

/* ============= Error de Routing ============= */
routerCarritos.get('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})
routerCarritos.post('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})
routerCarritos.delete('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})
routerCarritos.put('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})

/* =========== Exportacion de modulo =========== */
module.exports = routerCarritos;