import axios from "axios";
import { BACKEND_API } from "@/lib/constants";
import { PaymentInitiationResponse } from "@/lib/payments/types";

export const initiatePayment = async (cartData: {
  cartId: number;
  addressId?: number;
  coupon?: string;
  isInitialBlock?: boolean;
  isBlockComplete?: boolean;
}) => {
  try {
    console.log("Initiating payment for cartId:", cartData.cartId, "and addressId:", cartData.addressId);
    const res = await axios.post<PaymentInitiationResponse>(
      `${BACKEND_API}/payment/initiate`,
      cartData,
    );

    return res.data;
  } catch (error: any) {
    console.error(
      "❌ Error initiating payment:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const markPaymentAsSuccessful = async (cartId: number, addressId: number, coupon?: string) => {
  try {
    // console.log("HEREE");
    await axios.post<{ status: string }>(`${BACKEND_API}/payment/successful`, {
      cartId,
      addressId,
      coupon,
    });
    //   console.log(res);
  } catch (error) {
    console.error("❌ Error marking the book as successful");
    throw error;
  }
};

export const markBlockingPaymentAsSuccessful = async (cartId: number) => {
  try {
    // console.log("HEREE");
    await axios.post<{ status: string }>(`${BACKEND_API}/payment/blocked`, {
      cartId,
    });
    //   console.log(res);
  } catch (error) {
    console.error("❌ Error marking the book as successful");
    throw error;
  }
};

export const markBlockingCompletePaymentAsSuccessful = async (cartId: number, addressId: number) => {
  try {
    // console.log("HEREE");
    await axios.post<{ status: string }>(`${BACKEND_API}/payment/block-cart-bought`, {
      cartId,
      addressId,
    });
    //   console.log(res);
  } catch (error) {
    console.error("❌ Error marking the book as successful");
    throw error;
  }
};