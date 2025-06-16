import type { GameSettings } from '../types';

interface TitleScreenProps {
  settings: GameSettings;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ settings }) => {
  return (
    <div className="title-screen title-background-scroll">
      <h1 className="text-4xl font-extrabold mb-4">Welcome to the Talent Quiz</h1>
      <p className="text-lg mb-8">Test your knowledge about the talents!</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white shadow-md">
          <h2 className="text-2xl font-bold mb-2">Game Mode</h2>
          <p className="text-gray-700">{settings.gameMode === 'name' ? 'Guess the name' : 'Guess the face'}</p>
        </div>
        <div className="p-4 rounded-xl bg-white shadow-md">
          <h2 className="text-2xl font-bold mb-2">Difficulty</h2>
          <p className="text-gray-700">今後実装予定 (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
};