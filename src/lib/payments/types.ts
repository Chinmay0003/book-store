export interface PaymentInitiationResponse {
  razorpayKeyId: string;
  id: string;
  entity: string;
  amount_paid: number;
  amount_due: number;
  status: "created" | "attempted" | "paid";
  attempts: number;
  created_at: number;
  currency: string;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}
