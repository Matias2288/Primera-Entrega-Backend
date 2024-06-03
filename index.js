import express from "express"
import ProductRouter from "./src/router/product.routes.js"
import CartRouter from "./src/router/carts.routes.js"

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", ProductRouter)
app.use("/api/cart", CartRouter)

app.listen(PORT, () =>{
    console.log(`Servidor Express Puerto ${PORT}`);
});