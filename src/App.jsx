
import './App.css';
import { Home } from './components/Home';
import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/login';
import { Signup } from './pages/signup';
import Navbar from './components/Navbar';
import Dashboard from './pages/dashboard';
import AddNote from './pages/notes/notesForm';
import EditNoteForm from './pages/notes/editNote';



function App() {

  return (
    <div className="App">
    
      <Navbar /> {/* Navbar outside the Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Dashboard/>} />
        <Route path="/add-note" element={<AddNote/>} />
        <Route path="/edit-note/:id" element={<EditNoteForm/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
