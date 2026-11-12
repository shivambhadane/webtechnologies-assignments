# Assignment 6: Online Book Store Website Using React and MongoDB

**Course:** CS3111 - Web Technology  
**Faculty In-Charge:** Dr. Yashwant V. Dongre  
**Institution:** Vishwakarma Institute of Technology, Pune  

---

## 🎯 Aim & Objectives
To develop a responsive, component-driven **Online Book Store** web application using **React 19**, **TypeScript**, and **MongoDB** NoSQL database schema design.

### Core Components Specified in Assignment:
1. **Home:** Modern landing page with a hero showcase, department announcements, and featured textbooks.
2. **Login:** User authentication interface with field validation and role-based login feedback.
3. **Catalogue:** Interactive book showcase with real-time text search, category filters (Computer Science, Web Development, Data Science, System Architecture), price slider, rating indicators, and one-click **Add to Cart**.
4. **Registration:** Account creation form with password confirmation and client-side validation that maps directly to the MongoDB `users` collection.
5. **MongoDB NoSQL Architecture:** Document collection models for `users`, `books`, and `orders` using Mongoose schemas.
6. **Cart Drawer:** Slide-over interactive drawer with quantity adjustment and order total calculation.

---

## 🛠️ Technology Stack
- **Frontend Framework:** React 19 (Functional Components, Hooks)
- **Language:** TypeScript 5.7 (Strict Typing)
- **Tooling & Bundler:** Vite 6
- **Icons:** Lucide React
- **Database Architecture:** MongoDB NoSQL (Mongoose Schemas for Documents & Collections)

---

## 🚀 Quick Start & Running Locally

### Prerequisites
- Node.js (v18 or higher; tested on v24)
- npm (v9 or higher)

### Installation & Execution
```bash
# 1. Navigate to the assignment directory
cd Assignment6_BookStore_React_MongoDB

# 2. Install dependencies
npm install

# 3. Start local development server on Port 5175
npm run dev -- --port 5175

# 4. Or build for production
npm run build
```

Open your browser at `http://localhost:5175`.

---

## 📂 Project Structure
```
Assignment6_BookStore_React_MongoDB/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── DOCUMENTATION.md
├── README.md
└── src/
    ├── App.tsx          # Main application containing all 4 core components + Cart Drawer
    ├── index.css        # Responsive styling and design system
    ├── main.tsx         # React 19 bootstrap mount
    ├── types/
    │   └── index.ts     # TypeScript models for User, Book, CartItem
    └── data/
        └── mockBooks.ts # Curated textbook dataset adhering to MongoDB document schema
```
