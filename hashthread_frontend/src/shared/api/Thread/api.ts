import { baseInstance } from "../base";
import { PostThreadResponse, ThreadItems } from "../types/types";

export const postThread = async (text: string, files?: File[]) => {
  const formData = new FormData();
  formData.append("text", text); // Добавляем текст в formData
  files?.forEach((file) => formData.append("files", file)); // Добавляем файлы

  const response = await baseInstance.post<PostThreadResponse>(
    "/thread",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const getThread = async (id?: string) =>
  (await baseInstance.get<ThreadItems>(`/thread/${id}`)).data;

export const toggleLikeThread = async (threadId: string) =>
  (
    await baseInstance.patch<{ likeCount: number; isLiked: boolean }>(
      `/thread/${threadId}/like`,
    )
  ).data;
