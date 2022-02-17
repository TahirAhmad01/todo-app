import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import * as React from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "7px",
  boxShadow: 24,
};

export default function AddTodo() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Add todo</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modal_size">
          <h2 style={{ textAlign: "center", marginBottom: "22px" }}>
            New Task
          </h2>

          <TextField
            helperText=" "
            id="demo-helper-text-aligned-no-helper"
            label="Enter Task"
            sx={{ width: "100%" }}
          />
          <Stack component="form" noValidate spacing={3}>
            <TextField
              id="date"
              label="Due Daate"
              type="date"
              defaultValue="2017-05-24"
              sx={{ width: "100%" }}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              id="time"
              label="Set Time"
              type="time"
              defaultValue="07:30"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              sx={{ width: "100%" }}
            />
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            style={{ marginTop: "30px", justifyContent: "flex-end" }}
          >
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained">Save</Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
