import express from "express";
import ProductsRoute from "./routes/productos.route.js";
import CartsRoute from "./routes/carritos.route.js";
import ViewsRoute from "./routes/views.route.js";
import handlebars from "express-handlebars";
import path from "path";
import { formatear, subtotal } from "./utils.js";
import { upload } from "./utils.js";
import { connectToMongo } from "./connections/mongo.js";

const app = express();

app.engine(
  "handlebars",
  handlebars.engine({
    helpers: {
      formatear,
      subtotal,
    },
  })
);

app.set("views", path.join(process.cwd(), "src", "views"));
app.set("view engine", "handlebars");
app.use("/static", express.static(path.join(process.cwd(), "src", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", ViewsRoute);
app.use("/api/products/", ProductsRoute);
app.use("/api/carts/", CartsRoute);

//ENDPOINT POST PARA CARGAR LAS IMAGENES CON MULTER
app.post("/upload", upload.single("img"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No hay ningun archivo para cargar.");
  }
  res.send(`/static/images/${req.file.filename}`);
});

connectToMongo();

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
