import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const customFontStyle = {
  fontFamily: "Noto Sans Thai, sans-serif", // Replace 'your-custom-font' with your specific font
};

export default function SaveModal({
  onSave,
  startDate,
  deleteDate,
  selectedIndexZone,
  checkedSubZone,
}) {
  const [open, setOpen] = React.useState(false);
  const handleCloseErrorModal = () => setShowErrorModal(false);
  const [showErrorModal, setShowErrorModal] = React.useState(false);

  const handleOpen = () => {
    if (
      !startDate ||
      !deleteDate ||
      selectedIndexZone.length === 0 ||
      checkedSubZone.length === 0
    ) {
      setShowErrorModal(true);
      return;
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    onSave();
    handleClose();
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        sx={customFontStyle}
      >
        SAVE
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, textAlign: "center" }}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={customFontStyle}
          >
            กรุณายืนยันเพื่อจัดเก็บข้อมูล
          </Typography>
          <Button
            onClick={handleSave}
            sx={{ mt: 2, ...customFontStyle }}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </Box>
      </Modal>
      <Modal
        open={showErrorModal}
        onClose={handleCloseErrorModal}
        aria-labelledby="error-modal-title"
        aria-describedby="error-modal-description"
      >
        <Box sx={{ ...style, textAlign: "center" }}>
          <Typography
            id="error-modal-title"
            variant="h6"
            component="h2"
            sx={customFontStyle}
          >
            ERROR
          </Typography>
          <Typography
            id="error-modal-description"
            sx={{ mt: 2, ...customFontStyle }}
          >
            กรุณากรอกข้อมูลให้ครบก่อนทำการเซฟ
          </Typography>
          <Button
            onClick={handleCloseErrorModal}
            sx={{ mt: 2 }}
            variant="contained"
            color="error"
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
