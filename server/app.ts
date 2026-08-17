import express from "express";
import cors from "cors";
import platosRoutes from "./routes/platos.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import tagsRoutes from "./routes/tags.routes.js";
import allergensRoutes from "./routes/allergens.routes.js";
import storageRoutes from "./routes/storage.routes.js";
import publicRoutes from "./routes/public.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API Puerto funcionando",
  });
});

app.use("/api/platos", platosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/allergens", allergensRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/auth", authRoutes);

export default app;