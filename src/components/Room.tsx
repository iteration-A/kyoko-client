import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Socket } from "phoenix";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import useRoomChannel from "../hooks/useRoomChannel";
import Board from "./Board";
import { RoomType } from "../constants/types";
import { SERVER_URL, SERVER_SOCKET_URL } from "../constants/values";
import styles from "./Room.module.css";

const socket = new Socket(SERVER_SOCKET_URL);
socket.connect();
// socket.onOpen(() => console.log("Socket connected"));
// socket.onClose(() => console.log("Socket disconnected"));
// socket.onError(console.error);

const Room = () => {
  const { state } = useLocation();
  const [playerName, setPlayerName] = useState((state as any)?.player);

  const [room, setRoom] = useState<RoomType>();
  const { users, error: channelError } = useRoomChannel(
    socket,
    room,
    playerName
  );

  const params = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${SERVER_URL}/api/rooms/${params.roomId}`
        );

        setRoom(response.data.data);
        let pName = playerName;
        while (!Boolean(pName)) {
          pName = prompt("What's your name? :)");
        }
        setPlayerName(pName);
      } catch (error) {
        console.error(error);
        alert("Invalid room!");
      }
    };

    fetchData();
  }, [params.roomId]);

  const copyLinkHandler = () => {
    toast("Link copied!", { type: "success" });
  };

  if (!room) return <h1>Loading...</h1>;
  if (channelError) return <h1>Invalid room...</h1>;

  return (
    <div className={styles.container}>
      <h1>{`Room \`${room.name}\``}</h1>
      <CopyToClipboard
        text={`${window.origin}/${room.code}`}
        onCopy={copyLinkHandler}
      >
        <button className={styles.inviteContainer}>
          <h3>
            Invite your friends with <span>this</span> link
          </h3>
        </button>
      </CopyToClipboard>

      <div>
        <Board users={users} />
      </div>
    </div>
  );
};

export default Room;
