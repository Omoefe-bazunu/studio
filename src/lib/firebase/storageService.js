"use client";

import { storage } from "./firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

/**
 * Generic Helper to handle uploads across all categories.
 */
const uploadFile = async (file, folderPath) => {
  const fileExtension = file.name.split(".").pop();
  const uniqueFileName = `${uuidv4()}.${fileExtension}`;
  const fullPath = `${folderPath}/${uniqueFileName}`;
  const storageRef = ref(storage, fullPath);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error(`Upload failed for path: ${fullPath}`, error);
    throw error;
  }
};

export const uploadProjectScreenshot = (file, projectId) =>
  uploadFile(file, `projectScreenshots/${projectId}`);

export const uploadAdsBannerImage = (file, bannerId) =>
  uploadFile(file, `adsBanners/${bannerId}`);

export const uploadTopHeaderBannerImage = (file, bannerId) =>
  uploadFile(file, `topHeaderBanners/${bannerId}`);

export const uploadMarketingAdImage = (file, adProjectId) =>
  uploadFile(file, `marketingAdProjectImages/${adProjectId}`);

export const uploadAffiliateImage = (file, resourceId) =>
  uploadFile(file, `affiliateResourceImages/${resourceId}`);

/**
 * Specialized Blog Upload with nested fields (main/author)
 */
export const uploadBlogImage = (file, postId, fieldName) => {
  // fieldName should be 'main' or 'author'
  return uploadFile(file, `blogImages/${postId}/${fieldName}`);
};

/**
 * Deletes a file using its download URL
 */
export const deleteFileFromStorage = async (fileUrl) => {
  if (
    !fileUrl ||
    !fileUrl.startsWith("https://firebasestorage.googleapis.com")
  ) {
    return;
  }
  try {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
  } catch (error) {
    if (error.code !== "storage/object-not-found") {
      console.error("Error deleting file:", error);
    }
  }
};
