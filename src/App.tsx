import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans relative overflow-hidden flex flex-col pt-10 pb-20 md:pb-10">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(34, 211, 238, 0.08), transparent 50%), radial-gradient(circle at 100% 100%, rgba(217, 70, 239, 0.08), transparent 50%)' }} />
      <div className="fixed inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-fuchsia-600 flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.3)]">
          <Terminal className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-400 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            Neon Serpent
          </h1>
          <p className="text-gray-400 font-mono text-xs tracking-widest uppercase">WebAmp OS v1.0</p>
        </div>
      </header>

      {/* Main Layout */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-12 items-center justify-center">
        
        {/* Game Area */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <SnakeGame />
        </div>

        {/* Music Player Side */}
        <div className="w-full lg:w-96 flex flex-col items-center lg:items-start justify-center gap-8">
          <MusicPlayer />
          
          <div className="w-full max-w-sm hidden lg:block bg-black/40 border border-gray-800 rounded-xl p-6 backdrop-blur-md">
            <h3 className="text-sm font-mono text-cyan-500 mb-3 uppercase tracking-wider">System Log</h3>
            <ul className="text-xs font-mono text-gray-500 space-y-2">
              <li className="flex gap-2"><span className="text-fuchsia-500">[OK]</span> Core engine booted</li>
              <li className="flex gap-2"><span className="text-fuchsia-500">[OK]</span> Audio systems online</li>
              <li className="flex gap-2 text-cyan-400/80">&gt; Waiting for user input...</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
