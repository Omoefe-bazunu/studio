import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
  getDoc,
  where,
  arrayUnion,
  limit,
  increment,
  setDoc,
  getCountFromServer,
  onSnapshot,
} from "firebase/firestore";
import { uploadBlogImage, uploadAmazonProductImage } from "./storageService";

// --- Collection References ---

const testimonialsRef = collection(db, "testimonials");
const contactsRef = collection(db, "contacts");
const blogPostsRef = collection(db, "blogPosts");
const siteContentRef = collection(db, "siteContent");
const pricingPlansRef = collection(db, "pricingPlans");
// Site Visitors
const visitorLogRef = collection(db, "visitorLog");

// --- BLOG SYSTEM ---
export const getBlogPosts = async (filters = {}) => {
  const constraints = [];
  if (filters.category)
    constraints.push(where("category", "==", filters.category));
  if (filters.slug) constraints.push(where("slug", "==", filters.slug));
  constraints.push(orderBy("date", "desc"));
  const q = query(blogPostsRef, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      date: data.date?.toDate().toISOString() || new Date().toISOString(),
      createdAt: data.createdAt?.toDate().toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString(),
      comments: (data.comments || []).map((c) => ({
        ...c,
        date: c.date?.toDate().toISOString(),
      })),
    };
  });
};

