// ========================
// MENU MOBILE
// ========================
const botaoMenu = document.querySelector(".menu-icon");
const menusMobile = document.querySelectorAll(".menu-mobile");

botaoMenu.addEventListener("click", () => {
    menusMobile.forEach(menu => menu.classList.toggle("active"));
});

menusMobile.forEach(menu => {
    const links = menu.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("active");
        });
    });
});

// ========================
// FILTRAR PRODUTOS
// ========================
const searchInput = document.querySelector(".search input");
const categorySelect = document.querySelector(".search select");
const notFoundText = document.querySelector(".notFound");
const products = document.querySelectorAll(".product-item");

function filtrarProdutos() {
    const termoBusca = searchInput.value.toLowerCase();
    const categoriaSelecionada = categorySelect.value.toLowerCase();
    let encontrados = 0;

    products.forEach(produto => {
        const nome = produto.dataset.name.toLowerCase();
        const categoria = produto.dataset.category.toLowerCase();
        const combinaBusca = nome.includes(termoBusca);
        const combinaCategoria = categoriaSelecionada === "" || categoria === categoriaSelecionada;

        if (combinaBusca && combinaCategoria) {
            produto.style.display = "";
            encontrados++;
        } else {
            produto.style.display = "none";
        }
    });

    notFoundText.style.display = encontrados === 0 ? "block" : "none";
}

searchInput.addEventListener("input", filtrarProdutos);
categorySelect.addEventListener("change", filtrarProdutos);

// ========================
// CARRINHO
// ========================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCountElems = document.querySelectorAll("#cart-count");
const cartTotalElems = document.querySelectorAll("#cart-total");
const cartItemsContainers = document.querySelectorAll(".cart-items");
const cartIcons = document.querySelectorAll(".cart-icon");
const checkoutBtn = document.querySelectorAll("#checkout-btn");

// Salvar carrinho no localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Formatar preço
function formatPrice(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Atualiza carrinho na tela
function updateCartDisplay() {
    cartItemsContainers.forEach((container, index) => {
        container.innerHTML = "";
        let total = 0;
        let totalItems = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            totalItems += item.quantity;

            const li = document.createElement("li");
            li.classList.add("cart-item");

            const img = document.createElement("img");
            img.src = item.img;
            img.alt = item.name;
            img.classList.add("cart-item-img");

            const infoDiv = document.createElement("div");
            infoDiv.classList.add("cart-item-info");
            infoDiv.innerHTML = `
                <div class="cart-item-name">${item.name} (${item.size})</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            `;

            const qtyControls = document.createElement("div");
            qtyControls.classList.add("cart-item-controls");
            qtyControls.innerHTML = `
                <button class="qty-btn decrease" data-name="${item.name}" data-size="${item.size}">−</button>
                <span class="cart-item-qty">${item.quantity}</span>
                <button class="qty-btn increase" data-name="${item.name}" data-size="${item.size}">+</button>
            `;

            const removeBtn = document.createElement("button");
            removeBtn.classList.add("remove-btn");
            removeBtn.dataset.name = item.name;
            removeBtn.dataset.size = item.size;
            removeBtn.textContent = "❌";

            li.appendChild(img);
            li.appendChild(infoDiv);
            li.appendChild(qtyControls);
            li.appendChild(removeBtn);

            container.appendChild(li);
        });

        cartCountElems[index].textContent = totalItems;
        cartTotalElems[index].textContent = formatPrice(total);
    });

    saveCart();
}

// Adicionar item ao carrinho
function addToCart(name, price, img, size) {
    const existingItem = cart.find(item => item.name === name && item.size === size);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, img, size, quantity: 1 });
    }
    updateCartDisplay();
    alert(`Pedido (${size}) adicionado ao carrinho!`);
}

// Remover item
function removeFromCart(name, size) {
    cart = cart.filter(item => !(item.name === name && item.size === size));
    updateCartDisplay();
}

// Alterar quantidade
function changeQuantity(name, size, delta) {
    const item = cart.find(i => i.name === name && i.size === size);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(name, size);
    } else {
        updateCartDisplay();
    }
}

// ========================
// POPUP DE ESCOLHA DE TAMANHO
// ========================

