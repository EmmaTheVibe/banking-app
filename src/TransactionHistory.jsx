import TransactionItem from "./TransactionItem";
import Pagination from "@mui/material/Pagination";
import { useState, useRef } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import ModalBox from "./ModalBox";
import { formatNumber } from "./functions";
import { formatDate } from "./functions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";

export default function TransactionHistory({
  transactionHistory,
  loggedProfile,
  themeColors,
  setDisplay,
}) {
  const contentRef = useRef();

  const matches = useMediaQuery("(max-width:650px)");

  const [openModal, setOpenModal] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({});
  const displayTransac = (transaction) => {
    setOpenModal(true);
    setTransactionDetails(transaction);
  };

  const [currentPage, setCurrentPage] = useState(1);
  let itemsPerPage = 7;
  if (matches) {
    itemsPerPage = 15;
  }

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
            width: `${matches ? "320px" : "450px"}`,
          }}
        >
          <table
            ref={contentRef}
            style={{
              color: "#eee",
              backgroundColor: "#eee",
              padding: "12px",
              borderRadius: "12px",
            }}
          >
            <thead
              style={{
                backgroundColor: "#d59bf6",
                height: "40px",
                fontSize: `${matches ? "18px" : "20px"}`,
                color: "#eee",
              }}
            >
              <tr>
                <th colSpan="2">Transaction Receipt</th>
              </tr>
            </thead>
            <tbody>
              <tr
                style={{
                  fontSize: `${matches ? "14px" : "18px"}`,
                  color: "#212121",
                  fontWeight: "400",
                }}
              >
                <td>Transaction type: </td>
                <td>
                  <span>
                    {transactionDetails.type === "transfer" &&
                    loggedProfile.id === transactionDetails.profileId
                      ? "Debit"
                      : "Credit"}
                  </span>
                </td>
              </tr>
              {transactionDetails.type === "transfer" && (
                <>
                  <tr
                    style={{
                      fontSize: `${matches ? "14px" : "18px"}`,
                      fontWeight: "400",
                      color: "#212121",
                    }}
                  >
                    <td>Sender: </td>
                    <td>
                      <span>
                        {transactionDetails.senderLastname}{" "}
                        {transactionDetails.senderFirstname}
                      </span>
                    </td>
                  </tr>
                  <tr
                    style={{
                      fontSize: `${matches ? "14px" : "18px"}`,
                      fontWeight: "400",
                      color: "#212121",
                    }}
                  >
                    <td>Recipient: </td>
                    <td>
                      <span>
                        {transactionDetails.recipientLastname}{" "}
                        {transactionDetails.recipientFirstname}
                      </span>
                    </td>
                  </tr>
                </>
              )}
              <tr
                style={{
                  fontSize: `${matches ? "14px" : "18px"}`,
                  fontWeight: "400",
                  color: "#212121",
                }}
              >
                <td>Amount: </td>
                <td>
                  <span>
                    N{formatNumber(transactionDetails.amount?.toFixed(2))}
                  </span>
                </td>
              </tr>
              <tr
                style={{
                  fontSize: `${matches ? "14px" : "18px"}`,
                  fontWeight: "400",
                  color: "#212121",
                }}
              >
                <td>Transaction ID: </td>
                <td>
                  {" "}
                  <span style={{ fontSize: `${matches ? "14px" : "18px"}` }}>
                    {transactionDetails.transactionId}
                  </span>
                </td>
              </tr>
              <tr
                style={{
                  fontSize: `${matches ? "14px" : "18px"}`,
                  fontWeight: "400",
                  color: "#212121",
                }}
              >
                <td>Date & Time: </td>
                <td>
                  <span>{formatDate(transactionDetails.timestamp)}</span>
                </td>
              </tr>
            </tbody>
            <tfoot
              style={{
                backgroundColor: "#d59bf6",
                height: "40px",
                fontSize: "16px",
                color: "#eee",
              }}
            >
              <tr
                style={{
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                <td colSpan="2">Thanks for banking with us!</td>
              </tr>
            </tfoot>
          </table>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              position: "absolute",
              right: "0",
              bottom: "-50px",
            }}
          >
            <Button
              theme={themeColors}
              sx={{ fontFamily: "Kanit" }}
              color="ochre"
              type="submit"
              variant="contained"
              onClick={() => setOpenModal(false)}
            >
              <ArrowBackIcon sx={{ color: "#eee" }} />
            </Button>
          </div>
        </div>
      </ModalBox>
      <ul className="transaction-list">
        <div
          className="beneficiary-top"
          style={{
            padding: `${matches ? "0px 14px" : "0px 20px"}`,
            marginBottom: "12px",
          }}
        >
          <p
            style={{
              fontSize: `${matches ? "20px" : "26px"}`,
              color: "#d59bf6",
            }}
          >
            HISTORY
          </p>
          <h5
            onClick={() => setDisplay("home")}
            className="beneficiary-display"
            style={{ fontSize: `${matches ? "14px" : "16px"}` }}
          >
            Close
          </h5>
        </div>
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
