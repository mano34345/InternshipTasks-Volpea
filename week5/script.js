const initialProducts = [
    {
        id: 1,
        name: "Leaf Drop Necklace",
        price: 5500,
        image: "assets/crystal.1.jpg",
        variants: ["Silver", "Gold"],
        variantImages: {
            "Silver": "assets/crystal.1.jpg",
            "Gold": "assets/crystal1.2.jpg"
        },
        description: "Elegant black crystal teardrop necklace with a delicate chain."
    },
    {
        id: 2,
        name: "Emerald Elegance Necklace",
        price: 7500,
        image: "assets/emerald1.2.jpg",
        variants: ["Silver", "Gold"],
        variantImages: {
            "Silver": "assets/emerald1.2.jpg",
            "Gold": "assets/emerald.1.jpg"
        },
        description: "Elegant emerald necklace with a timeless design."
    },
    {
        id: 3,
        name: "Pearl Serenity Necklace",
        price: 6500,
        image: "assets/pearl1.jpg",
        variants: ["White Pearl", "Black Pearl"],
        variantImages: {
            "White Pearl": "assets/pearl1.jpg",
            "Black Pearl": "assets/pearl1.2.jpg"
        },
        description: "Classic pearl necklace for sophisticated style."
    },
    {
        id: 4,
        name: "Layered Elegance Necklace",
        price: 4500,
        image: "assets/layered.jpg",
        variants: ["White", "Golden"],
        variantImages: {
            "White": "assets/layered.jpg",
            "Golden": "assets/layered1.jpg"
        },
        description: "Unleash Bold Sophistication."
    },
    {
        id: 5,
        name: "Beaded Flower Necklace",
        price: 6000,
        image: "assets/beaded flower necklace.jpg",
        variants: ["Golden", "White"],
        variantImages: {
            "White": "assets/beaded flower necklace1.jpg",
            "Golden": "assets/beaded flower necklace.jpg"
        },
        description: "Elegance in Every Bead."
    },
    {
        id: 6,
        name: "Dreamy Princess Core Necklace",
        price: 5000,
        image: "assets/dreamy princess core necklace.jpg",
        variants: ["White", "Pink"],
        variantImages: {
            "White": "assets/dreamy princess core necklace.jpg",
            "Pink": "assets/dreamy princess core necklace1.jpg"
        },
        description: "Dreamy Princess Elegance"
    }
];

