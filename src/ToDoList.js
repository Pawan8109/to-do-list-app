import React, {useState, useEffect} from 'react';
import {FaTrashAlt} from 'react-icons/fa';
import {IoIosCheckboxOutline} from 'react-icons/io';
import { FaSpinner } from 'react-icons/fa';


function ToDoList () {

    const [allTodos, setAllTodos] = useState ([]);
    const [newTodoTitle, setNewTodoTitle] = useState ('');
    const [completedTodos, setCompletedTodos] = useState ([]);
    const [isCompletedScreen, setIsCompletedScreen] = useState (false);
    const [loading, setLoading] = useState(true);
  
    const handleAddNewToDo = () => {
      let newToDoObj = {
        title: newTodoTitle,
      };
     
      let updatedTodoArr = [...allTodos];
      updatedTodoArr.push (newToDoObj);
    
      setAllTodos (updatedTodoArr);
      localStorage.setItem ('todolist', JSON.stringify (updatedTodoArr));

      fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 1,
        title: newTodoTitle,
        completed: false,
      }),
    })
         
      setNewTodoTitle ('');
    };
  
    useEffect (() => {
         
    fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(savedTodos => {
     
      setAllTodos (savedTodos);
      setLoading(false); 

      savedTodos.forEach(todo => {
    
        if(todo.completed){
            setCompletedTodos(prevCompletedTodos => [...prevCompletedTodos, todo]);
              
        }
      });
    })
    .catch(error => console.error('Error fetching todos:', error));
  
    }, []);

    if (loading) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <FaSpinner className="spin" size={50} />
          </div>
        );
     }
  
    const handleToDoDelete = index => {
      let reducedTodos = [...allTodos];
      reducedTodos.splice (index,1);

      fetch(`https://jsonplaceholder.typicode.com/todos/${index}`, {
           method: 'DELETE',
      })
     
      localStorage.setItem ('todolist', JSON.stringify (reducedTodos));
      setAllTodos (reducedTodos);
    };
  
    const handleCompletedTodoDelete = index => {
      let reducedCompletedTodos = [...completedTodos];
      reducedCompletedTodos.splice (index,1);

      fetch(`https://jsonplaceholder.typicode.com/todos/${index}`, {
           method: 'DELETE',
       })
     
      localStorage.setItem (
        'completedTodos',
        JSON.stringify (reducedCompletedTodos)
      );
      setCompletedTodos (reducedCompletedTodos);
    };
  
    const handleComplete = index => {
  
      let filteredTodo = {
        ...allTodos[index],
      };
  
     
  
      let updatedCompletedList = [...completedTodos, filteredTodo];
      console.log (updatedCompletedList);
      setCompletedTodos (updatedCompletedList);

      fetch(`https://jsonplaceholder.typicode.com/todos/${index}`, {
           method: 'PUT',
           headers: {
               'Content-Type': 'application/json',
            },
           body: JSON.stringify({
            completed: true,
         }),
     })

      localStorage.setItem (
        'completedTodos',
        JSON.stringify (updatedCompletedList)
      );
   
  
      handleToDoDelete (index);
    };
    
    return (
        <div className="App">
          <h1>My Todos</h1>
    
          <div className="todo-wrapper">
    
            <div className="todo-input">
              <div className="todo-input-item">
                <label>Title:</label>
                <input
                  type="text"
                  value={newTodoTitle}
                  onChange={e => setNewTodoTitle (e.target.value)}
                  placeholder="What's the title of your To Do?"
                />
              </div>
              <div className="todo-input-item">
                <button
                  className="primary-btn"
                  type="button"
                  onClick={handleAddNewToDo}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="btn-area">
              <button
                className={`secondaryBtn ${isCompletedScreen === false && 'active'}`}
                onClick={() => setIsCompletedScreen (false)}
              >
                To Do
              </button>
              <button
                className={`secondaryBtn ${isCompletedScreen === true && 'active'}`}
                onClick={() => setIsCompletedScreen (true)}
              >
                Completed
              </button>
            </div>
            <div className="todo-list">
    
              {isCompletedScreen === false &&
                allTodos.map ((item, index) => (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
    
                    </div>
                    <div>
                      <FaTrashAlt
                        title="Delete?"
                        className="icon"
                        onClick={() => handleToDoDelete (index)}
                      />
                      <IoIosCheckboxOutline
                        title="Completed?"
                        className=" check-icon"
                        onClick={() => handleComplete (index)}
                      />
                    </div>
                  </div>
                ))}
    
              {isCompletedScreen === true &&
                completedTodos.map ((item, index) => (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div>
                      <FaTrashAlt
                        className="icon"
                        onClick={() => handleCompletedTodoDelete (index)}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      );
}

export default ToDoList;