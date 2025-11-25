import React from 'react';

export enum Step {
  WAITING_MARKER = 'WAITING_MARKER', // Waiting for image target to be found
  READY = 'READY',                   // Target found, ready to record
  RECORDING = 'RECORDING',           // Recording audio
  RECORDED = 'RECORDED',             // Audio recorded, ready to review
  PLAYING = 'PLAYING',               // Playing back audio
  RELEASED = 'RELEASED'              // Fish released
}

export enum Emotion {
  CALM = 'CALM',
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  SECRET = 'SECRET'
}

// Extend JSX Intrinsic Elements to allow A-Frame elements in TypeScript
// We augment both the global JSX namespace and React's internal JSX namespace
// to ensure compatibility across different TypeScript configurations.

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-assets': any;
      'a-entity': any;
      'a-camera': any;
      'a-plane': any;
      'a-text': any;
      'a-circle': any;
      'a-ring': any;
      'a-cone': any;
      'a-sphere': any;
      'a-cylinder': any;
      'a-triangle': any;
      'a-animation': any;
      'a-light': any;
      'a-sky': any;
      'a-cursor': any;
      'a-image': any;
      'a-video': any;
      'a-link': any;
      'a-gltf-model': any;
      'a-obj-model': any;
      [elemName: string]: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-assets': any;
      'a-entity': any;
      'a-camera': any;
      'a-plane': any;
      'a-text': any;
      'a-circle': any;
      'a-ring': any;
      'a-cone': any;
      'a-sphere': any;
      'a-cylinder': any;
      'a-triangle': any;
      'a-animation': any;
      'a-light': any;
      'a-sky': any;
      'a-cursor': any;
      'a-image': any;
      'a-video': any;
      'a-link': any;
      'a-gltf-model': any;
      'a-obj-model': any;
      [elemName: string]: any;
    }
  }
}
