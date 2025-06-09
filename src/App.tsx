import type { GameSettings, DebugMode, DormitoryInfo } from './types';
// 値として使用するものは通常のインポート
import { useState, useEffect } from 'react';
import { GameScreen } from './components/GameScreen';
import { Badge } from './components/Badge';
import { HelpModal } from './components/HelpModal';
import { useBadges } from './hooks/useBadges';

type Screen = 'title' | 'game';

// LocalStorage のキー名
const STORAGE_KEYS = {
  DORMITORY: 'parerquiz-selected-dormitory',
  GAME_MODE: 'parerquiz-selected-game-mode',
  DIFFICULTY: 'parerquiz-selected-difficulty'
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('title');
  
  // LocalStorage から設定を復元
  const [selectedDormitory, setSelectedDormitory] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.DORMITORY) || 'すべて';
  });
  
  const [selectedGameMode, setSelectedGameMode] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.GAME_MODE) || 'name';
  });
  
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.DIFFICULTY) || 'ふつう';
  });
  
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);

  // デバッグ用状態
  const [debugGameSettings, setDebugGameSettings] = useState<GameSettings | null>(null);
  const [debugMode, setDebugMode] = useState<DebugMode | null>(null);

  // ヘルプモーダル用状態
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // ホスト名がlocalhostかどうかを判定
  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'
  );

  // 設定変更時に LocalStorage に自動保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DORMITORY, selectedDormitory);
  }, [selectedDormitory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GAME_MODE, selectedGameMode);
  }, [selectedGameMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DIFFICULTY, selectedDifficulty);
  }, [selectedDifficulty]);

  const { getBadgeForDormitory, shouldBadgeGlow, resetAllBadges, reloadBadges, badges } = useBadges();

  const dormitories: DormitoryInfo[] = [
    { 
      name: 'バゥ寮', 
      color: 'from-red-400 to-red-600', 
      textColor: 'text-white',
      imagePath: '/parerquiz/assets/images/dormitory/wa.webp'
    },
    { 
      name: 'ミュゥ寮', 
      color: 'from-pink-400 to-pink-600', 
      textColor: 'text-white',
      imagePath: '/parerquiz/assets/images/dormitory/me.webp'
    },
    { 
      name: 'クゥ寮', 
      color: 'from-cyan-400 to-blue-500', 
      textColor: 'text-white',
      imagePath: '/parerquiz/assets/images/dormitory/co.webp'
    },
    { 
      name: 'ウィニー寮', 
      color: 'from-green-400 to-green-600', 
      textColor: 'text-white',
      imagePath: '/parerquiz/assets/images/dormitory/wh.webp'
    },
    { 
      name: 'すべて', 
      color: 'from-yellow-400 to-amber-500', 
      textColor: 'text-white',
      imagePath: '/parerquiz/assets/images/parerdemia-logo.png'
    }
  ];

  const gameModes = [
    { id: 'name', name: '名前当てモード', description: '画像を見て名前を当てよう', color: 'from-green-400 to-green-600' },
    { id: 'face', name: '顔当てモード', description: '情報を見て顔を当てよう', color: 'from-blue-400 to-blue-600' }
  ];

  const difficulties = [
    { id: 'ふつう', name: 'ふつう', description: '標準的な難易度', color: 'from-blue-400 to-blue-600', available: true },
    { id: 'むずかしい', name: 'むずかしい', description: '似た髪色の人が優先的に出現', color: 'from-orange-400 to-orange-600', available: true },
    { id: '寮生専用', name: '寮生専用', description: 'マニア向け（シルエット表示）', color: 'from-purple-400 to-purple-600', available: true }
  ];

  const handleDormitorySelect = (dormName: string) => {
    setSelectedDormitory(dormName);
  };

  const handleGameModeSelect = (modeId: string) => {
    setSelectedGameMode(modeId);
  };

  const handleDifficultySelect = (difficultyId: string) => {
    setSelectedDifficulty(difficultyId);
  };

  const handleGameStart = () => {
    const settings: GameSettings = {
      dormitory: selectedDormitory as 'バゥ寮' | 'ミュゥ寮' | 'クゥ寮' | 'ウィニー寮' | 'すべて',
      gameMode: selectedGameMode as 'name' | 'face',
      difficulty: selectedDifficulty as 'ふつう' | 'むずかしい' | '寮生専用',
      isAdvancedMode: selectedDifficulty === '寮生専用'
    };
    setGameSettings(settings);
    setDebugGameSettings(null);
    setDebugMode(null);
    setCurrentScreen('game');
  };

  // デバッグ用ゲーム終了画面表示
  const handleDebugGameEnd = (correctAnswers: number, totalQuestions: number) => {
    const settings: GameSettings = {
      dormitory: selectedDormitory as 'バゥ寮' | 'ミュゥ寮' | 'クゥ寮' | 'ウィニー寮' | 'すべて',
      gameMode: selectedGameMode as 'name' | 'face',
      difficulty: selectedDifficulty as 'ふつう' | 'むずかしい' | '寮生専用',
      isAdvancedMode: selectedDifficulty === '寮生専用'
    };
    setDebugGameSettings(settings);
    setDebugMode({ correctAnswers, totalQuestions });
    setGameSettings(null);
    setCurrentScreen('game');
  };

  const handleBackToTitle = () => {
    setCurrentScreen('title');
    setGameSettings(null);
    setDebugGameSettings(null);
    setDebugMode(null);
    // タイトル画面に戻ったときにバッジを再読み込み
    reloadBadges();
  };

  if (currentScreen === 'game' && (gameSettings || debugGameSettings)) {
    return (
      <GameScreen 
        settings={gameSettings || debugGameSettings!} 
        onBackToTitle={handleBackToTitle}
        debugMode={debugMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="text-center py-8 px-4 relative">
        <div className="max-w-4xl mx-auto relative">
          <h1 className="text-4xl md:text-6xl font-black font-rounded bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2 text-shadow-soft">
            パレクイズ
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-gray-600 font-medium font-elegant">
            ～めざせ！パレデミア学園60名完全マスター！～
          </p>
          
          {/* ヘルプボタン */}
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="absolute top-0 right-0 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 border border-white/50 flex items-center justify-center group"
            title="ヘルプ"
          >
            <span className="text-2xl text-gray-600 group-hover:text-purple-600 transition-colors duration-200">
              ❓
            </span>
          </button>
        </div>
      </header>

      {/* ヘルプモーダル */}
      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
      />

      {/* Main Content */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* バッジコレクション表示エリア - バッジがある場合のみ表示 */}
          {badges.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50 mb-6">
              <h2 className="text-2xl font-bold font-rounded text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-sm font-black mr-3">
                  🏆
                </span>
                バッジコレクション
              </h2>
              <div className="grid grid-cols-5 gap-4 justify-items-center">
                {dormitories.map((dorm) => {
                  const badge = getBadgeForDormitory(dorm.name as any);
                  return (
                    <div key={dorm.name} className="text-center">
                      <Badge
                        dormitory={dorm.name as any}
                        difficulty={badge?.difficulty || 'ふつう'}
                        earned={!!badge}
                        size="medium"
                        enableGlow={badge ? shouldBadgeGlow(badge.difficulty) : false}
                      />
                      <div className="text-xs text-gray-600 mt-2 font-medium">
                        {dorm.name}
                      </div>
                      {badge && (
                        <div className="text-xs text-gray-500 mt-1 hidden md:block">
                          {badge.difficulty === 'ふつう' ? 'ベーシック' : 
                           badge.difficulty === 'むずかしい' ? 'アドバンス' : 
                           badge.difficulty === '寮生専用' ? 'エキスパート' : badge.difficulty}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* 出題範囲セクション */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
              <h2 className="text-2xl font-bold font-rounded text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-black mr-3">
                  1
                </span>
                出題範囲
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {dormitories.map((dorm) => (
                  <button
                    key={dorm.name}
                    onClick={() => handleDormitorySelect(dorm.name)}
                    className={`px-4 py-3 rounded-xl font-medium font-rounded transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 ${
                      selectedDormitory === dorm.name
                        ? `bg-gradient-to-r ${dorm.color} ${dorm.textColor} shadow-lg ring-2 ring-white/50 font-bold`
                        : 'bg-white/80 text-gray-700 hover:bg-white shadow-md border border-gray-200/50 hover:shadow-lg'
                    }`}
                  >
                    <img
                      src={dorm.imagePath}
                      alt={`${dorm.name}のエンブレム`}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <span>{dorm.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ゲームモードセクション */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
              <h2 className="text-2xl font-bold font-rounded text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-black mr-3">
                  2
                </span>
                ゲームモード
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {gameModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleGameModeSelect(mode.id)}
                    className={`text-center px-4 py-3 rounded-xl font-bold font-rounded transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                      selectedGameMode === mode.id
                        ? `bg-gradient-to-r ${mode.color} text-white shadow-lg ring-2 ring-white/50`
                        : 'bg-white/80 text-gray-700 hover:bg-white shadow-md border border-gray-200/50 hover:shadow-lg'
                    }`}
                  >
                    <div className="font-bold">{mode.name}</div>
                    <div className="text-sm opacity-90 hidden md:block">{mode.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 難易度セクション */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50 mb-8">
            <h2 className="text-2xl font-bold font-rounded text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-black mr-3">
                3
              </span>
              難易度
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => difficulty.available && handleDifficultySelect(difficulty.id)}
                  disabled={!difficulty.available}
                  className={`px-4 py-3 rounded-xl font-medium font-rounded transition-all duration-200 ${
                    difficulty.available 
                      ? selectedDifficulty === difficulty.id
                        ? `bg-gradient-to-r ${difficulty.color} text-white shadow-lg ring-2 ring-white/50 font-bold`
                        : 'bg-white/80 text-gray-700 hover:bg-white shadow-md border border-gray-200/50 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-md border border-gray-200/50'
                  }`}
                >
                  <div className="flex items-center">
                    <span>{difficulty.name}</span>
                    {!difficulty.available && (
                      <span className="ml-2 text-xs bg-gray-400 text-white px-2 py-1 rounded-full font-elegant">
                        実装予定
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* スタートボタン */}
          <div className="text-center">
            <button 
              onClick={handleGameStart}
              className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-black font-rounded text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group text-shadow-soft"
            >
              スタート
              <span className="ml-3 group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </button>
          </div>

          {/* デバッグ用ボタン（localhost でのみ表示） - 画面最下部に移動 */}
          {isLocalhost && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-2xl shadow-lg p-4 mt-8">
              <h3 className="text-lg font-bold text-yellow-800 mb-3">🐛 デバッグ用機能</h3>
              
              {/* ゲーム結果シミュレーション */}
              <div className="mb-4">
                <h4 className="text-md font-bold text-yellow-700 mb-2">ゲーム結果シミュレーション</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleDebugGameEnd(5, 15)}
                    className="px-3 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    15問中5問正解
                  </button>
                  <button
                    onClick={() => handleDebugGameEnd(10, 15)}
                    className="px-3 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors text-sm"
                  >
                    15問中10問正解
                  </button>
                  <button
                    onClick={() => handleDebugGameEnd(15, 15)}
                    className="px-3 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    15問全問正解
                  </button>
                  <button
                    onClick={() => handleDebugGameEnd(30, 60)}
                    className="px-3 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    60問中30問正解
                  </button>
                  <button
                    onClick={() => handleDebugGameEnd(50, 60)}
                    className="px-3 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors text-sm"
                  >
                    60問中50問正解
                  </button>
                  <button
                    onClick={() => handleDebugGameEnd(60, 60)}
                    className="px-3 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    60問全問正解
                  </button>
                </div>
              </div>

              {/* バッジ管理 */}
              <div>
                <h4 className="text-md font-bold text-yellow-700 mb-2">バッジ管理</h4>
                <button
                  onClick={resetAllBadges}
                  className="px-4 py-2 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition-colors text-sm"
                >
                  🗑️ バッジを全てリセット
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 px-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-md px-6 py-3 inline-block border border-white/50">
          <p className="text-sm text-gray-600 font-elegant">
            このゲームは二次創作物であり非公式のものです
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
