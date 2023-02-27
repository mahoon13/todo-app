import { useState } from "react";
import Todo from "./Todo";
import { ACTIONS } from "../pages";

import styles from "../styles/todolist.module.css";

export default function Todolist(props) {
  const [dragStartTarget, setDragStartTarget] = useState(null);

  return (
    <div className={styles.list}>
      {props.todos.map((todo) => {
        return (
          <Todo
            todo={todo}
            key={todo.id}
            dispatch={props.dispatch}
            onDragStart={() => {
              setDragStartTarget(todo);
            }}
            onDragOver={() => {
              if (dragStartTarget.id !== todo.id) {
                props.dispatch({
                  type: ACTIONS.SWAP_TODOS,
                  payload: { from: dragStartTarget, to: todo },
                });
              }
            }}
            deleteTodo={() => {
              props.dispatch({
                type: ACTIONS.DELETE_TODO,
                payload: { todo: todo },
              });
            }}
          />
        );
      })}
    </div>
  );
}
