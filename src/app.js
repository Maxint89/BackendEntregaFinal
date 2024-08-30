import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./dao/db/product-manager-db.js";
import "./database.js";

const app = express();
const PUERTO = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public")); 

//Express-Handlebars
app.engine("handlebars", engine()); 
app.set("view engine", "handlebars"); 
app.set("views", "./src/views"); 

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando el servidor en el puerto:${PUERTO}`);
});

// Inicialización del ProductManager
const productManager = new ProductManager("./src/data/products.json");

// Inicialización del servidor de Socket.IO
const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Un Cliente se conectó");

    // Enviar lista de productos al cliente al conectarse
    socket.emit("productos", await productManager.getProducts());

    // Manejo del evento de eliminar producto
    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        // Enviar lista actualizada de productos a todos los clientes
        io.sockets.emit("productos", await productManager.getProducts());
    });

    // Manejo del evento de agregar producto
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        // Enviar lista actualizada de productos a todos los clientes
        io.sockets.emit("productos", await productManager.getProducts());
    });
});