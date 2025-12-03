import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

// CHANGE this to your signaling server URL
const SIGNALING_URL = import.meta.env.VITE_SIGNALING_URL || "http://localhost:5000";

// STUN/TURN config (add TURN in production)
const ICE_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
    // add TURN server here: { urls: "turn:your-turn", username: "...", credential: "..." }
  ]
};

const socket = io(SIGNALING_URL);

export default function App() {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [registered, setRegistered] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [peers, setPeers] = useState({}); // socketId -> RTCPeerConnection
  const localVideoRef = useRef();
  const remoteVideosRef = useRef({}); // socketId->videoElement
  const localStreamRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => console.log("connected to signaling:", socket.id));
    socket.on("registered", (d)=>{ console.log("registered", d); setRegistered(true); });
    socket.on("msg", (d) => setMessages((m)=>[...m, { from: d.meta.fromUserId || d.fromSocket, text: d.message, stamp: Date.now() }]));
    socket.on("peer-joined", ({ socketId, name }) => {
      console.log("peer-joined", socketId, name);
      // optionally show available peers
    });
    socket.on("peer-left", ({ socketId }) => {
      console.log("peer-left", socketId);
      // cleanup remote video
      if (remoteVideosRef.current[socketId]) {
        remoteVideosRef.current[socketId].srcObject = null;
        delete remoteVideosRef.current[socketId];
      }
      // close peer connection
      if (peers[socketId]) { peers[socketId].close(); delete peers[socketId]; setPeers({ ...peers }); }
    });

    socket.on("webrtc-offer", async ({ fromSocket, offer, roomId }) => {
      console.log("offer from", fromSocket);
      await ensureLocalStream();
      const pc = createPeerConnection(fromSocket);
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("webrtc-answer", { toSocketId: fromSocket, answer, roomId });
    });

    socket.on("webrtc-answer", async ({ fromSocket, answer }) => {
      const pc = peers[fromSocket];
      if (!pc) return console.warn("pc not found for answer", fromSocket);
      await pc.setRemoteDescription(answer);
    });

    socket.on("webrtc-candidate", ({ fromSocket, candidate }) => {
      const pc = peers[fromSocket];
      if (!pc) return;
      pc.addIceCandidate(candidate).catch(console.error);
    });

    return () => {
      socket.off();
    };
    // eslint-disable-next-line
  }, [peers]);

  async function register() {
    if (!userId || !name) return alert("enter id & name");
    socket.emit("register", { userId, name });
  }

  async function joinRoom() {
    if (!roomId) return alert("enter room id");
    socket.emit("join-room", { roomId });
    setJoined(true);
  }

  function leaveRoom() {
    socket.emit("leave-room", { roomId });
    setJoined(false);
    // hang up all peers
    Object.values(peers).forEach(pc => pc.close());
    setPeers({});
  }

  function sendMessage() {
    if (!input) return;
    socket.emit("msg", { roomId, message: input, meta: { fromUserId: userId, timestamp: Date.now() }});
    setMessages(m=>[...m, { from: userId, text: input, stamp: Date.now() }]);
    setInput("");
  }

  // --- WebRTC helpers ---
  async function ensureLocalStream() {
    if (localStreamRef.current) return localStreamRef.current;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    return stream;
  }

  function createPeerConnection(remoteSocketId) {
    const pc = new RTCPeerConnection(ICE_CONFIG);
    // add local tracks
    if (localStreamRef.current) {
      for (const t of localStreamRef.current.getTracks()) pc.addTrack(t, localStreamRef.current);
    }
    // on track -> show remote video
    pc.ontrack = (ev) => {
      let el = remoteVideosRef.current[remoteSocketId];
      if (!el) {
        const v = document.createElement("video");
        v.autoplay = true; v.playsInline = true; v.id = "vid-" + remoteSocketId;
        document.getElementById("remotes").appendChild(v);
        remoteVideosRef.current[remoteSocketId] = v;
        el = v;
      }
      el.srcObject = ev.streams[0];
    };
    // ice candidates
    pc.onicecandidate = (ev) => {
      if (ev.candidate) {
        socket.emit("webrtc-candidate", { toSocketId: remoteSocketId, candidate: ev.candidate });
      }
    };
    // store
    peers[remoteSocketId] = pc;
    setPeers({ ...peers });
    return pc;
  }

  // initiate call to all peers in room (1:1 simplest)
  async function startCall() {
    await ensureLocalStream();
    // ask server for current room members? For simplicity we broadcast to everyone
    // We'll assume the other peers will respond.
    // Create offer per peer
    // NOTE: In real app, fetch list of sockets for the room from server; here we rely on 'peer-joined' events to know IDs.
    // For demo: request server side to list room members (not implemented) -> so we'll do a cheap approach by creating a "call-request" message.
    socket.emit("msg", { roomId, message: "__call_request__", meta: { fromUserId: userId, timestamp: Date.now() }});
  }

  // When receiving call request, we (as receiver) create peer connection and offer back? We'll implement: caller sends special event to all peers to trigger offer flow.
  // Simpler: implement 'call-init' that includes caller asking others to initiate P2P from their side by creating offer.
  socket.off("call-init");
  socket.on("call-init", async ({ fromSocket }) => {
    // the caller wants to connect; create pc and createAnswer flow (we treat this as caller->callee offer path)
    console.log("call-init from", fromSocket);
    await ensureLocalStream();
    const pc = createPeerConnection(fromSocket);
    // We'll make callee create offer? To keep design simple we will let caller create offer and emit webrtc-offer
    // So here we can optionally show "Incoming call" UI.
  });

  // Simpler workable flow (practical demo):
  // Caller: createOffer -> send webrtc-offer to every other socket id known (need list).
  // For demo usage: use 2 users only: when room has 2 participants, both will exchange offers if both call startCall.

  // Manual: create direct offer to a known socket id:
  async function callPeer(remoteSocketId) {
    await ensureLocalStream();
    const pc = createPeerConnection(remoteSocketId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("webrtc-offer", { toSocketId: remoteSocketId, offer, roomId });
  }

  return (
    <div className="container">
      <h2>LoveKitty — Chat & Calls (Demo)</h2>
      <div className="row">
        <div className="card">
          <h4>Identity</h4>
          <input placeholder="your-id (unique)" value={userId} onChange={e=>setUserId(e.target.value)} />
          <input placeholder="your name" value={name} onChange={e=>setName(e.target.value)} />
          <button onClick={() => { register(); }}>Register</button>
          <div>Registered: {registered ? "yes" : "no"}</div>
        </div>

        <div className="card">
          <h4>Room</h4>
          <input placeholder="room id" value={roomId} onChange={e=>setRoomId(e.target.value)} />
          {!joined ? <button onClick={joinRoom}>Join Room</button> : <button onClick={leaveRoom}>Leave Room</button>}
        </div>

        <div className="card">
          <h4>Messaging</h4>
          <div className="msgs" id="msgs">
            {messages.map((m, i) => <div key={i} className={"msg " + (m.from === userId ? "me" : "them")}>
              <b>{m.from}</b>: {m.text}
            </div>)}
          </div>
          <input placeholder="type..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=> e.key === "Enter" && sendMessage()} />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

      <div className="row">
        <div className="card">
          <h4>Local Preview</h4>
          <video ref={localVideoRef} autoPlay playsInline muted style={{ width: 240, height: 180, background: "#000" }} />
          <div className="controls">
            <button onClick={ensureLocalStream}>Enable Camera</button>
            <button onClick={startCall}>Start Call (send request)</button>
          </div>
        </div>

        <div className="card">
          <h4>Remotes</h4>
          <div id="remotes" style={{ display: "flex", gap: 8 }} />
          <div className="call-actions">
            <input placeholder="remote socket id" id="remote" />
            <button onClick={() => { const id = document.getElementById("remote").value; if (id) callPeer(id); }}>Call Specific Socket</button>
          </div>
        </div>
      </div>
    </div>
  );
}
