import axios from "axios";
import { BACKEND_API } from "@/lib/constants";
import { ICartResponse } from "@/lib/cart/types";
import { ICartStatusEnum } from "@/lib/cart/enums";

export const fetchActiveCart = async (token: string) => {
  try {
    const res = await axios.get<ICartResponse[]>(`${BACKEND_API}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const carts = res.data;
    return carts.find((cart) => cart.status === ICartStatusEnum.ACTIVE)?.cartBookTopology.map(book => book.book);

  } catch (error) {
    console.error("❌ Error fetching books:");
    throw error;
  }
};

export const addBookToCart = async (bookId: number, token: string) => {
    try {
        console.log(bookId, token);
        const res = await axios.post<ICartResponse[]>(`${BACKEND_API}/cart`, { bookId }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const carts = res.data;
        return carts.find((cart) => cart.status === ICartStatusEnum.ACTIVE)?.cartBookTopology.map(book => book.book);
    } catch (error) {
        console.error("❌ Error adding book:");
        throw error;
    }
};

export const updateCartWithBooks = async (bookIds: number[], token: string) => {
    try {
        const res = await axios.put<ICartResponse[]>(`${BACKEND_API}/cart`, { bookIds }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const carts = res.data;
        return carts.find((cart) => cart.status === ICartStatusEnum.ACTIVE)?.cartBookTopology.map(book => book.book);
    } catch (error) {
        console.error("❌ Error adding book:");
        throw error;
    }
};