export const addBlogPost = async (postData) => {
  const tempId = `blog_${Date.now()}`;
  let mainImg = postData.imageSrc || "";
  if (postData.imageFile)
    mainImg = await uploadBlogImage(postData.imageFile, tempId, "mainImage");
  let authImg = postData.authorImageSrc || "";
  if (postData.authorImageFile)
    authImg = await uploadBlogImage(
      postData.authorImageFile,
      tempId,
      "authorImage",
    );

  const { imageFile, authorImageFile, ...cleanData } = postData;
  return (
    await addDoc(blogPostsRef, {
      ...cleanData,
      imageSrc: mainImg,
      authorImageSrc: authImg,
      likes: 0,
      dislikes: 0,
      commentsCount: 0,
      comments: [],
      date: Timestamp.fromDate(new Date(postData.date)),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  ).id;
};

export const updateBlogPost = async (id, data) => {
  let mainImg = data.imageSrc || "";
  if (data.imageFile)
    mainImg = await uploadBlogImage(data.imageFile, id, "mainImage");
  let authImg = data.authorImageSrc || "";
  if (data.authorImageFile)
    authImg = await uploadBlogImage(data.authorImageFile, id, "authorImage");

  const { imageFile, authorImageFile, ...cleanData } = data;
  await updateDoc(doc(db, "blogPosts", id), {
    ...cleanData,
    imageSrc: mainImg,
    authorImageSrc: authImg,
    date: Timestamp.fromDate(new Date(data.date)),
    updatedAt: serverTimestamp(),
  });
};

export const deleteBlogPost = (id) => deleteDoc(doc(db, "blogPosts", id));
export const updateBlogPostEngagement = (id, updates) =>
  updateDoc(doc(db, "blogPosts", id), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
export const addCommentToBlogPost = (id, comment) =>
  updateDoc(doc(db, "blogPosts", id), {
    comments: arrayUnion({ ...comment, date: Timestamp.now() }),
    commentsCount: increment(1),
    updatedAt: serverTimestamp(),
  });

// --- CONTACT MESSAGES ---
export const addContactMessage = (data) =>
  addDoc(contactsRef, { ...data, createdAt: serverTimestamp() });
export const getContactMessages = async () => {
  const q = query(contactsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt:
      d.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
  }));
};
export const deleteContactMessage = (id) => deleteDoc(doc(db, "contacts", id));

// --- TESTIMONIALS ---
export const getTestimonials = async (filter) => {
  const constraints = [
    where("status", "==", "approved"),
    orderBy("createdAt", "desc"),
  ];
  if (filter?.category)
    constraints.unshift(where("serviceCategory", "==", filter.category));
  const q = query(testimonialsRef, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate().toISOString(),
  }));
};
export const addTestimonial = (data) =>
  addDoc(testimonialsRef, {
    ...data,
    status: "approved",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
export const updateTestimonial = (id, data) =>
  updateDoc(doc(db, "testimonials", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
export const deleteTestimonial = (id) => deleteDoc(doc(db, "testimonials", id));

// --- SITE CONTENT & BANNERS ---
export const getAdsBanners = async () => {
  const snap = await getDoc(doc(db, "siteContent", "adsBanners"));
  return snap.exists() ? snap.data().banners || [] : [];
};

export const updateAdsBanners = async (bannersArray) => {
  await setDoc(doc(db, "siteContent", "adsBanners"), {
    banners: bannersArray,
    updatedAt: serverTimestamp(),
  });
};

const amazonProductsRef = collection(db, "amazonProducts");

export const getAmazonProducts = async () => {
  const q = query(amazonProductsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return {
    products: snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate(),
    })),
  };
};

export const addAmazonProduct = async (data) => {
  console.log("Starting product upload...", data);
  const productId = `amz_${Date.now()}`;
  let mainImageUrl = "";
  const extraImageUrls = [];

  try {
    // 1. Upload Main Image
    if (data.mainImage) {
      console.log("Uploading main image...");
      mainImageUrl = await uploadAmazonProductImage(
        data.mainImage,
        productId,
        "main",
      );
    }

    // 2. Upload Extra Images
    if (data.extraImages && data.extraImages.length > 0) {
      console.log(`Uploading ${data.extraImages.length} extra images...`);
      for (let i = 0; i < data.extraImages.length; i++) {
        const url = await uploadAmazonProductImage(
          data.extraImages[i],
          productId,
          `extra_${i}`,
        );
        extraImageUrls.push(url);
      }
    }

    // 3. Save to Firestore
    console.log("Saving to Firestore...");
    const docRef = await addDoc(collection(db, "amazonProducts"), {
      name: data.name,
      description: data.description,
      ctaLink: data.ctaLink,
      mainImageUrl,
      extraImageUrls,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("Success! ID:", docRef.id);
    return docRef;
  } catch (error) {
    console.error("DETAILED ERROR:", error.code, error.message);
    throw error; // Re-throw so the UI toast shows up
  }
};

export const deleteAmazonProduct = (id) =>
  deleteDoc(doc(db, "amazonProducts", id));

// --- SITE VISITORS & ANALYTICS ---

/**
 * Fetch a larger sample of recent traffic for the table.
 * Increased limit from 100 to 1000.
 */
export const getVisitorStats = async () => {
  // Increased limit to 1000 so the table shows more history
  const q = query(visitorLogRef, orderBy("timestamp", "desc"), limit(1000));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    timestamp: d.data().timestamp?.toDate().toLocaleString() || "Just now",
  }));
};

/**
 * High-performance metrics fetcher.
 * Uses getCountFromServer to get TRUE totals without hitting the 100/1000 document limit.
 */
export const getQuickMetrics = async () => {
  try {
    // 1. Get True Total Page Hits
    const totalSnap = await getCountFromServer(visitorLogRef);

    // 2. Get True Unique Sessions
    const uniqueQuery = query(visitorLogRef, where("isUnique", "==", true));
    const uniqueSnap = await getCountFromServer(uniqueQuery);

    return {
      total: totalSnap.data().count,
      unique: uniqueSnap.data().count,
    };
  } catch (error) {
    console.error("Error fetching count metrics:", error);
    return { total: 0, unique: 0 };
  }
};

// --- ADS.TXT MANAGEMENT ---
export const getAdsTxtContent = async () => {
  const snap = await getDoc(doc(db, "siteContent", "adsTxt"));
  return snap.exists() ? snap.data().content || "" : "";
};

export const updateAdsTxtContent = async (content) => {
  await setDoc(doc(db, "siteContent", "adsTxt"), {
    content: content,
    updatedAt: serverTimestamp(),
  });
};
