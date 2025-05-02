interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

interface RazorpayInstance {
  open(): void;
}

interface Window {
  Razorpay: RazorpayConstructor;
}
