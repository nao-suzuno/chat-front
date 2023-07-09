import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function App () {
  const { listening, transcript,resetTranscript } = useSpeechRecognition();

  const handleStartListening = () => {
    SpeechRecognition.startListening({continuous: true});
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    sendTranscriptToAPI(transcript);
    resetTranscript();
  };

  const sendTranscriptToAPI = (transcript) => {
    console.log('Transcript:', transcript);
  };

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={handleStartListening} disabled={listening}>音声入力開始</button>
      <button onClick={handleStopListening} disabled={!listening}>音声入力終了</button>
      <p>{transcript}</p>
    </div>
  );
};

export default App;