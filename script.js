const products = [
  {id:1,name:"Vestido azul serenity",category:"vestidos",tag:"Elegante",description:"Modelagem feminina com detalhe franzido.",image:"look-02.jpg"},
  {id:2,name:"Conjunto rosa delicado",category:"conjuntos",tag:"Conjunto",description:"Duas peças para um look cheio de charme.",image:"look-05.jpg"},
  {id:3,name:"Conjunto vermelho",category:"conjuntos",tag:"Destaque",description:"Uma cor marcante para chegar chegando.",image:"look-03.jpg"},
  {id:4,name:"Peças coloridas",category:"blusas",tag:"Cores da estação",description:"Escolha sua cor favorita e monte seu look.",image:"look-04.jpg"},
  {id:5,name:"Vestido azul claro",category:"vestidos",tag:"Favorito",description:"Visual moderno com caimento delicado.",image:"look-01.jpg"},
  {id:6,name:"Vestido preto",category:"vestidos",tag:"Clássico",description:"Aquele pretinho versátil que não pode faltar.",image:"look-02.jpg"},
  {id:7,name:"Top rosa",category:"praia",tag:"Moda praia",description:"Peça leve para compor seu visual de verão.",image:"look-09.jpg"},
  {id:8,name:"Conjunto branco",category:"praia",tag:"Leveza",description:"Uma opção clean para dias ensolarados.",image:"look-09.jpg"},
  {id:9,name:"Look vermelho",category:"vestidos",tag:"Poderosa",description:"Um look marcante e cheio de personalidade.",image:"look-10.jpg"},
  {id:10,name:"Seleção de cores",category:"blusas",tag:"Novidades",description:"Modelos em cores lindas para combinar.",image:"look-08.jpg"}
];
const cart = {};
const grid = document.getElementById("product-grid");
const cartItems = document.getElementById("cart-items");
const count = document.getElementById("cart-count");

function renderProducts(filter="todos"){
  const shown = products.filter(p => filter==="todos" || p.category===filter || (filter==="vestidos" && p.category==="conjuntos"));
  grid.innerHTML = shown.map(p => `
    <article class="product-card">
      <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span></div>
      <div class="product-info"><h3>${p.name}</h3><p>${p.description}</p>
        <div class="product-bottom"><span>Consulte disponibilidade</span><button class="add-btn" type="button" data-add="${p.id}">+ Adicionar</button></div>
      </div>
    </article>`).join("");
}
function renderCart(){
  const entries = Object.entries(cart).filter(([,qty])=>qty>0);
  const totalQty = entries.reduce((sum,[,qty])=>sum+qty,0);
  count.textContent = totalQty;
  if(!entries.length){
    cartItems.innerHTML='<div class="empty-cart">Sua sacola ainda está vazia.<br><a href="#colecao">Escolha seus looks na coleção.</a></div>';
    return;
  }
  cartItems.innerHTML = entries.map(([id,qty])=>{
    const p=products.find(item=>item.id===Number(id));
    return `<div class="cart-row">
      <img src="${p.image}" alt="">
      <div><strong>${p.name}</strong><small>Valor a consultar</small>
        <div class="quantity"><button type="button" data-change="${id}" data-step="-1" aria-label="Diminuir quantidade">−</button><span>${qty}</span><button type="button" data-change="${id}" data-step="1" aria-label="Aumentar quantidade">+</button></div>
      </div>
      <button class="remove-btn" type="button" data-remove="${id}" aria-label="Remover ${p.name}">×</button>
    </div>`;
  }).join("");
}
document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]");
  const change=e.target.closest("[data-change]");
  const remove=e.target.closest("[data-remove]");
  if(add){const id=add.dataset.add;cart[id]=(cart[id]||0)+1;renderCart();add.textContent="Adicionado ✓";setTimeout(()=>add.textContent="+ Adicionar",900);}
  if(change){const id=change.dataset.change;cart[id]=Math.max(0,(cart[id]||0)+Number(change.dataset.step));renderCart();}
  if(remove){delete cart[remove.dataset.remove];renderCart();}
});
document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{
  document.querySelector(".filter.active").classList.remove("active");
  button.classList.add("active");renderProducts(button.dataset.filter);
}));
document.getElementById("checkout-form").addEventListener("submit",e=>{
  e.preventDefault();
  const entries=Object.entries(cart).filter(([,qty])=>qty>0);
  if(!entries.length){alert("Adicione pelo menos um produto ao seu pedido.");return;}
  const name=document.getElementById("customer-name").value.trim();
  const payment=document.getElementById("payment").value;
  if(!name||!payment)return;
  const lines=entries.map(([id,qty])=>{const p=products.find(item=>item.id===Number(id));return `• ${p.name} — quantidade: ${qty}`;});
  const message=`Olá, Juuh! 💗 Gostaria de fazer um pedido.\n\n*Nome:* ${name}\n\n*Produtos:*\n${lines.join("\n")}\n\n*Forma de pagamento:* ${payment}\n\nPode me informar os valores, disponibilidade e opções de entrega?`;
  window.open(`https://wa.me/5513997525574?text=${encodeURIComponent(message)}`,"_blank","noopener");
});
renderProducts();renderCart();