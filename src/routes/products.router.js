import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";

const router = express.Router();
const productManager = new ProductManager();

// Listar todos los productos con paginación, límite, filtro y ordenamiento
router.get("/", async (req, res) => {
    try {
        const { limit = 9, page = 1, sort, query } = req.query;
        const filtro = {};

        // Construir el filtro basado en la query
        if (query) {
            const filtroObject = JSON.parse(query);
            Object.assign(filtro, filtroObject);
        }

        // Construir el orden basado en el sort
        const opcionesOrden = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

        const opciones = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: opcionesOrden
        };

        const resultado = await productManager.getProducts(filtro, opciones);

        const respuesta = {
            status: "success",
            payload: resultado.docs,
            totalPages: resultado.totalPages,
            prevPage: resultado.hasPrevPage ? resultado.prevPage : null,
            nextPage: resultado.hasNextPage ? resultado.nextPage : null,
            page: resultado.page,
            hasPrevPage: resultado.hasPrevPage,
            hasNextPage: resultado.hasNextPage,
            prevLink: resultado.hasPrevPage ? `/api/products?limit=${limit}&page=${resultado.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: resultado.hasNextPage ? `/api/products?limit=${limit}&page=${resultado.nextPage}&sort=${sort}&query=${query}` : null
        };

        res.json(respuesta);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({
            status: "error",
            message: "No se pudieron obtener los productos"
        });
    }
});

// Obtener un producto por ID
router.get("/:pid", async (req, res) => {
    const idProducto = req.params.pid;

    try {
        const producto = await productManager.getProductById(idProducto);
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }

        res.json({
            success: true,
            data: producto
        });
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).json({
            success: false,
            message: "No se pudo obtener el producto"
        });
    }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
    const nuevoProducto = req.body;

    try {
        await productManager.addProduct(nuevoProducto);
        res.status(201).json({
            success: true,
            message: "Producto agregado exitosamente"
        });
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({
            success: false,
            message: "No se pudo agregar el producto"
        });
    }
});

// Actualizar un producto por ID
router.put("/:pid", async (req, res) => {
    const idProducto = req.params.pid;
    const productoActualizado = req.body;

    try {
        await productManager.updateProduct(idProducto, productoActualizado);
        res.json({
            success: true,
            message: "Producto actualizado exitosamente"
        });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({
            success: false,
            message: "No se pudo actualizar el producto"
        });
    }
});

// Eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
    const idProducto = req.params.pid;

    try {
        await productManager.deleteProduct(idProducto);
        res.json({
            success: true,
            message: "Producto eliminado exitosamente"
        });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({
            success: false,
            message: "No se pudo eliminar el producto"
        });
    }
});

export default router;
