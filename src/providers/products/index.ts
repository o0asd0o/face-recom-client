import { deleteDoc, doc, DocumentData, getFirestore, onSnapshot, query, QuerySnapshot, updateDoc, where } from "firebase/firestore";
import { productsCollection } from "providers/firebase";
import { ProductData } from "types/server";

const firestoreRef = getFirestore();

export const onProductsSnapshot = (
  observer: (snashot: QuerySnapshot<DocumentData>) => void,
) => {
  const resQuery = query(productsCollection)

  return onSnapshot(resQuery, observer)
};

export const updateProductDoc = async (
  productId: string,
  data: ProductData
) =>
  await updateDoc(
    doc(firestoreRef, 'products', productId),
    data
  );

export const deleteProductDoc = async (productId: string) => await deleteDoc(doc(firestoreRef, 'products', productId));