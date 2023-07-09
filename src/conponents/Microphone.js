import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function Microphone () {
    const { listening, transcript, resetTranscript } = useSpeechRecognition();
  
    const handleStartListening = () => {
      SpeechRecognition.startListening({continuous: true});
    };
  

    const handleStopListening = () => {
      SpeechRecognition.stopListening();
      setTimeout(sendTranscriptToAPI(transcript),5000);
    };
  
    const sendTranscriptToAPI = (transcript) => {
      console.log('Transcript:', transcript);
      resetTranscript();
    };
  
    return (
      <div>
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <button onClick={handleStartListening} disabled={listening}>音声入力開始</button>
        <button onClick={handleStopListening} disabled={!listening}>音声入力終了</button>
        <button onClick={resetTranscript}>リセット</button>

        <p>{transcript}</p>
      </div>
    );
  };
  
  export default Microphone;