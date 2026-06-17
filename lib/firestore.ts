import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  updateDoc,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import { generateSlug } from "./utils";

export interface Memory {
  id: string;
  slug: string;
  name: string;
  product: string;
  year: number;
  price?: string;
  personalMemory?: string;
  aiResponse: string;
  photoUrl?: string;
  photoStoragePath?: string;
  shareToX: boolean;
  createdAt: Timestamp;
  likes: number;
}

export interface MemoryInput {
  name: string;
  product: string;
  year: number;
  price?: string;
  personalMemory?: string;
  aiResponse: string;
  photo?: File;
  shareToX: boolean;
}

export async function uploadPhoto(
  memoryId: string,
  file: File
): Promise<{ photoUrl: string; photoStoragePath: string }> {
  const photoStoragePath = `memories/${memoryId}/${file.name}`;
  const storageRef = ref(storage, photoStoragePath);
  await uploadBytes(storageRef, file);
  const photoUrl = await getDownloadURL(storageRef);
  return { photoUrl, photoStoragePath };
}

export async function saveMemory(input: MemoryInput): Promise<Memory> {
  const slug = generateSlug(input.name, input.year);

  const docRef = await addDoc(collection(db, "memories"), {
    slug,
    name: input.name,
    product: input.product,
    year: input.year,
    price: input.price || null,
    personalMemory: input.personalMemory || null,
    aiResponse: input.aiResponse,
    shareToX: input.shareToX,
    createdAt: Timestamp.now(),
    likes: 0,
  });

  let photoUrl: string | undefined;
  let photoStoragePath: string | undefined;

  if (input.photo) {
    const uploaded = await uploadPhoto(docRef.id, input.photo);
    photoUrl = uploaded.photoUrl;
    photoStoragePath = uploaded.photoStoragePath;
    await updateDoc(doc(db, "memories", docRef.id), {
      photoUrl,
      photoStoragePath,
    });
  }

  return {
    id: docRef.id,
    slug,
    name: input.name,
    product: input.product,
    year: input.year,
    price: input.price,
    personalMemory: input.personalMemory,
    aiResponse: input.aiResponse,
    photoUrl,
    photoStoragePath,
    shareToX: input.shareToX,
    createdAt: Timestamp.now(),
    likes: 0,
  };
}

export async function getMemoryBySlug(slug: string): Promise<Memory | null> {
  const q = query(collection(db, "memories"), where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Memory;
}

export type SortOption = "newest" | "oldest" | "most-liked";

export async function getMemories(
  pageSize: number = 12,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  sort: SortOption = "newest"
): Promise<{ memories: Memory[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  let orderField: string;
  let orderDirection: "asc" | "desc";

  switch (sort) {
    case "oldest":
      orderField = "createdAt";
      orderDirection = "asc";
      break;
    case "most-liked":
      orderField = "likes";
      orderDirection = "desc";
      break;
    default:
      orderField = "createdAt";
      orderDirection = "desc";
  }

  let q = query(
    collection(db, "memories"),
    orderBy(orderField, orderDirection),
    limit(pageSize)
  );

  if (lastDoc) {
    q = query(
      collection(db, "memories"),
      orderBy(orderField, orderDirection),
      startAfter(lastDoc),
      limit(pageSize)
    );
  }

  const snapshot = await getDocs(q);
  const memories = snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as Memory
  );
  const newLastDoc =
    snapshot.docs.length > 0
      ? snapshot.docs[snapshot.docs.length - 1]
      : null;

  return { memories, lastDoc: newLastDoc };
}

export async function likeMemory(memoryId: string): Promise<void> {
  await updateDoc(doc(db, "memories", memoryId), {
    likes: increment(1),
  });
}

export async function getMemoryCount(): Promise<number> {
  const snapshot = await getDocs(collection(db, "memories"));
  return snapshot.size;
}