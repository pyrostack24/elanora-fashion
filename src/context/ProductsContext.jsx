import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

// Initial products with stock information per size
const initialProducts = [
  {
    id: 1,
    name: 'Polo Shirt',
    price: '$489',
    category: 'Shirts',
    image: '/Featured/men-polo.png',
    description: 'Classic polo shirt',
    rating: 4.5,
    reviews: 24,
    stock: {
      XS: 10,
      S: 15,
      M: 20,
      L: 18,
      XL: 12,
      XXL: 8
    }
  },
  {
    id: 2,
    name: 'Hoodie',
    price: '$679',
    category: 'Outerwear',
    image: '/Featured/men-hoodie.png',
    description: 'Comfortable hoodie',
    rating: 5.0,
    reviews: 18,
    stock: {
      XS: 5,
      S: 10,
      M: 15,
      L: 12,
      XL: 8,
      XXL: 5
    }
  },
  {
    id: 3,
    name: 'Short',
    price: '$899',
    category: 'Pants',
    image: '/Featured/men-short.png',
    description: 'Stylish shorts',
    rating: 4.8,
    reviews: 32,
    stock: {
      XS: 8,
      S: 12,
      M: 18,
      L: 15,
      XL: 10,
      XXL: 6
    }
  },
  {
    id: 4,
    name: 'Shirt',
    price: '$329',
    category: 'Shirts',
    image: '/Featured/men-shirt.png',
    description: 'Elegant dress shirt',
    rating: 4.3,
    reviews: 15,
    stock: {
      XS: 12,
      S: 18,
      M: 25,
      L: 20,
      XL: 15,
      XXL: 10
    }
  },
  {
    id: 5,
    name: 'Classic Polo',
    price: '$449',
    category: 'Shirts',
    image: '/Featured/men-polo.png',
    rating: 4.7,
    reviews: 28,
    stock: {
      XS: 6,
      S: 10,
      M: 14,
      L: 12,
      XL: 8,
      XXL: 4
    }
  },
  {
    id: 6,
    name: 'Winter Jacket',
    price: '$899',
    category: 'Outerwear',
    image: '/Featured/men-hoodie.png',
    rating: 4.9,
    reviews: 41,
    stock: {
      XS: 3,
      S: 7,
      M: 10,
      L: 8,
      XL: 5,
      XXL: 3
    }
  },
  {
    id: 7,
    name: 'Cargo Shorts',
    price: '$599',
    category: 'Pants',
    image: '/Featured/men-short.png',
    rating: 4.6,
    reviews: 19,
    stock: {
      XS: 5,
      S: 8,
      M: 12,
      L: 10,
      XL: 6,
      XXL: 4
    }
  },
  {
    id: 8,
    name: 'Casual Shirt',
    price: '$379',
    category: 'Shirts',
    image: '/Featured/men-shirt.png',
    rating: 4.4,
    reviews: 22,
    stock: {
      XS: 10,
      S: 15,
      M: 20,
      L: 18,
      XL: 12,
      XXL: 8
    }
  }
];

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('elanora-products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('elanora-products', JSON.stringify(products));
  }, [products]);

  const getProductById = (id) => {
    return products.find(p => p.id === parseInt(id));
  };

  const updateProductPrice = (productId, newPrice) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, price: newPrice } : product
      )
    );
  };

  const updateProductStock = (productId, size, newStock) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? {
              ...product,
              stock: {
                ...product.stock,
                [size]: parseInt(newStock)
              }
            }
          : product
      )
    );
  };

  const isProductInStock = (productId) => {
    const product = getProductById(productId);
    if (!product || !product.stock) return false;
    return Object.values(product.stock).some(quantity => quantity > 0);
  };

  const isSizeAvailable = (productId, size) => {
    const product = getProductById(productId);
    if (!product || !product.stock) return false;
    return product.stock[size] > 0;
  };

  const decreaseStock = (productId, size, quantity = 1) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId && product.stock[size] >= quantity
          ? {
              ...product,
              stock: {
                ...product.stock,
                [size]: product.stock[size] - quantity
              }
            }
          : product
      )
    );
  };

  const value = {
    products,
    getProductById,
    updateProductPrice,
    updateProductStock,
    isProductInStock,
    isSizeAvailable,
    decreaseStock
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
