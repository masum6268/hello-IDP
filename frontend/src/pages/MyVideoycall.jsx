import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../components/Socket";
import { VideoCalling } from "../components/VideoCalling";
import { useParams } from "react-router-dom";

const APP_ID = "6aaf461638d144148e4cf28c95de56bb";

export default function MyVideoycall() {
  const [incomingCall, setIncomingCall] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [token, setToken] = useState("");
  const [startCall, setStartCall] = useState(false);
  
  const { id } = useParams();


  useEffect(() => {
    socket.emit("register", { id });

    socket.on("incoming-call", async ({ from, channelName }) => {
      console.log("Incoming call from", from);
      setChannelName(channelName);
      setIncomingCall(true);
    });

    return () => {
      socket.off("incoming-call");
    };
  }, []);

  const handleAccept = async () => {
    const { data } = await axios.get("http://localhost:4000/api/token", {
      params: { channelName: channelName, uid: 0 },
    });
    setToken(data.token);
    setIncomingCall(false);
    setStartCall(true);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>User Dashboard</h1>
      {incomingCall && (
        <div>
          <h3>📞 Incoming Call</h3>
          <button onClick={handleAccept} style={{ padding: "10px 20px" }}>Accept</button>
        </div>
      )}
      {startCall && <VideoCalling appId={APP_ID} channelName={channelName} token={token} />}
    </div>
  );
}
