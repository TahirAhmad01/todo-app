import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import AddTodo from "./AddTodo";

const todoListItem = [
  {
    name: "meting",
    Date: "today",
  },
  {
    name: "meting",
    Date: "today",
  },
  {
    name: "meting",
    Date: "today",
  },
  {
    name: "meting",
    Date: "today",
  },
];

function TodoBox() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [date, setDate] = useState("2017-05-24");
  const [time, setTime] = useState("07:30");
  const [inpError, setInpError] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setInpError(false);
  };

  const handleInp = (e) => {
    const InpValue = e.target.value;

    setValue(InpValue);
    if (InpValue === "") {
      setInpError(true);
    } else {
      setInpError(false);
    }
  };

  const handleDate = (e) => {
    const dateValue = e.target.value;
    setDate(dateValue);
    console.log(date);
  };

  const handleTime = (e) => {
    const timeValue = e.target.value;
    setTime(timeValue);
  };

  const updateTodo = () => {
    //update todo func
    if (value !== "") {
      todoListItem.push({ name: value, Date: date + " - " + time });
      handleClose();
    } else {
      setInpError(true);
    }
  };

  return (
    <div className="todo_body">
      <div className="todo_inner">
        <div className="todo_header">
          <div className="title">List</div>
          <AddTodo
            open={open}
            handleClose={handleClose}
            handleOpen={handleOpen}
          >
            <h2 style={{ textAlign: "center", marginBottom: "22px" }}>
              New Task
            </h2>

            {/* <TextField
              helperText=" "
              id="demo-helper-text-aligned-no-helper"
              label="Enter Task"
            /> */}

            <div className="textField">
              <TextField
                id="outlined-basic"
                label="Enter Task"
                variant="outlined"
                sx={{ width: "100%" }}
                onChange={handleInp}
                value={value}
                error={inpError && true}
              />
              {inpError ? (
                <span className="error">Please enter a value</span>
              ) : (
                ""
              )}
            </div>

            <Stack component="form" spacing={3}>
              <TextField
                id="date"
                label="Due Daate"
                type="date"
                value={date}
                onChange={handleDate}
                className="textField"
                // defaultValue="2017-05-24"
                sx={{ width: "100%" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                id="time"
                label="Set Time"
                type="time"
                value={time}
                onChange={handleTime}
                className="textField"
                // defaultValue="07:30"
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
              <Button variant="contained" onClick={updateTodo}>
                Save
              </Button>
            </Stack>
          </AddTodo>
        </div>

        {todoListItem.map((todo, index) => (
          <div className="todoListCon" key={index}>
            <div>{todo.name}</div>
            <div>{todo.Date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoBox;
