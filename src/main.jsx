import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import App from './App.jsx'

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProductsProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
            <Analytics />
            <SpeedInsights />
          </WishlistProvider>
        </CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
