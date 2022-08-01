import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AddPostForm from './components/AddPostForm';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Login from './pages/Login';
import NoPage from './pages/NoPage';
import Post from './pages/Post';
import Profile from './pages/Profile';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <div className="grid-container">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/post/:postId" element={<Post />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/addpost" element={<AddPostForm />} />
            <Route path="/profile/:username" element={<Profile />} />

            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>

        <footer className="footer">All right reserved.</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
