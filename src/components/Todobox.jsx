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
      const dbRef = ref(getDatabase());

      if (currentUser !== null) {
        const uid = currentUser.uid;
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
                    JSON.stringify(snapshot.val()),
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
    <div className="my-[40px] mx-auto flex justify-center items-center px-4 max-w-full">
      <div className="w-[600px] max-w-full rounded-2xl bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.01)] border border-slate-100 pb-4 overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="font-bold text-2xl text-slate-900 tracking-tight">
            My Tasks
          </div>
          <AddTodo
            open={open}
            handleClose={handleClose}
            handleOpen={handleOpen}
          >
            <h2 className="text-center mb-6 font-bold text-xl text-slate-800">
              Add New Task
            </h2>
            {/* <TextField
              helperText=" "
              id="demo-helper-text-aligned-no-helper"
              label="Enter Task"
            /> */}

            <div className="mb-6">
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
                <span className="text-red-500 text-xs mt-1 block">
                  Please enter a value
                </span>
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
                className="mb-6"
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
                className="mb-6"
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
              className="mt-[30px] justify-end"
            >
              <Button variant="outlined" color="error" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                className="!bg-indigo-500 !hover:bg-indigo-600"
                onClick={updateTodo}
              >
                Save
              </Button>
            </Stack>
          </AddTodo>
        </div>

        {loading && (
          <div className="p-12 text-center text-slate-400 text-base">
            Loading tasks...
          </div>
        )}
        {!loading && todoList.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-base">
            You have no tasks pending! ✨
          </div>
        ) : (
          <div className="mt-3">
            {todoList
              .sort((a, b) => b.id - a.id)
              .map((todo, index) => (
                <div
                  className="px-6 py-4 bg-white my-3 mx-6 rounded-xl border border-slate-200 flex flex-col gap-1.5 transition-all duration-200 hover:border-slate-300 hover:-translate-y-px hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                  key={index}
                >
                  <div className="font-semibold text-base text-slate-800">
                    {todo?.title}
                  </div>
                  <div className="text-sm text-slate-500 flex items-center gap-2">
                    {moment(todo?.Date, "YYYY-MM-DD").format("ll")} •{" "}
                    {todo?.time}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoBox;
