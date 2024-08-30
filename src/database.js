import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://backend70080:coderhouse@cluster0.cfyfu.mongodb.net/supermercado?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conexion a la base de datos exitosa"))
    .catch(() => console.log("No fue posible conectarse"));
