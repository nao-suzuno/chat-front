import React,{ useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function Microphone () {
    const { listening, transcript, resetTranscript } = useSpeechRecognition();
    const [result, setResult] = useState("");
  
    const handleStartListening = () => {
      SpeechRecognition.startListening({continuous: true});
    };
  

    const handleStopListening = () => {
      SpeechRecognition.stopListening();
      setTimeout(sendTranscriptToAPI(transcript),5000);
    };
  
    const sendTranscriptToAPI = (transcript) => {
      fetch("https://pi4c8iu2g5.execute-api.us-east-1.amazonaws.com/default/chat-server?text=" + transcript, {method: 'GET', headers: {'Content-Type': 'application/json'}, mode: 'cors'})
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('APIリクエストエラー: ' + res.status);
        }          
      })
      .then(data => {
        setResult(data.result);
      })
      .catch((e) => {
        console.error('Failed to check authorization status', e);
      })
      resetTranscript();
    };
  
    return (
      <div>
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <button onClick={handleStartListening} disabled={listening}>音声入力開始</button>
        <button onClick={handleStopListening} disabled={!listening}>音声入力終了</button>
        <button onClick={resetTranscript}>リセット</button>

        <p>音声認識:{transcript}</p>
        <p>返答結果:{result}</p>
      </div>
    );
  };
  
  export default Microphone;
