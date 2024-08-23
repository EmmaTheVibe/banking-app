import TransactionItem from "./TransactionItem";

export default function TransactionHistory({
  transactionHistory,
  loggedProfile,
  themeColors,
  setDisplay,
}) {
  return (
    <ul>
      <button className="close" onClick={() => setDisplay("home")}>
        Close
      </button>
      {transactionHistory.length > 0 ? (
        transactionHistory.map((transaction) => (
          <TransactionItem
            transaction={transaction}
            key={transaction.transactionId}
            loggedProfile={loggedProfile}
          />
        ))
      ) : (
        <p>Nothing to see here yet :)</p>
      )}
    </ul>
  );
}
