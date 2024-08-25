import Avatar from "@mui/material/Avatar";
import { IconButton } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Beneficiary({
  beneficiary,
  removeBeneficiary,
  setValue,
  selectBeneficiary,
  loggedProfile,
  handleOpenModal,
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

  return (
    <div className="beneficiary">
      <div className="name-tag">
        <IconButton sx={{ p: 0, marginRight: "12px" }}>
          {beneficiary.imageUrl.length > 0 ? (
            <Avatar
              style={{
                width: "40px",
                height: "40px",
                border: "2px solid #d59bf6",
              }}
              alt={beneficiary.firstname + beneficiary.lastname}
              src={beneficiary.imageUrl}
            />
          ) : (
            <Avatar
              style={{
                width: "40px",
                height: "40px",
                border: "2px solid #d59bf6",
              }}
              {...stringAvatar(
                `${beneficiary.firstname.toUpperCase()} ${beneficiary.lastname.toUpperCase()}`
              )}
            />
          )}
        </IconButton>
        <p>
          {beneficiary.lastname} {beneficiary.firstname}
        </p>
      </div>
      <div className="options">
        <TaskAltIcon
          sx={{ color: "#d59bf6", cursor: "pointer" }}
          onClick={() => selectBeneficiary(beneficiary.accountNumber)}
        />
        <DeleteIcon
          sx={{ color: "#d59bf6", marginLeft: "20px", cursor: "pointer" }}
          onClick={() =>
            handleOpenModal(
              beneficiary.firstname,
              beneficiary.lastname,
              beneficiary.accountNumber
            )
          }
        />
      </div>
    </div>
  );
}
