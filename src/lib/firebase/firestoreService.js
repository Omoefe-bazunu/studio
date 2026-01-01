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
} from "firebase/firestore";
import {
  uploadProjectScreenshot,
  uploadMarketingAdImage,
  uploadBlogImage,
  uploadAdsBannerImage,
  uploadTopHeaderBannerImage,
} from "./storageService";

// --- Collection References ---
const webProjectsRef = collection(db, "webProjects");
const mobileProjectsRef = collection(db, "mobileProjects");
const saasProjectsRef = collection(db, "saasProjects");
const marketingAdProjectsRef = collection(db, "marketingAdProjects");
const testimonialsRef = collection(db, "testimonials");
const contactsRef = collection(db, "contacts");
const blogPostsRef = collection(db, "blogPosts");
const siteContentRef = collection(db, "siteContent");
const pricingPlansRef = collection(db, "pricingPlans");
// Site Visitors
const visitorLogRef = collection(db, "visitorLog");

// --- Helper: Generic Project Fetcher ---
const fetchProjects = async (colRef) => {
  const q = query(colRef, orderBy("deliveryDate", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      deliveryDate:
        data.deliveryDate?.toDate().toISOString().split("T")[0] || "",
      createdAt:
        data.createdAt?.toDate().toISOString() || new Date(0).toISOString(),
      updatedAt:
        data.updatedAt?.toDate().toISOString() || new Date(0).toISOString(),
    };
  });
};

// --- Helper: Generic Project Saver ---
const saveProjectScreenshots = async (projectData, pathPrefix) => {
  const urls = [];
  const hints = [];
  for (const ss of projectData.screenshots || []) {
    if (ss.file) {
      const url = await uploadProjectScreenshot(ss.file, pathPrefix);
      urls.push(url);
      hints.push(ss.hint || "");
    } else if (ss.url) {
      urls.push(ss.url);
      hints.push(ss.hint || "");
    }
  }
  return { urls, hints };
};

// --- WEB PROJECTS ---
export const getWebProjects = () => fetchProjects(webProjectsRef);
export const addWebProject = async (data) => {
  const { urls, hints } = await saveProjectScreenshots(
    data,
    `web_${Date.now()}`
  );
  const { screenshots, ...cleanData } = data;
  return (
    await addDoc(webProjectsRef, {
      ...cleanData,
      screenshots: urls,
      imageHints: hints,
      category: "Web Development",
      deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  ).id;
};
export const updateWebProject = async (id, data) => {
  const { urls, hints } = await saveProjectScreenshots(data, id);
  const { screenshots, ...cleanData } = data;
  await updateDoc(doc(db, "webProjects", id), {
    ...cleanData,
    screenshots: urls,
    imageHints: hints,
    deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
    updatedAt: serverTimestamp(),
  });
};
export const deleteWebProject = (id) => deleteDoc(doc(db, "webProjects", id));

// --- MOBILE PROJECTS ---
export const getMobileProjects = () => fetchProjects(mobileProjectsRef);
export const addMobileProject = async (data) => {
  const { urls, hints } = await saveProjectScreenshots(
    data,
    `mob_${Date.now()}`
  );
  const { screenshots, ...cleanData } = data;
  return (
    await addDoc(mobileProjectsRef, {
      ...cleanData,
      screenshots: urls,
      imageHints: hints,
      category: "Mobile App Development",
      deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  ).id;
};
export const updateMobileProject = async (id, data) => {
  const { urls, hints } = await saveProjectScreenshots(data, id);
  const { screenshots, ...cleanData } = data;
  await updateDoc(doc(db, "mobileProjects", id), {
    ...cleanData,
    screenshots: urls,
    imageHints: hints,
    deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
    updatedAt: serverTimestamp(),
  });
};
export const deleteMobileProject = (id) =>
  deleteDoc(doc(db, "mobileProjects", id));

// --- SAAS PROJECTS ---
export const getSaasProjects = () => fetchProjects(saasProjectsRef);
export const addSaasProject = async (data) => {
  const { urls, hints } = await saveProjectScreenshots(
    data,
    `saas_${Date.now()}`
  );
  const { screenshots, ...cleanData } = data;
  return (
    await addDoc(saasProjectsRef, {
      ...cleanData,
      screenshots: urls,
      imageHints: hints,
      category: "SaaS Development",
      deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  ).id;
};
export const updateSaasProject = async (id, data) => {
  const { urls, hints } = await saveProjectScreenshots(data, id);
  const { screenshots, ...cleanData } = data;
  await updateDoc(doc(db, "saasProjects", id), {
    ...cleanData,
    screenshots: urls,
    imageHints: hints,
    deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
    updatedAt: serverTimestamp(),
  });
};
export const deleteSaasProject = (id) => deleteDoc(doc(db, "saasProjects", id));

// --- MARKETING & ADS PROJECTS ---
export const getMarketingAdProjects = () =>
  fetchProjects(marketingAdProjectsRef);
export const addMarketingAdProject = async (data) => {
  let url = data.imageSrc || "";
  if (data.imageFile)
    url = await uploadMarketingAdImage(data.imageFile, `mad_${Date.now()}`);
  const { imageFile, ...cleanData } = data;
  return (
    await addDoc(marketingAdProjectsRef, {
      ...cleanData,
      imageSrc: url,
      category: "Marketing & Ads Design",
      deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  ).id;
};
export const updateMarketingAdProject = async (id, data) => {
  let url = data.imageSrc;
  if (data.imageFile) url = await uploadMarketingAdImage(data.imageFile, id);
  const { imageFile, ...cleanData } = data;
  await updateDoc(doc(db, "marketingAdProjects", id), {
    ...cleanData,
    imageSrc: url,
    deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
    updatedAt: serverTimestamp(),
  });
};
export const deleteMarketingAdProject = (id) =>
  deleteDoc(doc(db, "marketingAdProjects", id));

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
      "authorImage"
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
export const getAdsBannerContent = async () => {
  const snap = await getDoc(doc(siteContentRef, "mainBanner"));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};
export const setAdsBannerContent = async (data) => {
  let url = data.imageUrl;
  if (data.imageFile)
    url = await uploadAdsBannerImage(data.imageFile, "mainBanner");
  const { imageFile, ...cleanData } = data;
  await setDoc(
    doc(siteContentRef, "mainBanner"),
    { ...cleanData, imageUrl: url, updatedAt: serverTimestamp() },
    { merge: true }
  );
};

export const getTopHeaderBannerContent = async () => {
  const snap = await getDoc(doc(siteContentRef, "topHeaderBanner"));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};
export const setTopHeaderBannerContent = async (data) => {
  let url = data.imageUrl;
  if (data.imageFile)
    url = await uploadTopHeaderBannerImage(data.imageFile, "topHeaderBanner");
  const { imageFile, ...cleanData } = data;
  await setDoc(
    doc(siteContentRef, "topHeaderBanner"),
    { ...cleanData, imageUrl: url, updatedAt: serverTimestamp() },
    { merge: true }
  );
};

//Site visitors

export const getVisitorStats = async () => {
  const q = query(visitorLogRef, orderBy("timestamp", "desc"), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    timestamp: d.data().timestamp?.toDate().toLocaleString() || "Just now",
  }));
};
