const fs = require('fs/promises');

class Contenedor {
    constructor(archivo) {
        this.archivo = archivo;
    }

    async getAll () {
        try {
            const objs = JSON.parse(await fs.readFile(this.archivo, 'utf-8'), null, 2);
            return objs;
        }
        catch(error) {
            console.log(error)
        }
    }

    async save(obj) {
        try {
            const objs = JSON.parse(await fs.readFile(this.archivo, 'utf-8'), null, 2);
            const fecha = new Date().toLocaleString('es-AR')
            let newId
            if (objs.length == 0) {
                newId = 1
            } else {
                newId = objs[objs.length -1].id + 1
            }

            const newObj = { id: newId, timestamp: fecha, ...obj}
            objs.push(newObj)

            await fs.writeFile(this.archivo, JSON.stringify(objs, null, 2))
            return {
                status: 'Aniadido con exito',
                id: newObj.id
            };

        } catch (error) {
            console.log(error)
        }
    }

    async getById(id) {
        try {
            const objs = JSON.parse(await fs.readFile(this.archivo, 'utf-8'), null, 2);
            const indexObj = objs.findIndex((o)=> o.id == id);

            if (indexObj == -1) {
                throw new Error('Objeto no encontrado, intente con otro numero de identificacion')
            } 
            return objs[indexObj];

        } catch (error) {
            console.log(error)
            return {error: 'Objeto no encontrado'}
        }
    }

    async deleteById(id) {
        try {
            const objs = JSON.parse(await fs.readFile(this.archivo, 'utf-8'), null, 2);
            const indexObj = objs.findIndex((o)=> o.id == id);
            
            if (indexObj == -1) {
                throw new Error('Objeto no encontrado, intente con otro numero de identificacion')
            } else {
                objs.splice(indexObj, 1)
            }

            await fs.writeFile(this.archivo, JSON.stringify(objs, null, 2))
            return true

        } catch (error) {
            console.log(error)
            return false
        }
    }

    async updateCart(obj, id) {
        try {
            const objs = JSON.parse(await fs.readFile(this.archivo, 'utf-8'), null, 2);
            const indexObj = objs.findIndex((o)=> o.id == id);
            objs[indexObj] = obj

            await fs.writeFile(this.archivo, JSON.stringify(objs, null, 2))
            return {
                status: 'Aniadido con exito',
                carrito: objs.id
            };

        } catch (error) {
            console.log(error)
        }
    }

    async updateById(id, producto, descripcion, codigo, stock, precio, img) {
        try {
            const objs = JSON.parse(await fs.readFile(this.archivo, 'utf-8'), null, 2);
            const indexObj = objs.findIndex((o)=> o.id == id);
            
            if (indexObj == -1) {
                throw new Error('Objeto no encontrado, intente con otro numero de identificacion')
            } else {
                objs[indexObj].producto = producto;
                objs[indexObj].descripcion = descripcion;
                objs[indexObj].codigo = codigo;
                objs[indexObj].stock = stock;
                objs[indexObj].precio = precio;
                objs[indexObj].img = img;
            }

            await fs.writeFile(this.archivo, JSON.stringify(objs, null, 2))
            
            return true

        } catch (error) {
            console.log(error)
            return false
        }
    }

    async deleteProductById (carrito, producto) {
        try{
            const objs = JSON.parse(await fs.readFile(this.archivo, 'utf-8'), null, 2);
            const indexObj = objs.findIndex((o)=> o.id == carrito.id);
    
            if (indexObj == -1) {
                throw new Error('Objeto no encontrado, intente con otro numero de identificacion')
            } else if (objs[indexObj].productos) {
                const indexProd = carrito.productos.findIndex((o)=> o.id == producto.id);
                objs[indexObj].productos.splice(indexProd, 1)
            } else {
                throw new Error('El carrito no tiene este producto')
            }
    
            await fs.writeFile(this.archivo, JSON.stringify(objs, null, 2))
            return true
        }
        catch(error) {
            console.log(error)
            return false
        }
    }

    async deleteAll() {
        try {
            const objs = await this.getAll();
            
            if (objs == undefined) {
                return 'No hay nada que eliminar'
            } else {
                await fs.writeFile(this.archivo, JSON.stringify([], null, 2))
                return 'Archivo reiniciado. Ya no hay elementos en el documento json'
            }
            
        } catch (error) {
            return 'Error: No se pudo eliminar'
        }
    }
}

module.exports = Contenedor;