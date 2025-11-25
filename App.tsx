import React, { useState, useRef, useEffect } from 'react';
import { Step, Emotion } from './types';
import { ARFish } from './components/ARFish';

const App: React.FC = () => {
  // -- State Machine --
  const [step, setStep] = useState<Step>(Step.WAITING_MARKER);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [emotion, setEmotion] = useState<Emotion>(Emotion.CALM);
  
  // Logic Refs
  const recorderRef = useRef<MediaRecorder | null>(null);
  const targetRef = useRef<any>(null);

  // -- Event Listeners for MindAR --
  useEffect(() => {
    const target = targetRef.current;
    if (target) {
      const onTargetFound = () => {
        console.log("Marker Found");
        // Only transition to READY if we are currently waiting
        setStep((prev) => prev === Step.WAITING_MARKER ? Step.READY : prev);
      };
      
      const onTargetLost = () => {
        console.log("Marker Lost");
        // Optionally reset to waiting, or keep state if you want persistence
        // setStep(Step.WAITING_MARKER); 
      };

      target.addEventListener("targetFound", onTargetFound);
      target.addEventListener("targetLost", onTargetLost);

      return () => {
        target.removeEventListener("targetFound", onTargetFound);
        target.removeEventListener("targetLost", onTargetLost);
      };
    }
  }, []);

  // -- Logic Actions --

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        setStep(Step.RECORDED);
      };

      recorder.start();
      recorderRef.current = recorder;
      setStep(Step.RECORDING);
    } catch (err) {
      console.error("Mic error:", err);
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop();
    }
  };

  const playAudio = () => {
    if (!audioBlob) return;
    const url = URL.createObjectURL(audioBlob);
    const audio = new Audio(url);
    audio.play();
    audio.onended = () => {
      // Optional: Logic when playback ends
    };
    // setStep(Step.PLAYING); // Optional state if you want UI feedback during play
  };

  const releaseFish = () => {
    setStep(Step.RELEASED);
  };

  const resetFlow = () => {
    setAudioBlob(null);
    setStep(Step.READY);
  };

  // -- Render Helpers --

  return (
    <div className="w-full h-full">
      {/* 
        (A) AR Scene Manager 
        Note: using a publicly available 'card' target for demo purposes.
        In production, replace 'imageTargetSrc' with your custom .mind file.
      */}
      <a-scene
        mindar-image="imageTargetSrc: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind; autoStart: true; uiLoading: no; uiScanning: no;"
        color-space="sRGB"
        embedded
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        className="absolute inset-0 z-0"
      >
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        {/* Marker Entity */}
        <a-entity ref={targetRef} mindar-image-target="targetIndex: 0">
          
          {/* Title Board (Always visible on marker) */}
          <a-plane position="0 1 0" width="1.5" height="0.4" color="#000" opacity="0.7">
             <a-text value="Leave your voice to the Yellow River" align="center" width="2"></a-text>
          </a-plane>

          {/* Fish (Only visible when RELEASED) */}
          <ARFish visible={step === Step.RELEASED} emotion={emotion} />

        </a-entity>
      </a-scene>


      {/* 
        (C) AR UI Control Layer 
        Standard HTML overlay for interaction
      */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center gap-3">
          
          {/* State: WAITING_MARKER */}
          {step === Step.WAITING_MARKER && (
            <div className="bg-black/70 text-white px-6 py-4 rounded-xl backdrop-blur-md animate-pulse">
              <p className="font-bold text-lg">Scan the Marker</p>
            </div>
          )}

          {/* State: READY */}
          {step === Step.READY && (
            <button 
              onClick={startRecording}
              className="px-8 py-3 bg-red-500 text-white rounded-full font-bold shadow-lg active:scale-95 transition-transform"
            >
              🎤 Start Recording
            </button>
          )}

          {/* State: RECORDING */}
          {step === Step.RECORDING && (
            <>
              <div className="text-red-500 font-bold bg-white/90 px-3 py-1 rounded mb-2 animate-pulse">
                Recording...
              </div>
              <button 
                onClick={stopRecording}
                className="px-8 py-3 bg-gray-800 text-white rounded-full font-bold shadow-lg border-2 border-red-500 active:scale-95 transition-transform"
              >
                ⏹ Stop
              </button>
            </>
          )}

          {/* State: RECORDED */}
          {step === Step.RECORDED && (
            <div className="bg-black/60 p-5 rounded-2xl backdrop-blur-md flex flex-col items-center gap-4">
              <p className="text-white text-sm">Recording saved!</p>
              
              {/* Emotion Selector */}
              <div className="flex gap-2">
                {[Emotion.CALM, Emotion.HAPPY, Emotion.SAD, Emotion.SECRET].map(e => (
                  <button 
                    key={e} 
                    onClick={() => setEmotion(e)}
                    className={`w-8 h-8 rounded-full border-2 ${emotion === e ? 'border-white scale-110' : 'border-transparent opacity-60'}`}
                    style={{backgroundColor: e === Emotion.HAPPY ? '#FCD34D' : e === Emotion.SAD ? '#60A5FA' : e === Emotion.SECRET ? '#A78BFA' : '#34D399'}}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={playAudio} className="px-4 py-2 bg-white/20 text-white rounded-lg">
                  ▶ Review
                </button>
                <button onClick={releaseFish} className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold">
                  🐟 Release
                </button>
                <button onClick={resetFlow} className="px-4 py-2 bg-white/10 text-white rounded-lg">
                  ↩ Cancel
                </button>
              </div>
            </div>
          )}

          {/* State: RELEASED */}
          {step === Step.RELEASED && (
            <div className="bg-black/60 p-5 rounded-2xl backdrop-blur-md text-center">
              <p className="text-white mb-3">Your voice drifts with the river...</p>
              <button onClick={resetFlow} className="px-6 py-2 bg-white/20 text-white rounded-lg">
                Start Again
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default App;