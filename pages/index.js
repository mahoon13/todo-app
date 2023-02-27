import { useEffect, useReducer, useState } from "react";
import Head from "next/head";

import Todolist from "../components/Todolist";

import styles from "../styles/home.module.css";

//the key wich userid will save with it in browser localstorage
const localStorageKey = "todo-app-next";

//status constants
const REGISTERED = true;
const NOT_REGISTERED = false;
const FAILED_REGISTER = null;

//todos actions
export const ACTIONS = {
  ADD_TODO: "add_todo",
  COMPELETE_TODO: "compelete_todo",
  SET_TODOS: "set_todos",
  SWAP_TODOS: "swap_todos",
  DELETE_TODO: "delete_todo",
};

export default function Home() {
  const [status, setStatus] = useState(NOT_REGISTERED);
  const [todoText, setTodoText] = useState("");

  const [todos, dispatch] = useReducer((todos, action) => {
    switch (action.type) {
      //add todos -> payload.todo = {todo: String, id: Number(Date.now()), checked: Boolean(false)}
      case ACTIONS.ADD_TODO:
        //prevent adding empty todo
        if (action.payload.todo.todo.trim() == "") return todos;
        return [...todos, action.payload.todo];

      //set todo checked -> payload = {id: Number, checked: Boolean}
      case ACTIONS.COMPELETE_TODO:
        return todos.map((todo) => {
          if (todo.id === action.payload.id) {
            return { ...todo, checked: action.payload.checked };
          }
          return todo;
        });

      //set todos -> payload = {todos: Array(of todo Objects)}
      case ACTIONS.SET_TODOS:
        return action.payload.todos;

      //swap todos -> payload = {from: Object(todo), to: Object(todo)}
      case ACTIONS.SWAP_TODOS:
        return todos.map((todo) => {
          if (todo.id === action.payload.from.id) return action.payload.to;
          if (todo.id === action.payload.to.id) return action.payload.from;
          return todo;
        });

      //delete todo -> patload = {todo: Object(todo)}
      case ACTIONS.DELETE_TODO:
        return todos.filter((todo) => todo.id !== action.payload.todo.id);
    }
  }, []);

  //register user proccess
  async function registerUser() {
    const userId = localStorage[localStorageKey];

    //get user todolist from database
    const res = await fetch("/api/user/get?user_id=" + userId).then((res) =>
      res.json()
    );

    //load user todos from database to todos state
    dispatch({ type: ACTIONS.SET_TODOS, payload: { todos: res.todos } });

    //change status to registered
    setStatus(REGISTERED);
  }

  useEffect(() => {
    //if user is not registered
    if (localStorage[localStorageKey] === undefined) {
      //register user
      fetch("/api/user/new").then((res) => {
        if (res.status === 200) {
          //successfully registered user
          res.json().then((data) => {
            //save userid in browser localstorage
            localStorage.setItem(localStorageKey, data.userId);

            registerUser();
          });
        } else {
          //failed to register user
          setStatus(FAILED_REGISTER);
        }
      });
    } else {
      registerUser();
    }
  }, []);

  //update todolist in database when todos state changed
  useEffect(() => {
    //prevent database update before regestration
    if (status !== REGISTERED) return;

    //post user todolist to update end point
    fetch("/api/user/update", {
      method: "POST",
      body: JSON.stringify({
        userId: localStorage[localStorageKey],
        todos,
      }),
    });
  }, [todos]);

  if (status === FAILED_REGISTER)
    return (
      <div>
        <h1>Cant connect to server,please refresh the page</h1>
      </div>
    );

  return (
    <div id="app">
      <Head>
        <title>todo-app</title>
      </Head>
      <form
        id={styles.todo__form}
        onSubmit={(ev) => {
          //prevent page from refresh on submit
          ev.preventDefault();

          //prevent adding new todos while is not registered
          if (status !== REGISTERED) return;

          //add new todo
          dispatch({
            type: ACTIONS.ADD_TODO,
            payload: {
              todo: {
                todo: todoText,
                checked: false,
                id: Date.now(),
              },
            },
          });

          //empty input value
          setTodoText("");
        }}
      >
        <input
          id={styles.todo__input}
          placeholder="type here.."
          onChange={(ev) => {
            //save input value in state to get it on form submit
            setTodoText(ev.target.value);
          }}
          value={todoText}
        />
        <button className={styles.submit__btn} type="submit">
          Add Todo
        </button>
      </form>

      {status === REGISTERED && <Todolist todos={todos} dispatch={dispatch} />}
    </div>
  );
}
