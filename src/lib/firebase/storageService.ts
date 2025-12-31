
"use client";

import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // For generating unique file names

/**
 * Uploads a project screenshot to Firebase Storage.
 * @param file The file to upload.
 * @param projectId The ID of the project this screenshot belongs to.
 * @returns The download URL of the uploaded file.
 */
export const uploadProjectScreenshot = async (file: File, projectId: string): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `projectScreenshots/${projectId}/${uniqueFileName}`;
  const storageRef = ref(storage, filePath);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading project screenshot to Firebase Storage:", error);
    throw error;
  }
};

export const uploadAdsBannerImage = async (file: File, bannerId: string): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `adsBanners/${bannerId}/${uniqueFileName}`;
  const storageRef = ref(storage, filePath);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading ads banner image:", error);
    throw error;
  }
};

export const uploadTopHeaderBannerImage = async (file: File, bannerId: string): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `topHeaderBanners/${bannerId}/${uniqueFileName}`; // Unique path for this banner type
  const storageRef = ref(storage, filePath);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading top header banner image:", error);
    throw error;
  }
};


/**
 * Uploads a marketing case study image to Firebase Storage.
 * @param file The file to upload.
 * @param caseStudyIdOrTempId A unique identifier for the case study (can be the Firestore doc ID or a temp ID).
 * @returns The download URL of the uploaded file.
 */
export const uploadMarketingImage = async (file: File, caseStudyIdOrTempId: string): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `marketingCaseStudyImages/${caseStudyIdOrTempId}/${uniqueFileName}`;
  const storageRef = ref(storage, filePath);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading marketing image to Firebase Storage:", error);
    throw error;
  }
};

/**
 * Uploads a marketing ad project image to Firebase Storage.
 * @param file The file to upload.
 * @param adProjectIdOrTempId A unique identifier for the ad project.
 * @returns The download URL of the uploaded file.
 */
export const uploadMarketingAdImage = async (file: File, adProjectIdOrTempId: string): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `marketingAdProjectImages/${adProjectIdOrTempId}/${uniqueFileName}`;
  const storageRef = ref(storage, filePath);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading marketing ad image to Firebase Storage:", error);
    throw error;
  }
};

/**
 * Uploads an affiliate resource image to Firebase Storage.
 * @param file The file to upload.
 * @param resourceIdOrTempId A unique identifier for the resource.
 * @returns The download URL of the uploaded file.
 */
export const uploadAffiliateImage = async (file: File, resourceIdOrTempId: string): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `affiliateResourceImages/${resourceIdOrTempId}/${uniqueFileName}`;
  const storageRef = ref(storage, filePath);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading affiliate image to Firebase Storage:", error);
    throw error;
  }
};

/**
 * Uploads a blog post image (main or author) to Firebase Storage.
 * @param file The file to upload.
 * @param postIdOrTempId A unique identifier for the blog post.
 * @param fieldName Indicates if it's 'mainImage' or 'authorImage'.
 * @returns The download URL of the uploaded file.
 */
export const uploadBlogImage = async (
  file: File,
  postIdOrTempId: string,
  fieldName: 'mainImage' | 'authorImage'
): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `blogImages/${postIdOrTempId}/${fieldName}/${uniqueFileName}`;
  const storageRef = ref(storage, filePath);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error(`Error uploading blog ${fieldName} to Firebase Storage:`, error);
    throw error;
  }
};


export const deleteFileFromStorage = async (fileUrl: string): Promise<void> => {
  if (!fileUrl || !fileUrl.startsWith('https://firebasestorage.googleapis.com')) {
    console.warn('Invalid or non-Firebase Storage URL provided for deletion:', fileUrl);
    return;
  }
  try {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
    console.log('File deleted successfully from storage:', fileUrl);
  } catch (error: any) {
    if (error.code === 'storage/object-not-found') {
      console.warn('File not found in storage, it might have been already deleted:', fileUrl);
    } else if (error.code === 'storage/invalid-argument' && error.message.includes('storageRefFromURL')) {
      console.warn('Could not derive storage path from URL. Consider storing full storage paths for deletion.', fileUrl, error);
    }
    else {
      console.error("Error deleting file from Firebase Storage:", fileUrl, error);
      // Optionally re-throw or handle more gracefully if needed
      // throw error;
    }
  }
};
