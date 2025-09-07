
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Poem } from "@/lib/poems-service";
import { Button } from "@/components/ui/button";
import { Mic, Pause, Play, Redo, Save, Square, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useReactMediaRecorder } from "react-media-recorder";

// --- Componente para visualizar el audio en tiempo real ---
const AudioVisualizer = ({ audioStream }: { audioStream: MediaStream | null }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const animationFrameRef = React.useRef<number>();

    React.useEffect(() => {
        if (!audioStream || !canvasRef.current || audioStream.getAudioTracks().length === 0) {
            return;
        }

        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(audioStream);
        source.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');

        const draw = () => {
            if (!canvasCtx) return;
            animationFrameRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            
            canvasCtx.fillStyle = 'rgba(17, 24, 39, 0.5)'; // Match background
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                const r = barHeight + 100 * (i/bufferLength);
                const g = 250 * (i/bufferLength);
                const b = 50;
                canvasCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);
                x += barWidth + 1;
            }
        };

        draw();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            audioContext.close();
        };
    }, [audioStream]);

    return <canvas ref={canvasRef} className="w-full h-24 rounded-lg" />;
};


type RecitedPoem = {
  id: string;
  poemId: string;
  title: string;
  audioBlobUrl: string;
  createdAt: string;
  name: string;
};

const RECITED_POEMS_KEY = 'amor-expressions-recited-v1';

