import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'


function App() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const b_onclick = () => {
    SpeechRecognition.startListening();
  };

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={b_onclick}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
    </div>
  );
  // function b_onclick(){
  //   const recognition = SpeechRecognition.SpeechRecognition();
  //   recognition.onresult = (event) => {
  //     console.log(event);
  //   }
  //   SpeechRecognition.recognition.start();
  // }

  // return (
  //   <div>
  //     <button onClick={b_onclick}>音声入力開始</button>
  //   </div>
  // );


}

export default App;
