# 🚀 QuickCart – Fullstack eCommerce Admin Dashboard

QuickCart is a modern fullstack eCommerce admin dashboard that allows sellers and admins to manage products, upload images, and control inventory efficiently. Built with a scalable architecture using Next.js, MongoDB, and Cloudinary.

---

## 🌐 Live Demo

🔗 https://your-live-link.com

---

## 📸 Screenshots

### 🏠 Dashboard

![Dashboard](./screenshots/dashboard.png)

### 📦 Product List

![Product List](./screenshots/product-list.png)

### ➕ Add Product

![Add Product](./screenshots/add-product.png)

### ✏️ Edit Product

![Edit Product](./screenshots/edit-product.png)

---

## ✨ Features

* 🔐 Role-based authentication (Admin / Seller)
* 📦 Full product management (CRUD)
* 🖼️ Image upload & storage with Cloudinary
* 🔄 Update & replace product images
* ❌ Delete products with confirmation
* ⚡ Fast and responsive UI
* 🛡️ Protected API routes
* 📊 Sorted product listing (latest first)
* 🚫 Proper error handling and validation

---

## 🧱 Tech Stack

### Frontend

* Next.js (App Router)
* React.js
* Tailwind CSS

### Backend

* Next.js API Routes / Express.js (optional)
* MongoDB with Mongoose

### Services

* Cloudinary (image storage)
* Clerk (authentication)

---

## 📁 Project Structure

```
/app
  /seller
  /product-list
  /add-product
/components
/lib
/models
/config
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root:

```
# Public
NEXT_PUBLIC_CURRENCY=$
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key

# Private
CLERK_SECRET_KEY=your_secret
MONGODB_URI=your_mongodb_uri

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

## 🧪 Installation & Setup

Clone the repository:

```
git clone https://github.com/your-username/quickcart.git
cd quickcart
```

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Visit:

```
http://localhost:3000
```

---

## 🔐 Role-Based Access

| Role   | Permissions              |
| ------ | ------------------------ |
| Admin  | Full access (CRUD)       |
| Seller | Create & update products |
| User   | Restricted               |

---

## 🔄 API Endpoints

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| GET    | /api/products     | Get all products   |
| GET    | /api/products/:id | Get single product |
| POST   | /api/products     | Create product     |
| PUT    | /api/products/:id | Update product     |
| DELETE | /api/products/:id | Delete product     |

---

## 🚀 Deployment

* Frontend: Vercel
* Database: MongoDB Atlas
* Media: Cloudinary

---

## 🧠 What I Learned

* Building fullstack applications with Next.js
* Handling file uploads with FormData
* Managing cloud media storage (Cloudinary)
* Implementing role-based authentication
* Structuring scalable backend APIs

---

## 📌 Future Improvements

* 🔍 Search & filter products
* 📄 Pagination
* 🛒 Order management system
* 📊 Analytics dashboard
* 🌙 Dark mode

---

## 👨‍💻 Author

**Jubayer Khan**
Frontend Developer (Next.js)

* GitHub: https://github.com/your-username
* Portfolio: https://your-portfolio.com

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---
