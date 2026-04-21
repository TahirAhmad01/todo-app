import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { child, get, getDatabase, ref, set } from "firebase/database";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { useAuth } from "./../context/authContext";
import AddTodo from "./AddTodo";

function TodoBox({ filter = "all_uncompleted" }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [time, setTime] = useState("07:30");
  const [priority, setPriority] = useState("P4");
  const [attachment, setAttachment] = useState("");
  const [label, setLabel] = useState("");
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [inpError, setInpError] = useState(false);
  const [loading, setLogin] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (!todoList || todoList.length === 0) return;
      if (!("Notification" in window) || Notification.permission !== "granted")
        return;

      Object.values(todoList).forEach((todo) => {
        const todayStr = moment().format("YYYY-MM-DD");
        if (!todo.completed && todo.reminder && todo.Date === todayStr) {
          const currTime = moment().format("HH:mm");
          // If the current time is equal to or has passed the task time, and we haven't sent it yet
          if (currTime >= todo.time) {
            const notifiedKey = `notified-${todo.id}-${todo.Date}-${todo.time}`;
            if (!sessionStorage.getItem(notifiedKey)) {
              try {
                new Notification("Task Reminder", {
                  body: `It's time for: ${todo.title} ⏰`,
                  icon: "/vite.svg",
                });
                sessionStorage.setItem(notifiedKey, "true");
              } catch (e) {
                console.log("Notification error:", e);
              }
            }
          }
        }
      });
    }, 10000); // Checks every 10 seconds

    return () => clearInterval(interval);
  }, [todoList]);

  console.log(loading);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setInpError(false);
    setReminder(false);
    setValue("");
    setDescription("");
    setEditId(null);
    setDate(new Date().toISOString().substring(0, 10));
    setTime("07:30");
    setPriority("P4");
    setAttachment("");
    setLabel("");
    setShowLabelInput(false);
  };

  const handleDescription = (e) => setDescription(e.target.value);

  const openEditModal = (todo) => {
    setValue(todo.title);
    setDescription(todo.description || "");
    setDate(todo.Date);
    setTime(todo.time || "07:30");
    setReminder(todo.reminder || false);
    setPriority(todo.priority || "P4");
    setAttachment(todo.attachment || "");
    setLabel(todo.label || "");
    setEditId(todo.id);
    setOpen(true);
  };

  const deleteTodo = (taskId) => {
    const updatedList = todoList.filter((todo) => todo.id !== taskId);
    setTodoList([...updatedList]);
    localStorage.setItem("TodoList", JSON.stringify(updatedList));

    if (currentUser !== null) {
      const db = getDatabase();
      set(ref(db, "todos/" + uid), updatedList).catch((err) =>
        console.log(err),
      );
    }
  };

  const handleReminderChange = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      if ("Notification" in window) {
        if (Notification.permission === "default") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              setReminder(true);
              new Notification("Notifications Enabled", {
                body: "You will now receive task reminders!",
              });
            } else {
              setReminder(false);
              alert("Notification permission denied.");
            }
          });
        } else if (Notification.permission === "granted") {
          setReminder(true);
        } else {
          setReminder(false);
          alert(
            "Notification permission is denied. Please enable it in your browser/OS settings.",
          );
        }
      } else {
        alert("This browser does not support notifications.");
      }
    } else {
      setReminder(false);
    }
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

  const handlePriority = () => {
    const priorities = ["P1", "P2", "P3", "P4"];
    const currentIndex = priorities.indexOf(priority);
    setPriority(priorities[(currentIndex + 1) % priorities.length]);
  };

  const handleAttachment = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file.name);
    }
  };

  const handleLabel = (e) => {
    setLabel(e.target.value);
  };

  const openDeleteModal = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTaskToDelete(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTodo(taskToDelete);
      closeDeleteModal();
    }
  };

  const newId = Math.floor(Date.now() / 1000);

  const updateTodo = () => {
    if (value !== "") {
      const db = getDatabase();
      const dbRef = ref(getDatabase());

      let updatedList;
      if (editId) {
        updatedList = todoList.map((todo) =>
          todo.id === editId
            ? {
                ...todo,
                title: value,
                description,
                Date: date,
                time,
                reminder,
                priority,
                attachment,
                label,
              }
            : todo,
        );
      } else {
        const newId = Math.floor(Date.now() / 1000);
        const newTask = {
          title: value,
          description: description,
          Date: date,
          time,
          priority,
          attachment,
          label,
          id: newId,
          completed: false,
          reminder: reminder,
        };
        updatedList = [...todoList, newTask];
      }

      setTodoList(updatedList);
      handleClose();

      if (currentUser !== null) {
        set(ref(db, "todos/" + uid), updatedList)
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
        localStorage.setItem("TodoList", JSON.stringify(updatedList));
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
      if (filter.startsWith("label_")) {
        const targetLabel = filter.replace("label_", "");
        return todo.label && todo.label.toLowerCase().trim() === targetLabel;
      }

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
          <div className="font-bold text-2xl md:text-3xl text-slate-900 dark:text-slate-100 tracking-tight capitalize">
            {filter.startsWith("label_") && filter.replace("label_", "")}
            {filter === "all_uncompleted" && "Inbox"}
            {filter === "today" && "Today's Task"}
            {filter === "upcoming" && "Upcoming Task"}
            {filter === "completed" && "Completed Task"}
          </div>
        </div>

        {/* Modal purely for Editing Tasks */}
        <AddTodo
          open={open && editId}
          handleClose={handleClose}
          handleOpen={handleOpen}
        >
          <h2 className="text-center mb-6 font-bold text-xl text-slate-800 dark:text-slate-100">
            Edit Task
          </h2>
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
            {inpError && (
              <span className="text-red-500 text-xs mt-1 block">
                Please enter a value
              </span>
            )}
          </div>

          <div className="mb-6">
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              sx={{ width: "100%" }}
              onChange={handleDescription}
              value={description}
              multiline
              rows={3}
            />
          </div>

          <Stack component="form" spacing={3}>
            <TextField
              id="date"
              label="Select Date"
              type="date"
              value={date}
              onChange={handleDate}
              className="mb-6"
              sx={{ width: "100%" }}
              InputLabelProps={{ shrink: true }}
              required
            />

            <TextField
              id="time"
              label="Set Time"
              type="time"
              value={time}
              onChange={handleTime}
              className="mb-6"
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              sx={{ width: "100%" }}
              required
            />
          </Stack>

          <FormControlLabel
            control={
              <Switch
                checked={reminder}
                onChange={handleReminderChange}
                color="primary"
              />
            }
            label={
              <span className="text-slate-800 dark:text-slate-200">
                Set Reminder
              </span>
            }
            className="mt-6"
          />

          <Stack direction="row" spacing={2} className="mt-[30px] justify-end">
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

        {/* Inline Add Task UI */}
        <div className="mx-6 py-4 mt-2">
          {!open || editId ? (
            <div
              className="flex items-center gap-3 cursor-pointer group w-fit"
              onClick={() => {
                handleClose();
                handleOpen();
              }}
            >
              <div className="text-[#db4c3f] font-light text-xl flex items-center justify-center group-hover:bg-[#db4c3f] group-hover:text-white rounded-full transition-all duration-200">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <span className="text-slate-500 group-hover:text-[#db4c3f] font-medium transition-colors">
                Add task
              </span>
            </div>
          ) : (
            <div className="border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 flex flex-col gap-2 relative">
                <input
                  type="text"
                  placeholder="Task name"
                  autoFocus
                  className="w-full text-base font-semibold outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent"
                  value={value}
                  onChange={handleInp}
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="w-full text-sm outline-none text-slate-600 dark:text-slate-400 placeholder-slate-400 dark:placeholder-slate-600 bg-transparent mt-1"
                  value={description}
                  onChange={handleDescription}
                />
                <div className="absolute right-4 top-4 flex items-center gap-1 text-slate-400 text-[10px] font-bold tracking-wider">
                  DICTATE
                  <svg
                    className="w-4 h-4 text-[#db4c3f] ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 relative">
                  <label className="relative overflow-hidden flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <svg
                      className="w-4 h-4 text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {date === new Date().toISOString().substring(0, 10)
                        ? "Today"
                        : moment(date, "YYYY-MM-DD").format("MMM D")}
                    </span>
                    <input
                      type="date"
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      onClick={(e) =>
                        e.target.showPicker && e.target.showPicker()
                      }
                      onChange={handleDate}
                      value={date}
                    />
                  </label>
                  <label className="relative overflow-hidden flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <svg
                      className="w-4 h-4 text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-[100px] truncate">
                      {attachment || "Attachment"}
                    </span>
                    {!attachment && (
                      <span className="bg-green-50 dark:bg-green-500/20 text-green-600 px-1 ml-1 rounded uppercase min-[320px]:text-[10px] font-bold tracking-wide">
                        New
                      </span>
                    )}
                    <input
                      type="file"
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      onChange={handleAttachment}
                    />
                  </label>
                  <button
                    onClick={handlePriority}
                    className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                      />
                    </svg>
                    <span
                      className={`text-xs font-medium ${priority === "P1" ? "text-red-500" : priority === "P2" ? "text-orange-500" : priority === "P3" ? "text-blue-500" : "text-slate-600 dark:text-slate-400"}`}
                    >
                      {priority}
                    </span>
                  </button>
                  <label className="relative overflow-hidden flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <svg
                      className="w-4 h-4 text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {time}
                    </span>
                    <input
                      type="time"
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      onClick={(e) =>
                        e.target.showPicker && e.target.showPicker()
                      }
                      onChange={handleTime}
                      value={time}
                    />
                  </label>
                  <button
                    onClick={() => setShowLabelInput(!showLabelInput)}
                    className={`flex items-center px-2 py-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded ${showLabelInput || label ? "bg-slate-100 dark:bg-slate-800 text-indigo-500" : "text-slate-500"}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                      />
                    </svg>
                  </button>

                  {/* Label Input Popover */}
                  {showLabelInput && (
                    <div className="absolute right-0 top-12 z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg p-2 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="Type a label..."
                        value={label}
                        onChange={handleLabel}
                        className="text-sm bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 w-32"
                        autoFocus
                      />
                      {label && (
                        <button
                          onClick={() => setLabel("")}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer text-sm font-semibold text-slate-600 dark:text-slate-400 transition-colors">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  Inbox
                  <svg
                    className="w-3 h-3 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateTodo}
                    disabled={!value}
                    className="px-4 py-2 rounded-md bg-[#db4c3f] hover:bg-red-600 text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add task
                  </button>
                </div>
              </div>
            </div>
          )}
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
                    {todo?.description && (
                      <div
                        className={`text-sm break-words transition-all duration-200 ${
                          todo?.completed
                            ? "text-slate-400 dark:text-slate-500 line-through"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {todo.description}
                      </div>
                    )}
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      {moment(todo?.Date, "YYYY-MM-DD").format("ll")} •{" "}
                      {todo?.time}
                      {todo?.reminder && (
                        <svg
                          className="w-4 h-4 ml-1 text-indigo-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 ml-4">
                    <button
                      onClick={() => openEditModal(todo)}
                      className="p-1 px-3 text-sm rounded bg-indigo-50 text-indigo-500 hover:bg-indigo-100 hover:text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(todo.id)}
                      className="p-1 px-3 text-sm rounded bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-[400px] shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Delete Task
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="text"
                color="inherit"
                className="!text-slate-600 dark:!text-slate-400 !font-medium"
                onClick={closeDeleteModal}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                className="!bg-red-500 hover:!bg-red-600 !shadow-none"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoBox;
