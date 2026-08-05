interface CartItem {
  item: {
    price: number;
  };
  qty: number;
}

interface Cart {
  [key: string]: CartItem;
}

export const totalCart = (cart: Cart) =>
  Object.entries(cart).reduce((acc, [key, value]) => {
    acc += value.item.price * value.qty;
    return acc;
  }, 0);

export const colorMap = {
  neonGreen: "#39FF14",
  navyBlue: "#000080",
  red: "#f44336",
  pink: "#e91e63",
  purple: "#9c27b0",
  deepPurple: "#673ab7",
  indigo: "#3f51b5",
  blue: "#2196f3",
  lightBlue: "#03a9f4",
  cyan: "#00bcd4",
  teal: "#009688",
  green: "#4caf50",
  lightGreen: "#8bc34a",
  lime: "#cddc39",
  yellow: "#ffeb3b",
  amber: "#ffc107",
  orange: "#ff9800",
  deepOrange: "#ff5722",
  brown: "#795548",
  grey: "#9e9e9e",
  gray: "#9e9e9e",
  blueGrey: "#607d8b",
  black: "#000000",
  white: "#ffffff",
  neonYellow: "#ffeb3b",
  neonPink: "#ffc0cb",
  neonRed: "#f44336",
  neonPurple: "#e91e63",
  neonBlue: "#2196f3",
};

export const sizeMap = {
  xs: "Extra small",
  s: "Small",
  m: "Medium",
  l: "Large",
  xl: "Extra large",
  xxl: "Extra extra large",
} as any;



export const priceRanges = [
  { label: "Under ₦25,000", min: 0, max: 25000 },
  { label: "₦25,000 - ₦60,000", min: 25000, max: 60000 },
  { label: "₦60,000 - ₦120,000", min: 60000, max: 120000 },
  { label: "₦120,000 - ₦250,000", min: 120000, max: 250000 },
  { label: "₦250,000 & above", min: 250000, max: Infinity },
];

export const allGenderTypes = ["All", "Male", "Female"];

export const fitTypes = [
  {
    name: "Regular",
    value: "regular",
  },
  {
    name: "Short",
    value: "short",
  },
  {
    name: "Long",
    value: "long",
  },
];

export const deliveryMap = {
  unpaid: "Not confirmed",
  paid: "to be delivered",
  transit: "in transit",
  delivered: "delivered",
  refunded: "refunded",
} as any;

export const deliveryColorMap = {
  unpaid: "gray",
  paid: "yellow",
  transit: "blue",
  delivered: "green",
  refunded: "red",
} as any;
