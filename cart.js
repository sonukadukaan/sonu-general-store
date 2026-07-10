let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cart-items");
const total = document.getElementById("total");

function renderCart() {

    cartItems.innerHTML = "";

    let sum = 0;

    cart.forEach((item, index) => {

        let qty = item.qty || 1;

        let price = parseInt(item.price.replace(/[^0-9]/g, "")) || 0;

        sum += price * qty;

        cartItems.innerHTML += `
        <div class="product">

            <div>
                <h3>${item.name}</h3>
                <p>💰 ₹${price}</p>

                <div class="qty-box">
                    <button class="qty-btn" onclick="changeQty(${index},-1)">➖</button>

                    <span>${qty}</span>

                    <button class="qty-btn" onclick="changeQty(${index},1)">➕</button>
                </div>

                <button class="remove-btn" onclick="removeItem(${index})">
                ❌ हटाएँ
                </button>

            </div>

        </div>
        `;
    });

    total.innerText = "कुल: ₹" + sum;

    localStorage.setItem("cart", JSON.stringify(cart));
}

function changeQty(index,value){

    cart[index].qty = (cart[index].qty || 1) + value;

    if(cart[index].qty<=0){
        cart.splice(index,1);
    }

    renderCart();
}

function removeItem(index){

    cart.splice(index,1);

    renderCart();
}

function sendWhatsAppOrder(){

    if(cart.length==0){
        alert("Cart खाली है");
        return;
    }

    let msg="🛒 Naya Order\n\n";

    let sum=0;

    cart.forEach((item,i)=>{

        let qty=item.qty||1;

        let price=parseInt(item.price.replace(/[^0-9]/g,""))||0;

        sum+=price*qty;

        msg+=(i+1)+". "+item.name+" × "+qty+" = ₹"+(price*qty)+"\n";

    });

    msg+="\n💰 Total = ₹"+sum;

    window.location.href=
    "https://wa.me/918051707285?text="+encodeURIComponent(msg);

}

renderCart();