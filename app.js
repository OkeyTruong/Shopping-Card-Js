const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

// const cart = {

//     cartBtn: cartBtn,
//     closeCartBtn: closeCartBtn,
//     clearCartBtn: clearCartBtn,
//     cartDOM: cartDOM,
//     cartOverlay: cartOverlay,
//     cartItems: cartItems,
//     cartTotal: cartTotal,
//     cartContent: cartContent,
//     productsDOM: productsDOM,
// }
// console.log(cart);

// cart

let cart = [];

// getting the products
class Products {
    async getProducts() {
        try {
            let result = await fetch('products.json');
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image };
            });
            return products;
        } catch (error) {
            console.log(error);
        }   
    }
}
// display products
class UI {
    displayProducts(products) {
        let result = '';
        console.log(products);
        products.forEach(product => {
            result += `
            <!-- single product -->
            <article class="product">
                <div class="img-container">
                    <img class="product-img" src=${product.image} alt="product">
                    <button class="bag-btn" data-id="1">
                        <i class="fa fa-shopping-cart"></i> add to bag
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>${product.price}</h4>
            </article>
            <!-- end of single product -->
            `
        })
        productsDOM.innerHTML = result;
    }
}
// local storage
class Storage {

}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();
    const storage = new Storage();
    
    // get all products
    products.getProducts().then(products => ui.displayProducts(products));
});