import axios from "axios";
import { BACKEND_API } from "@/lib/constants";
import { PaymentInitiationResponse } from "@/lib/payments/types";

export const initiatePayment = async (bookId: number) => {
  try {
    const res = await axios.post<PaymentInitiationResponse>(
      `${BACKEND_API}/payment/initiate?bookId=${bookId}`,
    );
    // console.log(res);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching books:");
    throw error;
  }
};

export const markPaymentAsSuccessful = async (bookId: number) => {
  try {
    // console.log("HEREE");
    await axios.post<{ status: string }>(
      `${BACKEND_API}/payment/successful?bookId=${bookId}`,
    );
    //   console.log(res);
  } catch (error) {
    console.error("❌ Error marking the book as successful");
    throw error;
  }
};
