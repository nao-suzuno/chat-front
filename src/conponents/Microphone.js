import React,{ useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './Microphone.css';

function Microphone () {
    const { listening, transcript, resetTranscript } = useSpeechRecognition();
    const [result, setResult] = useState("");
    const [text, setText] = useState("");
    const [log,setLog] = useState([]);
  
    const handleStartListening = () => {
      SpeechRecognition.startListening({continuous: true});
    };
  

    const handleStopListening = () => {
      SpeechRecognition.stopListening();
      setLog([...log,`user:${transcript}`])
      setTimeout(sendTranscriptToAPI(transcript),5000);
    };
  
    const sendTranscriptToAPI = async(transcript) => {
      await fetch("https://pi4c8iu2g5.execute-api.us-east-1.amazonaws.com/default/chat-server?text=" + transcript, {method: 'GET', headers: {'Content-Type': 'application/json'}, mode: 'cors'})
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          setText("Error");
          throw new Error('APIリクエストエラー: ' + res.status);
        }          
      })
      .then(data => {
        setText("DONE!");
        setLog([...log,`system:${data.result}`])
        setResult(data.result);
      })
      .catch((e) => {
        setText("Error");
        console.error('Failed to check authorization status', e);
      })

      setText("Loading");
      resetTranscript();
    };
  
    return (
      <div class="microphoneBlock">
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <div class="buttons">
          <button onClick={handleStartListening} disabled={listening}>音声入力開始</button>
          <button onClick={handleStopListening} disabled={!listening}>音声入力終了</button>
          <button onClick={resetTranscript}>リセット</button>
        </div>
        <p>送信内容(音声認識):{transcript}</p>
        <p>返答結果:{result}</p>
        <p>status:{text}</p>
        <p>Log</p>
        {
          (function () {
            const list = [];
            for (const t of log) {
              list.push(<li>{t}</li>);
            }
            return <ul>{list}</ul>;
          }())
        }
      </div>
    );
  };
  
  export default Microphone;
