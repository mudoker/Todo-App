import { useState } from 'react'
import '../App.css'

function Form(props) {
    const [input, setInput] = useState('');

    const handleChange = event => {
        setInput(event.target.value);
    }

    const handleTodoSubmit = (e) => {
        e.preventDefault();

        // eslint-disable-next-line react/prop-types
        props.onSubmit({
            id: Math.floor(Math.random() * 10000),
            text: input
        });
        setInput('');
    }

    return (
        <form className='todo-form' onSubmit={handleTodoSubmit}>
            <input type='text' placeholder='Type something...' value={input} name='task' onChange={handleChange} className='todo-input'/>
            <button className='todo-button'>Add</button>
        </form>
    )
}

export default Form