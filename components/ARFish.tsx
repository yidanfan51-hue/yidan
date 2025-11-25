import React from 'react';
import { Emotion } from '../types';

interface ARFishProps {
  visible: boolean;
  emotion: Emotion;
}

export const ARFish: React.FC<ARFishProps> = ({ visible, emotion }) => {
  // Determine color based on emotion
  const getColor = (e: Emotion) => {
    switch (e) {
      case Emotion.HAPPY: return '#FCD34D'; // Yellow
      case Emotion.SAD: return '#60A5FA';   // Blue
      case Emotion.SECRET: return '#A78BFA'; // Purple
      case Emotion.CALM: 
      default: return '#34D399'; // Green
    }
  };

  const fishColor = getColor(emotion);

  return (
    <a-entity visible={visible}>
      {/* Container for the swimming animation */}
      <a-entity 
        animation__swim={visible ? "property: position; from: -1 0 0; to: 1 0 0; dur: 8000; loop: true; easing: linear;" : ""}
      >
        {/* Fish Body Group */}
        <a-entity scale="0.2 0.2 0.2" rotation="0 -90 0">
          
          {/* Main Body */}
          <a-cone 
            color={fishColor} 
            radius-bottom="0.5" 
            height="1.5" 
            rotation="0 0 -90"
            position="0 0 0"
            opacity="0.9"
          ></a-cone>

          {/* Tail */}
          <a-triangle
            color={fishColor}
            vertex-a="0 0.5 0"
            vertex-b="0 -0.5 0"
            vertex-c="-0.8 0 0"
            position="-0.8 0 0"
            rotation="0 0 0"
            material="side: double"
          ></a-triangle>

          {/* Eye */}
          <a-sphere color="black" radius="0.1" position="0.5 0.2 0.3"></a-sphere>
          <a-sphere color="black" radius="0.1" position="0.5 0.2 -0.3"></a-sphere>

          {/* Bobbing animation */}
          <a-animation 
            attribute="position" 
            dur="2000" 
            fill="forwards" 
            to="0 0.1 0" 
            direction="alternate" 
            repeat="indefinite"
          ></a-animation>
        </a-entity>
      </a-entity>
    </a-entity>
  );
};