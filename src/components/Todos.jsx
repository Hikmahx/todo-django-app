import React, {useEffect} from 'react'
import TodoItem from '../components/TodoItem'
import Loading from './Loading';


const Todos = ({checkBox, todos, error, errMessage, deleteTodo, updateTodo, totalTodo, total, clearCompleted, displayCompleted, displayActive, displayAll, setfilterTodos, filterTodos, dragItem, loading}) => {


  useEffect(() => {
    totalTodo()
    // eslint-disable-next-line
    setfilterTodos(todos)
    // eslint-disable-next-line
  }, [todos])

  dragItem()
  if(!error){
    return (
      <div className="todo-container mx-6 pb-10">
        {loading &&
          <div className="flex justify-center mx-auto mt-6 lg:mt-4">
            <Loading />
          </div>
        }      

        <div style={{maxWidth:"34rem"}} className='mx-auto mt-7 text-xs sm:text-base lg:text-lg text-darkest-grayish-blue dark:text-gray'>
          <ul className="w-full flex flex-col items-center relative bg-white dark:bg-very-dark-desaturated-blue transition-colors shadow-xl rounded">
          {filterTodos.map(todo=>(
            <TodoItem key={todo.id} checkBox={checkBox} todo={todo} error={error} errMessage={errMessage} deleteTodo={deleteTodo} updateTodo={updateTodo} totalTodo={totalTodo} />
          ))}
            {todos.length > 0 ? 
            <li className="flex items-center justify-between h-12 px-5 lg:px-6 w-full text-xs lg:text-sm text-dark-grayish-blue dark:text-dark-grayish-blue-dark">
              <div className="items-remainding"> {total} items left</div>
              <div className="complete-status hidden lg:flex font-bold">
                <p onClick={displayAll} className="mx-3 cursor-pointer text-bright-blue">All</p>
                <p onClick={displayActive} className="mx-3 cursor-pointer hover:text-darkest-grayish-blue dark:hover:text-gray">Active</p>
                <p onClick={displayCompleted} className="mx-3 cursor-pointer hover:text-darkest-grayish-blue dark:hover:text-gray">Completed</p>
              </div>
              <div onClick={clearCompleted} className="clear-complete text-light-grayish-blue hover:text-dark-grayish-blue dark:text-dark-grayish-blue-dark dark:hover:text-gray cursor-pointer">Clear Completed</div>
            </li>
            : null
            }   
          </ul>
          {todos.length > 0 ? 
          <>
          <div className="flex items-center justify-center mt-6 lg:mt-0 h-12 px-5 lg:px-6 w-full lg:hidden text-xs lg:text-sm shadow bg-white dark:bg-very-dark-desaturated-blue text-dark-grayish-blue rounded">
            <div className="complete-status flex font-bold">
              <p onClick={displayAll} className="mx-3 cursor-pointer text-bright-blue">All</p>
              <p onClick={displayActive} className="mx-3 cursor-pointer hover:text-darkest-grayish-blue dark:hover:text-gray">Active</p>
              <p onClick={displayCompleted} className="mx-3 cursor-pointer hover:text-darkest-grayish-blue dark:hover:text-gray">Completed</p>
            </div>
          </div>
          <p className="mt-8 lg:mt-14 text-center text-xs lg:text-sm text-dark-grayish-blue dark:text-light-grayish-blue-dark">Drag and drop to reorder list</p>
          </>  
          : null
          }   

        </div>      
      </div>

    ) 
  } 
  if(error){
    return (
      <div className="dark:text-gray mt-16 lg:mt-20 lg:text-lg">
        <p className='text-center'>{errMessage}</p>
        <p className="text-center">Please reload page</p>
      </div>
    )
  }
}

export default Todos
