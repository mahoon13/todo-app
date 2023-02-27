import styles from "../styles/todo.module.css";
import { ACTIONS } from "../pages";

export default function Todo({
  onDragStart,
  onDragOver,
  deleteTodo,
  dispatch,
  todo: { todo, id, checked },
}) {
  return (
    <div
      className={styles.todo__box}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
    >
      <div className={styles.flex}>
        <input
          type="checkbox"
          defaultChecked={checked}
          //change checked status of todo in todos state
          onChange={(ev) => {
            let checked = ev.target.checked;
            dispatch({
              type: ACTIONS.COMPELETE_TODO,
              payload: { id, checked },
            });
          }}
        />
        <p>{todo}</p>
      </div>

      <div className={styles.dlt__btn} onClick={deleteTodo}>
        x
      </div>
    </div>
  );
}
