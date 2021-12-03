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
// buttons
let buttonsDOM = [];

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
        // console.log(products);
        let result = '';
        products.forEach(product => {
            result += `
            <!-- single product -->
            <article class="product">
                <div class="img-container">
                    <img class="product-img" src=${product.image} alt="product">
                    <button class="bag-btn" data-id="${product.id}">
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
    getBagButtons(){
        const btns = [...document.querySelectorAll('.bag-btn')];
        buttonsDOM = btns;
        // console.log(buttonsDOM);
        // console.log(btns)
        btns.forEach(btn => {
            let id = btn.dataset.id;
            // let inCart = cart.find(item => item.id === id);
            // console.log(inCart);
            // if(inCart){
            //     btn.innerText = 'In Cart';
            //     btn.disabled = true;
            // }
            btn.addEventListener("click",event =>{
                event.target.innerText = "In Cart";
                event.target.disabled = true;
                // get product from products
                let cartItem = {...Storage.getProduct(id), amount: 1};
                // console.log(cartItem);
                // add product to the cart
                cart = [...cart, cartItem];
                // console.log(cart);
                // save cart in local storage
                Storage.saveCart(cart); 
                // set cart values
                this.setCartValues(cart);
                // display cart item
                this.addCartItem(cartItem)
                // show the cart
                this.showCart();
            })
        });
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        // console.log(cart);
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item){
         const div = document.createElement("div")
        div.classList.add("cart-item")
        div.innerHTML = `<img src="${item.image}" alt="product" />
        <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>
                <i class="fas fa-trash"></i>
        </div>
        <div>
            <i class="fa fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fa fa-chevron-down" data-id=${item.id}></i>
        </div>`
        cartContent.appendChild(div)
        // console.log(cartContent);
    }
    showCart(){
        cartOverlay.classList.add("transparentBcg")
        cartDOM.classList.add("showCart")
    }
    hideCart(){
        cartOverlay.classList.remove("transparentBcg")
        cartDOM.classList.remove("showCart")  
    }
    setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populate(cart);
        cartBtn.addEventListener("click", this.showCart);
        closeCartBtn.addEventListener("click", this.hideCart);
    }
    populate(cart){
        cart.forEach(item => this.addCartItem(item));
    }
    cartLogic(){
        clearCartBtn.addEventListener("click", () => {
            this.clearCart();
        })
    }
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        // console.log(cartContent.children);
        while(cartContent.children.length > 0){
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart();
    }
    removeItem(id){
        // console.log(id);
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fa fa-shopping-cart"></i> add to bag`;    
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}
// local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[]
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();
    
    // setup  app
    ui.setupAPP()
    // get all products
    products.getProducts().then(products =>{
        ui.displayProducts(products)
        Storage.saveProducts(products)
    }).then(() => {
        ui.getBagButtons();
        ui.cartLogic();
    });
});