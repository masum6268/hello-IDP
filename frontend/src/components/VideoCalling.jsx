import {
    LocalUser,
    RemoteUser,
    useIsConnected,
    useJoin,
    useLocalMicrophoneTrack,
    useLocalCameraTrack,
    usePublish,
    useRemoteUsers,
  } from "agora-rtc-react";
  import { useState } from "react";
  import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
  
  export const VideoCalling = ({ appId, channelName, token }) => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  
    return (
      <AgoraRTCProvider client={client}>
        <Basics appId={appId} channelName={channelName} token={token} />
      </AgoraRTCProvider>
    );
  };
  
  const Basics = ({ appId, channelName, token }) => {
    const [calling, setCalling] = useState(true);
    const isConnected = useIsConnected();
    const [micOn, setMic] = useState(true);
    const [cameraOn, setCamera] = useState(true);
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
    const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  
    useJoin({ appid: appId, channel: channelName, token: token }, calling);
    usePublish([localMicrophoneTrack, localCameraTrack]);
    const remoteUsers = useRemoteUsers();
  
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Video Call</h2>
        {isConnected ? (
          <div>
            <LocalUser
              audioTrack={localMicrophoneTrack}
              cameraOn={cameraOn}
              micOn={micOn}
              videoTrack={localCameraTrack}
              style={{ width: "300px", height: "300px", margin: "10px", borderRadius: "10px", background: "#333" }}
            />
            {remoteUsers.map((user) => (
              <RemoteUser
                key={user.uid}
                user={user}
                style={{ width: "300px", height: "300px", margin: "10px", borderRadius: "10px", background: "#555" }}
              />
            ))}
            <div style={{ marginTop: "20px" }}>
              <button onClick={() => setMic((prev) => !prev)}>{micOn ? "Mute Mic" : "Unmute Mic"}</button>
              <button onClick={() => setCamera((prev) => !prev)}>{cameraOn ? "Off Camera" : "On Camera"}</button>
            </div>
          </div>
        ) : (
          <div>Connecting...</div>
        )}
      </div>
    );
  };
  