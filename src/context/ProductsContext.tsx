import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from '../types';
import { PRODUCTS, UNIT_PRICE } from '../data/products';

const PRODUCTS_STORAGE_KEY = 'soldout.products.v2';

interface ProductsContextValue {
  products: Product[];
  toggleSoldOut: (productId: string) => void;
  addProduct: (productData: Omit<Product, 'id'>) => Product;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  resetToDefaults: () => void;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

function loadProductsFromStorage(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(PRODUCTS));
      return PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return PRODUCTS;
  } catch {
    return PRODUCTS;
  }
}

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(loadProductsFromStorage);

  const saveProducts = useCallback((newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(newProducts));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, []);

  const toggleSoldOut = useCallback(
    (productId: string) => {
      saveProducts(
        products.map((p) => {
          if (p.id === productId) {
            return {
              ...p,
              isSoldOut: !p.isSoldOut,
            };
          }
          return p;
        })
      );
    },
    [products, saveProducts]
  );

  const addProduct = useCallback(
    (data: Omit<Product, 'id'>) => {
      const id = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `item-${Date.now()}`;
      
      const newProduct: Product = {
        ...data,
        id: `${id}-${Date.now().toString().slice(-4)}`,
        price: data.price || UNIT_PRICE,
        createdAt: new Date().toISOString(),
      };

      saveProducts([...products, newProduct]);
      return newProduct;
    },
    [products, saveProducts]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<Product>) => {
      saveProducts(
        products.map((p) => (p.id === productId ? { ...p, ...updates } : p))
      );
    },
    [products, saveProducts]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      saveProducts(products.filter((p) => p.id !== productId));
    },
    [products, saveProducts]
  );

  const resetToDefaults = useCallback(() => {
    saveProducts(PRODUCTS);
  }, [saveProducts]);

  const value = useMemo(
    () => ({
      products,
      toggleSoldOut,
      addProduct,
      updateProduct,
      deleteProduct,
      resetToDefaults,
    }),
    [products, toggleSoldOut, addProduct, updateProduct, deleteProduct, resetToDefaults]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export function useProducts(): ProductsContextValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return ctx;
}
