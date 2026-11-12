# Technical Documentation: Online Book Store (React & MongoDB)

**Course:** CS3111 - Web Technology  
**Assignment:** Practical No. 6  
**Author:** Shivam Bhadane  
**Faculty Evaluator:** Dr. Yashwant V. Dongre  

---

## 1. System Architecture

The Online Book Store follows a decoupled Single Page Application (SPA) architecture communicating with a NoSQL document database:

```
+------------------------------------------------------------------------+
|                            Client (Browser)                            |
|  +------------------+  +-------------------+  +---------------------+  |
|  |  Home Component  |  | Catalogue (Filter)|  |  Login/Registration|  |
|  +------------------+  +-------------------+  +---------------------+  |
|                          | React 19 State |                            |
|                          +----------------+                            |
+-----------------------------------|------------------------------------+
                                    | REST / JSON
+-----------------------------------v------------------------------------+
|                         Node.js / Express API                          |
|             (Mongoose ODM Schema Validation & Middleware)              |
+-----------------------------------|------------------------------------+
                                    | BSON Wire Protocol
+-----------------------------------v------------------------------------+
|                           MongoDB Database                             |
|    +--------------------+  +--------------------+  +---------------+   |
|    |  users Collection  |  |  books Collection  |  | orders Collect|   |
|    +--------------------+  +--------------------+  +---------------+   |
+------------------------------------------------------------------------+
```

---

## 2. MongoDB Schema Specifications

### 2.1 `users` Collection Schema
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email']
  },
  passwordHash: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: null
  },
  department: {
    type: String,
    enum: ['Computer Engineering', 'Information Technology', 'AI & DS', 'E & TC'],
    default: 'Computer Engineering'
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

### 2.2 `books` Collection Schema
```javascript
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  author: {
    type: String,
    required: true,
    index: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Computer Science', 'Web Development', 'Data Science', 'System Architecture'],
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  description: String,
  coverImage: String,
  publishedYear: Number
});

module.exports = mongoose.model('Book', bookSchema);
```

---

## 3. Component Breakdown

### 3.1 Home Component
- Displays a prominent hero banner highlighting academic features.
- Highlights 3 curated textbooks with quick "Add to Cart" triggers.
- Feature grid explaining modular architecture, MongoDB collections, and VIT syllabus adherence.

### 3.2 Catalogue Component
- **Live Search:** Filters on Title, Author, or ISBN substring matches.
- **Category Filter Chips:** Instant single-click filtering across disciplines.
- **Price Range Slider:** Dynamic pricing filter between ₹400 and ₹1500.
- **Book Cards:** Show title, author, year, stock availability, rating stars, discount pricing, and cart buttons.

### 3.3 Login Component
- Email and password inputs with format validation.
- Checks against stored/registered users in state.
- Dynamic error banners for incorrect credentials.

### 3.4 Registration Component
- Full registration form collecting Student Name, Official Email, Phone, Department, and Password with confirmation matching.
- Direct simulated insertion into the MongoDB `users` collection model.

### 3.5 Cart Slide-over Drawer
- Tracks real-time cart state with quantity increment/decrement.
- Calculates subtotal and overall total.
- Interactive Checkout trigger with simulated MERN order payload.

---

## 4. Verification & Testing

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| TC-01 | Open Home Page | Hero banner & 3 featured books rendered | PASS |
| TC-02 | Search in Catalogue | Typing "Clean Code" isolates Robert Martin's book | PASS |
| TC-03 | Category Filter | Clicking "Data Science" displays only Python / Data books | PASS |
| TC-04 | Add to Cart | Item count on badge increments, item appears in drawer | PASS |
| TC-05 | User Registration | Valid form submission registers new user and logs them in | PASS |
| TC-06 | TypeScript Build | `npm run build` compiles with 0 errors | PASS |
