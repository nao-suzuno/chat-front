import React, { useState, useEffect } from 'react';

const Microphone = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [socket, setSocket] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/ws');
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        }
      };

      // 録音を開始
      recorder.start();

      setIsRecording(true);
      setMediaStream(stream);
      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaStream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>WebSocket Mic Streaming</h1>
        {!isRecording ? (
          <button onClick={handleStartRecording}>Start Recording</button>
        ) : (
          <button onClick={handleStopRecording}>Stop Recording</button>
        )}
      </header>
    </div>
  );
};

export default Microphone;
