import {
  doc,
  DocumentData,
  getFirestore,
  onSnapshot,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import { restoOwnersCollection } from "providers/firebase";
import { Status } from "types";

const firestoreRef = getFirestore();

export const onRestoOwnersSnapshot = (
  observer: (snashot: QuerySnapshot<DocumentData>) => void,
  status?: Status
) => {
  let resQuery = query(restoOwnersCollection, where("role", "==", "owner"));

  if (status) {
    resQuery = query(
      restoOwnersCollection,
      where("role", "==", "owner"),
      where("status", "==", status)
    );
  }
  return onSnapshot(resQuery, observer);
};

export const updateStatus = async (ownerId: string, status: Status) =>
  await updateDoc(doc(firestoreRef, "users", ownerId), { status: status });
