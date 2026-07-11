import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let products = [];
let savedCategories = [];

async function loadData() {

    const categorySnapshot = await getDocs(collection(db, "categories"));
    const productSnapshot = await getDocs(collection(db, "products"));

    savedCategories = [];
    products = [];

    categorySnapshot.forEach(doc => {
        savedCategories.push(doc.data().name);
    });

    productSnapshot.forEach(doc => {
        products.push(doc.data());
    });

}
const categoryBox = document.getElementById("categories");

categoryBox.innerHTML =
`<button id="showAll" class="category" data-category="">
📦<br>All
</button>`;

savedCategories.forEach(cat => {
    categoryBox.innerHTML += `
    <button class="category" data-category="${cat}">
        📦<br>${cat}
    </button>
    `;
});
const container = document.getElementById("product-list");

products.forEach((item,index)=>{

container.innerHTML += `
<div class="product">
<img src="${item.image}" alt="${item.name}">
<div>
<h3>${item.name}</h3>
<p>💰 ${item.price} / ${item.unit || ""}</p>
<p>${item.stock}</p>
<p class="cat">${item.category}</p>

<button class="cart-btn"
onclick="addToCart(${index})">
🛒 Cart में जोड़ें
</button>

</div>
</div>
`;

});

const search = document.getElementById("search");

search.addEventListener("keyup",()=>{

const value = search.value.toLowerCase();

document.querySelectorAll(".product").forEach(card=>{

const name = card.querySelector("h3").innerText.toLowerCase();

if(name.includes(value)){
card.style.display="flex";
}else{
card.style.display="none";
}

});

});

document.addEventListener("click",(e)=>{

if (e.target.classList.contains("category") || e.target.id === "showAll") {

const cat = e.target.id === "showAll" ? "" : e.target.dataset.category;

document.querySelectorAll(".product").forEach(card=>{

const text = card.querySelector(".cat").innerText.toLowerCase();

if(!cat || text.includes(cat.toLowerCase())){
card.style.display="flex";
}else{
card.style.display="none";
}

});

}

});
function addToCart(index){
  alert("addToCart chal gaya");

let product = products[index];

let found = cart.find(item=>item.name===product.name);

if(found){
found.qty++;
}else{
cart.push({...product,qty:1});
}

localStorage.setItem("cart",JSON.stringify(cart));

let total=0;

cart.forEach(item=>{
total+=item.qty;
});

document.getElementById("cart-count").innerText=
"🛒 Cart ("+total+")";

}

function openCart(){

if(cart.length===0){
alert("🛒 आपका Cart खाली है");
return;
}

window.location.href="cart.html";

}

function sendWhatsApp(){

let customerName = document.getElementById("customerName").value.trim();
let customerPhone = document.getElementById("customerPhone").value.trim();
let customerAddress = document.getElementById("customerAddress").value.trim();

if(customerName==="" || customerPhone==="" || customerAddress===""){
    alert("कृपया नाम, मोबाइल नंबर और पता भरें");
    return;
}
if(cart.length===0){
alert("🛒 Cart खाली है");
return;
}

let msg =
"🛒 नया ऑर्डर\n\n"+
"👤 नाम: "+customerName+"\n"+
"📞 मोबाइल: "+customerPhone+"\n"+
"📍 पता: "+customerAddress+"\n\n";
let total=0;

cart.forEach((item,i)=>{
msg+=(i+1)+". "+item.name+
" x"+item.qty+
" - "+item.price+"\n";

total+=parseInt(item.price.replace("₹",""))*item.qty||0;
});

msg+="\n💰 Total = ₹"+total;

window.open(
"https://wa.me/918051707285?text="+encodeURIComponent(msg)
);

}

document.getElementById("cart-count").innerText=
"🛒 Cart ("+
cart.reduce((a,b)=>a+b.qty,0)+
")";
loadData().then(() => {

    // Categories
    categoryBox.innerHTML = `
    <button id="showAll" class="category" data-category="">
    📦<br>All
    </button>`;

    savedCategories.forEach(cat => {
        categoryBox.innerHTML += `
        <button class="category" data-category="${cat}">
            📦<br>${cat}
        </button>
        `;
    });

    // Products
    container.innerHTML = "";

    products.forEach((item, index) => {

        container.innerHTML += `
        <div class="product">
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h3>${item.name}</h3>
                <p>💰 ${item.price} / ${item.unit || ""}</p>
                <p>${item.stock}</p>
                <p class="cat">${item.category}</p>

                <button class="cart-btn" onclick="addToCart(${index})">
                    🛒 Cart में जोड़ें
                </button>
            </div>
        </div>
        `;

    });

});
window.addToCart = addToCart;
window.openCart = openCart;
window.sendWhatsApp = sendWhatsApp;
