import { StoredOrder, OrderStatus } from '../types';

const ORDERS_STORAGE_KEY = 'soldout.orders.v2';

function generateInitialOrders(): StoredOrder[] {
  const now = Date.now();
  return [
    {
      id: 'ord-101',
      reference: 'SO-89FA2',
      customerName: 'Cheikh Ahmadou Bamba',
      phone: '+221 77 654 32 10',
      zone: 'Dakar (Plateau)',
      address: 'Avenue Peytavin, Immeuble Horizon 4e étage',
      note: 'Livrer de préférence en début d’après-midi s’il vous plaît',
      items: [
        {
          productId: 'never-follow',
          productName: 'Never Follow',
          size: 'L',
          quantity: 1,
          unitPrice: 20000,
          fingerprintName: 'SO-BIO-A92K1',
        },
      ],
      totalAmount: 20000,
      biometricCert: 'SO-BIO-A92K1',
      fingerprintScanned: true,
      status: 'Confirmée',
      createdAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    },
    {
      id: 'ord-102',
      reference: 'SO-33D41',
      customerName: 'Aïssatou Ndiaye',
      phone: '+221 78 123 45 67',
      zone: 'Almadies',
      address: 'Route des Almadies, près de la Pointe des Almadies',
      items: [
        {
          productId: 'own-your-story',
          productName: 'Own Your Story',
          size: 'M',
          quantity: 1,
          unitPrice: 20000,
          fingerprintName: 'SO-BIO-N77P9',
        },
        {
          productId: 'the-one',
          productName: 'The One',
          size: 'S',
          quantity: 1,
          unitPrice: 20000,
          fingerprintName: 'SO-BIO-N77P9',
        },
      ],
      totalAmount: 40000,
      biometricCert: 'SO-BIO-N77P9',
      fingerprintScanned: true,
      status: 'En préparation',
      createdAt: new Date(now - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    },
    {
      id: 'ord-103',
      reference: 'SO-77E19',
      customerName: 'Mamadou Diallo',
      phone: '+221 76 987 65 43',
      zone: 'Mermoz',
      address: 'Mermoz Pyrotechnie, Villa 42',
      items: [
        {
          productId: 'built-different',
          productName: 'Built Different',
          size: 'XL',
          quantity: 1,
          unitPrice: 20000,
          fingerprintName: 'SO-BIO-D44K8',
        },
      ],
      totalAmount: 20000,
      biometricCert: 'SO-BIO-D44K8',
      fingerprintScanned: true,
      status: 'Livrée',
      createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    },
  ];
}

export const ordersService = {
  getOrders(): StoredOrder[] {
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!raw) {
        const initial = generateInitialOrders();
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw);
    } catch {
      return generateInitialOrders();
    }
  },

  addOrder(order: StoredOrder): StoredOrder[] {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save order', e);
    }
    return updated;
  },

  updateOrderStatus(orderId: string, status: OrderStatus): StoredOrder[] {
    const orders = this.getOrders();
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update order status', e);
    }
    return updated;
  },

  deleteOrder(orderId: string): StoredOrder[] {
    const orders = this.getOrders();
    const updated = orders.filter((o) => o.id !== orderId);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete order', e);
    }
    return updated;
  },

  getStats() {
    const orders = this.getOrders();
    const totalRevenue = orders
      .filter((o) => o.status !== 'Annulée')
      .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === 'Reçue' || o.status === 'Confirmée').length;
    const inPrepOrders = orders.filter((o) => o.status === 'En préparation').length;
    const deliveredOrders = orders.filter((o) => o.status === 'Livrée').length;

    return {
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      inPrepOrders,
      deliveredOrders,
    };
  },
};
