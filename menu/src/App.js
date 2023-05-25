import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  addButton: {
    backgroundColor: 'transparent',
    color: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
    },
  },
  deleteButton: {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
  deepBlueButton: {
    backgroundColor: 'transparent',
    color: '#050038',
    '&:hover': {
      backgroundColor: '#050038',
      color: 'white',
    },
  },
  confettiContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 9999,
  },
}));

const App = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const handleToggleComplete = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const handleDeleteAll = () => {
    setTodos([]);
  };

  const handleDeleteCompleted = () => {
    const completedTodos = todos.filter((todo) => todo.completed);
    if (completedTodos.length > 0) {
      setShowConfetti(true);
      const incompleteTodos = todos.filter((todo) => !todo.completed);
      setTodos(incompleteTodos);
      toast.success('¡Felicidades por completar tus tareas!', {
        position: 'top-center',
        autoClose: 3000, // Modificado a 5000 (5 segundos)
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        setShowConfetti(false);
      }, 10000);
    }
  };

  return (
    <div className="App">
      <h1>Lista de Quehaceres</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Agregar nuevo ítem"
          value={inputValue}
          onChange={handleInputChange}
        />
        <Button
          className={`${classes.addButton}`}
          variant="outlined"
          startIcon={<FontAwesomeIcon icon={faCartPlus} />}
          onClick={handleAddTodo}
        >
          Crear Nuevo
        </Button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo.id)}
            />
            <span>{todo.text}</span>
          </li>
        ))}
      </ul>
      <div className="button-container">
        <Button
          className={`${classes.deepBlueButton}`}
          variant="outlined"
          startIcon={<FontAwesomeIcon icon={faTrash} />}
          onClick={handleDeleteAll}
        >
          Eliminar Todos
        </Button>
        <Button
          className={`${classes.deepBlueButton}`}
          variant="outlined"
          startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
          onClick={handleDeleteCompleted}
        >
          Eliminar Completados
        </Button>
      </div>
      {showConfetti && (
        <div className={classes.confettiContainer}>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={4000}
            gravity={0.1}
            colors={['#050038', '#00FFD1', '#FF0081', '#FFD100']}
            run={showConfetti}
            onConfettiComplete={() => setShowConfetti(true)}
          />
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
