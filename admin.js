import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
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

async function saveProduct() {

    let name = document.getElementById("name").value.trim();
    let price = document.getElementById("price").value.trim();
    let stock = document.getElementById("stock").value.trim();
    let unit = document.getElementById("unit").value;
    let category = document.getElementById("category").value;
    let file = document.getElementById("image").files[0];

    if (!file) {
        alert("Image Select Karo");
        return;
    }

    let reader = new FileReader();

    reader.onload = async function () {

        let image = reader.result;

        if (name === "" || price === "") {
            alert("Product Name aur Price likhiye");
            return;
        }

        await addDoc(collection(db, "products"), {
            name: name,
            price: "₹" + price,
            unit: unit,
            stock: stock,
            image: image,
            category: category
        });

        alert("✅ Product Save Ho Gaya");

        loadProducts();

        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        document.getElementById("stock").value = "";
        document.getElementById("image").value = "";
        document.getElementById("unit").selectedIndex = 0;

    };

    reader.readAsDataURL(file);
}
    
  async function loadCategories() {

    const snapshot = await getDocs(collection(db, "categories"));
    alert("Categories: " + snapshot.size);

    let select = document.getElementById("category");

    select.innerHTML = "";

    snapshot.forEach((docSnap) => {

        const cat = docSnap.data();

        select.innerHTML += `
            <option value="${cat.name}">
                ${cat.name}
            </option>
        `;

    });

}

async function loadProducts() {

    let box = document.getElementById("productList");
    box.innerHTML = "";

    const snapshot = await getDocs(collection(db, "products"));

    snapshot.forEach((docSnap) => {

        const item = docSnap.data();

        box.innerHTML += `
        <div style="padding:10px;border:1px solid #ddd;margin:8px 0;border-radius:10px;">
            <b>${item.name}</b><br>
            💰 ${item.price}<br>
            📂 ${item.category}<br><br>

            <button onclick="deleteProduct('${docSnap.id}')">
                🗑️ Delete
            </button>
        </div>
        `;
    });

}


async function deleteProduct(id){

    if(!confirm("Delete Product?")) return;

  await deleteDoc(doc(db, "products", id));

    alert("✅ Product Delete Ho Gaya");

    loadProducts();
}

loadCategories();
console.log("Loading Categories...");
loadProducts();
loadCategoryList();
async function deleteCategory(categoryName){

    if(!confirm("Delete Category?")) return;

    const q = query(
        collection(db, "categories"),
        where("name", "==", categoryName)
    );

    const snapshot = await getDocs(q);
    alert(snapshot.size);

    for (const docSnap of snapshot.docs) {
        try {
    await deleteDoc(doc(db, "categories", docSnap.id));
    alert("Deleted");
} catch (e) {
    alert(e.message);
}
    }

    alert("✅ Category Delete Ho Gayi");

    loadCategories();
    loadCategoryList();
}
async function loadCategoryList(){

    let categories = [];
    const snapshot = await getDocs(collection(db, "categories"));

snapshot.forEach(docSnap => {
    categories.push(docSnap.data());
});

    let box = document.getElementById("categoryList");

    box.innerHTML = "";

    categories.forEach((cat,index)=>{

        box.innerHTML += `
        <div style="padding:10px;border:1px solid #ddd;margin:8px 0;border-radius:10px;">
            <b>${cat.name}</b>

             <button onclick="deleteCategory('${cat.name}')" style="float:right;">
                🗑 Delete
            </button>
        </div>
        `;
    });

}
window.login = login;
window.addCategory = addCategory;
window.saveProduct = saveProduct;
window.deleteProduct = deleteProduct;
window.deleteCategory = deleteCategory;
