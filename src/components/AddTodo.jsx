import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "7px",
  boxShadow: 24,
};

export default function AddTodo({ children, open, handleClose }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="w-[480px] max-w-[92%] !rounded-[16px] p-8 outline-none border-none dark:bg-slate-900"
      >
        {children}
      </Box>
    </Modal>
  );
}
