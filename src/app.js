import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from "socket.io";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import { viewsRouter } from "./routes/views.routes.js";
import ".database.js";
import ProductManager from './dao/fs/product-manager.js';
const app = express();
const PORT = 8080;
const productsManager = new ProductManager("./src/data/products.json");

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

app.use(express.json());
app.use(express.static("./src/public"));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use('/', viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Se ha conectado un nuevo cliente");
    socket.emit("products", await productsManager.getProducts());

    socket.on("deleteProduct", async (id) => {
        await productsManager.deleteProduct(id);
        io.emit("products", await productsManager.getProducts());
    });

    socket.on("addProduct", async (nuevoProducto) => {
        try {
            await productsManager.addProduct(nuevoProducto);
            io.sockets.emit("products", await productsManager.getProducts());
        } catch (error) {
            console.log("Error al agregar el producto:", error);
        }
    });
});