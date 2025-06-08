import axios from "axios";
import { BACKEND_API } from "@/lib/constants";
import { PaymentInitiationResponse } from "@/lib/payments/types";

export const initiatePayment = async (cartId: number, addressId: number, coupon?: string) => {
  try {
    console.log("Initiating payment for cartId:", cartId, "and addressId:", addressId);
    const res = await axios.post<PaymentInitiationResponse>(
      `${BACKEND_API}/payment/initiate`,
      {
        cartId,
        addressId,
        coupon,
      },
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

export const markPaymentAsSuccessful = async (bookIds: number[]) => {
  try {
    // console.log("HEREE");
    await axios.post<{ status: string }>(`${BACKEND_API}/payment/successful`, {
      bookIds,
    });
    //   console.log(res);
  } catch (error) {
    console.error("❌ Error marking the book as successful");
    throw error;
  }
};
