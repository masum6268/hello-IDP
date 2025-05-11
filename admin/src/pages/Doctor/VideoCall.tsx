import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
// Removed unused import
import socket from '../../components/Socket';
import axios from 'axios';
import { VideoCalling } from '../../components/VideoCalling';

// Removed unused variable
const APP_ID = "6aaf461638d144148e4cf28c95de56bb";


function VideoCall() {
    // Removed unused variable
    const { id } = useParams<{ id: string }>();

  const [userIdToCall, setUserIdToCall] = useState(""); // Retained as it is used in handleCall
  const [channelName, setChannelName] = useState(""); // Retained as it is used in handleCall
  const [token, setToken] = useState(""); // Retained as it is used in handleCall
  const [startCall, setStartCall] = useState(false); // Retained as it is used in handleCall

  const handleCall = async () => {
    const channel = `channel-${Date.now()}`;
    setChannelName(channel);

    const { data } = await axios.get("http://localhost:4000/api/token", {
      params: { channelName: channel, uid: 0 },
    });
    setToken(data.token);

    socket.emit("call-user", { from: "admin-123", to: id, channelName: channel });

    setStartCall(true);
  
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Video Call Dashboard</h1>
      {!startCall ? (
        <>
          <input
            type="text"
            placeholder="User ID to call"
            value={userIdToCall}
            onChange={(e) => setUserIdToCall(e.target.value)}
            style={{ marginBottom: "10px", padding: "8px" }}
          />
          <br />
          <button onClick={handleCall} style={{ padding: "10px 20px" }}>Call patient</button>
        </>
      ) : (
        <VideoCalling appId={APP_ID} channelName={channelName} token={token} />
      )}
    </div>
  );
}

export default VideoCall