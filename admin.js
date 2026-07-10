import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
const ADMIN_PASSWORD = "S123456";

function login() {
    let password = document.getElementById("password").value;

    if (password === ADMIN_PASSWORD) {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("adminBox").style.display = "block";
    } else {
        alert("❌ गलत Password");
    }
}
window.login = login;

async function addCategory() {

    let name = document.getElementById("categoryName").value.trim().toLowerCase();

    if(name===""){
        alert("Category Name लिखें");
        return;
    }

    await addDoc(collection(db,"categories"),{
        name:name
    });

    alert("✅ Category Save Ho Gayi");

    document.getElementById("categoryName").value="";

    loadCategories();
    loadCategoryList();

}

function saveProduct() {

    let name = document.getElementById("name").value.trim();
    let price = document.getElementById("price").value.trim();
    let stock = document.getElementById("stock").value.trim();
    let unit = document.getElementById("unit").value;
let file = document.getElementById("image").files[0];

if (!file) {
    alert("Image Select Karo");
    return;
}

let reader = new FileReader();

reader.onload = async function () {
    let image = reader.result;
    let category = document.getElementById("category").value;

    if(name==="" || price===""){
        alert("Product Name aur Price likhiye");
        return;
    }

 await db.collection("products").add({
    name: name,
    price: "₹" + price,
    unit: unit,
    stock: stock,
    image: image,
    category: category
});

loadProducts();

alert("✅ Product Save Ho Gaya");

    document.getElementById("name").value="";
    document.getElementById("price").value="";
    document.getElementById("stock").value="";
    document.getElementById("image").value="";
    document.getElementById("unit").selectedIndex = 0;
};
reader.readAsDataURL(file);
}
async function loadCategories() {

    let snapshot = await getDocs(collection(db, "categories"));

    let select = document.getElementById("category");

    select.innerHTML = "";

    snapshot.forEach((docItem) => {

        let cat = docItem.data();

        select.innerHTML += `
        <option value="${cat.name}">
            ${cat.name}
        </option>
        `;

    });

}

loadCategories();
async function loadProducts() {

    let box = document.getElementById("productList");
    box.innerHTML = "";

    const snapshot = await db.collection("products").get();

    snapshot.forEach((doc) => {

        const item = doc.data();

        box.innerHTML += `
        <div style="padding:10px;border:1px solid #ddd;margin:8px 0;border-radius:10px;">
            <b>${item.name}</b><br>
            💰 ${item.price}<br>
            📂 ${item.category}<br><br>

            <button onclick="deleteProduct('${doc.id}')">
            🗑️ Delete
            </button>
        </div>
        `;
    });

}

async function deleteProduct(id){

    if(!confirm("Delete Product?")) return;

    await db.collection("products").doc(id).delete();

    alert("✅ Product Delete Ho Gaya");

    loadProducts();
}

loadProducts();
loadCategoryList();
function deleteCategory(index){

    if(!confirm("Delete Category?")) return;

    let categories = JSON.parse(localStorage.getItem("categories")) || [];
let deletedCategory = categories[index];

let products = JSON.parse(localStorage.getItem("products")) || [];

products = products.filter(item => item.category !== deletedCategory);

localStorage.setItem("products", JSON.stringify(products));
    categories.splice(index,1);

    localStorage.setItem("categories", JSON.stringify(categories));

    loadCategories();
    loadCategoryList();
    loadProducts();
}
function loadCategoryList(){

    let categories = JSON.parse(localStorage.getItem("categories")) || [];

    let box = document.getElementById("categoryList");

    box.innerHTML = "";

    categories.forEach((cat,index)=>{

        box.innerHTML += `
        <div style="padding:10px;border:1px solid #ddd;margin:8px 0;border-radius:10px;">
            <b>${cat}</b>

            <button onclick="deleteCategory(${index})" style="float:right;">
                🗑 Delete
            </button>
        </div>
        `;
    });

}
