import axios from "axios";
import { BACKEND_API } from "@/lib/constants";
import { ICartResponse } from "@/lib/cart/types";
import { ICartStatusEnum } from "@/lib/cart/enums";

export const fetchActiveCart = async (token: string) => {
  try {
    const res = await axios.get<ICartResponse>(`${BACKEND_API}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const cart = res.data;
    console.log("Carts data", cart);
    return {
      books: (cart.cartBookTopology ?? []).map((book) => book.book),
      id: cart.id ?? null,
      ...(cart.unpaidBlockedCart && {
        unpaidBlockedCartId: cart.unpaidBlockedCart,
        unpaidBlockedCart: cart.unpaidBlockedCart.cartBookTopology.map(e=>e.book),
      }),
      ...(cart.paidBlockedCart && {
        paidBlockedCartId: cart.paidBlockedCart,
        paidBlockedCart: cart.paidBlockedCart.cartBookTopology.map(e=>e.book),
      }),
    };
  } catch (error) {
    console.error("❌ Error fetching books:");
    throw error;
  }
};

export const addBookToCart = async (bookId: number, token: string, isBlock = false) => {
  try {
    console.log(bookId, token);
    const res = await axios.post<ICartResponse>(
      `${BACKEND_API}/cart`,
      {
        bookId,
        ...(isBlock && {
          cartType: ICartStatusEnum.UNPAID_BLOCK,
        }),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const carts = res.data;
    return (carts.cartBookTopology ?? []).map((book) => book.book);
  } catch (error) {
    console.error("❌ Error adding book:");
    throw error;
  }
};

export const updateCartWithBooks = async (bookIds: number[], token: string, isBlock = false) => {
  try {
    const res = await axios.put<ICartResponse>(
      `${BACKEND_API}/cart`,
      {
        bookIds,
        ...(isBlock && {
          cartType: ICartStatusEnum.UNPAID_BLOCK,
        }),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const carts = res.data;
    return (carts.cartBookTopology ?? []).map((book) => book.book);
  } catch (error) {
    console.error("❌ Error adding book:");
    throw error;
  }
};
