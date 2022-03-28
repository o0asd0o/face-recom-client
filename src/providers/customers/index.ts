import { DocumentData, getDocs, onSnapshot, query, QuerySnapshot, where } from "firebase/firestore";
import { customersCollection } from "providers/firebase";

export const onCustomersSnapshot = (
  observer: (snashot: QuerySnapshot<DocumentData>) => void,
) => {
  const resQuery = query(customersCollection);

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
}