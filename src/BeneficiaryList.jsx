import Beneficiary from "./Beneficiary";
import { TextField } from "@mui/material";
import { useState } from "react";
import ModalBox from "./ModalBox";
import { deleteBeneficiary } from "./firebaseService";

export default function BeneficiaryList({
  beneficiaryList,
  setBeneficiaryList,
  setIsListVisible,
  loggedProfile,
  formRef,
  setValue,
  trigger,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [accNo, setAccNo] = useState("");
  const handleOpenModal = (firstName, lastName, accountNumber) => {
    setOpenModal(true);
    setFirstname(firstName);
    setLastname(lastName);
    setAccNo(accountNumber);
  };
  const handleCloseModal = () => setOpenModal(false);
  const [searchTerm, setSearchTerm] = useState("");

  // const handleSearch = (event) => {
  //   const searchValue = event.target.value;
  //   setSearchTerm(searchValue);

  //   if (searchValue.trim() === "") {
  //     setBeneficiaryList(beneficiaryList);
  //   } else {
  //     // Filter the array of objects based on the firstName and lastName properties
  //     const results = beneficiaryList
  //       .slice()
  //       .filter((beneficiary) =>
  //         `${beneficiary.firstname} ${beneficiary.lastname}`
  //           .toLowerCase()
  //           .includes(searchValue.toLowerCase())
  //       );
  //     setBeneficiaryList(results);
  //   }
  // };

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

  return (
    <>
      <ModalBox openModal={openModal}>
        <div className="benef-modal">
          <p>
            Remove {lastname} {firstname} from your beneficiary list?
          </p>
          <div className="beneficiary-top">
            <p onClick={() => removeBeneficiary(accNo)}>Yes</p>
            <p onClick={handleCloseModal}>No</p>
          </div>
        </div>
      </ModalBox>
      <ul className="beneficiary-list" ref={formRef}>
        <div className="beneficiary-top">
          <div className="label">
            <TextField
              className="custom-text-field"
              // placeholder="Enter an amount to transfer"
              label="Search"
              name="search"
              variant="standard"
              fullWidth
              type="text"
              onChange={(e) => setSearchTerm(e.target.value)}
              // {...registerTransfer("amount", registerTransferOptions.amount)}
              // helperText={
              //   transferErrors?.amount && (
              //     <span className="error">{transferErrors.amount.message}</span>
              //   )
              // }
            />
          </div>
          <h5
            onClick={() => setIsListVisible(false)}
            className="beneficiary-display"
          >
            Close
          </h5>
        </div>
        {beneficiaryList.length > 0 ? (
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
        ) : (
          <p>Nothing to see here yet :)</p>
        )}
      </ul>
    </>
  );
}
