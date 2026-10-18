import { apiRequest } from "./api";

export interface IUploadedImage {
  secureUrl: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
}

// Uploads a single image through the authenticated content-admin endpoint
// (POST /api/v1/uploads/image, multipart field "file").
export async function uploadImage(file: File): Promise<IUploadedImage> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiRequest<IUploadedImage>("/uploads/image", {
    method: "POST",
    body: formData,
  });

  return data;
}
