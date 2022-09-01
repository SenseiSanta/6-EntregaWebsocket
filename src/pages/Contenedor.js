const fs = require('fs/promises');

class Contenedor {
    constructor(archivo) {
        this.archivo = archivo;
    }

    addId(arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i].id = i+1;
        }
        return arr
    }

    async getAll () {
        try {
            const objs = JSON.parse(await fs.readFile(this.archivo, 'utf-8'), null, 2);
            const objsWiD = objs;
            this.addId(objsWiD)
            return objsWiD;
        }
        catch(error) {
            console.log(error)
        }
    }

    async save(obj) {
        try {
            const objs = JSON.parse(await fs.readFile(this.archivo, 'utf-8'), null, 2);
            objs.push(obj)
             
            await fs.writeFile(this.archivo, JSON.stringify(objs, null, 2))
            return 'Aniadido con exito';

        } catch (error) {
            console.log(error)
        }
    }

    async getById(id) {
        try {
            const objs = JSON.parse(await fs.readFile(this.archivo, 'utf-8'), null, 2);
            const objsWiD = JSON.parse(await fs.readFile(this.archivo, 'utf-8'), null, 2);
            this.addId(objsWiD);
            const indexObj = objsWiD.findIndex((o)=> o.id == id);

            if (indexObj == -1) {
                throw new Error('Objeto no encontrado, intente con otro numero de identificacion')
            } 
            return objsWiD[indexObj];

        } catch (error) {
            console.log(error)
            return {error: 'Producto no encontrado'}
        }
    }

    async deleteById(id) {
        try {
            const objs = JSON.parse(await fs.readFile(this.archivo, 'utf-8'), null, 2);
            const objsWiD = JSON.parse(await fs.readFile(this.archivo, 'utf-8'), null, 2);
            this.addId(objsWiD);
            const indexObj = objsWiD.findIndex((o)=> o.id == id);
            
            if (indexObj == -1) {
                throw new Error('Objeto no encontrado, intente con otro numero de identificacion')
            } else {
                objs.splice(indexObj, 1)
            }
            console.log(objs)

            await fs.writeFile(this.archivo, JSON.stringify(objs, null, 2))
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async updateById(id, producto, precio, img) {
        try {
            const objs = JSON.parse(await fs.readFile(this.archivo, 'utf-8'), null, 2);
            const objsWiD = JSON.parse(await fs.readFile(this.archivo, 'utf-8'), null, 2);
            this.addId(objsWiD);
            const indexObj = objsWiD.findIndex((o)=> o.id == id);
            
            if (indexObj == -1) {
                throw new Error('Objeto no encontrado, intente con otro numero de identificacion')
            } else {
                objs[indexObj].producto = producto;
                objs[indexObj].precio = precio;
                objs[indexObj].img = img;
            }
            console.log(objs)

            await fs.writeFile(this.archivo, JSON.stringify(objs, null, 2))
            return true

        } catch (error) {
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