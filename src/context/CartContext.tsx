import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CartLine, EnrichedCartLine, Product } from '../types';
import { UNIT_PRICE } from '../data/products';
import { useProducts } from './ProductsContext';

const CART_STORAGE_KEY = 'soldout.cart.v2';

interface CartContextValue {
  lines: EnrichedCartLine[];
  count: number;
  total: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addLine: (productId: string, size: string, quantity?: number) => boolean;
  setQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  setFingerprint: (lineId: string, file: File) => void;
  clearFingerprint: (lineId: string) => void;
  clearCart: () => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCartFromStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item === 'object' &&
        typeof item.lineId === 'string' &&
        typeof item.size === 'string' &&
        typeof item.quantity === 'number'
    );
  } catch {
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products } = useProducts();
  const [rawLines, setRawLines] = useState<CartLine[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setRawLines(loadCartFromStorage());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        const serializable = rawLines.map(({ lineId, productId, size, quantity, fingerprintName }) => ({
          lineId,
          productId,
          size,
          quantity,
          fingerprintName,
        }));
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serializable));
      } catch (err) {
        console.error('Failed to save cart to localStorage', err);
      }
    }
  }, [rawLines, isLoaded]);

  const addLine = useCallback(
    (productId: string, size: string, quantity = 1) => {
      const targetProduct = products.find((p) => p.id === productId);
      if (targetProduct?.isSoldOut) {
        return false;
      }

      setRawLines((prev) => {
        const existingIndex = prev.findIndex((item) => item.productId === productId && item.size === size);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: Math.min(20, updated[existingIndex].quantity + quantity),
          };
          return updated;
        }
        const lineId =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `line-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        return [...prev, { lineId, productId, size, quantity }];
      });
      setIsCartOpen(true);
      return true;
    },
    [products]
  );

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    setRawLines((prev) =>
      prev.map((item) => (item.lineId === lineId ? { ...item, quantity: Math.max(1, Math.min(20, quantity)) } : item))
    );
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setRawLines((prev) => prev.filter((item) => item.lineId !== lineId));
  }, []);

  const setFingerprint = useCallback((lineId: string, file: File) => {
    setRawLines((prev) =>
      prev.map((item) => (item.lineId === lineId ? { ...item, fingerprintFile: file, fingerprintName: file.name } : item))
    );
  }, []);

  const clearFingerprint = useCallback((lineId: string) => {
    setRawLines((prev) =>
      prev.map((item) => (item.lineId === lineId ? { ...item, fingerprintFile: undefined, fingerprintName: undefined } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setRawLines([]);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const enrichedLines = useMemo(() => {
    return rawLines.flatMap((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (!product) return [];
      const itemPrice = product.price || UNIT_PRICE;
      return [
        {
          ...line,
          product,
          lineTotal: itemPrice * line.quantity,
        },
      ];
    });
  }, [rawLines, products]);

  const count = useMemo(() => enrichedLines.reduce((acc, line) => acc + line.quantity, 0), [enrichedLines]);
  const total = useMemo(() => enrichedLines.reduce((acc, line) => acc + (line.lineTotal || 0), 0), [enrichedLines]);

  const value = useMemo(
    () => ({
      lines: enrichedLines,
      count,
      total,
      isCartOpen,
      openCart,
      closeCart,
      addLine,
      setQuantity,
      removeLine,
      setFingerprint,
      clearFingerprint,
      clearCart,
      clear: clearCart,
    }),
    [enrichedLines, count, total, isCartOpen, openCart, closeCart, addLine, setQuantity, removeLine, setFingerprint, clearFingerprint, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
