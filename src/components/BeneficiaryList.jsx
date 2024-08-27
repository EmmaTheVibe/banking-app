import Beneficiary from "./Beneficiary";
import { TextField } from "@mui/material";
import { useState } from "react";
import ModalBox from "./ModalBox";
import { deleteBeneficiary } from "../firebase/firebaseService";
import Avatar from "@mui/material/Avatar";
import { IconButton } from "@mui/material";
import { Button } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function BeneficiaryList({
  beneficiaryList,
  setBeneficiaryList,
  setIsListVisible,
  loggedProfile,
  formRef,
  setValue,
  trigger,
  errorMessage,
  loadingBeneficiaries,
  themeColors,
}) {
  function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  const [openModal, setOpenModal] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState({});
  const handleOpenModal = (beneficiary) => {
    setOpenModal(true);
    setSelectedBeneficiary(beneficiary);
  };
  const handleCloseModal = () => setOpenModal(false);
  const [searchTerm, setSearchTerm] = useState("");

  async function removeBeneficiary(accountNumber) {
    handleCloseModal();
    setBeneficiaryList((beneficiaries) =>
      beneficiaries.filter(
        (beneficiary) => beneficiary.accountNumber !== accountNumber
      )
    );
    await deleteBeneficiary(loggedProfile.id, accountNumber);
  }

  function selectBeneficiary(accountNumber) {
    setValue("accountNumber", `${accountNumber}`);
    trigger("accountNumber");
    setIsListVisible(false);
  }

  const matches = useMediaQuery("(max-width:650px)");

  return (
    <>
      <ModalBox openModal={openModal}>
        <div className="benef-modal">
          <p style={{ fontSize: "18px", marginBottom: "16px" }}>
            Remove{" "}
            <span>
              {selectedBeneficiary.lastname?.toUpperCase()}{" "}
              {selectedBeneficiary.firstname?.toUpperCase()}
            </span>{" "}
            as a beneficiary?
          </p>
          <IconButton sx={{ p: 0, marginBottom: "12px" }}>
            {selectedBeneficiary.imageUrl?.length > 0 ? (
              <Avatar
                style={{
                  width: "80px",
                  height: "80px",
                  border: "2px solid #d59bf6",
                }}
                alt={
                  selectedBeneficiary.firstname + selectedBeneficiary.lastname
                }
                src={selectedBeneficiary.imageUrl}
              />
            ) : (
              <Avatar
                style={{
                  width: "80px",
                  height: "80px",
                  border: "2px solid #d59bf6",
                  fontFamily: "Kanit",
                  fontSize: "30px",
                }}
                {...stringAvatar(
                  `${selectedBeneficiary.lastname?.toUpperCase()} ${selectedBeneficiary.firstname?.toUpperCase()}`
                )}
              />
            )}
          </IconButton>
          <div className="beneficiary-top">
            <Button
              theme={themeColors}
              color="ochre"
              type="submit"
              variant="outlined"
              sx={{ fontFamily: "Kanit" }}
              onClick={handleCloseModal}
              style={{ cursor: "pointer" }}
            >
              No
            </Button>
            <Button
              theme={themeColors}
              color="ochre"
              type="submit"
              variant="contained"
              sx={{ fontFamily: "Kanit" }}
              onClick={() =>
                removeBeneficiary(selectedBeneficiary.accountNumber)
              }
              style={{ cursor: "pointer" }}
            >
              Yes
            </Button>
          </div>
        </div>
      </ModalBox>
      <ul className="beneficiary-list" ref={formRef}>
        <div className="beneficiary-top">
          <p
            style={{
              fontSize: `${matches ? "20px" : "26px"}`,
              color: "#d59bf6",
            }}
          >
            BENEFICIARIES
          </p>
          <h5
            onClick={() => setIsListVisible(false)}
            className="beneficiary-display"
            style={{ fontSize: `${matches ? "14px" : "16px"}` }}
          >
            Close
          </h5>
        </div>
        <div className="beneficiary-top">
          <div className="label">
            <TextField
              className="custom-text-field"
              label="Search"
              name="search"
              variant="standard"
              fullWidth
              type="text"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {!loadingBeneficiaries && beneficiaryList.length > 0 ? (
          beneficiaryList
            .filter((beneficiary) => {
              return searchTerm.toLowerCase === ""
                ? beneficiary
                : `${beneficiary.firstname} ${beneficiary.lastname}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            })
            .map((beneficiary) => (
              <Beneficiary
                beneficiary={beneficiary}
                key={beneficiary.accountNumber}
                loggedProfile={loggedProfile}
                removeBeneficiary={removeBeneficiary}
                selectBeneficiary={selectBeneficiary}
                handleOpenModal={handleOpenModal}
              />
            ))
        ) : !loadingBeneficiaries && errorMessage.length > 0 ? (
          <p>{errorMessage}</p>
        ) : loadingBeneficiaries ? (
          <p>Loading...</p>
        ) : (
          <p>
            Maybe the beneficiaries are the friends we made along the way :)
          </p>
        )}
      </ul>
    </>
  );
}
