import React, { useState } from 'react';
import { 
  BookOpen, ShoppingCart, User as UserIcon, LogIn, Search, Filter,
  Star, Plus, Minus, Trash2, CheckCircle2, Database, Code, ArrowRight,
  ShieldCheck, Sparkles, BookMarked, Layers, Server, X
} from 'lucide-react';
import { Book, CartItem, User } from './types';
import { MOCK_BOOKS } from './data/mockBooks';

type TabType = 'home' | 'catalogue' | 'login' | 'register' | 'schema';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [books] = useState<Book[]>(MOCK_BOOKS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([
    {
      _id: '663f124a910e192a8b3401fa',
      name: 'Shivam Bhadane',
      email: 'shivam.bhadane@vit.edu',
      phone: '+91 98765 43210',
      department: 'Computer Engineering',
      createdAt: '2024-04-10T09:30:00Z'
    }
  ]);

  // Catalogue Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(1500);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDept, setRegDept] = useState('Computer Engineering');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Cart operations
  const addToCart = (book: Book) => {
    setCart(prev => {
      const existing = prev.find(item => item.book._id === book._id);
      if (existing) {
        return prev.map(item =>
          item.book._id === book._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
    triggerToast(`Added "${book.title.slice(0, 24)}..." to Cart!`);
  };

  const updateCartQty = (bookId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.book._id === bookId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (bookId: string) => {
    setCart(prev => prev.filter(item => item.book._id !== bookId));
    triggerToast('Item removed from Cart');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesPrice = book.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    const found = registeredUsers.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
    if (found) {
      setCurrentUser(found);
      triggerToast(`Welcome back, ${found.name}!`);
      setCurrentTab('catalogue');
    } else {
      // Allow demo login
      const newUser: User = {
        _id: '663f' + Math.random().toString(16).substring(2, 18),
        name: loginEmail.split('@')[0],
        email: loginEmail,
        department: 'Information Technology',
        createdAt: new Date().toISOString()
      };
      setCurrentUser(newUser);
      triggerToast(`Logged in as ${newUser.name}`);
      setCurrentTab('catalogue');
    }
  };

  // Handle Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setRegError('Full Name, Email, and Password are required.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    const newUser: User = {
      _id: '663f' + Math.random().toString(16).substring(2, 18),
      name: regName,
      email: regEmail,
      phone: regPhone || undefined,
      department: regDept,
      createdAt: new Date().toISOString()
    };

    setRegisteredUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    triggerToast(`Account created for ${newUser.name}!`);
    setCurrentTab('catalogue');
  };

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="container nav-container">
          <div className="brand" onClick={() => setCurrentTab('home')}>
            <BookMarked size={28} />
            <span>VIT Books</span>
            <span className="brand-badge">React + MERN</span>
          </div>

          <div className="nav-links">
            <button
              className={`nav-btn ${currentTab === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentTab('home')}
            >
              Home
            </button>
            <button
              className={`nav-btn ${currentTab === 'catalogue' ? 'active' : ''}`}
              onClick={() => setCurrentTab('catalogue')}
            >
              Catalogue ({books.length})
            </button>
            <button
              className={`nav-btn ${currentTab === 'schema' ? 'active' : ''}`}
              onClick={() => setCurrentTab('schema')}
            >
              <Database size={16} />
              MongoDB Schema
            </button>
            {!currentUser ? (
              <>
                <button
                  className={`nav-btn ${currentTab === 'login' ? 'active' : ''}`}
                  onClick={() => setCurrentTab('login')}
                >
                  <LogIn size={16} />
                  Login
                </button>
                <button
                  className={`nav-btn ${currentTab === 'register' ? 'active' : ''}`}
                  onClick={() => setCurrentTab('register')}
                >
                  <UserIcon size={16} />
                  Register
                </button>
              </>
            ) : (
              <div className="user-pill">
                <UserIcon size={16} color="#4f46e5" />
                <span>{currentUser.name}</span>
                <button
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '0.25rem' }}
                  onClick={() => { setCurrentUser(null); triggerToast('Logged out'); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="nav-actions">
            <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={18} />
              <span>Cart</span>
              {totalCartCount > 0 && <span className="cart-badge">{totalCartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main>
        {/* TAB 1: HOME */}
        {currentTab === 'home' && (
          <div>
            <div className="hero">
              <div className="container hero-content">
                <div className="hero-pill">
                  <Sparkles size={16} />
                  <span>CS3111 Web Technology Practical 6</span>
                </div>
                <h1>Welcome to VIT Academic Bookstore</h1>
                <p>
                  Explore curated computer science, system architecture, and software engineering textbooks
                  backed by React 19 component architecture and MongoDB NoSQL schema specifications.
                </p>
                <div className="hero-buttons">
                  <button className="btn-primary" onClick={() => setCurrentTab('catalogue')}>
                    <span>Browse Catalogue</span>
                    <ArrowRight size={18} />
                  </button>
                  <button className="btn-outline-white" onClick={() => setCurrentTab('schema')}>
                    <Database size={18} />
                    <span>View MongoDB Models</span>
                  </button>
                </div>
              </div>
            </div>

            <section className="section container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 className="section-title">Featured Textbooks</h2>
                  <p className="section-desc">Handpicked reference books recommended by department faculty</p>
                </div>
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => setCurrentTab('catalogue')}
                >
                  View All &rarr;
                </button>
              </div>

              <div className="book-grid">
                {books.slice(0, 3).map(book => (
                  <div key={book._id} className="book-card">
                    <div className="book-img-wrap">
                      <img src={book.coverImage} alt={book.title} className="book-img" />
                      <span className="book-tag">{book.category}</span>
                    </div>
                    <div className="book-body">
                      <h3 className="book-title">{book.title}</h3>
                      <div className="book-author">by {book.author}</div>
                      <p className="book-desc">{book.description}</p>
                      <div className="book-meta">
                        <div className="rating-badge">
                          <Star size={14} fill="#b45309" stroke="#b45309" />
                          <span>{book.rating}</span>
                        </div>
                        <span>{book.reviewsCount} reviews</span>
                      </div>
                      <div className="book-footer">
                        <div className="price-wrap">
                          <span className="price-curr">&#8377;{book.price}</span>
                          <span className="price-orig">&#8377;{book.originalPrice}</span>
                        </div>
                        <button className="btn-add-cart" onClick={() => addToCart(book)}>
                          <Plus size={16} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ background: '#ffffff', borderTop: '1px solid var(--border)', padding: '3rem 0' }}>
              <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '10px', color: 'var(--primary)' }}>
                    <Layers size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Modular Architecture</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Clean separation of Home, Login, Catalogue, and Registration components with TypeScript type safety.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: '10px', color: '#10b981' }}>
                    <Database size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>MongoDB Collections</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Complete Mongoose schemas for Users, Books, and Order documents with indexing and validation rules.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '10px', color: '#b45309' }}>
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>VIT Pune Curriculum</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Designed strictly adhering to Dr. Yashwant V. Dongre's Web Technology laboratory specification.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: CATALOGUE */}
        {currentTab === 'catalogue' && (
          <div className="container section">
            <h2 className="section-title">Course Textbooks Catalogue</h2>
            <p className="section-desc">Search across syllabus titles, authors, categories, and price ranges</p>

            <div className="filter-bar">
              <div className="search-box">
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Search title, author, or ISBN..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="category-chips">
                {['All', 'Computer Science', 'Web Development', 'Data Science', 'System Architecture'].map(cat => (
                  <button
                    key={cat}
                    className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '200px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Max:</span>
                <input
                  type="range"
                  min="400"
                  max="1500"
                  step="50"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>&#8377;{maxPrice}</span>
              </div>
            </div>

            {filteredBooks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <h3>No textbooks match your criteria</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Try clearing filters or adjusting the price slider.</p>
                <button
                  className="btn-primary"
                  style={{ marginTop: '1.5rem', background: 'var(--primary)', color: '#fff' }}
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setMaxPrice(1500); }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="book-grid">
                {filteredBooks.map(book => (
                  <div key={book._id} className="book-card">
                    <div className="book-img-wrap">
                      <img src={book.coverImage} alt={book.title} className="book-img" />
                      <span className="book-tag">{book.category}</span>
                    </div>
                    <div className="book-body">
                      <h3 className="book-title">{book.title}</h3>
                      <div className="book-author">by {book.author} &bull; {book.publishedYear}</div>
                      <p className="book-desc">{book.description}</p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        ISBN: <code>{book.isbn}</code> &bull; Stock: {book.stock} units
                      </div>
                      <div className="book-meta">
                        <div className="rating-badge">
                          <Star size={14} fill="#b45309" stroke="#b45309" />
                          <span>{book.rating}</span>
                        </div>
                        <span>{book.reviewsCount} ratings</span>
                      </div>
                      <div className="book-footer">
                        <div className="price-wrap">
                          <span className="price-curr">&#8377;{book.price}</span>
                          <span className="price-orig">&#8377;{book.originalPrice}</span>
                        </div>
                        <button className="btn-add-cart" onClick={() => addToCart(book)}>
                          <Plus size={16} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LOGIN */}
        {currentTab === 'login' && (
          <div className="container section">
            <div className="auth-wrapper">
              <div className="auth-header">
                <h2>Student & Faculty Login</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Sign in with your VIT email address to access your academic cart and orders
                </p>
              </div>

              {loginError && (
                <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="student@vit.edu"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-submit" style={{ marginTop: '0.5rem' }}>
                  Sign In to Account
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Don't have an account?{' '}
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => setCurrentTab('register')}
                >
                  Register here
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REGISTER */}
        {currentTab === 'register' && (
          <div className="container section">
            <div className="auth-wrapper" style={{ maxWidth: '540px' }}>
              <div className="auth-header">
                <h2>User Registration</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Create an account mapped directly to the MongoDB <code>users</code> collection
                </p>
              </div>

              {regError && (
                <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
                  {regError}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Shivam Bhadane"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">VIT Student / Faculty Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name.roll@vit.edu"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      className="form-select"
                      value={regDept}
                      onChange={e => setRegDept(e.target.value)}
                    >
                      <option value="Computer Engineering">Computer Engg</option>
                      <option value="Information Technology">Information Tech</option>
                      <option value="Artificial Intelligence">AI & DS</option>
                      <option value="Electronics & Telecomm">E & TC</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Min 6 characters"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Re-enter password"
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-submit" style={{ marginTop: '0.5rem' }}>
                  Complete Registration (Insert to MongoDB)
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Already registered?{' '}
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => setCurrentTab('login')}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MONGODB SCHEMA SPECIFICATION */}
        {currentTab === 'schema' && (
          <div className="container section">
            <h2 className="section-title">MongoDB NoSQL Schema & Architecture</h2>
            <p className="section-desc">
              Formal Mongoose Document Models and JSON payloads required for Assignment 6 evaluation
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Database size={18} color="var(--primary)" />
                  <span>1. User Collection (Mongoose Schema)</span>
                </h3>
                <div className="schema-block">
{`const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: /.+\@vit\.edu$/ 
  },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  department: { 
    type: String, 
    enum: ['Computer Engineering', 'Information Technology', 'AI & DS', 'E & TC'],
    default: 'Computer Engineering' 
  },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);`}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={18} color="var(--secondary)" />
                  <span>2. Book Collection (Mongoose Schema)</span>
                </h3>
                <div className="schema-block">
{`const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  author: { type: String, required: true, index: true },
  isbn: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ['Computer Science', 'Web Development', 'Data Science', 'System Architecture'],
    required: true 
  },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  stock: { type: Number, default: 10, min: 0 },
  description: { type: String },
  coverImage: { type: String },
  publishedYear: { type: Number }
});

