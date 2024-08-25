import TransactionItem from "./TransactionItem";
import Pagination from "@mui/material/Pagination";
import { useState, useRef } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import ModalBox from "./ModalBox";
import { formatNumber } from "./functions";
import { formatDate } from "./functions";
import html2pdf from "html2pdf.js";

export default function TransactionHistory({
  transactionHistory,
  loggedProfile,
  themeColors,
  setDisplay,
}) {
  const contentRef = useRef();

  // Function to generate the PDF
  const generatePDF = () => {
    const element = contentRef.current; // Get the div element

    const options = {
      // margin: 1,
      filename: "Receipt.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // Generate the PDF
    html2pdf().from(element).set(options).save();
  };

  const matches = useMediaQuery("(max-width:650px)");

  const [openModal, setOpenModal] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({});
  const displayTransac = (transaction) => {
    setOpenModal(true);
    setTransactionDetails(transaction);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Calculate the total number of pages
  const totalPages = Math.ceil(transactionHistory.length / itemsPerPage);

  // Calculate the items to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = transactionHistory.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };
  return (
    <div className="history">
      <ModalBox openModal={openModal}>
        <div
          style={{
            backgroundColor: "#eee",
            width: `${matches ? "320px" : "400px"}`,
          }}
        >
          <div
            ref={contentRef}
            style={{
              backgroundColor: "#eee",
              color: "#212121",
              padding: "12px",
              borderRadius: "12px",
            }}
          >
            <p
              style={{ fontSize: "14px", color: "#212121", fontWeight: "400" }}
            >
              Transaction type:{" "}
              <span>
                {transactionDetails.type === "transfer" &&
                loggedProfile.id === transactionDetails.profileId
                  ? "Debit"
                  : "Credit"}
              </span>
            </p>
            {transactionDetails.type === "transfer" && (
              <>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                    color: "#212121",
                  }}
                >
                  Sender:{" "}
                  <span>
                    {transactionDetails.senderLastname}{" "}
                    {transactionDetails.senderFirstname}
                  </span>
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                    color: "#212121",
                  }}
                >
                  Recipient:{" "}
                  <span>
                    {transactionDetails.recipientLastname}{" "}
                    {transactionDetails.recipientFirstname}
                  </span>
                </p>
              </>
            )}
            <p
              style={{ fontSize: "14px", fontWeight: "400", color: "#212121" }}
            >
              Amount: <span>N{formatNumber(transactionDetails.amount)}</span>
            </p>
            <p
              style={{ fontSize: "14px", fontWeight: "400", color: "#212121" }}
            >
              Transaction ID:{" "}
              <span style={{ fontSize: "12px" }}>
                {transactionDetails.transactionId}
              </span>
            </p>
            <p
              style={{ fontSize: "14px", fontWeight: "400", color: "#212121" }}
            >
              Date & Time:{" "}
              <span>{formatDate(transactionDetails.timestamp)}</span>
            </p>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginTop: "12px",
                color: "#212121",
              }}
            >
              Thanks for banking with us!
            </p>
          </div>

          <div className="beneficiary-top" style={{ padding: "0px 12px" }}>
            <p
              onClick={generatePDF}
              style={{ color: "#212121", fontSize: "16px" }}
            >
              Print
            </p>
            <p
              onClick={() => setOpenModal(false)}
              style={{ color: "#212121", fontSize: "16px" }}
            >
              Close
            </p>
          </div>
        </div>
      </ModalBox>
      <ul className="transaction-list">
        <button className="close" onClick={() => setDisplay("home")}>
          Close
        </button>
        {transactionHistory.length > 0 ? (
          currentItems.map((transaction) => (
            <TransactionItem
              displayTransac={displayTransac}
              transaction={transaction}
              key={transaction.transactionId}
              loggedProfile={loggedProfile}
            />
          ))
        ) : (
          <p>Nothing to see here yet :)</p>
        )}
      </ul>
      {transactionHistory.length > itemsPerPage && (
        <Pagination
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#d59bf6",
              fontFamily: "Kanit", // Custom color for pagination items
            },
            "& .Mui-selected": {
              backgroundColor: "#d59bf6 !important", // Custom background color for selected page
              color: "#eee !important", // Custom text color for selected page
            },
            "& .MuiPaginationItem-previousNext": {
              color: "#d59bf6", // Custom color for previous/next buttons
            },
            marginTop: "12px",
          }}
          size={matches ? "small" : "large"}
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      )}
    </div>
  );
}
