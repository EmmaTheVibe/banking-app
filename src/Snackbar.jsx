import * as React from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';

export default function PositionedSnackbar() {
  const [state, setState] = React.useState({
    open: true,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

//   const handleClick = (newState) => () => {
//     setState({ ...newState, open: true });
//   };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

//   const buttons = (
//     <React.Fragment>
//       <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//         <Button onClick={handleClick({ vertical: 'top', horizontal: 'center' })}>
//           Top-Center
//         </Button>
//       </Box>
//       <Grid container justifyContent="center">
//         <Grid item xs={6}>
//           <Button onClick={handleClick({ vertical: 'top', horizontal: 'left' })}>
//             Top-Left
//           </Button>
//         </Grid>
//         <Grid item xs={6} textAlign="right">
//           <Button onClick={handleClick({ vertical: 'top', horizontal: 'right' })}>
//             Top-Right
//           </Button>
//         </Grid>
//         <Grid item xs={6}>
//           <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'left' })}>
//             Bottom-Left
//           </Button>
//         </Grid>
//         <Grid item xs={6} textAlign="right">
//           <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'right' })}>
//             Bottom-Right
//           </Button>
//         </Grid>
//       </Grid>
//       <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//         <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'center' })}>
//           Bottom-Center
//         </Button>
//       </Box>
//     </React.Fragment>
//   );

  return (
    <Box sx={{ width: 500 }}>
      <Snackbar
        anchorOrigin={{ vertical:'top', horizontal:'center' }}
        open={open}
        onClose={handleClose}
        message="Transaction succesful!"
        key={vertical + horizontal}
      />
    </Box>
  );
}