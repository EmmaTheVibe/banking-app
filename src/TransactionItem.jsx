import { formatNumber } from "./functions";
import { formatDate } from "./functions";

export default function TransactionItem({ transaction, loggedProfile }) {
  return (
    <li className="item">
      <p>{formatDate(transaction.timestamp)}</p>
      {transaction.type === "transfer" &&
      loggedProfile.id === transaction.profileId ? (
        <p>
          You{" "}
          <span className="red">sent N{formatNumber(transaction.amount)}</span>{" "}
          to {transaction.recipientLastname} {transaction.recipientFirstname}
        </p>
      ) : transaction.type === "transfer" &&
        loggedProfile.id === transaction.recipientId ? (
        <p>
          You{" "}
          <span className="green">
            received N{formatNumber(transaction.amount)}
          </span>{" "}
          from {transaction.senderLastname} {transaction.senderFirstname}
        </p>
      ) : transaction.type === "deposit" ? (
        <p>
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
