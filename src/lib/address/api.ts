import axios from "axios";
import { IGetAllBooksResponse, IBookData } from "@/lib/books/types";
import { BACKEND_API } from "@/lib/constants";
import { IAddAddressRequest, IGetAllUserAddressResponse, IGetPriceDetailsRequest, IGetPriceDetailsResponse } from "./types";

export const getAllAddress = async (token: string) => {
  try {
    const res = await axios.get<IGetAllUserAddressResponse>(`${BACKEND_API}/checkout`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching books:");
    throw error;
  }
};

export const addAddress = async (token: string, addressData: IAddAddressRequest) => {
  try {
    const res = await axios.post<IGetAllUserAddressResponse>(
      `${BACKEND_API}/checkout`,
      { ...addressData },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error adding address:", error);
    return null;
  }
};

export const fetchPriceDetails = async (token: string, cartData: IGetPriceDetailsRequest) => {
  try {
    const res = await axios.post<IGetPriceDetailsResponse>(
      `${BACKEND_API}/checkout/price`,
      { ...cartData },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    console.log("Price details fetched successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error adding address:", error);
    return null;
  }
};