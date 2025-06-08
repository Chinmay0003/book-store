"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Lock } from "lucide-react";
import { useBookStore, useCartStore } from "@/lib/books/bookStore";
import { updateCartWithBooks } from "@/lib/cart/api";
import { addAddress, fetchPriceDetails, getAllAddress } from "@/lib/address/api";
import {
  IAddAddressRequest,
  IAddressData,
  IGetAllUserAddressResponse,
} from "@/lib/address/types";
import { set, useForm } from "react-hook-form";
import { initiatePayment, markPaymentAsSuccessful } from "@/lib/payments/api";
import { PaymentInitiationResponse, RazorpayOptions } from "@/lib/payments/types";
import Link from "next/link";
import toast from "react-hot-toast";
import PaymentSuccessModal from "../../components/ui/PaymentSuccessfulModal";
import { IAddressCountryEnum } from "@/lib/cart/enums";
import { ensureBooksLoaded } from "@/lib/books/bookLoader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
const Index = () => {
  const [discountCode, setDiscountCode] = useState("");
  const [userAddress, setUserAddress] = useState<IGetAllUserAddressResponse | null>(
    null,
  ); // Adjusted type to array or null
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const cartData = useCartStore();
  const removingItemId = useCartStore((state) => state.removingItemId);
  const setRemovingItemId = useCartStore((state) => state.setRemovingItemId);
  const booksData = useBookStore();
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const readyToCheckout = booksData.books.filter((book) =>
    cartData.cart.includes(book.id),
  );
  const { register, handleSubmit } = useForm<IAddAddressRequest>();
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const handleRemoveFromCart = async (bookId: number) => {
    setRemovingItemId(bookId);
    const updatedCart = cartData.cart.filter((id: number) => id !== bookId);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated");
      setRemovingItemId(null);
      return;
    }
    try {
      await updateCartWithBooks(updatedCart, token);
      // Always fetch the latest cart from backend after update
      const latestCart = (await import("@/lib/cart/api").then((m) =>
        m.fetchActiveCart(token),
      )).books;
      cartData.setCart(latestCart ? latestCart.map((e) => e.id) : []);
      toast.success("Book removed from cart");
    } catch (error) {
      toast.error("Error removing book from cart");
      console.error("Error removing book from cart:", error);
    } finally {
      setRemovingItemId(null);
    }
  };
  // Load books on initial mount
  useEffect(() => {
    async function loadBooks() {
      setIsLoading(true);
      await ensureBooksLoaded();
      setIsLoading(false);
    }
    loadBooks();
  }, [booksData.setBooks]);

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const userAddress = await getAllAddress(token);
        if (!userAddress) {
          console.error("Failed to fetch user address");
          return;
        }
        setUserAddress(userAddress);
      } catch (error) {
        console.error("Error fetching user address:", error);
      }
    };
    fetchUserAddress();
  }, []);

  useEffect(() => {
    const fetchCartPriceDetails = async () => {
      try {
        const token = localStorage.getItem("token") ?? "";
        console.log(`Fetching price details for cart ID: ${cartData.id}`);
        const priceDetails = (await fetchPriceDetails(token, {
          cartId: cartData.id!,
        })) ?? {
          cartPrice: 0,
          discountAmount: 0,
          deliveryCharge: 0,
          finalPrice: 0,
        };
        setSubtotal(priceDetails.cartPrice);
        setShipping(priceDetails.deliveryCharge);
        setDiscount(priceDetails.discountAmount);
        setTotal(priceDetails.finalPrice);
      } catch (error) {
        console.error("Error fetching user address:", error);
      }
    }
    if (cartData.id) {
      fetchCartPriceDetails();
    }  
  }, [cartData.id]);

  const handleSubmitAddress = async (data: IAddAddressRequest) => {
    const token = localStorage.getItem("token") || "";
    console.log("Submitting address:", data);
    const userAddress = await addAddress(token, data);
    console.log("Address added:", userAddress);
    setShowNewAddressForm(false);
    if (!userAddress) {
      toast.error("Failed to add address");
      return;
    }
    toast.success("Address added successfully");
    setUserAddress(userAddress);
  };

  const handleBuyNow = async (bookIds: number[]) => {
    try {
      if (isProcessingPayment) return;
      setIsProcessingPayment(true);
      if (cartData.id === null) {
        return;
      }
      const data = await initiatePayment(cartData.id, selectedAddressId!, appliedCoupon ?? undefined);
      if (!data.id) throw new Error("Order not created");

      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => openRazorpay(data);
        script.onerror = () => {
          toast.error("Razorpay SDK failed to load.");
        };
        document.body.appendChild(script);
      } else {
        openRazorpay(data);
      }
    } catch (err) {
      console.error("❌ Payment initiation error:", err);
      toast.error("❌ Payment failed. Try again.");
      setIsProcessingPayment(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!discountCode) return;
    setIsApplying(true);
  
    try {
      const token = localStorage.getItem("token") ?? "";
      const priceDetails = (await fetchPriceDetails(token, {
        cartId: cartData.id!,
        coupon: discountCode,
      })) ?? {
        cartPrice: 0,
        discountAmount: 0,
        deliveryCharge: 0,
        finalPrice: 0,
      };

      setAppliedCoupon(discountCode);
      setDiscountCode("");
      setSubtotal(priceDetails.cartPrice);
      setShipping(priceDetails.deliveryCharge);
      setDiscount(priceDetails.discountAmount);
      setTotal(priceDetails.finalPrice);
  
    } catch (error) {
      console.error("Error applying coupon:", error);
    } finally {
      setIsApplying(false);
    }
  };
  
  const handleRemoveCoupon = async () => {
    setAppliedCoupon(null);
    setIsApplying(true);
    try {
      const token = localStorage.getItem("token") ?? "";
      const priceDetails = (await fetchPriceDetails(token, {
        cartId: cartData.id!,
      })) ?? {
        cartPrice: 0,
        discountAmount: 0,
        deliveryCharge: 0,
        finalPrice: 0,
      };

      setAppliedCoupon(null);
      setDiscountCode("");
      setSubtotal(priceDetails.cartPrice);
      setShipping(priceDetails.deliveryCharge);
      setDiscount(priceDetails.discountAmount);
      setTotal(priceDetails.finalPrice);
  
    } catch (error) {
      console.error("Error applying coupon:", error);
    } finally {
      setIsApplying(false);
    }
  };
  

  const openRazorpay = (data: PaymentInitiationResponse) => {
    const options: RazorpayOptions = {
      key: data.razorpayKeyId,
      amount: data.amount_due,
      currency: data.currency,
      name: "MyBestKid",
      description: `Payment for books`,
      order_id: data.id,
      handler: async function () {
        try {
          setShowSuccessModal(true);
          await markPaymentAsSuccessful(readyToCheckout.map((book) => book.id));
        } catch (err) {
          console.error("Post-payment processing failed:", err);
          toast.error("Something went wrong after payment.");
        }
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: function () {
          toast.error("❌ Payment popup closed.");
          setIsProcessingPayment(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  const handlePayment = async () => {
    if (readyToCheckout.length === 0) {
      toast.error("Please add items to your cart before proceeding to checkout.");
      return;
    }
    if (selectedAddressId === null) {
      toast.error("Please select a shipping address before proceeding to checkout.");
      return;
    }
    console.log(
      "Selected address ID: and checkout",
      selectedAddressId,
      readyToCheckout,
    );
    handleBuyNow(readyToCheckout.map((book) => book.id));
  };
  const countries = Object.values(IAddressCountryEnum);
  return isLoading ? (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none w-full bg-white">
      <div className="floating-shape absolute w-48 h-48 bg-pink-100 rounded-full opacity-60 mix-blend-multiply top-20 left-20 animate-float" />
      <div className="floating-shape absolute w-48 h-48 bg-pink-100 rounded-full opacity-60 mix-blend-multiply bottom-20 left-50 animate-float" />
      <div className="floating-shape absolute w-64 h-64 bg-purple-100 rounded-full opacity-40 mix-blend-multiply top-40 right-32 animate-float delay-500" />
      <div className="floating-shape absolute w-32 h-32 bg-blue-100 rounded-full opacity-60 mix-blend-multiply bottom-20 left-1/3 animate-float delay-1000" />
      <LoadingSpinner />
    </div>
  ) : (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden text-sm text-[#22223b]">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="floating-shape absolute w-48 h-48 bg-pink-100 rounded-full opacity-60 mix-blend-multiply top-20 left-20 animate-float" />
        <div className="floating-shape absolute w-48 h-48 bg-pink-100 rounded-full opacity-60 mix-blend-multiply bottom-20 left-50 animate-float" />
        <div className="floating-shape absolute w-64 h-64 bg-purple-100 rounded-full opacity-40 mix-blend-multiply top-40 right-32 animate-float delay-500" />
      </div>
      <main className="container mx-auto px-4 py-12 max-w-6xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left Column */}
            <div className="lg:col-span-3 space-y-8">
              <h1 className="text-3xl font-bold text-slate-800">Checkout</h1>

              {/* Address Information */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-700">
                  Choose Existing Address
                </h2>

                {/* Address List */}
                {userAddress ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-[Inter,sans-serif]">
                    {userAddress.map((address: IAddressData, index: number) => {
                      const isSelected = selectedAddressId === address.id;
                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedAddressId(address.id)}
                          role="button"
                          tabIndex={0}
                          className={`border rounded-md p-4 text-sm bg-white cursor-pointer transition-all ${
                            isSelected ? "border-green-500" : "border-gray-300"
                          }`}>
                          <div className="flex items-start gap-2">
                            {isSelected && (
                              <div className="text-green-600 mt-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  className="w-5 h-5"
                                  viewBox="0 0 16 16">
                                  <path d="M13.485 1.929a1.5 1.5 0 012.122 2.122l-8.486 8.485a1.5 1.5 0 01-2.122 0L.393 8.535a1.5 1.5 0 112.122-2.122l3.435 3.435L13.485 1.93z" />
                                </svg>
                              </div>
                            )}
                            <div>
                              <p className="text-gray-700">
                                {address.firstName} {address.lastName}
                              </p>
                              <p className="text-gray-700">{address.streetAddress}</p>
                              <p className="text-gray-700">
                                {address.city}, {address.state} {address.pincode}
                              </p>
                              <p className="text-gray-700">{address.country}</p>
                              <p className="text-gray-700">{address.phoneNumber}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 text-sm py-4">
                    No saved addresses found.
                  </div>
                )}

                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="w-full mt-4 flex items-center justify-center gap-2 border-2 border-dashed border-blue-400 text-blue-500 rounded-lg p-4 hover:bg-blue-50 transition">
                  <span className="font-medium">Add New Address</span>
                </button>
                {showNewAddressForm && (
                  <div className="relative">
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-slate-400 hover:text-red-500 text-2xl font-bold z-10"
                      onClick={() => setShowNewAddressForm(false)}
                      aria-label="Close address form">
                      ×
                    </button>
                    <form onSubmit={handleSubmit((data) => handleSubmitAddress(data))}>
                      <motion.div variants={itemVariants} className="space-y-4 mt-6">
                        <h2 className="text-xl font-semibold text-slate-700">
                          Contact Information
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                              First Name
                            </label>
                            <input
                              {...register("firstName")}
                              className="w-full p-3 rounded-lg border-2 border-slate-200"
                              placeholder="Robbin"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                              Last Name
                            </label>
                            <input
                              {...register("lastName")}
                              className="w-full p-3 rounded-lg border-2 border-slate-200"
                              placeholder="Johnson"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">
                            Phone Number
                          </label>
                          <input
                            {...register("phoneNumber")}
                            type="tel"
                            className="w-full p-3 rounded-lg border-2 border-slate-200"
                            placeholder="+91..."
                          />
                        </div>

                        <h2 className="text-xl font-semibold text-slate-700">
                          Shipping Address
                        </h2>
                        <input
                          {...register("streetAddress")}
                          className="w-full p-3 rounded-lg border-2 border-slate-200"
                          placeholder="123 Storybook Lane"
                        />
                        <div className="grid grid-cols-3 gap-4">
                          <input
                            {...register("city")}
                            className="w-full p-3 rounded-lg border-2 border-slate-200"
                            placeholder="City"
                          />
                          <input
                            {...register("state")}
                            className="w-full p-3 rounded-lg border-2 border-slate-200"
                            placeholder="State"
                          />
                          <select
                            {...register("country")}
                            className="w-full p-3 pr-10 rounded-lg border-2 border-slate-200 appearance-none bg-white">
                            {countries.map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
                        </div>

                        <input
                          {...register("pincode", { valueAsNumber: true })}
                          className="w-full p-3 rounded-lg border-2 border-slate-200"
                          placeholder="Pincode"
                        />
                        <button
                          type="submit"
                          className="w-full py-4 bg-[#22223b] hover:bg-[#22223b] hover:bg-black-600 text-lg text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02]">
                          Save Address
                        </button>
                      </motion.div>
                    </form>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Order</h2>

                {/* Cart Items */}
                <motion.div variants={itemVariants} className="space-y-6 mb-8">
                  {readyToCheckout.length === 0 ? (
                    <div className="text-center text-slate-400">
                      Your cart is empty.
                    </div>
                  ) : (
                    readyToCheckout.map((item) => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden shadow-sm">
                          <img
                            src={
                              item.bookMedia.filter((e) => e.type === "image")[0]
                                ?.metadata?.s3_url || "/placeholder-book.jpg"
                            }
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-800">{item.name}</h3>
                          <p className="text-sm text-slate-500">Qty: 1</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-800">
                            Rs. {item.price.toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="mt-1 text-slate-400 hover:text-red-500 transition-colors"
                            disabled={removingItemId === item.id}>
                            {removingItemId === item.id ? (
                              <svg
                                className="animate-spin h-4 w-4 text-red-500"
                                viewBox="0 0 24 24">
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8z"></path>
                              </svg>
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>

                {/* Discount Code */}
                <motion.div variants={itemVariants} className="mb-6">
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Discount Code
                  </label>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Coupon Applied:</span>
                        <span className="bg-green-800 text-white px-2 py-0.5 rounded text-sm">
                          {appliedCoupon}
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-sm text-red-500 hover:underline ml-4"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="Enter code"
                        disabled={!!appliedCoupon}
                        className="flex-1 p-3 rounded-lg border w-full border-slate-200 transition-all disabled:bg-slate-100"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isApplying || !discountCode}
                        className="px-6 bg-[#22223b] hover:bg-[#22223b] text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        {isApplying ? (
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                        ) : (
                          "Apply"
                        )}
                      </button>
                    </div>
                  )}

                  {/* Success or error messages */}
                  {/* {couponSuccess && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-600 text-sm mt-2"
                    >
                      🎉 Coupon applied successfully!
                    </motion.p>
                  )}
                  {couponError && (
                    <p className="text-red-500 text-sm mt-2">{couponError}</p>
                  )} */}
                </motion.div>

                {/* Order Summary */}
                <motion.div variants={itemVariants} className="space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span>Rs. {shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-blue-500">
                    <span>Discount</span>
                    <span>-RS. {discount.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Total</span>
                      <span>Rs. {total.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Checkout Button */}
                <motion.div variants={itemVariants} className="mt-8">
                  <button
                    onClick={handlePayment}
                    className="w-full block py-4 bg-[#22223b] hover:bg-[#22223b] hover:bg-black-600 text-lg text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] text-center flex items-center justify-center gap-2"
                    disabled={isProcessingPayment}>
                    {isProcessingPayment && (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                    )}
                    {isProcessingPayment ? "Processing..." : "Secure Checkout"}
                  </button>
                  <div className="mt-4 flex items-center justify-center gap-2 text-slate-500">
                    <Lock size={16} />
                    <span className="text-sm">SSL Encrypted Payment</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        {showSuccessModal && (
          <PaymentSuccessModal
            onFinish={() => {
              setShowSuccessModal(false);
              window.location.href = "/";
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
