import React from "react";
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
  return (
    <div className="todo_body">
      <div className="todo_inner">
        <div className="todo_header">
          <div className="title">List</div>
          <AddTodo />
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