export function ReciteClient({ poem }: { poem: Poem }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [speechSynthesis, setSpeechSynthesis] = React.useState<SpeechSynthesis | null>(null);
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = React.useState('');
  const [karaokeStatus, setKaraokeStatus] = React.useState<'idle' | 'playing' | 'paused'>('idle');
  const [currentWordIndex, setCurrentWordIndex] = React.useState(-1);
  const [playbackRate, setPlaybackRate] = React.useState(1);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl, previewStream } = useReactMediaRecorder({ audio: true, blobPropertyBag: { type: 'audio/mp3' } });
  const [showSaveModal, setShowSaveModal] = React.useState(false);
  const [recitalName, setRecitalName] = React.useState(poem.title);

  const poemWords = React.useMemo(() => poem.poem.split(/(\s+)/), [poem.poem]);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      setSpeechSynthesis(synth);
      const loadVoices = () => {
        const availableVoices = synth.getVoices().filter(v => v.lang.startsWith('es'));
        setVoices(availableVoices);
        if (availableVoices.length > 0) {
          const googleVoice = availableVoices.find(v => v.name === 'Google español');
          setSelectedVoiceURI(googleVoice ? googleVoice.voiceURI : availableVoices[0].voiceURI);
        }
      };
      loadVoices();
      if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = loadVoices;
      return () => synth.cancel();
    }
  }, []);

  const handlePlayKaraoke = () => {
    if (!speechSynthesis || !poem) return;
    if (karaokeStatus === 'paused' && utteranceRef.current) {
      speechSynthesis.resume();
      setKaraokeStatus('playing');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(poem.poem);
    utteranceRef.current = utterance;
    if (selectedVoiceURI) {
      const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
      if (selectedVoice) utterance.voice = selectedVoice;
    }
    utterance.rate = playbackRate;
    utterance.onstart = () => setKaraokeStatus('playing');
    utterance.onpause = () => setKaraokeStatus('paused');
    utterance.onresume = () => setKaraokeStatus('playing');
    utterance.onend = () => { setKaraokeStatus('idle'); setCurrentWordIndex(-1); };
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const wordIndex = utterance.text.substring(0, event.charIndex).split(/(\s+)/).length - 1;
        setCurrentWordIndex(wordIndex);
      }
    };
    speechSynthesis.speak(utterance);
  };

  const handlePauseKaraoke = () => speechSynthesis?.pause();
  const handleStopKaraoke = () => { speechSynthesis?.cancel(); setKaraokeStatus('idle'); setCurrentWordIndex(-1); };
  const handleStartRecording = () => { clearBlobUrl(); startRecording(); };
  const handleStopRecording = () => stopRecording();
  const handleRestartRecording = () => { stopRecording(); clearBlobUrl(); };

  const handleSaveRecital = () => {
    if (!mediaBlobUrl || !poem) return;
    const storedRecitals = localStorage.getItem(RECITED_POEMS_KEY);
    const recitals: RecitedPoem[] = storedRecitals ? JSON.parse(storedRecitals) : [];
    const newRecital: RecitedPoem = {
      id: new Date().toISOString(),
      poemId: poem.id,
      title: poem.title,
      audioBlobUrl: mediaBlobUrl,
      createdAt: new Date().toISOString(),
      name: recitalName.trim() || poem.title,
    };
    recitals.unshift(newRecital);
    localStorage.setItem(RECITED_POEMS_KEY, JSON.stringify(recitals));
    toast({ title: "¡Guardado!", description: "Tu recitado ha sido guardado en 'Mis Recitados'." });
    setShowSaveModal(false);
    router.push('/recitals');
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-900 text-white p-4 sm:p-8" style={{backgroundImage: 'linear-gradient(rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.9)), url("https://images.unsplash.com/photo-1502810365585-56FFA361fdde?q=80&w=2070&auto=format&fit=crop")'}}>
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 overflow-y-auto rounded-lg bg-black/30 backdrop-blur-sm p-6">
        <h1 className="text-3xl font-bold font-headline text-primary mb-4">{poem.title}</h1>
        <div className="text-2xl md:text-3xl font-serif leading-relaxed">
          {poemWords.map((word, index) => (
            <span key={index} className={`transition-colors duration-200 ${currentWordIndex === index ? 'text-yellow-300' : 'text-white/80'}`}>
              {word}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex-shrink-0 mt-6 space-y-4">
        <Card className="bg-black/30 border-white/20 text-white">
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2"><Bot className="h-4 w-4"/> Karaoke (IA)</Label>
                    <div className="flex items-center gap-2">
                        {karaokeStatus === 'idle' && <Button size="icon" variant="ghost" onClick={handlePlayKaraoke}><Play className="h-5 w-5"/></Button>}
                        {karaokeStatus === 'playing' && <Button size="icon" variant="ghost" onClick={handlePauseKaraoke}><Pause className="h-5 w-5"/></Button>}
                        {karaokeStatus === 'paused' && <Button size="icon" variant="ghost" onClick={handlePlayKaraoke}><Play className="h-5 w-5"/></Button>}
                        <Button size="icon" variant="ghost" onClick={handleStopKaraoke}><Square className="h-5 w-5"/></Button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-xs">Voz</Label>
                        <Select value={selectedVoiceURI} onValueChange={setSelectedVoiceURI}>
                            <SelectTrigger className="bg-gray-800 border-gray-700"><SelectValue placeholder="Seleccionar voz..." /></SelectTrigger>
                            <SelectContent>
                                {voices.map(voice => <SelectItem key={voice.voiceURI} value={voice.voiceURI}>{voice.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-xs">Velocidad ({playbackRate.toFixed(1)}x)</Label>
                        <Slider value={[playbackRate]} onValueChange={(v) => setPlaybackRate(v[0])} min={0.5} max={2} step={0.1} />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-black/30 border-white/20 text-white">
            <CardContent className="p-4 space-y-4">
                 <Label className="flex items-center gap-2"><Mic className="h-4 w-4"/> Tu Recitado</Label>
                 {status === 'recording' && <AudioVisualizer audioStream={previewStream} />}
                 {status === 'stopped' && mediaBlobUrl && (
                    <div className="flex justify-center">
                        <audio src={mediaBlobUrl} controls className="w-full" />
                    </div>
                 )}
                 <div className="flex items-center justify-center space-x-4">
                    {status !== 'recording' && <Button variant="secondary" onClick={handleStartRecording}><Mic className="mr-2 h-4 w-4"/>Grabar</Button>}
                    {status === 'recording' && <Button variant="destructive" onClick={handleStopRecording}><Square className="mr-2 h-4 w-4"/>Detener</Button>}
                    <Button variant="outline" onClick={handleRestartRecording}>Reiniciar</Button>
                    <Button onClick={() => setShowSaveModal(true)} disabled={!mediaBlobUrl}>Guardar</Button>
                 </div>
            </CardContent>
        </Card>
        <Button variant="link" className="text-gray-400 mx-auto block" onClick={() => router.back()}>Salir</Button>
      </div>
      
      <AlertDialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Guardar Recitado</AlertDialogTitle>
                <AlertDialogDescription>Ponle un nombre a tu grabación para guardarla en "Mis Recitados".</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
                <Label htmlFor="recital-name">Nombre del Recitado</Label>
                <Input id="recital-name" value={recitalName} onChange={(e) => setRecitalName(e.target.value)} placeholder="Ej: Para mi amor"/>
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleSaveRecital}>Guardar</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
