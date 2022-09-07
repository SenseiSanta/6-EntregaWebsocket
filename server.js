/*=================== MODULOS ===================*/
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const morgan = require('morgan')
const Contenedor = require('./src/pages/Contenedor')
const { Server: Httpserver } = require('http')
const { Server: Ioserver } = require('socket.io')


/*=== Instancia de Server, contenedor y rutas ===*/
const app = express();
const httpServer = new Httpserver(app)
const io = new Ioserver(httpServer)
const cajaMensajes = new Contenedor('./DB/messages.json');
const routerProductos = require('./src/routes/productos.routes.js')
const routerCarritos = require('./src/routes/carritos.routes.js')
const routerInitial = require('./src/routes/initial.routes.js')


/*================= Middlewears =================*/
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(express.static(__dirname + './public'))


/*============= Motor de plantillas =============*/
app.engine('hbs', exphbs.engine({
    defaulyLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')


/*==================== Rutas ====================*/
app.use('/', routerInitial)
app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarritos);
app.use('*', (req, res) => {
    res.send({error: 'Producto no encontrado'})
})

/*================== Servidor ==================*/
const PORT = 8080;
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en el servidor: ${error}`))

/*================== Websocket ==================*/
io.on('connection', async (socket)=>{
    const DB_MENSAJES = await cajaMensajes.getAll()
    console.log(`Nuevo cliente conectado -> ID: ${socket.id}`)
    io.sockets.emit('from-server-message', DB_MENSAJES)
    
    socket.on('from-client-message', async mensaje => {
        await cajaMensajes.save(mensaje)
        io.sockets.emit('from-server-message', DB_MENSAJES)
    })
})