import { IBookData } from "@/lib/books/types";
import { ICartStatusEnum } from "@/lib/cart/enums";

export interface ICartResponse {
  id: number;
  status: ICartStatusEnum;
  cartBookTopology: {
    book: IBookData;
  }[];
}