module.exports = mongoose.model('Book', bookSchema);`}
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Server size={18} color="#10b981" />
                  <span>3. Active Registered Documents in MongoDB (Simulated Store)</span>
                </h3>
                <div className="schema-block">
                  {JSON.stringify(registeredUsers, null, 2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cart Slide-over Drawer */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h3 style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart size={20} />
                <span>Your Cart ({totalCartCount} items)</span>
              </h3>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setIsCartOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="cart-body">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <ShoppingCart size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p>Your shopping cart is empty.</p>
                  <button
                    className="btn-primary"
                    style={{ marginTop: '1rem', background: 'var(--primary)', color: '#fff' }}
                    onClick={() => { setIsCartOpen(false); setCurrentTab('catalogue'); }}
                  >
                    Browse Catalogue
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.book._id} className="cart-item">
                    <img src={item.book.coverImage} alt={item.book.title} className="cart-item-img" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                        {item.book.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        &#8377;{item.book.price} each
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer' }}
                          onClick={() => updateCartQty(item.book._id, -1)}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: '18px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer' }}
                          onClick={() => updateCartQty(item.book._id, 1)}
                        >
                          +
                        </button>
                        <button
                          style={{ background: 'none', border: 'none', color: '#ef4444', marginLeft: 'auto', cursor: 'pointer' }}
                          onClick={() => removeFromCart(item.book._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span>Subtotal:</span>
                  <span>&#8377;{cartSubtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 800, fontSize: '1.15rem' }}>
                  <span>Total Amount:</span>
                  <span>&#8377;{cartSubtotal}</span>
                </div>
                <button
                  className="btn-submit"
                  onClick={() => {
                    alert(`Order Placed Successfully! Total: ₹${cartSubtotal}\nOrder confirmation sent to ${currentUser?.email || 'guest@vit.edu'}`);
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                >
                  Checkout (Simulate MERN Order)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
