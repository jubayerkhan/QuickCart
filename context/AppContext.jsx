"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const router = useRouter();
  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  const { user } = useUser();
  const role = user?.publicMetadata?.role || "user";
  const { isSignedIn, isLoaded } = useAuth();

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(true);
  const isSeller = role === "seller";

  // ✅ PRODUCT MAP (O(1) lookup)
  const productMap = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p._id] = p;
    });
    return map;
  }, [products]);

  // =============================
  // FETCH PRODUCTS
  // =============================
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products?limit=1000"); // ← get all for context
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Product fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // =============================
  // FETCH CART
  // =============================
  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();

      const formatted = {};
      data.cart?.items?.forEach((item) => {
        formatted[item.productId] = item.quantity;
      });

      setCartItems(formatted);
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  }, []);

  // =============================
  // ADD TO CART
  // =============================
  const addToCart = useCallback(async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    toast.success("Added to cart");

    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: itemId }),
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  // =============================
  // UPDATE CART
  // =============================
  const updateCartQuantity = useCallback(async (itemId, quantity) => {
    setCartItems((prev) => {
      const updated = { ...prev };

      if (quantity <= 0) delete updated[itemId];
      else updated[itemId] = quantity;

      return updated;
    });

    try {
      if (quantity <= 0) {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: itemId }),
        });
      } else {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: itemId, quantity }),
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // =============================
  // DERIVED VALUES (OPTIMIZED)
  // =============================
  const cartCount = useMemo(() => {
    return Object.values(cartItems).reduce((a, b) => a + b, 0);
  }, [cartItems]);

  const cartAmount = useMemo(() => {
    let total = 0;

    for (const id in cartItems) {
      const product = productMap[id];
      if (!product) continue;

      total += product.offerPrice * cartItems[id];
    }

    return Math.floor(total * 100) / 100;
  }, [cartItems, productMap]);

  // =============================
  // FETCH USER ROLE
  // =============================
  const fetchUserRole = async () => {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      console.log("role data:", data); // ← check this
      if (data.success) {
        setRole(data.user.role);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // =============================
  // EFFECTS
  // =============================
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (!user) return;

    fetch("/api/user", { method: "POST" });
  }, [user?.id]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    fetchCart();
  }, [isLoaded, isSignedIn, fetchCart]);

  useEffect(() => {
    if (!user) return;
    fetchUserRole();
  }, [user]);

  // =============================
  // CONTEXT VALUE (MEMOIZED)
  // =============================
  const value = useMemo(
    () => ({
      user,
      router,
      currency,
      loading,
      role,
      isSeller,
      products,
      productMap,

      cartItems,
      cartCount,
      cartAmount,

      addToCart,
      updateCartQuantity,
    }),
    [
      user,
      router,
      currency,
      loading,
      products,
      role,
      isSeller,
      productMap,
      cartItems,
      cartCount,
      cartAmount,
      addToCart,
      updateCartQuantity,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
