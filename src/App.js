import React, { useState, useEffect, useMemo } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


const App = () => {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const { transcript, resetTranscript, listening, interimTranscript } = useSpeechRecognition();

  let socket = useMemo(() => new WebSocket('ws://localhost:8080'), []);

  useEffect(() => {
    if (transcript && !interimTranscript && listening) {
      // 音声データをWebSocketを介して送信
      socket.send(transcript);
      resetTranscript();
      setSent(true);
    }
  }, [transcript, listening, resetTranscript, socket, interimTranscript]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!interimTranscript && sent) {
        setSent(false);
        console.log('入力完了');
        socket.send('done');
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [interimTranscript, socket, sent]);

  const startRecording = () => {
    // 録音を開始
    SpeechRecognition.startListening({ continuous: true });
  };

  socket.onmessage = (event) => {
    setMessage(event.data);
    SpeechRecognition.stopListening();
    // テキストを音声で読み上げる
    const utterance = new SpeechSynthesisUtterance(event.data);
    window.speechSynthesis.speak(utterance); 
    utterance.onend = () => {
      SpeechRecognition.startListening({ continuous: true });
    };  
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
  };

  return (
    <div>
      <button onClick={startRecording} disabled={listening}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!listening}>
        Stop Recording
      </button>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <p>sent:{sent ? 'on' : 'off'}</p>
      <p>{message}</p>
    </div>
  );
}

export default App;
