import Avatar from "@mui/material/Avatar";
import { IconButton } from "@mui/material";
export default function ProfilePicture({
  loggedProfile,
  handleClick = () => {},
  pfpState,
  size = 100,
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
    <IconButton onClick={handleClick} sx={{ p: 0 }}>
      {pfpState ? (
        <Avatar
          style={{
            width: `${size}px`,
            height: `${size}px`,
            border: "4px solid #d59bf6",
          }}
          alt={loggedProfile.firstname + loggedProfile.lastname}
          src={loggedProfile.imageUrl}
        />
      ) : (
        <Avatar
          style={{
            width: `${size}px`,
            height: `${size}px`,
            fontSize: "36px",
            fontFamily: "Kanit",
            border: "4px solid #d59bf6",
          }}
          {...stringAvatar(
            `${loggedProfile.lastname?.toUpperCase()} ${loggedProfile.firstname?.toUpperCase()}`
          )}
        />
      )}
    </IconButton>
  );
}
