// src/app/(app)/live/page.tsx
'use client';

import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// The signaling server URL
const SIGNALING_URL = process.env.NEXT_PUBLIC_SIGNALING_URL || "http://localhost:5000";

// STUN/TURN server configuration
const ICE_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
  ]
};

let socket: Socket;

export default function LivePage() {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [registered, setRegistered] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [peers, setPeers] = useState<Record<string, RTCPeerConnection>>({});
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<Record<string, HTMLVideoElement>>({});
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    socket = io(SIGNALING_URL);

    socket.on("connect", () => console.log("Connected to signaling server:", socket.id));
    socket.on("registered", (d) => { console.log("registered", d); setRegistered(true); });
    socket.on("msg", (d) => setMessages((m) => [...m, { from: d.meta.fromUserId || d.fromSocket, text: d.message, stamp: Date.now() }]));
    socket.on("peer-joined", ({ socketId, name }) => {
      console.log("peer-joined", socketId, name);
      // New peer joined, let's call them
      callPeer(socketId);
    });

    socket.on("peer-left", ({ socketId }) => {
      console.log("peer-left", socketId);
      // Cleanup remote video
      if (remoteVideosRef.current[socketId]) {
        remoteVideosRef.current[socketId].srcObject = null;
        const videoElement = document.getElementById(`vid-${socketId}`);
        videoElement?.parentNode?.removeChild(videoElement);
        delete remoteVideosRef.current[socketId];
      }
      // Close peer connection
      if (peers[socketId]) {
        peers[socketId].close();
        const newPeers = { ...peers };
        delete newPeers[socketId];
        setPeers(newPeers);
      }
    });

    socket.on("webrtc-offer", async ({ fromSocket, offer }) => {
      console.log("Offer from", fromSocket);
      await ensureLocalStream();
      const pc = createPeerConnection(fromSocket);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("webrtc-answer", { toSocketId: fromSocket, answer, roomId });
    });

    socket.on("webrtc-answer", async ({ fromSocket, answer }) => {
      const pc = peers[fromSocket];
      if (!pc) return console.warn("pc not found for answer", fromSocket);
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("webrtc-candidate", ({ fromSocket, candidate }) => {
      const pc = peers[fromSocket];
      if (!pc) return;
      pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
    });

    return () => {
      if(localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
      Object.values(peers).forEach(pc => pc.close());
      setPeers({});
      if(socket) socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function register() {
    if (!userId || !name) return alert("Enter user ID and name");
    socket.emit("register", { userId, name });
  }

  async function joinRoom() {
    if (!roomId) return alert("Enter room ID");
    await ensureLocalStream();
    socket.emit("join-room", { roomId });
    setJoined(true);
  }

  function leaveRoom() {
    socket.emit("leave-room", { roomId });
    setJoined(false);
    Object.values(peers).forEach(pc => pc.close());
    setPeers({});
    const remotesDiv = document.getElementById("remotes");
    if(remotesDiv) remotesDiv.innerHTML = "";
    remoteVideosRef.current = {};
  }

  function sendMessage() {
    if (!input) return;
    const messageData = { from: userId, text: input, stamp: Date.now() };
    socket.emit("msg", { roomId, message: input, meta: { fromUserId: userId, timestamp: Date.now() } });
    setMessages(m => [...m, messageData]);
    setInput("");
  }

  async function ensureLocalStream() {
    if (localStreamRef.current) return localStreamRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      return stream;
    } catch (error) {
      console.error("Error accessing media devices.", error);
      alert("Could not access camera and microphone. Please check permissions.");
      return null;
    }
  }

  function createPeerConnection(remoteSocketId: string): RTCPeerConnection {
    const pc = new RTCPeerConnection(ICE_CONFIG);

    pc.onicecandidate = (ev) => {
      if (ev.candidate) {
        socket.emit("webrtc-candidate", { toSocketId: remoteSocketId, candidate: ev.candidate, roomId });
      }
    };

    pc.ontrack = (ev) => {
      let el = remoteVideosRef.current[remoteSocketId];
      if (!el) {
        const v = document.createElement("video");
        v.autoplay = true;
        v.playsInline = true;
        v.id = `vid-${remoteSocketId}`;
        const remotesDiv = document.getElementById("remotes");
        if(remotesDiv) remotesDiv.appendChild(v);
        remoteVideosRef.current[remoteSocketId] = v;
        el = v;
      }
      el.srcObject = ev.streams[0];
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current!));
    }
    
    setPeers(prev => ({...prev, [remoteSocketId]: pc}));
    return pc;
  }

  async function callPeer(remoteSocketId: string) {
    if(!localStreamRef.current) await ensureLocalStream();
    
    const pc = createPeerConnection(remoteSocketId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("webrtc-offer", { toSocketId: remoteSocketId, offer, roomId });
  }

  return (
    <div className="live-chat-container">
      <h2 className="live-chat-heading">LoveKitty — Chat & Calls (Demo)</h2>
      <div className="live-chat-row">
        <div className="live-chat-card">
          <h4>Identity</h4>
          <input placeholder="your-id (unique)" value={userId} onChange={e => setUserId(e.target.value)} />
          <input placeholder="your name" value={name} onChange={e => setName(e.target.value)} />
          <button onClick={register} disabled={registered}>Register</button>
          <div>Registered: {registered ? "Yes" : "No"}</div>
        </div>

        <div className="live-chat-card">
          <h4>Room</h4>
          <input placeholder="room id" value={roomId} onChange={e => setRoomId(e.target.value)} />
          {!joined ? <button onClick={joinRoom}>Join Room</button> : <button onClick={leaveRoom}>Leave Room</button>}
        </div>

        <div className="live-chat-card">
          <h4>Messaging</h4>
          <div className="live-chat-msgs" id="msgs">
            {messages.map((m, i) => (
              <div key={i} className={`live-chat-msg ${m.from === userId ? "me" : "them"}`}>
                <b>{m.from}</b>: {m.text}
              </div>
            ))}
          </div>
          <input placeholder="Type..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

      <div className="live-chat-row">
        <div className="live-chat-card">
          <h4>Local Preview</h4>
          <video ref={localVideoRef} autoPlay playsInline muted style={{ width: 240, height: 180, background: "#000", borderRadius: '8px' }} />
          <div className="controls" style={{marginTop: '8px'}}>
            <button onClick={ensureLocalStream}>Enable Camera</button>
          </div>
        </div>

        <div className="live-chat-card">
          <h4>Remote Videos</h4>
          <div id="remotes" style={{ display: "flex", gap: 8, flexWrap: 'wrap' }} />
        </div>
      </div>
    </div>
  );
}
