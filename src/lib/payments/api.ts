import axios from "axios";
import { BACKEND_API } from "@/lib/constants";
import { PaymentInitiationResponse } from "@/lib/payments/types";

export const initiatePayment = async (bookIds: number[], addressId: number) => {
  try {
    console.log("Initiating payment for bookId:", bookIds, "and addressId:", addressId);
    const res = await axios.post<PaymentInitiationResponse>(
      `${BACKEND_API}/payment/initiate`,
      {
        bookIds,
        addressId,
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
