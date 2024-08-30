import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Renderizar la vista de productos en tiempo real
router.get("/realtimeproducts", (req, res) => {
    try {
        res.render("realtimeproducts");
    } catch (error) {
        console.error("Error al renderizar la vista de productos en tiempo real:", error);
        res.status(500).json({
            success: false,
            message: "No se pudo cargar la vista de productos en tiempo real"
        });
    }
});

// Mostrar todos los productos con paginación y ordenamiento
router.get("/products", async (req, res) => {
    const { page = 1, limit = 9, sort = 'asc' } = req.query;
    const opciones = {
        page: parseInt(page, 9),
        limit: parseInt(limit, 9),
        sort: { price: sort === 'asc' ? 1 : -1 }
    };

    try {
        const productos = await productManager.getProducts({}, opciones);
        res.render("home", { productos: productos.docs, ...productos });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({
            success: false,
            message: "No se pudieron obtener los productos"
        });
    }
});

// Mostrar los productos de un carrito específico
router.get("/carts/:cid", async (req, res) => {
    const carritoId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(carritoId);

        if (!carrito) {
            console.log("Carrito no encontrado");
            return res.status(404).json({
                success: false,
                message: "Carrito no encontrado"
            });
        }

        const productosEnCarrito = carrito.products.map(item => ({
            product: item.product.toObject(),
            quantity: item.quantity
        }));

        res.render("carts", { productos: productosEnCarrito });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({
            success: false,
            message: "No se pudo obtener el carrito"
        });
    }
});

export default router;
