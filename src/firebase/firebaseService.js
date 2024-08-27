import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  query,
  orderBy,
  where,
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { v4 as uuidv4 } from "uuid";

export const isEmailRegistered = async (email) => {
  const usersRef = collection(db, "profiles");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const addProfileToFirestore = async (profile) => {
  try {
    await addDoc(collection(db, "profiles"), profile);
    console.log("Profile added to Firestore");
  } catch (e) {
    console.error("Error adding profile: ", e);
  }
};

export const getProfilesFromFirestore = async () => {
  try {
    const profilesCollection = collection(db, "profiles");
    const profilesSnapshot = await getDocs(profilesCollection);
    return profilesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error fetching profiles: ", e);
    return [];
  }
};

export const findProfileInFirestore = async (email, password) => {
  try {
    const profilesCollection = collection(db, "profiles");
    const q = query(
      profilesCollection,
      where("email", "==", email),
      where("password", "==", password)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))[0];
  } catch (e) {
    alert("Error finding profile: ", e);
    return false;
  }
};

export async function refreshAccount(accountNumber) {
  if (!accountNumber) {
    console.log("Account number is required to fetch user account.");
    return null;
  }

  try {
    const usersCollectionRef = collection(db, "profiles");

    const q = query(
      usersCollectionRef,
      where("accountNumber", "==", accountNumber)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data();
    } else {
      console.log("No user found with this account number.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user account by account number:", error);
    return null;
  }
}

export const updateBalanceInFirestore = async (profileId, newBalance) => {
  try {
    const profileRef = doc(db, "profiles", profileId);
    await updateDoc(profileRef, {
      balance: newBalance,
    });
    console.log("Balance updated in Firestore");
  } catch (e) {
    console.error("Error updating balance: ", e);
  }
};

export const updateBalanceVisibility = async (profileId, visibility) => {
  try {
    const profileRef = doc(db, "profiles", profileId);
    await updateDoc(profileRef, {
      showBalance: visibility,
    });
    console.log("visibility updated in Firestore");
  } catch (e) {
    console.error("Error updating visibility: ", e);
  }
};

export const logDepositTransaction = async (profileId, amount) => {
  try {
    const transactionId = uuidv4();
    const transactionData = {
      transactionId: transactionId,
      type: "deposit",
      profileId: profileId,
      amount: amount,
      timestamp: new Date(),
      status: "completed",
    };

    await setDoc(doc(db, "transactions", transactionId), transactionData);
    console.log("Deposit transaction logged");
  } catch (error) {
    console.error("Error logging deposit transaction:", error.message);
  }
};

export const logTransferTransaction = async (
  profileId,
  senderFirstname,
  senderLastname,
  recipientId,
  recipientFirstname,
  recipientLastname,
  amount
) => {
  try {
    const transactionId = uuidv4();
    const transactionData = {
      transactionId: transactionId,
      type: "transfer",
      profileId: profileId,
      senderFirstname: senderFirstname,
      senderLastname: senderLastname,
      recipientId: recipientId,
      recipientFirstname: recipientFirstname,
      recipientLastname: recipientLastname,
      amount: amount,
      timestamp: new Date(),
      status: "completed",
    };

    await setDoc(doc(db, "transactions", transactionId), transactionData);
    console.log("Transfer transaction logged");
  } catch (error) {
    console.error("Error logging transfer transaction:", error.message);
  }
};

export const fetchUserTransactions = async (profileId) => {
  try {
    const transactionsRef = collection(db, "transactions");

    const senderQuery = query(
      transactionsRef,
      where("profileId", "==", profileId),
      orderBy("timestamp", "desc")
    );

    const recipientQuery = query(
      transactionsRef,
      where("recipientId", "==", profileId),
      orderBy("timestamp", "desc")
    );

    const [senderSnapshot, recipientSnapshot] = await Promise.all([
      getDocs(senderQuery),
      getDocs(recipientQuery),
    ]);

    const senderTransactions = senderSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const recipientTransactions = recipientSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const combinedTransactions = [
      ...senderTransactions,
      ...recipientTransactions,
    ];
    combinedTransactions.sort(
      (a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()
    );

    return combinedTransactions;
  } catch (error) {
    console.error("Error fetching transactions: ", error);
    return [];
  }
};

export const addBeneficiary = async (
  profileId,
  recipientAccountNumber,
  recipientFirstname,
  recipientLastname,
  recipientImageUrl
) => {
  try {
    const beneficiaryRef = doc(db, "beneficiaries", profileId);

    const docSnap = await getDoc(beneficiaryRef);

    if (docSnap.exists()) {
      await updateDoc(beneficiaryRef, {
        beneficiaryList: arrayUnion({
          accountNumber: recipientAccountNumber,
          firstname: recipientFirstname,
          lastname: recipientLastname,
          imageUrl: recipientImageUrl,
        }),
      });
    } else {
      await setDoc(beneficiaryRef, {
        beneficiaryList: [
          {
            accountNumber: recipientAccountNumber,
            firstname: recipientFirstname,
            lastname: recipientLastname,
            imageUrl: recipientImageUrl,
          },
        ],
      });
    }

    console.log("Beneficiary added successfully");
  } catch (error) {
    console.error("Error adding beneficiary:", error);
  }
};

export const updateBeneficiaryImageUrls = async (
  userAccountNumber,
  newImageUrl
) => {
  try {
    const beneficiariesRef = collection(db, "beneficiaries");
    const querySnapshot = await getDocs(beneficiariesRef);

    querySnapshot.forEach(async (docSnap) => {
      const docData = docSnap.data();
      const beneficiaryList = docData.beneficiaryList || [];

      let needsUpdate = false;
      const updatedBeneficiaryList = beneficiaryList.map((beneficiary) => {
        if (beneficiary.accountNumber === userAccountNumber) {
          needsUpdate = true;
          return {
            ...beneficiary,
            imageUrl: newImageUrl,
          };
        }
        return beneficiary;
      });

      if (needsUpdate) {
        await updateDoc(docSnap.ref, {
          beneficiaryList: updatedBeneficiaryList,
        });
        console.log(`Updated beneficiary list in document ${docSnap.id}`);
      } else {
        console.log(`No matching beneficiary found in document ${docSnap.id}`);
      }
    });
  } catch (error) {
    console.error("Error updating beneficiary image:", error);
  }
};

export async function isAccountNumberInBeneficiaryList(
  loggedInUserId,
  accountNumber
) {
  try {
    const beneficiaryDocRef = doc(db, "beneficiaries", loggedInUserId);

    const beneficiaryDocSnap = await getDoc(beneficiaryDocRef);

    if (beneficiaryDocSnap.exists()) {
      const beneficiaryData = beneficiaryDocSnap.data();

      const beneficiaryList = beneficiaryData.beneficiaryList;

      const accountExists = beneficiaryList.some(
        (beneficiary) => beneficiary.accountNumber === accountNumber
      );

      return accountExists;
    } else {
      console.log("No beneficiary list found for this user.");
      return false;
    }
  } catch (error) {
    console.error("Error checking beneficiary list:", error);
    return false;
  }
}

export const fetchBeneficiaryList = async (userId) => {
  try {
    const userDocRef = doc(db, "beneficiaries", userId);

    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();

      return { beneficiaries: userData.beneficiaryList || [], error: null };
    } else {
      console.log("No beneficiary list found for this user.");
      return {
        beneficiaries: [],
        error:
          "Maybe the beneficiaries are the friends we made along the way :)",
      };
    }
  } catch (error) {
    console.error("Error fetching beneficiary list:", error);
    return {
      beneficiaries: [],
      error: "Network error",
    };
  }
};

export async function deleteBeneficiary(userId, accountNumber) {
  try {
    const userDocRef = doc(db, "beneficiaries", userId);

    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.log("No such document!");
      return;
    }

    const data = userDoc.data();
    console.log("Current data:", data);

    if (Array.isArray(data.beneficiaryList)) {
      const beneficiaryToDelete = data.beneficiaryList.find(
        (beneficiary) => beneficiary.accountNumber === accountNumber
      );

      if (beneficiaryToDelete) {
        await updateDoc(userDocRef, {
          beneficiaryList: arrayRemove(beneficiaryToDelete),
        });

        console.log("Beneficiary deleted successfully.");
      } else {
        console.log("Beneficiary not found in the list.");
      }
    } else {
      console.log("Beneficiary list is not an array or does not exist.");
    }
  } catch (error) {
    console.error("Error deleting beneficiary:", error);
  }
}
