import { Socket, Channel, Presence } from "phoenix";
import { useState, useEffect } from "react";

type RoomType = {
  code: string;
  name: string;
};
type UserType = {
  name: string;
};

const useRoomChannel = (
  socket: Socket,
  room: RoomType | undefined,
  player: string | null
) => {
  const [channel, setChannel] = useState<Channel>();
  useEffect(() => {
    if (!room) return;
    if (!player) return;

    const chan = socket.channel(`room:${room.code}`, { player });
    chan
      .join()
      .receive("ok", () => console.log("Room entered"))
      .receive("error", console.error);

    setChannel(chan);
  }, [room]);

  const [users, setUsers] = useState<UserType[]>([]);
  useEffect(() => {
    if (!channel) return;

    const presence = new Presence(channel);
    presence.onSync(() => {
      setUsers(
        presence.list((users: any) => {
          if (typeof users === "string") return [users];
          if (!users) return [];
          return users.map((user: any) => user.metas);
        })
      );
    });
  }, [channel, player]);

  return { channel, users };
};
export default useRoomChannel;
