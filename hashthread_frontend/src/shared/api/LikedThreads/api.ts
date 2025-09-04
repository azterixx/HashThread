import { baseInstance } from "../base";
import { ThreadItems } from "../types/types";

export const fetchLikedThreads = async () =>
  (await baseInstance.get<ThreadItems[]>("/user/liked-threads")).data;
