import express from "express";
const router = express.Router();
import CartManager from "../dao/db/cart-manager-db";
import ProductManager from "../dao/db/product-manager-db.js";

const cartManager = new CartManager();
const productManager = new ProductManager();


//Metodo para crear un nuevo carrito: 

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
})

//Metodo para listar los productos que pertenezcan al carrito con el id = cid.

router.get("/:cid", async (req, res) => {
    const carritoID = parseInt(req.params.cid);
    try {
        const carritoBuscado = await cartManager.getCarritoById(carritoID);
        res.json(carritoBuscado.products);
    } catch (error) {
        res.status(500).send("Error del servidor, carrito no encontrado");
    }
})

//Metodo para agregar el producto con id pid al carrito con el id cid: 

router.post("/:cid/product/:pid", async (req, res) => {
    const carritoId = parseInt(req.params.cid);
    const productoId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const carritoActualizado = await cartManager.agregarProductoAlCarrito(carritoId, productoId, quantity);
        res.json(carritoActualizado.products);
    } catch (error) {
        res.status(500).send(`Error al ingresar un producto al carrito ${carritoId}`);
    }
});

// Metodo para eliminar un producto de un carrito
router.delete("/:cid/product/:pid/:quantity", async (req, res) => {
    const { cid, pid, quantity } = req.params;
    try {
        // Verifica si el producto existe
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ status: "Error", msg: `No se encontró el producto con el id ${pid}` });
        }

        // Verifica si el carrito existe
        const cart = await cartManager.getCarritoById(cid);
        if (!cart) {
            return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });
        }

        // Llama al método para eliminar el producto del carrito
        const cartUpdate = await cartManager.deleteProductToCart(cid, pid, parseInt(quantity));
        res.status(200).json({ status: "success", payload: cartUpdate });
    } catch (error) {
        res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
    }
});


// Metodo para actualizar la cantidad de un producto en un carrito
router.put("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ status: "Error", msg: "La cantidad debe ser un número positivo" });
    }
    try {
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ status: "Error", msg: `No se encontró el producto con el id ${pid}` });
        }
        const cart = await cartManager.getCarritoById(cid);
        if (!cart) {
            return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });
        }
        const cartUpdate = await cartManager.updateQuantityProductInCart(cid, pid, Number(quantity));
        res.status(200).json({ status: "success", payload: cartUpdate });
    } catch (error) {
        res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
    }
});

// Metodo para eliminar todos los productos de un carrito
router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.clearProductsToCart(cid);
        if (!cart) {
            return res.status(404).json({ status: "Error", msg: "Carrito no encontrado" });
        }
        res.status(200).json({ status: "success", cart });
    } catch (error) {
        res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
    }
});

export default router; 