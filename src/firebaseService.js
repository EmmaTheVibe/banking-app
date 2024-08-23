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
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { v4 as uuidv4 } from "uuid";

export const isEmailRegistered = async (email) => {
  const usersRef = collection(db, "profiles");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty; // Returns true if email is found
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

    // Query for transactions where profileId matches
    const senderQuery = query(
      transactionsRef,
      where("profileId", "==", profileId),
      orderBy("timestamp", "desc")
    );

    // Query for transactions where recipientId matches
    const recipientQuery = query(
      transactionsRef,
      where("recipientId", "==", profileId),
      orderBy("timestamp", "desc")
    );

    // Execute both queries
    const [senderSnapshot, recipientSnapshot] = await Promise.all([
      getDocs(senderQuery),
      getDocs(recipientQuery),
    ]);

    // Combine results and remove duplicates (if any)
    const senderTransactions = senderSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const recipientTransactions = recipientSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Combine and remove duplicates
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
    // Reference the document using the sender's ID as the document ID
    const beneficiaryRef = doc(db, "beneficiaries", profileId);

    // Check if the document already exists
    const docSnap = await getDoc(beneficiaryRef);

    if (docSnap.exists()) {
      // If the document exists, update the beneficiary list
      await updateDoc(beneficiaryRef, {
        beneficiaryList: arrayUnion({
          accountNumber: recipientAccountNumber,
          firstname: recipientFirstname,
          lastname: recipientLastname,
          imageUrl: recipientImageUrl,
        }),
      });
    } else {
      // If the document doesn't exist, create it with the initial beneficiary
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

// Function to update the image URL in all relevant beneficiary lists
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
            imageUrl: newImageUrl, // Update the image URL
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
    // Get a reference to the logged-in user's beneficiary list document
    const beneficiaryDocRef = doc(db, "beneficiaries", loggedInUserId);

    // Fetch the document
    const beneficiaryDocSnap = await getDoc(beneficiaryDocRef);

    // Check if the document exists
    if (beneficiaryDocSnap.exists()) {
      const beneficiaryData = beneficiaryDocSnap.data();

      // Assuming the beneficiary list is an array of objects
      const beneficiaryList = beneficiaryData.beneficiaryList;

      // Check if the account number exists in the beneficiary list
      const accountExists = beneficiaryList.some(
        (beneficiary) => beneficiary.accountNumber === accountNumber
      );

      return accountExists; // Returns true if account number exists, otherwise false
    } else {
      console.log("No beneficiary list found for this user.");
      return false;
    }
  } catch (error) {
    console.error("Error checking beneficiary list:", error);
    return false;
  }
}
