import { baseInstance } from "../base";
import { ThreadType } from "../types/types";

export const fetchFeed = async (page: number, sort?: string) =>
  (
    await baseInstance.get<ThreadType>("/feed", {
      params: { page, sort },
    })
  ).data;
