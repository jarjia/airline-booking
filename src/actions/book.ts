"use server";

import { FinalData } from "@/types/types";
import axios from "axios";

export async function book(data: FinalData) {
  try {
    const res = await axios.post(
      process.env.NEXT_PUBLIC_API_URL as string,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-auth-key": process.env.NEXT_PUBLIC_SECRET_KEY,
        },
      }
    );

    return { data: res.data };
  } catch (error) {
    return { error: (error as any).response.data };
  }
}
