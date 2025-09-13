"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Download, ChevronDown, Mic2, Wand2, Bot, Music, BookOpen, Film, Tv } from 'lucide-react';

type Language = 'English' | 'Arabic';
type ApiError = { detail: string };
type ApiResponse = { language: Language; url: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const Header = () => (
  <header className="py-4 px-4 sm:px-8 md:px-16 bg-white">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-black rounded-md"></div>
        <span className="font-bold text-xl text-gray-800">ElevenLabs</span>
      </div>
      <nav className="hidden md:flex items-center space-x-6 text-gray-600 font-medium">
        <a href="#" className="hover:text-black">Creative Platform</a>
        <a href="#" className="hover:text-black">Agents Platform</a>
        <a href="#" className="hover:text-black">Developers</a>
        <a href="#" className="hover:text-black">Resources</a>
        <a href="#" className="hover:text-black">Enterprise</a>
        <a href="#" className="hover:text-black">Pricing</a>
      </nav>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 font-medium hover:text-black">Log in</button>
        <button className="bg-black text-white px-5 py-2 rounded-full font-semibold hover:bg-gray-800 transition-colors">Sign up</button>
      </div>
    </div>
  </header>
);

const TabButton = ({ icon: Icon, label, active }: { icon: React.ElementType, label: string, active: boolean }) => (
  <button className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${active ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

const Tabs = () => {
    const TABS = [
        { label: 'Text to Speech', icon: Mic2, active: true },
        { label: 'Agents', icon: Bot, active: false },
        { label: 'Music', icon: Music, active: false },
        { label: 'Speech to Text', icon: Wand2, active: false },
        { label: 'Dubbing', icon: Film, active: false },
        { label: 'Voice Cloning', icon: Tv, active: false },
        { label: 'ElevenReader', icon: BookOpen, active: false },
    ];
    return (
        <div className="flex flex-wrap justify-center gap-2 my-8">
            {TABS.map(tab => <TabButton key={tab.label} {...tab} />)}
        </div>
    )
}

// --- Main Text-to-Speech Component ---
const TextToSpeechCard = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('English');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Effect to fetch audio URL when language changes
  useEffect(() => {
    const fetchAudioUrl = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // This now uses the API_URL variable
        const response = await fetch(`${API_URL}/api/audio/${selectedLanguage}/`);
        if (!response.ok) {
          const errData: ApiError = await response.json();
          throw new Error(errData.detail || 'Failed to fetch audio URL');
        }
        const data: ApiResponse = await response.json();
        setAudioUrl(data.url);
      } catch (e: any) {
        setError(e.message);
        console.error("Fetch error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudioUrl();
  }, [selectedLanguage]);

  // Effect to manage the Audio element instance
  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      const handleAudioEnd = () => setIsPlaying(false);
      audioRef.current.addEventListener('ended', handleAudioEnd);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleAudioEnd);
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback error:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-1 w-full max-w-4xl mx-auto border border-gray-200">
        <div className="p-6">
             <textarea
                className="w-full h-48 p-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Enter text here..."
                defaultValue="In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. Not the 'burn it all down' kind... but he was gentle, wise, with eyes like old stars. Even the birds fell silent when he passed."
             />
             <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-center text-sm text-gray-500">Voice and model selection UI would go here.</p>
             </div>
        </div>
        <div className="relative bg-white p-4 rounded-b-2xl border-t border-gray-200">
            <div className="absolute bottom-full left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
             <div className="flex justify-between items-center">
                <div className="relative">
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                        className="appearance-none bg-gray-100 border border-gray-300 rounded-lg py-2 pl-4 pr-10 font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value="English">🇺🇸 English</option>
                        <option value="Arabic">🇸🇦 Arabic</option>
                    </select>
                    <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                <div className="flex items-center space-x-4">
                    <button 
                        onClick={togglePlayPause}
                        disabled={isLoading || !!error}
                        className="bg-black text-white px-6 py-2.5 rounded-full font-semibold flex items-center space-x-2 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        <span>{isLoading ? 'Loading...' : (isPlaying ? 'PAUSE' : 'PLAY')}</span>
                    </button>
                    <a 
                      href={audioUrl || '#'}
                      download
                      className={`p-2.5 rounded-full ${audioUrl ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 cursor-not-allowed'}`}
                      onClick={(e) => !audioUrl && e.preventDefault()}
                    >
                        <Download size={20} />
                    </a>
                </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{`Error: ${error}`}</p>}
        </div>
    </div>
  );
};


// --- Main Page Component ---
export default function Home() {
  return (
    <div className="bg-[#F9F9F9] min-h-screen font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
            The most realistic voice AI platform
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
            AI voice models and products powering millions of developers, creators, and enterprises. From low-latency conversational agents to the leading AI voice generator for voiceovers and audiobooks.
        </p>
        <Tabs />
        <TextToSpeechCard />
        <div className="mt-12 py-6">
            <p className="text-lg text-gray-800 font-semibold">EXPERIENCE THE FULL AUDIO AI PLATFORM</p>
            <button className="mt-4 bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">SIGN UP</button>
        </div>
      </main>
    </div>
  );
}

