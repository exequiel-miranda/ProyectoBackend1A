import express from "express";
import productsRoutes from "./src/routes/products.js";
import branchesRoutes from "./src/routes/branches.js";
import employessRoutes from "./src/routes/employees.js";
import providerRoutes from "./src/routes/providers.js";
import customerRoutes from "./src/routes/customers.js";
import registerCustomer from  "./src/routes/registerCustomer.js"
import cookieParser from "cookie-parser";
import loginCustomers from "./src/routes/loginCustomer.js"
import logout from "./src/routes/logout.js";
import recoveryPassword from "./src/routes/recoveryPassword.js";
import cors from "cors";
import limiter from "./src/middlewares/limiter.js";

//Ejecutar express
const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],

  credentials: true,
}));

app.use(cookieParser())

app.use(limiter);

app.use(express.json());

//Creamos los endPoints
app.use("/api/products", limiter, productsRoutes);
app.use("/api/branches", limiter,branchesRoutes);
app.use("/api/employees", limiter, employessRoutes);
app.use("/api/providers", limiter, providerRoutes);
app.use("/api/customers", limiter, customerRoutes);
app.use("/api/registerCustomers", limiter, registerCustomer);
app.use("/api/loginCustomers", limiter, loginCustomers);
app.use("/api/logout", limiter, logout );
app.use("/api/recoveryPassword", limiter, recoveryPassword);

export default app;
