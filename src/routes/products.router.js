import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";
const manager = new ProductManager();
const router = express.Router();

//Metodo para mostrar todos los productos:
router.get("/", async (req, res) => {
    const limit = req.query.limit;
    try {
        const arrayProductos = await manager.getProducts();
        if (limit) {
            res.send(arrayProductos.slice(0, limit));
        } else {
            res.send(arrayProductos);
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
})

//Metodo que busca un producto por su id: 
router.get("/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        const producto = await manager.getProductById(parseInt(id));

        if (!producto) {
            res.send("Producto no encontrado");
        } else {
            res.send(producto);
        }
    } catch (error) {
        res.send("ID de producto no existente");
    }
})


//Metodo para agregar un nuevo producto: 
router.post("/", async (req, res) => {
    const nuevoProducto = req.body;    
    try {
        await manager.addProduct(nuevoProducto); 

        res.status(201).send("Producto agregado exitosamente"); 
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
})

// Método para actualizar el producto con la id = pid:
router.put("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const productoActualizado = req.body;
    try {
        const productoExistente = await manager.getProductById(id);
        if (!productoExistente) {
            return res.status(404).send("Producto no encontrado");
        }
        const productoModificado = { ...productoExistente, ...productoActualizado };
        await manager.updateProduct(id, productoModificado);
        res.send("Producto actualizado exitosamente");
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Método para eliminar el producto con la id = pid:
router.delete("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    try {
        const productoExistente = await manager.getProductById(id);
        if (!productoExistente) {
            return res.status(404).send("Producto no encontrado");
        }
        await manager.deleteProduct(id);
        res.send("Producto eliminado exitosamente");
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

export default router; 