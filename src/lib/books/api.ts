import axios from "axios";
import { IGetAllBooksResponse, IBookData } from "@/lib/books/types";
import { BACKEND_API } from "@/lib/constants";

export const fetchBooks = async () => {
  try {
    const res = await axios.get<IGetAllBooksResponse>(`${BACKEND_API}/book`);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching books:");
    throw error;
  }
};

export const getBookById = async (id: number): Promise<IBookData | null> => {
  try {
    const res = await axios.get(`${BACKEND_API}/book/${id}`);
    return res.data.bookData || null;
  } catch (error) {
    console.error("❌ Error fetching book by id:", error);
    return null;
  }
};
