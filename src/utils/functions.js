function formatNumber(amount) {
  if (!amount) return "";
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getCurrentDateTime() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const hours = String(today.getHours()).padStart(2, "0");
  const minutes = String(today.getMinutes()).padStart(2, "0");
  const seconds = String(today.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatDate(input) {
  if (!input) return "";
  // Convert Firestore Timestamp to JavaScript Date object
  const date = input.toDate();

  // Alternatively, you can use toISOString for a different format
  // const dateString = date.toISOString();

  // Example of custom formatting (e.g., 'YYYY-MM-DD HH:mm:ss')
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
  };
  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .replace(",", "");

  return formattedDate;
}

function capitalizeFirstLetter(word) {
  if (!word) return ""; // Handle empty or undefined input
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export { formatNumber, getCurrentDateTime, formatDate, capitalizeFirstLetter };
