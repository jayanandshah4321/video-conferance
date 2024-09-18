import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'

import Register from './components/Register'
import Loginn from './components/Loginn'
import Meetingform from './components/Meetingform'
import Chat from './components/Chat'
import Video from './components/Video'
import { SocketProvider } from './context/SocketProvider';
import RoomPage from './components/RoomPage';


if (typeof global === 'undefined') {
  window.global = window;
}

function App() {
  

  return (
    <Router>
      <SocketProvider>
      <Routes>
      
        <Route path="/login" element={<Loginn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/meetingform" element={<Meetingform/>} />
       <Route path="/Video/:roomId" element={<Video/>} />
        <Route path='/chat' element={<Chat/>} />
        <Route path='/room/:roomId' element={<RoomPage/>} />
       
      </Routes>
      </SocketProvider>
    </Router>
  )
}

export default App
