import axios from "axios";
import { BACKEND_API } from "@/lib/constants";

export const authUser = async (token: string) => {
  try {
    const res = await axios.get<{
      name: string;
      email: string;
      photoUrl?: string;
    }>(`${BACKEND_API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    // console.error("❌ Error fetching books:");
    throw error;
  }
};

export const redirectToSignin = () => {
  return `${BACKEND_API}/auth/google`;
};
