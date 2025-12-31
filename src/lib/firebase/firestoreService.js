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
  increment,
  setDoc,
} from "firebase/firestore";
import {
  uploadProjectScreenshot,
  deleteFileFromStorage,
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

// --- Helper: Generic Project Fetcher ---
const fetchProjects = async (colRef) => {
  const q = query(colRef, orderBy("deliveryDate", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      deliveryDate: data.deliveryDate.toDate().toISOString().split("T")[0],
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
  for (const ss of projectData.screenshots) {
    if (ss.file) {
      const url = await uploadProjectScreenshot(ss.file, pathPrefix);
      urls.push(url);
      hints.push(ss.hint);
    } else if (ss.url) {
      urls.push(ss.url);
      hints.push(ss.hint);
    }
  }
  return { urls, hints };
};

// --- CORE SERVICES: Web, Mobile, SaaS, Design ---

export const addWebProject = async (data) => {
  const { urls, hints } = await saveProjectScreenshots(
    data,
    `web_${Date.now()}`
  );
  return (
    await addDoc(webProjectsRef, {
      ...data,
      screenshots: urls,
      imageHints: hints,
      category: "Web Development",
      deliveryDate: Timestamp.fromDate(data.deliveryDate),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  ).id;
};
export const getWebProjects = () => fetchProjects(webProjectsRef);
export const updateWebProject = async (id, data) => {
  const { urls, hints } = await saveProjectScreenshots(data, id);
  await updateDoc(doc(db, "webProjects", id), {
    ...data,
    screenshots: urls,
    imageHints: hints,
    deliveryDate: Timestamp.fromDate(data.deliveryDate),
    updatedAt: serverTimestamp(),
  });
};
export const deleteWebProject = async (id) =>
  await deleteDoc(doc(db, "webProjects", id));

export const addMobileProject = async (data) => {
  const { urls, hints } = await saveProjectScreenshots(
    data,
    `mob_${Date.now()}`
  );
  return (
    await addDoc(mobileProjectsRef, {
      ...data,
      screenshots: urls,
      imageHints: hints,
      category: "Mobile App Development",
      deliveryDate: Timestamp.fromDate(data.deliveryDate),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  ).id;
};
export const getMobileProjects = () => fetchProjects(mobileProjectsRef);
export const updateMobileProject = async (id, data) => {
  const { urls, hints } = await saveProjectScreenshots(data, id);
  await updateDoc(doc(db, "mobileProjects", id), {
    ...data,
    screenshots: urls,
    imageHints: hints,
    deliveryDate: Timestamp.fromDate(data.deliveryDate),
    updatedAt: serverTimestamp(),
  });
};
export const deleteMobileProject = async (id) =>
  await deleteDoc(doc(db, "mobileProjects", id));

export const addSaasProject = async (data) => {
  const { urls, hints } = await saveProjectScreenshots(
    data,
    `saas_${Date.now()}`
  );
  return (
    await addDoc(saasProjectsRef, {
      ...data,
      screenshots: urls,
      imageHints: hints,
      category: "SaaS Development",
      deliveryDate: Timestamp.fromDate(data.deliveryDate),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  ).id;
};
export const getSaasProjects = () => fetchProjects(saasProjectsRef);
export const updateSaasProject = async (id, data) => {
  const { urls, hints } = await saveProjectScreenshots(data, id);
  await updateDoc(doc(db, "saasProjects", id), {
    ...data,
    screenshots: urls,
    imageHints: hints,
    deliveryDate: Timestamp.fromDate(data.deliveryDate),
    updatedAt: serverTimestamp(),
  });
};
export const deleteSaasProject = async (id) =>
  await deleteDoc(doc(db, "saasProjects", id));

export const addMarketingAdProject = async (data) => {
  let url = data.imageSrc || "";
  if (data.imageFile)
    url = await uploadMarketingAdImage(data.imageFile, `mad_${Date.now()}`);
  return (
    await addDoc(marketingAdProjectsRef, {
      ...data,
      imageSrc: url,
      category: "Marketing & Ads Design",
      deliveryDate: Timestamp.fromDate(data.deliveryDate),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  ).id;
};
export const getMarketingAdProjects = () =>
  fetchProjects(marketingAdProjectsRef);
export const updateMarketingAdProject = async (id, data) => {
  let url = data.imageSrc;
  if (data.imageFile) url = await uploadMarketingAdImage(data.imageFile, id);
  await updateDoc(doc(db, "marketingAdProjects", id), {
    ...data,
    imageSrc: url,
    deliveryDate: Timestamp.fromDate(data.deliveryDate),
    updatedAt: serverTimestamp(),
  });
};
export const deleteMarketingAdProject = async (id) =>
  await deleteDoc(doc(db, "marketingAdProjects", id));

// --- BLOG POSTS SERVICE FUNCTIONS ---

export const addBlogPost = async (postData) => {
  const tempId = `blog_${Date.now()}`;
  let mainImg = postData.imageSrc || "";
  if (postData.imageFile)
    mainImg = await uploadBlogImage(postData.imageFile, tempId, "main");
  let authImg = postData.authorImageSrc || "";
  if (postData.authorImageFile)
    authImg = await uploadBlogImage(postData.authorImageFile, tempId, "auth");

  return (
    await addDoc(blogPostsRef, {
      ...postData,
      imageSrc: mainImg,
      authorImageSrc: authImg,
      likes: 0,
      dislikes: 0,
      commentsCount: 0,
      comments: [],
      date: Timestamp.fromDate(postData.date),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  ).id;
};

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
      date: data.date.toDate().toISOString(),
      createdAt: data.createdAt?.toDate().toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString(),
      comments: (data.comments || []).map((c) => ({
        ...c,
        date: c.date.toDate().toISOString(),
      })),
    };
  });
};

export const updateBlogPost = async (id, postData) => {
  const docRef = doc(db, "blogPosts", id);
  const updateData = {
    ...postData,
    date: Timestamp.fromDate(postData.date),
    updatedAt: serverTimestamp(),
  };
  delete updateData.imageFile;
  delete updateData.authorImageFile;
  await updateDoc(docRef, updateData);
};

export const deleteBlogPost = async (id) =>
  await deleteDoc(doc(db, "blogPosts", id));

// --- ADS BANNER & SITE CONTENT ---

const ADS_BANNER_DOC_ID = "mainBanner";

export const getAdsBannerContent = async () => {
  const snap = await getDoc(doc(siteContentRef, ADS_BANNER_DOC_ID));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt?.toDate().toISOString(),
    updatedAt: data.updatedAt?.toDate().toISOString(),
  };
};

export const setAdsBannerContent = async (formData) => {
  const docRef = doc(siteContentRef, ADS_BANNER_DOC_ID);
  const existingDoc = await getDoc(docRef);
  const existingData = existingDoc.exists() ? existingDoc.data() : null;

  let newImageUrl =
    formData.imageUrl ||
    existingData?.imageUrl ||
    "https://placehold.co/1200x400";

  if (formData.imageFile) {
    newImageUrl = await uploadAdsBannerImage(
      formData.imageFile,
      ADS_BANNER_DOC_ID
    );
    if (
      existingData?.imageUrl &&
      !existingData.imageUrl.startsWith("https://placehold.co")
    ) {
      try {
        await deleteFileFromStorage(existingData.imageUrl);
      } catch (e) {
        console.warn(e);
      }
    }
  }

  const dataToSet = {
    ...formData,
    imageUrl: newImageUrl,
    updatedAt: serverTimestamp(),
  };
  delete dataToSet.imageFile;

  if (existingDoc.exists()) {
    await updateDoc(docRef, dataToSet);
  } else {
    await setDoc(docRef, { ...dataToSet, createdAt: serverTimestamp() });
  }
};

const TOP_HEADER_BANNER_DOC_ID = "topHeaderBanner";

export const getTopHeaderBannerContent = async () => {
  const snap = await getDoc(doc(siteContentRef, TOP_HEADER_BANNER_DOC_ID));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    updatedAt: data.updatedAt?.toDate().toISOString(),
  };
};

export const setTopHeaderBannerContent = async (formData) => {
  const docRef = doc(siteContentRef, TOP_HEADER_BANNER_DOC_ID);
  const data = { ...formData, updatedAt: serverTimestamp() };
  delete data.imageFile;
  await setDoc(docRef, data, { merge: true });
};

// --- CONTACTS & TESTIMONIALS ---

export const addContactMessage = async (formData) => {
  return (
    await addDoc(contactsRef, {
      ...formData,
      serviceOfInterest:
        formData.serviceOfInterest === "_none_"
          ? ""
          : formData.serviceOfInterest,
      createdAt: serverTimestamp(),
    })
  ).id;
};

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

export const addTestimonial = async (formData) => {
  return (
    await addDoc(testimonialsRef, {
      ...formData,
      status: "approved",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  ).id;
};

export const updateTestimonial = async (id, data) => {
  await updateDoc(doc(db, "testimonials", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTestimonial = async (id) =>
  await deleteDoc(doc(db, "testimonials", id));