function renderApp() {
    let products = JSON.parse(JSON.stringify(initialProducts));
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let isCartOpen = false;
    let isAdmin = false;
    let newProduct = { name: "", price: "", image: "", variants: "", description: "", variantImages: {} };
    let searchQuery = "";
    let isSearchOpen = false;

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        const cartCount = document.getElementById("cart-count");
        if (cartCount) {
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    function addToCart(product, variant, quantity) {
        const existingItem = cart.find(item => item.id === product.id && item.variant === variant);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ ...product, variant, quantity });
        }
        saveCart();
        isCartOpen = true;
        render();
    }

    function removeFromCart(id, variant) {
        cart = cart.filter(item => !(item.id === id && item.variant === variant));
        saveCart();
        render();
    }

    function checkout() {
        showAlert("Thank you for your purchase! (Simulated Checkout)", () => {
            cart = [];
            isCartOpen = false;
            saveCart();
            render();
        });
    }

    function addProduct() {
        if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.variants) {
            showAlert("Please fill in all required fields.");
            return;
        }

        const product = {
            id: products.length + 1,
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            image: newProduct.image,
            variants: newProduct.variants.split(",").map(v => v.trim()),
            variantImages: newProduct.variantImages,
            description: newProduct.description
        };

        products.push(product);
        newProduct = { name: "", price: "", image: "", variants: "", description: "", variantImages: {} };
        render();
    }

    function updateProduct(id) {
        const updatedName = prompt("Enter new name:");
        if (updatedName) {
            products = products.map(p => (p.id === id ? { ...p, name: updatedName } : p));
            render();
        }
    }

    function deleteProduct(id) {
        products = products.filter(p => p.id !== id);
        cart = cart.filter(item => item.id !== id);
        saveCart();
        render();
    }

    function searchProducts() {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return products;

        const tokens = query.split(/\s+/);
        return products
            .map(product => {
                const name = product.name.toLowerCase();
                const description = product.description.toLowerCase();
                let score = 0;

                tokens.forEach(token => {
                    if (name.includes(token)) {
                        score += name === token ? 10 : 5;
                    }
                    if (description.includes(token)) {
                        score += 2;
                    }
                });

                return { product, score };
            })
            .filter(({ score }) => score > 0)
            .sort((a, b) => b.score - a.score)
            .map(({ product }) => product);
    }

    function toggleSearch() {
        isSearchOpen = !isSearchOpen;
        const searchInput = document.getElementById("search-input");
        if (searchInput) {
            searchInput.classList.toggle("active", isSearchOpen);
            if (isSearchOpen) {
                searchInput.focus();
                searchQuery = "";
            } else {
                searchQuery = "";
                render();
            }
        }
    }

    function render() {
        const root = document.getElementById("root");
        const filteredProducts = isAdmin ? products : searchProducts();
        root.innerHTML = `
            <main class="container">
                ${isAdmin ? renderAdminPanel() : renderProducts(filteredProducts)}
            </main>
            ${isCartOpen ? renderCartModal() : ""}
        `;

        // Update Admin Button Text
        const adminBtn = document.getElementById("admin-btn");
        if (adminBtn) {
            adminBtn.textContent = isAdmin ? "User Mode" : "Admin Mode";
        }

        // Add Event Listener for Search Button
        const searchBtn = document.querySelector(".search-btn");
        if (searchBtn) {
            searchBtn.onclick = toggleSearch;
        }

        // Add Event Listeners for Variant Selection
        filteredProducts.forEach(product => {
            const variantSelect = document.getElementById(`variant-${product.id}`);
            if (variantSelect) {
                variantSelect.addEventListener('change', () => {
                    const selectedVariant = variantSelect.value;
                    const productCard = variantSelect.closest('.product-card');
                    const productImage = productCard.querySelector('img');
                    productImage.src = product.variantImages[selectedVariant] || product.image;
                    productImage.alt = `${product.name} (${selectedVariant})`;
                });
            }
        });

        // Add Event Listener for Search
        const searchInput = document.getElementById("search-input");
        if (searchInput) {
            searchInput.value = searchQuery;
            searchInput.classList.toggle("active", isSearchOpen);
            searchInput.addEventListener("input", (e) => {
                searchQuery = e.target.value;
                render();
            });
        }

        updateCartCount();
    }

    function renderProducts(filteredProducts) {
        return `
            <div class="product-grid">
                ${filteredProducts.length === 0 ? "<p>No products found.</p>" : filteredProducts.map(product => `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p class="price">PKR ${product.price.toLocaleString()}</p>
                        <p>${product.description}</p>
                        <div class="product-actions">
                            <select id="variant-${product.id}">
                                ${product.variants.map(variant => `<option value="${variant}">${variant}</option>`).join("")}
                            </select>
                            <input type="number" id="quantity-${product.id}" min="1" value="1">
                            <button class="add-to-cart-btn" onclick="addToCartHandler(${product.id})">Add to Cart</button>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
    }

    function renderCartModal() {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return `
            <div class="modal">
                <div class="modal-content">
                    <button class="modal-close-btn" onclick="toggleCart()">
                        <i class="fas fa-times"></i>
                    </button>
                    <h2>Your Shopping Cart</h2>
                    ${cart.length === 0 ? "<p>Your cart is empty.</p>" : `
                        ${cart.map(item => `
                            <div class="cart-item">
                                <div class="cart-item-info">
                                    <div class="cart-item-name">${item.name} (${item.variant})</div>
                                    <div class="cart-item-price">PKR ${item.price.toLocaleString()}</div>
                                    <div class="cart-item-quantity">Quantity: ${item.quantity}</div>
                                </div>
                                <button class="remove-btn" onclick="removeFromCartHandler(${item.id}, '${item.variant}')">Remove</button>
                            </div>
                        `).join("")}
                        <div class="cart-summary">
                            <div class="cart-summary-row">
                                <span>Subtotal:</span>
                                <span>PKR ${subtotal.toLocaleString()}</span>
                            </div>
                            <div class="cart-summary-row cart-total">
                                <span>Total:</span>
                                <span>PKR ${subtotal.toLocaleString()}</span>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 1rem;">
                            <button class="close-btn" onclick="toggleCart()">Continue Shopping</button>
                            <button class="checkout-btn" onclick="checkoutHandler()">Checkout</button>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    function renderAdminPanel() {
        return `
            <div class="admin-panel">
                <h2>Admin Panel</h2>
                <h3>Add New Product</h3>
                <input type="text" id="new-name" placeholder="Product Name" value="${newProduct.name}" oninput="updateNewProduct('name', this.value)">
                <input type="number" id="new-price" placeholder="Price" value="${newProduct.price}" oninput="updateNewProduct('price', this.value)">
                <input type="text" id="new-image" placeholder="Default Image URL" value="${newProduct.image}" oninput="updateNewProduct('image', this.value)">
                <input type="text" id="new-variants" placeholder="Variants (comma-separated)" value="${newProduct.variants}" oninput="updateNewProduct('variants', this.value)">
                <input type="text" id="new-variant-images" placeholder="Variant Images (Silver:image1.jpg,Gold:image2.jpg)" value="${Object.entries(newProduct.variantImages).map(([k, v]) => `${k}:${v}`).join(",")}" oninput="updateNewProduct('variantImages', this.value)">
                <input type="text" id="new-description" placeholder="Description" value="${newProduct.description}" oninput="updateNewProduct('description', this.value)">
                <button onclick="addProductHandler()">Add Product</button>
                <h3>Manage Products</h3>
                ${products.map(product => `
                    <div class="admin-product-item">
                        <div>
                            <p>${product.name}</p>
                            <p>PKR ${product.price.toLocaleString()}</p>
                            <p>${product.variants.join(", ")}</p>
                        </div>
                        <div>
                            <button class="edit-btn" onclick="updateProductHandler(${product.id})">Edit</button>
                            <button class="delete-btn" onclick="deleteProductHandler(${product.id})">Delete</button>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
    }

    // Global Event Handlers
    window.toggleCart = () => {
        isCartOpen = !isCartOpen;
        render();
    };

    window.toggleAdmin = () => {
        isAdmin = !isAdmin;
        searchQuery = "";
        isSearchOpen = false;
        render();
    };

    window.toggleSearch = toggleSearch;

    window.addToCartHandler = (id) => {
        const product = products.find(p => p.id === id);
        const variant = document.getElementById(`variant-${id}`).value;
        const quantity = parseInt(document.getElementById(`quantity-${id}`).value) || 1;
        addToCart(product, variant, quantity);
    };

    window.removeFromCartHandler = (id, variant) => {
        removeFromCart(id, variant);
    };

    window.checkoutHandler = () => {
        checkout();
    };

    window.addProductHandler = () => {
        addProduct();
    };

    window.updateProductHandler = (id) => {
        updateProduct(id);
    };

    window.deleteProductHandler = (id) => {
        deleteProduct(id);
    };

    window.updateNewProduct = (field, value) => {
        if (field === 'variantImages') {
            const variantImages = {};
            value.split(',').forEach(pair => {
                const [variant, image] = pair.split(':').map(v => v.trim());
                if (variant && image) {
                    variantImages[variant] = image;
                }
            });
            newProduct[field] = variantImages;
        } else {
            newProduct[field] = value;
        }
    };

    // Initial Render
    render();
}

// Alert Modal
function showAlert(message, callback) {
    const alertModal = document.getElementById('alertModal');
    const alertMessage = document.getElementById('alertMessage');
    const alertOkBtn = document.getElementById('alertOkBtn');

    alertMessage.textContent = message;
    alertModal.style.display = 'flex';

    alertOkBtn.onclick = () => {
        alertModal.style.display = 'none';
        if (callback) callback();
    };
}

// Start App
renderApp();