// Cria popup
const sizePopup = document.createElement("div");
sizePopup.classList.add("size-popup");
sizePopup.style.position = "fixed";
sizePopup.style.top = "0";
sizePopup.style.left = "0";
sizePopup.style.width = "100%";
sizePopup.style.height = "100%";
sizePopup.style.background = "rgba(0,0,0,0.7)";
sizePopup.style.display = "none";
sizePopup.style.alignItems = "center";
sizePopup.style.justifyContent = "center";
sizePopup.style.zIndex = "9999";

const popupContent = document.createElement("div");
popupContent.style.background = "#1f1f1f";
popupContent.style.padding = "30px";
popupContent.style.borderRadius = "8px";
popupContent.style.textAlign = "center";
popupContent.style.maxWidth = "400px";
popupContent.style.width = "90%";

const popupTitle = document.createElement("h2");
popupTitle.style.color = "#FE6A0F";
popupTitle.style.marginBottom = "20px";
popupTitle.textContent = "Escolha o tamanho";

const sizeButtons = document.createElement("div");
sizeButtons.style.display = "flex";
sizeButtons.style.justifyContent = "space-around";

["P", "M", "G"].forEach(size => {
    const btn = document.createElement("button");
    btn.textContent = size;
    btn.style.padding = "10px 20px";
    btn.style.background = "#FE6A0F";
    btn.style.border = "none";
    btn.style.color = "#fff";
    btn.style.fontSize = "18px";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";
    btn.addEventListener("click", () => {
        sizePopup.style.display = "none";
        addToCart(selectedProduct.name, selectedProduct.price[size.toLowerCase()], selectedProduct.img, size);
    });
    sizeButtons.appendChild(btn);
});

const closeBtn = document.createElement("button");
closeBtn.textContent = "Cancelar";
closeBtn.style.marginTop = "20px";
closeBtn.style.padding = "10px 20px";
closeBtn.style.background = "#555";
closeBtn.style.border = "none";
closeBtn.style.color = "#fff";
closeBtn.style.fontSize = "16px";
closeBtn.style.borderRadius = "5px";
closeBtn.style.cursor = "pointer";
closeBtn.addEventListener("click", () => {
    sizePopup.style.display = "none";
});

popupContent.appendChild(popupTitle);
popupContent.appendChild(sizeButtons);
popupContent.appendChild(closeBtn);
sizePopup.appendChild(popupContent);
document.body.appendChild(sizePopup);

let selectedProduct = null;

// ========================
// CLIQUE NOS PRODUTOS
// ========================
products.forEach(product => {
    product.addEventListener("click", e => {
        e.preventDefault();
        const name = product.dataset.name;
        const img = product.querySelector(".photo img").src;
        const price = {
            p: parseFloat(product.dataset.pricep),
            m: parseFloat(product.dataset.pricem),
            g: parseFloat(product.dataset.priceg)
        };
        selectedProduct = { name, img, price };
        sizePopup.style.display = "flex";
    });
});

// ========================
// CLIQUES NO CARRINHO
// ========================
cartItemsContainers.forEach(container => {
    container.addEventListener("click", e => {
        const name = e.target.dataset.name;
        const size = e.target.dataset.size;

        if (e.target.classList.contains("remove-btn")) removeFromCart(name, size);
        if (e.target.classList.contains("increase")) changeQuantity(name, size, 1);
        if (e.target.classList.contains("decrease")) changeQuantity(name, size, -1);
    });
});

// ========================
// ABRIR/FECHAR CARRINHO
// ========================
cartIcons.forEach(icon => {
    icon.addEventListener("click", e => {
        e.stopPropagation();
        const dropdown = icon.querySelector(".cart-dropdown");
        dropdown.classList.toggle("show");
    });
});

document.addEventListener("click", () => {
    document.querySelectorAll(".cart-dropdown").forEach(dropdown => {
        dropdown.classList.remove("show");
    });
});

// ========================
// CHECKOUT
// ========================
checkoutBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        if(cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }
        let message = "Olá! Gostaria de fazer o pedido:\n\n";
        cart.forEach(item => {
            message += `${item.name} (${item.size}) - Quantidade: ${item.quantity} - Preço unitário: ${formatPrice(item.price)}\n\n`;
        });
        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        message += `Total: ${formatPrice(total)}`;
        const encodedMessage = encodeURIComponent(message);
        const phone = "5551996927651";
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
    });
});

// ========================
// INICIALIZAÇÃO
// ========================
updateCartDisplay();
