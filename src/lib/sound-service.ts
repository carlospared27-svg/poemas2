
"use client";

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  // --- CORRECCIÓN: Acceso seguro a window ---
  if (typeof window !== 'undefined') {
    if (!audioContext) {
      try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error("Web Audio API is not supported in this browser", e);
        return null;
      }
    }
  }
  return audioContext;
};

const playSound = (type: 'click' | 'swoosh' | 'toggle') => {
  const context = getAudioContext();
  if (!context) return;

  // Ensure the context is running
  if (context.state === 'suspended') {
    context.resume();
  }
  
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  gainNode.gain.setValueAtTime(0, context.currentTime);

  switch (type) {
    case 'click':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);
      oscillator.frequency.exponentialRampToValueAtTime(300, context.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.1);
      break;

    case 'swoosh':
       oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.02);
      oscillator.frequency.exponentialRampToValueAtTime(400, context.currentTime + 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.15);
      break;
      
    case 'toggle':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.01);
      oscillator.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.1);
      break;
  }

  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + 0.15);
};

export { playSound };
