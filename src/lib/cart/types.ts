import { IBookData } from "@/lib/books/types";
import { ICartStatusEnum } from "@/lib/cart/enums";

export interface ICartResponse {
  status: ICartStatusEnum;
  cartBookTopology: {
    book: IBookData;
  }[];
}
