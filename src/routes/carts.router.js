import express from "express";
import CartManager from "../dao/db/cart-manager-db.js";

const router = express.Router();
const cartManager = new CartManager();

// Crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json({ success: true, data: nuevoCarrito });
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).json({ success: false, error: "No se pudo crear el carrito" });
    }
});

// Obtener todos los carritos
router.get("/", async (req, res) => {
    try {
        const carritos = await cartManager.obtenerCarritos();
        res.json({ success: true, data: carritos });
    } catch (error) {
        console.error("Error al obtener los carritos:", error);
        res.status(500).json({ success: false, error: "No se pudieron obtener los carritos" });
    }
});

// Obtener un carrito por ID
router.get("/:cid", async (req, res) => {
    const carritoId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(carritoId);
        if (carrito) {
            res.json({ success: true, data: carrito.products });
        } else {
            res.status(404).json({ success: false, error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ success: false, error: "No se pudo obtener el carrito" });
    }
});

// Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const carritoId = req.params.cid;
    const productoId = req.params.pid;
    const cantidad = req.body.quantity || 1;

    try {
        const carritoActualizado = await cartManager.agregarProductoAlCarrito(carritoId, productoId, cantidad);
        if (carritoActualizado) {
            res.json({ success: true, data: carritoActualizado.products });
        } else {
            res.status(404).json({ success: false, error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        res.status(500).json({ success: false, error: "No se pudo agregar el producto al carrito" });
    }
});

// Eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    const carritoId = req.params.cid;
    const productoId = req.params.pid;

    try {
        const carritoActualizado = await cartManager.eliminarProductoDelCarrito(carritoId, productoId);
        if (carritoActualizado) {
            res.json({ success: true, data: carritoActualizado.products });
        } else {
            res.status(404).json({ success: false, error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        res.status(500).json({ success: false, error: "No se pudo eliminar el producto del carrito" });
    }
});

// Actualizar carrito completo
router.put("/:cid", async (req, res) => {
    const carritoId = req.params.cid;
    const productos = req.body.products;

    try {
        const carritoActualizado = await cartManager.actualizarCarrito(carritoId, productos);
        if (carritoActualizado) {
            res.json({ success: true, data: carritoActualizado.products });
        } else {
            res.status(404).json({ success: false, error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        res.status(500).json({ success: false, error: "No se pudo actualizar el carrito" });
    }
});

// Actualizar cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
    const carritoId = req.params.cid;
    const productoId = req.params.pid;
    const cantidad = req.body.quantity;

    try {
        const carritoActualizado = await cartManager.actualizarCantidadProducto(carritoId, productoId, cantidad);
        if (carritoActualizado) {
            res.json({ success: true, data: carritoActualizado.products });
        } else {
            res.status(404).json({ success: false, error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito:", error);
        res.status(500).json({ success: false, error: "No se pudo actualizar la cantidad del producto" });
    }
});

// Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
    const carritoId = req.params.cid;

    try {
        const carritoActualizado = await cartManager.eliminarTodosLosProductos(carritoId);
        if (carritoActualizado) {
            res.json({ success: true, data: carritoActualizado.products });
        } else {
            res.status(404).json({ success: false, error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al eliminar todos los productos del carrito:", error);
        res.status(500).json({ success: false, error: "No se pudieron eliminar los productos del carrito" });
    }
});

export default router;
