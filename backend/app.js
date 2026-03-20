import express from "express";
import productsRoutes from "./src/routes/products.js";
import branchesRoutes from "./src/routes/branches.js";
import employessRoutes from "./src/routes/employees.js";
import providerRoutes from "./src/routes/providers.js";

//Ejecutar express
const app = express();

app.use(express.json());

//Creamos los endPoints
app.use("/api/products", productsRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/employees", employessRoutes);
app.use("/api/providers", providerRoutes);

export default app;
