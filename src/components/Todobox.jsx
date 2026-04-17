import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { child, get, getDatabase, ref, set } from "firebase/database";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { useAuth } from "./../context/authContext";
import AddTodo from "./AddTodo";

function TodoBox({ filter = "all_uncompleted" }) {
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

      todoList.push({
        title: value,
        Date: date,
        time,
        id: newId,
        completed: false,
      });
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

  const toggleComplete = (taskId) => {
    const updatedList = todoList.map((todo) =>
      todo.id === taskId ? { ...todo, completed: !todo.completed } : todo,
    );

    setTodoList([...updatedList]);
    localStorage.setItem("TodoList", JSON.stringify(updatedList));

    if (currentUser !== null) {
      const db = getDatabase();
      set(ref(db, "todos/" + uid), updatedList).catch((err) =>
        console.log(err),
      );
    }
  };

  const getFilteredTodos = () => {
    const todayStr = moment().format("YYYY-MM-DD");
    return todoList.filter((todo) => {
      switch (filter) {
        case "all_uncompleted":
          return !todo.completed;
        case "today":
          return todo.Date === todayStr;
        case "upcoming":
          return todo.Date > todayStr && !todo.completed;
        case "completed":
          return todo.completed;
        default:
          return true;
      }
    });
  };

  const filteredTodoList = getFilteredTodos();

  return (
    <div className="mt-8 mb-[40px] mx-auto flex justify-center items-start px-4 sm:px-8 w-full max-w-3xl flex-1">
      <div className="w-full rounded-2xl bg-white dark:bg-slate-900/50 shadow-xl border border-slate-200 dark:border-slate-800/60 pb-4 overflow-hidden transition-colors duration-200">
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 transition-colors duration-200">
          <div className="font-bold text-2xl md:text-3xl text-slate-900 dark:text-slate-100 tracking-tight">
            {filter === "all_uncompleted" && "Todo Lists"}
            {filter === "today" && "Today's Task"}
            {filter === "upcoming" && "Upcoming Task"}
            {filter === "completed" && "Completed Task"}
          </div>
          <AddTodo
            open={open}
            handleClose={handleClose}
            handleOpen={handleOpen}
          >
            <h2 className="text-center mb-6 font-bold text-xl text-slate-800 dark:text-slate-100">
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
        {!loading && filteredTodoList.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500 text-base">
            You have no tasks here! ✨
          </div>
        ) : (
          <div className="mt-3">
            {filteredTodoList
              .sort((a, b) => b.id - a.id)
              .map((todo, index) => (
                <div
                  className={`px-6 py-4 my-3 mx-6 rounded-xl border flex items-center justify-start gap-4 transition-all duration-200 hover:-translate-y-px hover:shadow-md ${
                    todo?.completed
                      ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-60"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/50"
                  }`}
                  key={todo?.id || index}
                >
                  <button
                    onClick={() => toggleComplete(todo?.id)}
                    className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      todo?.completed
                        ? "bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600"
                        : "bg-transparent border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-400"
                    }`}
                  >
                    {todo?.completed && (
                      <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                    <div
                      className={`font-semibold text-base truncate transition-all duration-200 ${
                        todo?.completed
                          ? "text-slate-400 dark:text-slate-500 line-through decoration-slate-400 dark:decoration-slate-500"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {todo?.title}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      {moment(todo?.Date, "YYYY-MM-DD").format("ll")} •{" "}
                      {todo?.time}
                    </div>
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
