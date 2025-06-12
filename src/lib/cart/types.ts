import { IBookData } from "@/lib/books/types";
import { ICartStatusEnum } from "@/lib/cart/enums";

export interface ICartResponse {
  id?: number;
  status?: ICartStatusEnum;
  cartBookTopology?: {
    book: IBookData;
  }[];
  unpaidBlockedCart?: {
    id: number;
    cartBookTopology: {
      book: IBookData;
    }[];
  },
  paidBlockedCart?: {
    id: number;
    cartBookTopology: {
      book: IBookData;
    }[];
  }
}
