import { useEffect, useState } from 'react'
import axios from 'axios'
import Header from './components/Header'
import Form from './components/Form'
import Todos from './components/Todos'
import Attribution from './Attribution'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


function App() { 
  const [todos, setTodos] = useState ([])
  const [checked, setChecked] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [errMessage, setErrMessage] = useState('') 
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [filterTodos, setfilterTodos] = useState ([])


  useEffect(() => {
    getData();
    // eslint-disable-next-line
    totalTodo();
    // eslint-disable-next-line
  }, []);
  
  const getData = ()=>{
      setLoading(true)

      axios.get('/api/todos/')
      .then(
        reponse=> {
          setTodos(reponse.data)
          setLoading(false)
        }
      )
      .catch(error=>{
        setError(true)
        setErrMessage(error.message)
      })
  }

  const totalTodo =()=>{
    let counter = 0
    setTotal(todos.length)
    todos.forEach(todo=>{
      if(!todo.completed){
        return counter--
      }if(todo.completed){
        return counter++
      }
    })

    setTotal((todos.length-counter)/2)
  }
  
  const inputTodo = (e) =>{
    
    setInput(e.target.value)
  }

  const submitTodo= (e)=>{
      if(input !== ''){

        if(id===''){
          setLoading(true)

          axios.post('/api/todos/', {
            todo: input, 
            completed: false
          })
          .then(
            reponse=>{
             setTodos([...todos, reponse.data]) 

             setLoading(false)
            } 
          )
          .catch(error=>{
            setError(true)
            setErrMessage(error.message)
          })    
        }else{
          setLoading(true)

          axios.put(`/api/todos/${id}/`, {
            todo:input, 
            completed:false
          })
          .then(
            reponse=> {
              // eslint-disable-next-line
              setTodos(todos.map(todo=>(todo.id==id? {id, todo:input} : todo)))
              setId('')
              if(document.querySelector('form').lastElementChild === document.querySelector('.form-cancel')){
              document.querySelector('form').lastElementChild.remove()
              }
              setLoading(false)
           }
          )
          .catch(error=>{
            setError(true)
            setErrMessage(error.message)
          })
        }
      }
      setInput('')
    e.preventDefault()
  }

  const updateTodo = async (e)=>{
    let id = e.target.parentElement.parentElement.dataset.id
    let p = e.target.parentElement.previousElementSibling.textContent
    let cross = e.target.nextElementSibling
    setInput(p)
    setId(id)

    let form = document.querySelector('form')
    if(form.childElementCount > 2){
      form.lastElementChild.remove()
    }
    let formCross = cross.cloneNode(true)
    formCross.classList.add('form-cancel')
    form.appendChild(formCross)
    formCross.addEventListener('click', ()=>{
      setId('')
      setInput('')
      form.lastElementChild.remove()
    })
  }

  const deleteTodo=  (e)=>{
    let id = e.target.parentElement.parentElement.dataset.id
    setLoading(true)

    axios.delete(`/api/todos/${id}/`)
    .then(
      response=>{
        getData()
        setId('')
        setInput('')
        setLoading(false)

        if(document.querySelector('form').lastElementChild === document.querySelector('.form-cancel')){
          document.querySelector('form').lastElementChild.remove()
        }
      }
    )
    .catch(error=>{
      setError(true)
      setErrMessage(error.message)
    })
  }

  const modeToggle =()=>{
    setDarkMode(!darkMode)
    if(darkMode === false){
      if(document.documentElement.classList.contains('dark')){
        document.documentElement.classList.remove('dark')
      }
    }else{
      document.documentElement.classList.add('dark')
    }
  }

  const checkBox = (e)=> {
    
    setChecked(!checked)
    let li = e.target.parentElement.parentElement.parentElement
    let p = e.target.parentElement.parentElement.nextElementSibling
    
    li.dataset.completed = checked
    if(checked){
      e.target.classList.add('bg-transparent', 'dark:bg-transparent')
      e.target.parentElement.classList.add('bg-gradient-to-r', 'from-gradient-blue', 'to-gradient-purple')
      p.classList.add('line-through', 'text-light-grayish-blue')
    }
    if(!checked){
      e.target.classList.remove('bg-transparent', 'dark:bg-transparent')
      e.target.parentElement.classList.remove('bg-gradient-to-r', 'from-gradient-blue', 'to-gradient-purple')
      p.classList.remove('line-through', 'text-light-grayish-blue')
    }
    
    let text = e.target.parentElement.parentElement.nextElementSibling.textContent
    let id = e.target.parentElement.parentElement.parentElement.dataset.id

    setLoading(true)

    axios.put(`/api/todos/${id}/`, {
      todo:text,
      completed: checked
    })
    .then(response=>{
      getData()
      setLoading(false)
    })
    .catch(error=>{
      setError(true)
      setErrMessage(error.message)
    })
  }

  const clearCompleted= ()=>{
    setTodos(JSON.parse(todos))
    todos.forEach(todo=>{
      if(todo.completed){
        let id = todo.id
        setLoading(true)

        axios.delete(`/api/todos/${id}/`)
        .then(
          reponse=>{
            getData()
            setLoading(false)
            setId('')
            setInput('')
            if(document.querySelector('form').lastElementChild === document.querySelector('.form-cancel')){
              document.querySelector('form').lastElementChild.remove()
            }    
          }
        )
        .catch(error=>{
          setError(true)
          setErrMessage(error.message)
        })  
      }
    })
  }

  const displayCompleted = ()=>{
    setfilterTodos(todos.filter(todo=> todo.completed === true))      
  }

  const displayActive = ()=>{
    setfilterTodos(todos.filter(todo=> todo.completed !== true))      
  }

  const displayAll = ()=>{
    setfilterTodos(todos)
  }

  const dragItem = ()=>{
    let dragStartIndex;
    let dragEndIndex;
    let lis = document.querySelectorAll('.todo-item')

    lis.forEach((li, index)=>{
      li.addEventListener('dragstart', (e)=>{
        dragStartIndex = index
      })
      li.addEventListener('dragenter', (e)=>{
        e.target.parentElement.classList.add('bg-very-light-grayish-blue', 'dark:bg-very-dark-grayish-blue-dark')
      })
      li.addEventListener('dragleave', (e)=>{
        e.target.parentElement.classList.remove('bg-very-light-grayish-blue', 'dark:bg-very-dark-grayish-blue-dark')
      })
      li.addEventListener('dragover', (e)=>{
        e.preventDefault()
      })
      li.addEventListener('drop', (e)=>{
        dragEndIndex = index
        
        const itemOne = lis[dragStartIndex]
        const itemTwo = lis[dragEndIndex]
        itemTwo.insertAdjacentElement("afterend", itemOne) 
        e.target.parentElement.classList.remove('bg-very-light-grayish-blue', 'dark:bg-very-dark-grayish-blue-dark')
      })
    })
  }

  return( 
  <div className='App bg-gray dark:bg-very-dark-blue font-josefinSans min-h-screen'>
    <Header modeToggle={modeToggle} darkMode={darkMode} />
    <Form submitTodo={submitTodo} inputTodo={inputTodo} input={input}/>
    <Todos todos={todos} checkBox={checkBox} error={error} errMessage={errMessage} deleteTodo={deleteTodo} updateTodo={updateTodo} totalTodo={totalTodo} total={total} clearCompleted={clearCompleted} displayCompleted={displayCompleted} displayActive={displayActive} setfilterTodos={setfilterTodos} filterTodos={filterTodos} displayAll={displayAll} dragItem={dragItem} loading={loading} />
    <Attribution/>
  </div>
  )
}

export default App;
