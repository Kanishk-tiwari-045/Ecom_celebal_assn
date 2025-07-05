# E-Commerce Store – React + Vite + Node.js + PayU (UPI/Google Pay) Integration

A modern, full-featured e-commerce store built with **React**, **Vite**, **Tailwind CSS**, and a **Node.js/Express** backend. Includes advanced features and a complete PayU UPI/Google Pay test payment integration.

## 🚀 Features

- **Product catalog** with grid/list views, search, and filtering
- **Cart management** with sidebar and full cart page
- **Multi-step checkout** with address and payment
- **PayU UPI payment integration** (test mode)
- **Order management** (history, status, details)
- **Wishlist, profile, and account management**

## 📁 Project Structure

```
ecommerce-store/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── app.js
│   └── package.json
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── postcss.config.cjs
├── vite.config.js
└── package.json
```

## 🗺️ Pages & Navigation

| Page                | Path                | Description                                      |
|---------------------|---------------------|--------------------------------------------------|
| Home                | `/`                 | Landing page, featured products, categories      |
| Products            | `/products`         | Product listing, search, filters, grid/list view |
| Product Detail      | `/product/:slug`    | Product info, gallery, add to cart/wishlist      |
| Cart                | `/cart`             | Cart management, quantity, remove, clear         |
| Checkout            | `/checkout`         | Multi-step checkout, address, PayU payment       |
| Orders              | `/orders`           | Order history, status, details                   |
| Wishlist            | `/wishlist`         | Saved products, add to cart, remove              |
| Profile             | `/profile`          | Account info, addresses, security, preferences   |
| About               | `/about`            | Company story, team, values, timeline            |
| Contact             | `/contact`          | Contact form, office info, business hours        |
| 404 Not Found       | `*`                 | Custom error page for invalid routes             |

## 💳 Payment Integration (PayU UPI/Google Pay)

- **Test Mode:** Uses PayU sandbox for safe, simulated payments.
- **Supported Methods:** UPI, Google Pay, PhonePe, and more (via PayU).
- **Flow:** On checkout, user is redirected to PayU's test payment page. Use test UPI IDs for successful simulation.

### Test UPI IDs for Sandbox

| UPI ID (VPA)         | Result         |
|----------------------|---------------|
| anything@payu        | Success       |
| 9999999999@payu      | Success       |

> **Note:** Real UPI IDs or QR code payments do not work in sandbox mode.

## ⚙️ Environment Variables

### Backend `.env` Example

```env
# PayU Credentials (from PayU dashboard)
PAYU_MERCHANT_KEY=YOUR_PAYU_MERCHANT_KEY
PAYU_MERCHANT_SALT=YOUR_PAYU_MERCHANT_SALT

# PayU URLs
PAYU_BASE_URL=https://test.payu.in
PAYU_SUCCESS_URL=https://your-domain.com/payment/success
PAYU_FAILURE_URL=https://your-domain.com/payment/failure

PORT=5000
```

- **PAYU_BASE_URL:** Always use `https://test.payu.in` for sandbox/testing.
- **PAYU_SUCCESS_URL / PAYU_FAILURE_URL:** Should be accessible by PayU (use ngrok for local dev).

## 🛠️ Setup & Running

### 1. Configure Environment

- Copy `.env.example` to `.env` in `backend/` and fill in your PayU credentials and URLs.

### 2. Start Servers

**Backend:**
```bash
cd backend
node app.js
# or for auto-reload:
# npx nodemon app.js
```

**Frontend:**
```bash
npm run dev
```

## 📝 Notes

- **Test mode does not process real payments.** Use only the provided test UPI IDs.
- For live payments, use production credentials and URLs, and ensure your business UPI VPA is registered with PayU.
- All pages are fully responsive and dark-themed.
- You can extend the backend for real order storage, email notifications, and more.
