// import { Socket, Channel } from "phoenix";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Room from "./components/Room";

// const SERVER_URL: string = process.env.SERVER_URL
//   ? `wss://${process.env.SERVER_URL}/socket`
//   : "ws://localhost:4000/socket";

// const socket = new Socket(SERVER_URL);
// socket.connect();
// socket.onOpen(() => console.log("Socket connected"));
// socket.onClose(() => console.log("Socket disconnected"));
// socket.onError(console.error);

function App() {
  return (
    <>
      <ToastContainer position="top-center" pauseOnHover theme="colored" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomId" element={<Room />} />
      </Routes>
    </>
  );
}

export default App;
