import { Button } from "@mui/material";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
import { storage, db } from "./firebaseConfig";
import CircularProgress from "@mui/material/CircularProgress";
import { updateBeneficiaryImageUrls } from "./firebaseService";

export default function ImageUpload({
  loggedProfile,
  setLoggedProfile,
  setPfpState,
  themeColors,
  setDisplay,
}) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // if (e.target.files[0]) {
    //   setImage(e.target.files[0]);
    // }
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        return;
      }
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeInBytes) {
        return;
      }
      setImage(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (image) {
      setLoading(true);
      const storageRef = ref(storage, `images/${image.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, image);
        const url = await getDownloadURL(snapshot.ref);
        const profileRef = doc(db, "profiles", loggedProfile.id);
        await updateDoc(profileRef, { imageUrl: url });
        setLoggedProfile((prevProfiles) => {
          return { ...prevProfiles, imageUrl: url };
        });
        await updateBeneficiaryImageUrls(loggedProfile.accountNumber, url);
        console.log(url);
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
      setPfpState(true);
      setLoading(false);
      setDisplay("home");
    }
  };
  return (
    <div>
      <form onSubmit={handleUpload} className="form">
        <input
          type="file"
          accept="image/jpeg, image/png, image/jpg"
          onChange={handleImageChange}
        />
        <div className="buttons">
          <Button
            theme={themeColors}
            sx={{ fontFamily: "Kanit" }}
            color="ochre"
            type="submit"
            variant="contained"
          >
            {loading ? (
              <CircularProgress
                style={{
                  color: "#141010",
                  width: "15px",
                  height: "15px",
                }}
              />
            ) : (
              "Change"
            )}
          </Button>
          <Button
            theme={themeColors}
            color="ochre"
            onClick={() => setDisplay("home")}
            variant="outlined"
            sx={{ fontFamily: "Kanit" }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
