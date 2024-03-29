import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { child, get, getDatabase, ref, set } from "firebase/database";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { useAuth } from "./../context/authContext";
import AddTodo from "./AddTodo";

function TodoBox() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [time, setTime] = useState("07:30");
  const [inpError, setInpError] = useState(false);
  const [loading, setLogin] = useState(false);

  const { todoList, currentUser, setTodoList } = useAuth() || {};
  const { uid } = currentUser || {};
  //console.log(uid);
  // console.log(new Date().toISOString().substring(0, 10));

  useEffect(() => {
    async function loadData() {
      const item = localStorage.getItem("TodoList");
      const uid = currentUser.uid;
      const dbRef = ref(getDatabase());

      if (currentUser !== null) {
        setLogin(true);
        await get(child(dbRef, `todos/${uid}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              localStorage.setItem("TodoList", JSON.stringify(snapshot.val()));
              setTodoList(snapshot.val());
            } else {
              localStorage.removeItem("TodoList");
            }
          })
          .catch((error) => {
            console.error(error);
          });
        setLogin(false);
      } else {
        if (item !== null) {
          setTodoList(JSON.parse(item));
        }
      }
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(loading);

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
    setDate(e.target.value);
  };

  const handleTime = (e) => {
    setTime(e.target.value);
  };

  const newId = Math.floor(Date.now() / 1000);

  const updateTodo = () => {
    if (value !== "") {
      const db = getDatabase();
      const dbRef = ref(getDatabase());

      todoList.push({ title: value, Date: date, time, id: newId });
      handleClose();

      if (currentUser !== null) {
        set(ref(db, "todos/" + uid), todoList)
          .then(() => {
            get(child(dbRef, `todos/${uid}`))
              .then((snapshot) => {
                if (snapshot.exists()) {
                  console.log(snapshot.val());
                  localStorage.setItem(
                    "TodoList",
                    JSON.stringify(snapshot.val())
                  );
                  setTodoList(snapshot.val());
                  //console.log("data inserted");
                } else {
                  console.log("No data available");
                }
              })
              .catch((error) => {
                console.error(error);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        localStorage.setItem("TodoList", JSON.stringify(todoList));
      }
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
              Add New Task
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
                label="Select Date"
                type="date"
                value={date}
                onChange={handleDate}
                className="textField"
                // defaultValue="2017-05-24"
                sx={{ width: "100%" }}
                InputLabelProps={{
                  shrink: true,
                }}
                required
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
                required
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

        {loading && <div style={{ textAlign: "center" }}>Loading.....</div>}
        {!loading && todoList.length === 0 ? (
          <div>No task found</div>
        ) : (
          todoList
            .sort((a, b) => b.id - a.id)
            .map((todo, index) => (
              <div className="todoListCon" key={index}>
                <div>{todo?.title}</div>
                {/* <div>
                {todo?.Date} - {todo?.time}
              </div> */}
                <div>
                  {moment(todo?.Date, "YYYY-MM-DD").format("ll")} - {todo?.time}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default TodoBox;
