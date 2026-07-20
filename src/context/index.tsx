import * as React from 'react';

interface ICart {
  id: string;
  [key: string]: any;
}

interface IAppContext {
  cart: Record<string, ICart>;
  setCart: (cart: Record<string, ICart>) => void;
  removeFromCart: (cartId: string) => void;
  addToCart: (cart: ICart) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  decrementQuantity: (cartId: string) => void;
  incrementQuantity: (cartId: string) => void;
  cartCount: number;
  totalCost: number;
  isInCart: (id: string) => boolean;
  clearCart: () => void;
}

interface IAppProvider {
  children: React.ReactNode;
}

export const AppContext = React.createContext<IAppContext>({
  cart: {},
  setCart: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  decrementQuantity: () => {},
  incrementQuantity: () => {},
  clearCart: () => {},
  isInCart: () => false,
  cartCount: 0,
  totalCost: 0,
});

export const AppProvider: React.FC<IAppProvider> = ({ children }) => {
  const [cart, setCart] = React.useState<Record<string, ICart>>({});

  const cartCount = Object.keys(cart).length;

  const addToCart = (item: any) => {
    const newCart = { ...cart };
    newCart[item.id] = item;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (cartId: string) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[cartId];
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      newCart[cartId].quantity = quantity;

      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const incrementQuantity = (cartId: string) => {
    updateQuantity(cartId, cart[cartId].quantity + 1);
  };

  const decrementQuantity = (cartId: string) => {
    updateQuantity(cartId, cart[cartId].quantity - 1);
  };

  const isInCart = (id: string) => !!cart[id];

  const totalCost = Object.values(cart).reduce(
    (acc, item) => acc + item.amount * item.quantity,
    0
  );

  const clearCart = () => {
    setCart({});
    localStorage.removeItem('cart');
  };

  React.useEffect(() => {
    const cart = localStorage.getItem('cart');
    if (cart) {
      setCart(JSON.parse(cart));
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        cart,
        setCart,
        removeFromCart,
        addToCart,
        updateQuantity,
        cartCount,
        isInCart,
        incrementQuantity,
        decrementQuantity,
        totalCost,
        clearCart,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => React.useContext(AppContext);
