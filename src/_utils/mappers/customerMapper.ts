import { serverTimestamp } from "firebase/firestore";
import { CustomerInformation } from "types";
import { CustomerData } from "types/server";

export const mapCustomerrData = (data: CustomerInformation): CustomerData => {
    return {
        address: data.address,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        createdDate: serverTimestamp(),
        updatedDate: serverTimestamp(),
  };
}