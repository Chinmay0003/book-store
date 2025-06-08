import { IAddressCountryEnum } from "@/lib/cart/enums";

export interface IAddressData {
  id: number;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  country: string;
  streetAddress: string;
  city: string;
  state: string;
  pincode: number;
  phoneNumber: string;
}
export interface IGetAllUserAddressResponse {
  map: any;
  address: IAddressData[];
}
export interface IAddAddressRequest {
  firstName: string;
  lastName: string;
  country: IAddressCountryEnum;
  streetAddress: string;
  city: string;
  state: string;
  pincode: number;
  phoneNumber: string;
}

export interface IGetPriceDetailsRequest {
  cartId: number;
  coupon?: string;
}

export interface IGetPriceDetailsResponse {
  cartPrice: number;
  discountAmount: number;
  deliveryCharge: number;
  finalPrice: number;
}