import { doc, DocumentData, getDocs, getFirestore, onSnapshot, query, QuerySnapshot, updateDoc, where } from "firebase/firestore";
import { customersCollection } from "providers/firebase";

const firestoreRef = getFirestore();

export const onCustomersSnapshot = (
  observer: (snashot: QuerySnapshot<DocumentData>) => void,
  email: string,
) => {
  const resQuery = query(customersCollection, where('email', '==', email));

  return onSnapshot(resQuery, observer)
};

export const emailExists = async (email: string): Promise<boolean> => {

    const emailsSnapshot = await getDocs(
        query(customersCollection, where('email', '==', email))
    );

    return emailsSnapshot.size > 0
};

export const getCurrentCustomer = async (email: string) => {
    const usersSnapshot = await getDocs(
        query(
            customersCollection,
            where('email', '==', email)
        )
    );
    
    return usersSnapshot.docs[0];
};

export const  updatePreferences = async (customerId: string, preferences: string[]) => 
    await updateDoc(
        doc(firestoreRef, 'customers', customerId),
        { preferences }
    );
