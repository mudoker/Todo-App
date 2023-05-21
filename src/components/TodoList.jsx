import React, { useState, useContext, useMemo } from 'react'
import Form from './Form'
import { RiCloseCircleLine } from 'react-icons/ri'
import { TiEdit } from 'react-icons/ti'
import '../App.css'
const TodosContext = React.createContext([])

function TodoList() {
    const [todos, setTodo] = useState([]);

    const addTodo = todo => {

        // eliminate empty spaces
        if (!todo.text || /^\s*$/.test(todo.text)) {
            return;
        }

        const newTodos = [todo, ...todos];

        setTodo(newTodos);
    }

    const removeTodo = id => {
        const removeArr = [...todos].filter(todo => todo.id !== id)
        setTodo(removeArr);
    }

    const updateTodo = (todoId, newValue) => {
        // eliminate empty spaces
        if (!newValue.text || /^\s*$/.test(newValue.text)) {
            return;
        }

        setTodo(prev => prev.map(item => (item.id === todoId ? newValue : item)))
    }

    const completeTodo = id => {
        let updatedTodos = todos.map(todo => {
            if (todo.id === id) {
                todo.isComplete = !todo.isComplete
                console.log("trigger");
            }
            return todo
        })
        setTodo(updatedTodos);
    }

    return (
        <div className='todo-app'>
            <h1> Today task!</h1>
            <Form onSubmit={addTodo} className='todo-form' />
            <TodosContext.Provider value={todos}>
                <Todo todos={todos} completeTodo={completeTodo} removeTodo={removeTodo} updateTodo={updateTodo} />
            </TodosContext.Provider>
        </div>
    );
}

function Todo(
    // eslint-disable-next-line react/prop-types
    { todos, completeTodo, removeTodo, updateTodo }) {
    const [edit, setEdit] = useState({
        id: null,
        value: ''
    })

    const todosFromContext = useContext(TodosContext)

    const newTodos = useMemo(() => {
        return todosFromContext.map(todo => {
            return {
                id: todo.id,
                text: todo.text,
                isComplete: todo.isComplete || false
            };
        });
    }, [todosFromContext])

    const submitUpdate = value => {
        updateTodo(edit.id, value)
        setEdit({
            id: null,
            value: ''
        })

    }
    if (edit.id) {
        return <Form edit={edit} onSubmit={submitUpdate} />
    }
    return (
        <div>
            {newTodos.map((todo, index) => (
                <div className={todo.isComplete ? 'todo-row complete' : 'todo-row'} key={index}>
                    <div key={todo.id} onClick={() => completeTodo(todo.id)}> {todo.text} </div>
                    <div className='icons'>
                        <RiCloseCircleLine onClick={() => removeTodo(todo.id)} className='delete-icon' />
                        <TiEdit onClick={() => setEdit({ id: todo.id, value: todo.text })} className='edit-icon' />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TodoList;
