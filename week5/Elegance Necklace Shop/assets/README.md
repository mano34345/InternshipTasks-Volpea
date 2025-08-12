# 💎 NeckMuse — Minimal. Magical. Memorable.

**NeckMuse** is a modern, elegant, and fully interactive necklace e-commerce website built using **HTML**, **CSS**, and **JavaScript**. It features dynamic product rendering, a functional shopping cart, admin mode for product management, and search functionality — all with a luxurious user interface and seamless user experience.

---

## ✨ Features

### 🛍️ User Mode:
- Responsive product grid with elegant necklace listings.
- Variant selection (e.g., Silver/Gold, White/Pink).
- Add to Cart functionality with quantity selector.
- Dynamic cart with:
  - Subtotal & Total calculation.
  - Remove items.
  - Simulated checkout alert.
- Search bar to find products instantly.

### 🛠️ Admin Mode:
- Toggle Admin Mode to add, update, or delete products.
- Add new product:
  - Name
  - Price
  - Image URL
  - Description
  - Variants (comma-separated)
  - Variant Images (e.g., `Silver:img1.jpg,Gold:img2.jpg`)
- Edit existing product names via prompt.
- Live updates reflected in product grid.

### 🖼️ Design:
- Hero section with high-quality banner image.
- Elegant font choices (`Cinzel`, `Playfair Display`) from Google Fonts.
- Soft pastel color palette for a premium feel.
- Hover effects and animated elements.

---

## 🧪 Tech Stack

| Technology   | Purpose                          |
|--------------|----------------------------------|
| HTML         | Page structure                   |
| CSS          | Styling and layout               |
| JavaScript   | Dynamic rendering and logic      |
| LocalStorage | Persisting cart data             |
| Font Awesome | Icons for UI (e.g., cart, search) |

---

## 🚀 How to Run

1. Clone or download this repository.
2. Place all files in the same root directory.
3. Add your product images inside the `/assets` folder.
4. Open `index.html` in a web browser.

---

## 🧠 Functional Logic Highlights

- **Product Rendering**: Loops through the `initialProducts` array and dynamically renders product cards.
- **Cart System**: Adds selected variant and quantity to cart, stored in `localStorage`.
- **Admin Panel**: Input fields update the live state to add new products.
- **Search Algorithm**: Tokenizes input and ranks products by match relevance.
- **Modals**: Includes both cart modal and alert modal for user interactions.

---

## 💡 Future Improvements

- Add real payment integration (Stripe/PayPal).
- Convert to React or Vue for better component management.
- Add user authentication (login/signup).
- Integrate with a backend API for database persistence.

---

## 📬 Contact

For suggestions, questions, or collaboration:

- 💼 LinkedIn: https://www.linkedin.com/public-profile/settings?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_self_edit_contact-info%3Bx550cf8dRH6L%2F3QpTsXMIA%3D%3D
