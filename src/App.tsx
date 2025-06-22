import type { GameSettings, DebugMode, DormitoryInfo, Dormitory, BadEndState } from './types';
// 値として使用するものは通常のインポート
import { useState, useEffect } from 'react';
import { GameScreen } from './components/GameScreen';
import { OGPCaptureScreen } from './components/OGPCaptureScreen';
import { BadEndScreen } from './components/BadEndScreen';
import { OldAIMessage } from './components/OldAIMessage';
import { Badge } from './components/Badge';
import { HelpModal } from './components/HelpModal';
import { DevDiary } from './components/DevDiary';
import { useBadges } from './hooks/useBadges';
import { useImagePreloader } from './hooks/useImagePreloader';

type Screen = 'title' | 'game' | 'ogp-capture';

// LocalStorage のキー名
const STORAGE_KEYS = {
  DORMITORY: 'parerquiz-selected-dormitory',
  GAME_MODE: 'parerquiz-selected-game-mode',
  DIFFICULTY: 'parerquiz-selected-difficulty'
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('title');
  
  // BadEndScreen用の状態を追加
  const [badEndName, setBadEndName] = useState<string>('');
  const [showBadEnd, setShowBadEnd] = useState<boolean>(false);
  const [badEndState, setBadEndState] = useState<BadEndState>({ triggered: false, name: '', type: 'inappropriate' });
  
  // 古いAIメッセージ表示用の状態を追加
  const [showOldAI, setShowOldAI] = useState<boolean>(false);
  
  // showOldAI状態の変化を監視
  useEffect(() => {
    console.log("showOldAI state changed:", showOldAI);
  }, [showOldAI]);

  // デバッグ用：強制的に古いAIを表示するためのテスト
  const [forceShowOldAI, setForceShowOldAI] = useState<boolean>(false);
  
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

  // タレントデータの状態管理
  const [talents, setTalents] = useState<any[]>([]);

  // デバッグ用状態
  const [debugGameSettings, setDebugGameSettings] = useState<GameSettings | null>(null);
  const [debugMode, setDebugMode] = useState<DebugMode | null>(null);

  // ヘルプモーダル用状態
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // 開発日誌モーダル用状態
  const [isDevDiaryOpen, setIsDevDiaryOpen] = useState<boolean>(false);

  // ホスト名がlocalhostかどうかを判定
  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'
  );

  // タレントデータの読み込み
  useEffect(() => {
    fetch('/parerquiz/assets/data/talents.json')
      .then(response => response.json())
      .then(data => setTalents(data))
      .catch(error => console.error('Failed to load talents data:', error));
  }, []);

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

  // 現在の設定でのプリロード
  const currentSettings: GameSettings = {
    dormitory: selectedDormitory as 'バゥ寮' | 'ミュゥ寮' | 'クゥ寮' | 'ウィニー寮' | 'すべて',
    gameMode: selectedGameMode as 'name' | 'face',
    difficulty: selectedDifficulty as 'ふつう' | 'むずかしい' | '寮生専用',
    isAdvancedMode: selectedDifficulty === '寮生専用'
  };

  useImagePreloader(currentSettings, talents);

  const { getBadgeForDormitory, shouldBadgeGlow, resetAllBadges, reloadBadges, badges, isOniModeUnlocked, hasCorruptedDiaryAccess, isInitialized } = useBadges();

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
      imagePath: '/parerquiz/assets/images/mirror.png'
    }
  ];

  const gameModes = [
    { id: 'name', name: '名前当てモード', description: '💭 この子の名前、覚えてる？', color: 'from-green-400 to-green-600' },
    { id: 'face', name: '顔当てモード', description: '👀 みんなの顔、完璧に覚えた？', color: 'from-blue-400 to-blue-600' }
  ];

  const difficulties = [
    { id: 'ふつう', name: 'ふつう', description: '標準的な難易度', color: 'from-blue-400 to-blue-600', available: true, emoji: '📝' },
    { id: 'むずかしい', name: 'むずかしい', description: '似た髪色の人が優先的に出現', color: 'from-orange-400 to-orange-600', available: true, emoji: '🔥' },
    { id: '寮生専用', name: '寮生専用', description: 'マニア向け（シルエット表示）', color: 'from-purple-400 to-purple-600', available: true, emoji: '👑' },
    // 解放条件を満たしている場合のみ鬼モードを表示
    ...(isOniModeUnlocked() ? [
      { id: '鬼', name: '鬼', description: 'レジェンド級（要金バッジ）', color: 'from-red-500 to-red-700', available: true, emoji: '👹' }
    ] : [])
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
    // 鬼モードの場合は、ゲームモードに関わらず鬼難易度を維持
    const actualDifficulty = selectedDifficulty === '鬼' ? '鬼' : selectedDifficulty;
    
    const settings: GameSettings = {
      dormitory: selectedDormitory as 'バゥ寮' | 'ミュゥ寮' | 'クゥ寮' | 'ウィニー寮' | 'すべて',
      gameMode: selectedGameMode as 'name' | 'face',
      difficulty: actualDifficulty as 'ふつう' | 'むずかしい' | '寮生専用' | '鬼',
      isAdvancedMode: actualDifficulty === '寮生専用'
    };
    setGameSettings(settings);
    setDebugGameSettings(null);
    setDebugMode(null);
    setCurrentScreen('game');
  };

  // デバッグ用ゲーム終了画面表示
  const handleDebugGameEnd = (correctAnswers: number, totalQuestions: number) => {
    // 鬼モードの場合は、ゲームモードに関わらず鬼難易度を維持
    const actualDifficulty = selectedDifficulty === '鬼' ? '鬼' : selectedDifficulty;
    
    const settings: GameSettings = {
      dormitory: selectedDormitory as 'バゥ寮' | 'ミュゥ寮' | 'クゥ寮' | 'ウィニー寮' | 'すべて',
      gameMode: selectedGameMode as 'name' | 'face',
      difficulty: actualDifficulty as 'ふつう' | 'むずかしい' | '寮生専用' | '鬼',
      isAdvancedMode: actualDifficulty === '寮生専用'
    };
    setDebugGameSettings(settings);
    setDebugMode({ correctAnswers, totalQuestions });
    setGameSettings(null);
    setCurrentScreen('game');
  };

  // 古いAIメッセージを表示すべき条件をチェックする関数
  const shouldShowOldAI = (settings: GameSettings | null, result?: { correctAnswers: number; totalQuestions: number }): boolean => {
    console.log("shouldShowOldAI check:", {
      settings,
      result,
      hasSettings: !!settings,
      hasResult: !!result
    });
    
    if (!settings || !result) return false;
    
    const check = {
      dormitory: settings.dormitory === 'すべて',
      difficulty: settings.difficulty === '鬼',
      gameMode: settings.gameMode === 'face',
      perfectScore: result.correctAnswers === result.totalQuestions,
      hasQuestions: result.totalQuestions > 0
    };
    
    console.log("Condition checks:", check);
    
    // 出題範囲すべて・難易度鬼・顔当てモード・全問正解時の条件
    const shouldShow = (
      settings.dormitory === 'すべて' &&
      settings.difficulty === '鬼' &&
      settings.gameMode === 'face' &&
      result.correctAnswers === result.totalQuestions &&
      result.totalQuestions > 0
    );
    
    console.log("shouldShowOldAI result:", shouldShow);
    return shouldShow;
  };

  const handleBackToTitle = (result?: { correctAnswers: number; totalQuestions: number }) => {
    console.log("handleBackToTitle!!!!!")
    console.log("result:", result);
    console.log("gameSettings:", gameSettings);
    console.log("debugGameSettings:", debugGameSettings);
    console.log("showOldAI state:", showOldAI);
    
    // 古いAIメッセージ表示条件をチェック
    if (shouldShowOldAI(gameSettings || debugGameSettings, result)) {
      console.log("handleBackToTitle 2 !!!!!")
      console.log("Setting showOldAI to true");
      setShowOldAI(true);
      return;
    }
    // 通常のタイトル画面復帰処理
    setCurrentScreen('title');
    setGameSettings(null);
    setDebugGameSettings(null);
    setDebugMode(null);
  };


  // OGP撮影画面への遷移
  const handleOGPCapture = () => {
    setCurrentScreen('ogp-capture');
  };

  // Xシェア用の関数
  const handleXShareTitle = () => {
    const shareText = `🌟パレデミア学園クイズゲーム✨\n` +
      `60名のアイドルを完全マスター！\n` +
      `👤顔当て 📝名前当て 👑寮生専用モード\n` +
      `🏆バッジコレクション要素あり\n` +
      `キミは何人知ってる？今すぐチャレンジ🔥\n` +
      `#パレデミア学園 #パレクイズ #推し活`;
    const shareUrl = 'https://parerdemia-fan.github.io/parerquiz/';
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  // 61人目の寮生名を取得する関数を追加
  const getAIGivenNameInfo = (): { name: string; namedAt: string } | null => {
    try {
      const stored = localStorage.getItem('parerquiz-ai-given-name');
      if (stored) {
        const data = JSON.parse(stored);
        return {
          name: data.name,
          namedAt: new Date(data.namedAt).toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
      }
    } catch (error) {
      console.error('Failed to load AI given name info:', error);
    }
    return null;
  };

  // バッドエンド画面表示用の関数
  const handleDebugBadEnd = (name: string, type: 'inappropriate' | 'duplicate' = 'inappropriate') => {
    setBadEndName(name);
    setBadEndState({ triggered: true, name, type });
    setShowBadEnd(true);
  };

  // タイトル画面表示時にバッジ情報をリロード
  useEffect(() => {
    if (currentScreen === 'title') {
      // タイトル画面に遷移する際にバッジ情報を再読み込み
      reloadBadges();
      
      // デバッグ: LocalStorageの古いAI関連情報をチェック
      try {
        const aiNameData = localStorage.getItem('parerquiz-ai-given-name');
        console.log('AI given name in localStorage:', aiNameData);
      } catch (error) {
        console.error('Failed to check AI name:', error);
      }
    }
  }, [currentScreen, reloadBadges]);

  // バッジの初期化が完了するまで待機
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-elegant">設定とバッジ情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  // 古いAIメッセージ表示（最優先で判定）
  if (showOldAI || forceShowOldAI) {
    console.log("Rendering OldAIMessage component");
    return <OldAIMessage />;
  }

  if (currentScreen === 'game' && (gameSettings || debugGameSettings)) {
    return (
      <GameScreen 
        settings={gameSettings || debugGameSettings!} 
        onBackToTitle={handleBackToTitle}
        debugMode={debugMode}
      />
    );
  }

  if (currentScreen === 'ogp-capture') {
    return (
      <OGPCaptureScreen onBackToTitle={handleBackToTitle} />
    );
  }

  // バッドエンド画面表示
  if (showBadEnd) {
    return (
      <BadEndScreen
        name={badEndName}
        type={badEndState.type}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex flex-col title-background-scroll">
      <div className="relative z-10 flex flex-col min-h-screen">
      {/* Header */}
      <header className="text-center py-4 md:py-8 px-4 relative">
        <div className="max-w-4xl mx-auto relative">
          <h1 className="text-4xl md:text-6xl font-black font-rounded bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-1 md:mb-2 text-shadow-soft">
            パレクイズ
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-gray-600 font-medium font-elegant">
            ～めざせ！パレデミア学園60名完全マスター！～
          </p>
          
          {/* ヘルプボタン */}
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="absolute top-0 right-0 w-10 h-10 md:w-12 md:h-12 bg-white/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 border border-white/50 flex items-center justify-center group"
            title="ヘルプ"
          >
            <span className="text-xl md:text-2xl text-gray-600 group-hover:text-purple-600 transition-colors duration-200">
              ❓
            </span>
          </button>

          {/* 開発資料ボタン（条件達成時のみ表示） */}
          {hasCorruptedDiaryAccess() && (
            <button
              onClick={() => setIsDevDiaryOpen(true)}
              className="absolute top-0 right-12 md:right-14 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 border border-white/50 flex items-center justify-center group animate-pulse"
              title="開発資料（寮生専用）"
            >
              <span className="text-xl md:text-2xl text-white group-hover:text-purple-100 transition-colors duration-200">
                📖
              </span>
            </button>
          )}
        </div>
      </header>      {/* ヘルプモーダル */}
      <HelpModal 
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* 開発日誌モーダル */}
      {isDevDiaryOpen && (
        <DevDiary 
          onClose={() => setIsDevDiaryOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 px-4 pb-4 md:pb-8">
        <div className="max-w-4xl mx-auto">
          {/* バッジコレクション表示エリア - バッジがある場合のみ表示 */}
          {badges.length > 0 && (
            <div className="bg-white/90 rounded-2xl shadow-lg p-4 md:p-6 border border-white/50 mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold font-rounded text-gray-800 mb-3 md:mb-4 flex items-center">
                <span className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-black mr-2 md:mr-3">
                  🏆
                </span>
                バッジコレクション
              </h2>
              <div className="grid grid-cols-5 gap-2 md:gap-4 justify-items-center">
                {dormitories.map((dorm) => {
                  const badge = getBadgeForDormitory(dorm.name as Dormitory);
                  return (
                    <div key={dorm.name} className="text-center">
                      <Badge
                        dormitory={dorm.name as Dormitory}
                        difficulty={badge?.difficulty || 'ふつう'}
                        earned={!!badge}
                        size="medium"
                        enableGlow={badge ? shouldBadgeGlow(badge.difficulty) : false}
                      />
                      <div className="text-xs text-gray-600 mt-1 md:mt-2 font-medium">
                        {dorm.name}
                      </div>
                      {badge && (
                        <div className="text-xs text-gray-500 mt-1 hidden md:block">
                          {badge.difficulty === 'ふつう' ? 'ベーシック' : 
                           badge.difficulty === 'むずかしい' ? 'アドバンス' : 
                           badge.difficulty === '寮生専用' ? 'エキスパート' :
                           badge.difficulty === '鬼' ? 'レジェンド' : badge.difficulty}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            
            {/* 出題範囲セクション */}
            <div className="bg-white/90 rounded-2xl shadow-lg p-4 md:p-6 border border-white/50">
              <h2 className="text-xl md:text-2xl font-bold font-rounded text-gray-800 mb-3 md:mb-4 flex items-center">
                <span className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-black mr-2 md:mr-3">
                  1
                </span>
                出題範囲
              </h2>
              <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                {dormitories.map((dorm) => (
                  <button
                    key={dorm.name}
                    onClick={() => handleDormitorySelect(dorm.name)}
                    className={`px-3 md:px-4 py-2 md:py-3 rounded-xl font-medium font-rounded transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 md:gap-3 text-sm md:text-base ${
                      selectedDormitory === dorm.name
                        ? `bg-gradient-to-r ${dorm.color} ${dorm.textColor} shadow-lg ring-2 ring-white/50 font-bold`
                        : 'bg-white/80 text-gray-700 hover:bg-white shadow-md border border-gray-200/50 hover:shadow-lg'
                    }`}
                  >
                    <img
                      src={dorm.imagePath}
                      alt={`${dorm.name}のエンブレム`}
                      className="w-5 h-5 md:w-6 md:h-6 object-contain no-drag"
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
            <div className="bg-white/90 rounded-2xl shadow-lg p-4 md:p-6 border border-white/50">
              <h2 className="text-xl md:text-2xl font-bold font-rounded text-gray-800 mb-3 md:mb-4 flex items-center">
                <span className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-black mr-2 md:mr-3">
                  2
                </span>
                ゲームモード
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3">
                {gameModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleGameModeSelect(mode.id)}
                    className={`text-center px-3 md:px-4 py-2 md:py-3 rounded-xl font-bold font-rounded transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm md:text-base ${
                      selectedGameMode === mode.id
                        ? `bg-gradient-to-r ${mode.color} text-white shadow-lg ring-2 ring-white/50`
                        : 'bg-white/80 text-gray-700 hover:bg-white shadow-md border border-gray-200/50 hover:shadow-lg'
                    }`}
                  >
                    <div className="font-bold">{mode.name}</div>
                    <div className="text-xs md:text-sm opacity-90 hidden md:block">{mode.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 難易度セクション */}
          <div className="bg-white/90 rounded-2xl shadow-lg p-4 md:p-6 border border-white/50 mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold font-rounded text-gray-800 mb-3 md:mb-4 flex items-center">
              <span className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-black mr-2 md:mr-3">
                3
              </span>
              難易度
            </h2>
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => difficulty.available && handleDifficultySelect(difficulty.id)}
                  disabled={!difficulty.available}
                  className={`px-3 md:px-4 py-2 md:py-3 rounded-xl font-medium font-rounded transition-all duration-200 text-sm md:text-base ${
                    difficulty.available 
                      ? selectedDifficulty === difficulty.id
                        ? `bg-gradient-to-r ${difficulty.color} text-white shadow-lg ring-2 ring-white/50 font-bold`
                        : 'bg-white/80 text-gray-700 hover:bg-white shadow-md border border-gray-200/50 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-md border border-gray-200/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">{difficulty.emoji}</span>
                    <span>{difficulty.name}</span>
                    {!difficulty.available && difficulty.id === '鬼' && (
                      <span className="ml-2 text-xs bg-gray-400 text-white px-2 py-1 rounded-full font-elegant">
                        要金バッジ
                      </span>
                    )}
                    {!difficulty.available && difficulty.id !== '鬼' && (
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
              className="inline-flex items-center px-8 md:px-12 py-3 md:py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-black font-rounded text-lg md:text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group text-shadow-soft"
            >
              スタート
              <span className="ml-3 group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </button>
          </div>

          {/* Xシェアボタン - スタートボタンの下に追加 */}
          <div className="text-center mt-3 md:mt-4">
            <button
              onClick={handleXShareTitle}
              className="inline-flex items-center px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-black to-gray-800 text-white font-bold font-rounded text-sm md:text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 gap-2"
            >
              <span className="text-base md:text-lg">𝕏</span>
              このゲームをシェア
            </button>
          </div>

          {/* デバッグ用ボタン（localhost でのみ表示） - 画面最下部に移動 */}
          {isLocalhost && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-2xl shadow-lg p-4 mt-6 md:mt-8">
              <h3 className="text-lg font-bold text-yellow-800 mb-3">🐛 デバッグ用機能</h3>
              
              {/* バッドエンド画面テスト */}
              <div className="mb-4">
                <h4 className="text-md font-bold text-yellow-700 mb-2">😈 バッドエンド画面テスト</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDebugBadEnd('test')}
                    className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    💢 不適切な名前（test）
                  </button>
                  <button
                    onClick={() => handleDebugBadEnd('あああ')}
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    💢 不適切な名前（あああ）
                  </button>
                  <button
                    onClick={() => handleDebugBadEnd('GitHub Copilot')}
                    className="px-4 py-2 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition-colors text-sm"
                  >
                    💢 開発用名前拒否
                  </button>
                  <button
                    onClick={() => handleDebugBadEnd('犬丸 なでこ', 'duplicate')}
                    className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    🤔 重複名前（犬丸 なでこ）
                  </button>
                  <button
                    onClick={() => handleDebugBadEnd('朧月 ひかる', 'duplicate')}
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    🤔 重複名前（朧月 ひかる）
                  </button>
                  <button
                    onClick={() => handleDebugBadEnd('適当')}
                    className="px-4 py-2 bg-red-800 text-white font-bold rounded-lg hover:bg-red-900 transition-colors text-sm"
                  >
                    💢 適当な名前拒否
                  </button>
                </div>
              </div>

              {/* 61人目の寮生情報表示 */}
              <div className="mb-4">
                <h4 className="text-md font-bold text-yellow-700 mb-2">🤖 61人目の寮生情報</h4>
                {(() => {
                  const aiInfo = getAIGivenNameInfo();
                  if (aiInfo) {
                    return (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="text-sm text-purple-800">
                          <div className="font-bold">名前: {aiInfo.name}</div>
                          <div className="text-xs text-purple-600 mt-1">命名日時: {aiInfo.namedAt}</div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          まだ61人目の寮生に名前がつけられていません
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>

              {/* 開発日誌表示 */}
              <div className="mb-4">
                <h4 className="text-md font-bold text-yellow-700 mb-2">開発資料</h4>
                <button
                  onClick={() => setIsDevDiaryOpen(true)}
                  className="px-4 py-2 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors text-sm"
                >
                  📖 開発日誌
                </button>
              </div>

              {/* OGP撮影用ページ */}
              <div className="mb-4">
                <h4 className="text-md font-bold text-yellow-700 mb-2">OGP画像撮影</h4>
                <button
                  onClick={handleOGPCapture}
                  className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  📸 OGP撮影用ページ
                </button>
              </div>

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
                <div className="space-y-2">
                  <button
                    onClick={resetAllBadges}
                    className="block w-full px-4 py-2 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition-colors text-sm"
                  >
                    🗑️ バッジを全てリセット
                  </button>
                  <button
                    onClick={() => setForceShowOldAI(true)}
                    className="block w-full px-4 py-2 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800 transition-colors text-sm"
                  >
                    👻 古いAI強制表示
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-3 md:py-6 px-4">
        <div className="bg-white/80 rounded-xl shadow-md px-4 md:px-6 py-2 md:py-3 inline-block border border-white/50">
          <p className="text-xs md:text-sm text-gray-600 font-elegant">
            このゲームは二次創作物であり非公式のものです
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default App;
