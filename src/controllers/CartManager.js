import {promises as fs} from 'fs'
import { nanoid } from 'nanoid';
import ProductManager from './ProductManager.js';

const productAll = new ProductManager

class CartManager{
    constructor(){
        this.path = "./src/models/carts.json"
    }

    readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8");
        return JSON.parse(carts);
    };

    writeCarts = async (carts) => {
     await fs.writeFile(this.path,JSON.stringify(carts));
    };

    exist = async (id) => {
        let carts = await this.readCarts();
        return carts.find(cart => cart.id === id);
    }

    addCarts = async () => {
        let cartsOld = await this.readCarts();
        let id = nanoid()
        let cartsConcat = [{id : id, products : []}, ...cartsOld]
        await this.writeCarts(cartsConcat)
        return "Carrito Agregado Correctamente"
    }

    getCartsById = async (id) =>{
        let cartById = await this.exist(id)
        if(!cartById) return "No se ha Encontrado el Carrito"
        return cartById
    };

    addProductInCart = async (cartId, productId) => {
        let cartById = await this.exist(cartId);
        if(!cartById) return "No se ha Encontrado el Carrito";
        let productById = await productAll.exist(productId);
        if(!cartById) return "No se ha Encontrado el Producto";

        let cartsAll = await this.readCarts()  
        let cartFilter = cartsAll.filter((cart) => cart.id != cartId);

        if(cartById.products.some((prod) => prod.id === productId)) {
            let moreProductInCart = cartById.products.find(
                (prod) => prod.id === productId
            );
            moreProductInCart.cantidad++;
            let cartsConcat = [cartById, ...cartFilter];
            await this.writeCarts(cartsConcat);
            return "Producto Sumado Correctamente";
        }
        cartById.products.push({ id:productById.id, cantidad: 1 })

        let cartsConcat = [cartById, ...cartFilter];
        await this.writeCarts(cartsConcat)
        return "Producto Agregado Correctamente"
    }
    deleteCarts = async (id) => {
        let carts = await this.readCarts();
        let existCarts = carts.some(cart => cart.id === id)
        if (existCarts) {
            let filterCarts = carts.filter(cart => cart.id != id)
            await this.writeCarts(filterCarts)
            return "Carrito eliminado correctamente"
        }
        return "El Carrito que desea eliminar no se encuentra"
    }
}

export default CartManager