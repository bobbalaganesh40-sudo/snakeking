import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Gamepad2 } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [[10, 10]];
const INITIAL_DIRECTION: Point = [0, -1];
const BASE_SPEED = 150;

type Point = [number, number];

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = [
      Math.floor(Math.random() * GRID_SIZE),
      Math.floor(Math.random() * GRID_SIZE),
    ];
    // Check if food spawns on snake
    if (!snake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1])) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>([5, 5]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  
  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) return;

      if (!isStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        setIsStarted(true);
      }

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (currentDir[1] !== 1) setDirection([0, -1]);
          break;
        case 'ArrowDown':
        case 's':
          if (currentDir[1] !== -1) setDirection([0, 1]);
          break;
        case 'ArrowLeft':
        case 'a':
          if (currentDir[0] !== 1) setDirection([-1, 0]);
          break;
        case 'ArrowRight':
        case 'd':
          if (currentDir[0] !== -1) setDirection([1, 0]);
          break;
      }
    },
    [gameOver, isStarted]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isStarted || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead: Point = [
          head[0] + directionRef.current[0],
          head[1] + directionRef.current[1],
        ];

        // Wall collision
        if (
          newHead[0] < 0 ||
          newHead[0] >= GRID_SIZE ||
          newHead[1] < 0 ||
          newHead[1] >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some((segment) => segment[0] === newHead[0] && segment[1] === newHead[1])) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
          // Do not pop the tail
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    // Increase speed slightly based on score
    const currentSpeed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 5);
    const gameLoop = setInterval(moveSnake, currentSpeed);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, score, isStarted]);

  const handleGameOver = () => {
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsStarted(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  return (
    <div className="flex flex-col items-center">
      {/* Score Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 bg-black/60 border border-cyan-500/30 px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <Gamepad2 className="w-5 h-5 text-cyan-400" />
          <span className="font-mono text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-black/60 border border-fuchsia-500/30 px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(217,70,239,0.2)]">
          <Trophy className="w-5 h-5 text-fuchsia-400" />
          <span className="font-mono text-xl font-bold text-fuchsia-400">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board container */}
      <div className="relative bg-black border-2 border-cyan-500/50 rounded-xl p-1 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
        {/* Glow effect slightly inset */}
        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(34,211,238,0.2)] pointer-events-none rounded-xl" />
        
        {/* Grid backdrop */}
        <div 
          className="relative bg-black/90 rounded-lg overflow-hidden"
          style={{
            width: `${GRID_SIZE * 20}px`,
            height: `${GRID_SIZE * 20}px`,
            backgroundImage: 'linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          {/* Render Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <motion.div
                key={`${segment[0]}-${segment[1]}-${index}`}
                className="absolute"
                initial={false}
                animate={{
                  left: segment[0] * 20,
                  top: segment[1] * 20,
                }}
                transition={{ type: 'tween', duration: 0.1, ease: 'linear' }}
                style={{
                  width: 20,
                  height: 20,
                  padding: '1px',
                }}
              >
                <div 
                  className={`w-full h-full rounded-sm ${isHead ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-cyan-600/80 shadow-[0_0_5px_rgba(8,145,178,0.8)]'}`}
                />
              </motion.div>
            );
          })}

          {/* Render Food */}
          <div
            className="absolute p-[2px]"
            style={{
              left: food[0] * 20,
              top: food[1] * 20,
              width: 20,
              height: 20,
            }}
          >
            <div className="w-full h-full bg-fuchsia-500 rounded-full shadow-[0_0_15px_#d946ef] animate-pulse" />
          </div>

          {/* Overlays */}
          <AnimatePresence>
            {!isStarted && !gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]"
              >
                <p className="font-mono text-cyan-400 text-lg animate-pulse tracking-widest uppercase">
                  Press any arrow key to start
                </p>
              </motion.div>
            )}

            {gameOver && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm"
              >
                <h2 className="text-4xl font-bold text-fuchsia-500 mb-2 drop-shadow-[0_0_10px_rgba(217,70,239,0.8)] uppercase tracking-wider">
                  System Failure
                </h2>
                <p className="text-cyan-400 font-mono text-xl mb-6">Score: {score}</p>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 rounded-lg font-mono uppercase tracking-wider hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_#22d3ee] transition-all duration-300"
                >
                  <RefreshCw className="w-5 h-5" />
                  Restart
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Mobile controls hint */}
      <p className="mt-8 text-sm font-mono text-gray-500 uppercase tracking-widest text-center max-w-xs">
        Use W,A,S,D or Arrow Keys to navigate the mainframe
      </p>
      
      {/* Fallback On-Screen Controls for Mobile */}
      <div className="grid grid-cols-3 gap-2 mt-6 sm:hidden pointer-events-auto">
        <div />
        <ControlButton onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))} icon="â" />
        <div />
        <ControlButton onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))} icon="â" />
        <ControlButton onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))} icon="â" />
        <ControlButton onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))} icon="â" />
      </div>
    </div>
  );
}

function ControlButton({ onClick, icon }: { onClick: () => void, icon: string }) {
  return (
    <button 
      onClick={onClick}
      className="w-14 h-14 bg-black/50 border border-cyan-500/50 rounded-lg flex items-center justify-center text-cyan-400 text-2xl active:bg-cyan-500/20 active:shadow-[0_0_10px_#22d3ee] transition-all"
    >
      {icon}
    </button>
  );
}
