import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

// types
export type CoffeeSize = 'S' | 'M' | 'L';

export interface CoffeeItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUri: string;
  category: string;
}

export interface CartItem extends CoffeeItem {
  size: CoffeeSize;
  quantity: number;
}

export interface AddressData {
  town: string;
  phone: string;
}

// mock coffee data
export const COFFEE_DATA: CoffeeItem[] = [
  {
    id: '1',
    name: 'Cappuccino',
    description: 'With Steamed Milk',
    price: 2.0,
    imageUri: '',
    category: 'Cappuccino',
  },
  {
    id: '2',
    name: 'Cappuccino',
    description: 'With Foam',
    price: 2.0,
    imageUri: '',
    category: 'Cappuccino',
  },
  {
    id: '3',
    name: 'Latte',
    description: 'Classic milk coffee',
    price: 2.5,
    imageUri: '',
    category: 'Latte',
  },
  {
    id: '4',
    name: 'Vanilla Latte',
    description: 'With vanilla syrup',
    price: 2.9,
    imageUri: '',
    category: 'Latte',
  },
  {
    id: '5',
    name: 'Espresso',
    description: 'Strong and bold',
    price: 1.9,
    imageUri: '',
    category: 'Espresso',
  },
  {
    id: '6',
    name: 'Double Espresso',
    description: 'Extra shot',
    price: 2.4,
    imageUri: '',
    category: 'Espresso',
  },
  {
    id: '7',
    name: 'Americano',
    description: 'Espresso with hot water',
    price: 2.1,
    imageUri: '',
    category: 'Americano',
  },
  {
    id: '8',
    name: 'Iced Americano',
    description: 'Chilled and smooth',
    price: 2.4,
    imageUri: '',
    category: 'Americano',
  },
  {
    id: '9',
    name: 'Mocha',
    description: 'Chocolate + espresso',
    price: 3.1,
    imageUri: '',
    category: 'Mocha',
  },
  {
    id: '10',
    name: 'White Mocha',
    description: 'Sweet and creamy',
    price: 3.3,
    imageUri: '',
    category: 'Mocha',
  },
  {
    id: '11',
    name: 'Cold Brew',
    description: 'Slow steeped coffee',
    price: 3.0,
    imageUri: '',
    category: 'Cold Brew',
  },
  {
    id: '12',
    name: 'Nitro Cold Brew',
    description: 'Creamy nitrogen finish',
    price: 3.6,
    imageUri: '',
    category: 'Cold Brew',
  },
];

// global store variables
let favorites: string[] = [];
let cart: CartItem[] = [];
let address: AddressData = { town: 'New city town', phone: '+919100000000000' };
let profilePhoto: string | null = null;
let profilePhotoLoaded = false;
let listeners: (() => void)[] = [];

const PROFILE_PHOTO_KEY = 'profilePhoto.v1';

function notifyListeners() {
  listeners.forEach(fn => fn());
}

async function loadProfilePhoto() {
  if (profilePhotoLoaded) return;
  try {
    const stored = await AsyncStorage.getItem(PROFILE_PHOTO_KEY);
    profilePhoto = stored;
    profilePhotoLoaded = true;
    notifyListeners();
  } catch {
    profilePhotoLoaded = true;
  }
}

export function useStore() {
  const [, forceUpdate] = useState(0);

  // Subscribe to changes
  const subscribe = useCallback(() => {
    const listener = () => forceUpdate(n => n + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  // Run subscription on mount
  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  // Load profile photo on first use
  useEffect(() => {
    loadProfilePhoto();
  }, []);

  // Profile photo
  const getProfilePhoto = () => profilePhoto;

  const setProfilePhoto = async (uri: string | null) => {
    profilePhoto = uri;
    if (uri) {
      await AsyncStorage.setItem(PROFILE_PHOTO_KEY, uri);
    } else {
      await AsyncStorage.removeItem(PROFILE_PHOTO_KEY);
    }
    notifyListeners();
  };

  // Favorites
  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      favorites = favorites.filter(fid => fid !== id);
    } else {
      favorites = [...favorites, id];
    }
    notifyListeners();
  };

  const getFavorites = (): CoffeeItem[] => {
    return COFFEE_DATA.filter(c => favorites.includes(c.id));
  };

  // ====== CART ======
  const addToCart = (item: CoffeeItem, size: CoffeeSize, quantity: number = 1) => {
    const existingIndex = cart.findIndex(c => c.id === item.id && c.size === size);
    if (existingIndex >= 0) {
      cart = cart.map((c, i) =>
        i === existingIndex ? { ...c, quantity: c.quantity + quantity } : c
      );
    } else {
      cart = [...cart, { ...item, size, quantity }];
    }
    notifyListeners();
  };

  const removeFromCart = (id: string, size: CoffeeSize) => {
    cart = cart.filter(c => !(c.id === id && c.size === size));
    notifyListeners();
  };

  const updateCartQuantity = (id: string, size: CoffeeSize, delta: number) => {
    cart = cart
      .map(c => {
        if (c.id === id && c.size === size) {
          const newQty = c.quantity + delta;
          return newQty > 0 ? { ...c, quantity: newQty } : null;
        }
        return c;
      })
      .filter(Boolean) as CartItem[];
    notifyListeners();
  };

  const getCart = () => cart;

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    cart = [];
    notifyListeners();
  };

  // address
  const getAddress = () => address;

  const updateAddress = (data: Partial<AddressData>) => {
    address = { ...address, ...data };
    notifyListeners();
  };

  return {
    // profile photo
    getProfilePhoto,
    setProfilePhoto,
    // favorites
    isFavorite,
    toggleFavorite,
    getFavorites,
    // cart
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCart,
    getCartTotal,
    clearCart,
    // address
    getAddress,
    updateAddress,
    // data
    coffeeData: COFFEE_DATA,
  };
}
