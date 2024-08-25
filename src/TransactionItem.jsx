import { formatNumber } from "./functions";
import { formatDate } from "./functions";

export default function TransactionItem({
  transaction,
  displayTransac,
  loggedProfile,
}) {
  return (
    <li className="item " onClick={() => displayTransac(transaction)}>
      <p>{formatDate(transaction.timestamp)}</p>
      {transaction.type === "transfer" &&
      loggedProfile.id === transaction.profileId ? (
        <p className="truncate ... break-text">
          You{" "}
          <span className="red">sent N{formatNumber(transaction.amount)}</span>{" "}
          to{" "}
          <span style={{ color: "#d59bf6" }}>
            {transaction.recipientLastname} {transaction.recipientFirstname}
          </span>
        </p>
      ) : transaction.type === "transfer" &&
        loggedProfile.id === transaction.recipientId ? (
        <p className="truncate ... break-text">
          You{" "}
          <span className="green">
            received N{formatNumber(transaction.amount)}
          </span>{" "}
          from{" "}
          <span style={{ color: "#d59bf6" }}>
            {transaction.senderLastname} {transaction.senderFirstname}
          </span>
        </p>
      ) : transaction.type === "deposit" ? (
        <p className="truncate ... break-text">
          You{" "}
          <span className="green">
            deposited N{formatNumber(transaction.amount)}
          </span>
        </p>
      ) : (
        ""
      )}
    </li>
  );
}
