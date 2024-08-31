import express from "express";
import CartManager from "../dao/db/cart-manager-db.js";

const router = express.Router();
const cartManager = new CartManager();

// Crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.crearCarrito();
        res.status(201).json(newCart);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Obtener todos los carritos
router.get("/carts", async (req, res) => {
    try {
        const carritos = await cartManager.obtenerCarritos();
        res.json({ carritos });
    } catch (error) {
        console.error("Error al obtener los carritos:", error);
        res.status(500).json({ error: "No se pudieron obtener los carritos" });
    }
});

// Obtener un carrito por ID
router.get("/:cid", async (req, res) => {
    const carritoId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(carritoId);
        if (!carrito) {
            return res.status(404).json({error: "Carrito no encontrado"});
        }
        res.json(carrito.products);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({error: "No se pudo obtener el carrito" });
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
        console.error("Error al agregar el producto al carrito", error);
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

// Actualizar carrito con un array de productos
router.put("/:cid", async (req, res) => {
    const carritoId = req.params.cid;
    const productos = req.body.products;

    try {
        const carritoActualizado = await cartManager.actualizarCarrito(carritoId, productos);
        if (carritoActualizado) {
            res.json({ message: "Carrito actualizado", data: carritoActualizado.products });
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        res.status(500).json({ error: "No se pudo actualizar el carrito" });
    }
});

// Actualizar cantidad de un producto en el carrito
router.put("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: "Cantidad invalidad, elija una cantidad positiva y mayor a 0" });
    }

    try {
        const updatedCart = await cartManager.actualizarCantidadProducto(cartId, productId, quantity);
        res.json(updatedCart.products);
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Eliminar un producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    const cartid = req.params.cid
    const prodid = req.params.pid;
    try {
        const carrito = await cartManager.eliminarProductoDelCarrito(cartid, prodid);
        res.send({ message: "Producto eliminado del carrito", carrito });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

// Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.eliminarTodosLosProductos(cartId);
        res.send({ message: "Carrito vacío", carrito: cart});
    } catch (error) {
        console.log(`Error al intentar vaciar el carrito con el ID: ${cartId}`);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
