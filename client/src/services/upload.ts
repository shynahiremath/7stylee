import api from "./api";

export const uploadService = {
  image: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post<{ url: string }>("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};