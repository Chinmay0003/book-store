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
    const res = await axios.get<IGetAllBooksResponse>(`${BACKEND_API}/book?bookId=${id}`);
    return res.data.bookData.length > 0 ? res.data.bookData[0] : null;
  } catch (error) {
    console.error("❌ Error fetching books:");
    throw error;
  }
};
