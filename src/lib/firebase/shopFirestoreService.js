// lib/firebase/shopFirestoreService.js
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

const PRODUCTS_COL = "shopProducts";
const ORDERS_COL = "shopOrders";

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts() {
  const q = query(collection(db, PRODUCTS_COL), orderBy("category", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getProductBySlug(slug) {
  const q = query(collection(db, PRODUCTS_COL), orderBy("category", "asc"));
  const snap = await getDocs(q);
  const match = snap.docs.find((d) => d.data().slug === slug);
  if (!match) return null;
  return { id: match.id, ...match.data() };
}

export async function addProduct({ imageFile, videoFile, ...rest }) {
  // imageUrl and videoUrl are already resolved URLs passed from the modal
  const docRef = await addDoc(collection(db, PRODUCTS_COL), {
    ...rest,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id, { imageFile, videoFile, ...rest }) {
  // imageUrl and videoUrl are already resolved URLs passed from the modal
  await updateDoc(doc(db, PRODUCTS_COL, id), {
    ...rest,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, PRODUCTS_COL, id));
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function saveOrder(order) {
  const docRef = await addDoc(collection(db, ORDERS_COL), {
    ...order,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getOrders() {
  const q = query(collection(db, ORDERS_COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
