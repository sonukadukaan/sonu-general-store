const products=[
{name:"पारले-जी",price:10,img:"https://via.placeholder.com/80?text=Product"},
{name:"कोका-कोला",price:40,img:"https://via.placeholder.com/80?text=Product"},
{name:"लक्स साबुन",price:38,img:"https://via.placeholder.com/80?text=Product"}
];
const box=document.getElementById("products");
function show(list){
box.innerHTML="";
list.forEach(p=>box.innerHTML+=`<div class="card"><img src="${p.img}"><div><h3>${p.name}</h3><div class="price">₹${p.price}</div><div>उपलब्ध</div></div></div>`);
}
show(products);
document.getElementById("search").oninput=e=>{
const q=e.target.value.toLowerCase();
show(products.filter(p=>p.name.toLowerCase().includes(q)));
};