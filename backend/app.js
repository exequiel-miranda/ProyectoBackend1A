import express from "express";
import productsRoutes from "./src/routes/products.js";
import branchesRoutes from "./src/routes/branches.js";
import employessRoutes from "./src/routes/employees.js";
import providerRoutes from "./src/routes/providers.js";
import customerRoutes from "./src/routes/customers.js";
import registerCustomer from "./src/routes/registerCustomer.js";
import cookieParser from "cookie-parser";
import loginCustomerRoutes from "./src/routes/loginCustomer.js";
import logoutRoutes from "./src/routes/logout.js";

//Ejecutar express
const app = express();

app.use(cookieParser());

app.use(express.json());

//Creamos los endPoints
app.use("/api/products", productsRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/employees", employessRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/registerCustomers", registerCustomer);
app.use("/api/loginCustomers", loginCustomerRoutes);
app.use("/api/logouts", logoutRoutes);

export default app;
