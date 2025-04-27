import axios from "axios";
import { IGetAllBooksResponse } from "@/lib/books/types";
import { BACKEND_API } from "@/lib/constants";

export const fetchBooks = async () => {
  try {
    const res = await axios.get<IGetAllBooksResponse>(`${BACKEND_API}/book`);
    console.log("✅ Books Fetched:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching books:");
    throw error;
  }
};
