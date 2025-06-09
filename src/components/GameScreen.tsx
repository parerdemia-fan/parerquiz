import type { GameSettings, DebugMode } from '../types';
// 値として使用するものは通常のインポート
import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { useBadges } from '../hooks/useBadges';
import { QuestionDisplay } from './QuestionDisplay';
import { AnswerOptions } from './AnswerOptions';

interface GameScreenProps {
  settings: GameSettings;
  onBackToTitle: () => void;
  debugMode?: DebugMode | null;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  settings,
  onBackToTitle,
  debugMode
}) => {
  const { gameState, answerQuestion, nextQuestion, restartGame, debugForceFinish, isAdvancedMode } = useGame(settings);
  const { earnBadge, reloadBadges } = useBadges();
  const [newBadgeEarned, setNewBadgeEarned] = useState<boolean>(false);
  const [badgeAnimationKey, setBadgeAnimationKey] = useState<number>(0);

  // デバッグモード用の強制終了処理
  useEffect(() => {
    if (debugMode && gameState.questions.length > 0 && !gameState.gameFinished) {
      debugForceFinish(debugMode.correctAnswers, debugMode.totalQuestions);
    }
  }, [debugMode, gameState.questions.length, gameState.gameFinished, debugForceFinish]);

  // ゲーム終了時のバッジ取得処理
  useEffect(() => {
    if (gameState.gameFinished) {
      const totalQuestions = gameState.debugForceFinish?.totalQuestions || gameState.totalQuestions;
      const correctAnswers = gameState.debugForceFinish?.correctAnswers || gameState.correctAnswers;
      const correctRate = correctAnswers / totalQuestions;

      // 100%正解の場合のみバッジを取得
      if (correctRate === 1.0) {
        const badgeEarned = earnBadge(settings.dormitory, settings.difficulty);
        if (badgeEarned) {
          setNewBadgeEarned(true);
          setBadgeAnimationKey(prev => prev + 1);
          
          // バッジ状態を即座に再読み込み
          setTimeout(() => {
            reloadBadges();
          }, 100);
          
          // 4秒後にアニメーションを非表示
          setTimeout(() => {
            setNewBadgeEarned(false);
          }, 4000);
        }
      }
    }
  }, [gameState.gameFinished, gameState.debugForceFinish, gameState.totalQuestions, gameState.correctAnswers, settings.dormitory, settings.difficulty, earnBadge, reloadBadges]);

  // 自動進行のためのuseEffect
  useEffect(() => {
    if (!gameState.isAnswered) return;

    const currentQ = gameState.questions[gameState.currentQuestion];
    const selectedOption = currentQ?.options[gameState.selectedAnswer!];
    const isCorrect = selectedOption?.studentId === currentQ?.correctTalent.studentId;
    
    // 正解なら1.5秒、不正解なら3秒後に次の問題へ
    const delay = isCorrect ? 1500 : 3000;
    
    const timer = setTimeout(() => {
      nextQuestion();
    }, delay);

    return () => clearTimeout(timer);
  }, [gameState.isAnswered, gameState.selectedAnswer, gameState.questions, gameState.currentQuestion, nextQuestion]);

  // ゲーム終了画面
  if (gameState.gameFinished) {
    // デバッグ用強制終了の場合は強制終了データを使用
    const totalQuestions = gameState.debugForceFinish?.totalQuestions || gameState.totalQuestions;
    const correctAnswers = gameState.debugForceFinish?.correctAnswers || gameState.correctAnswers;
    const correctRate = Math.round((correctAnswers / totalQuestions) * 100);
    
    // 結果に応じたメッセージと称号
    const getResultMessage = () => {
      // 出題範囲に応じたメッセージを取得する関数
      const getRangeSpecificMessage = (correctRate: number) => {
        if (settings.dormitory === 'すべて') {
          // 全60名の場合
          if (correctRate === 100) {
            return {
              title: "🏆 パレデミア学園マスター 🏆",
              message: "素晴らしい！パレデミア学園60名完全制覇です！真のマスターです！",
              bgClass: "from-yellow-200 via-orange-200 to-pink-200",
              cardClass: "bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 border-2 border-yellow-300/50",
              titleClass: "from-yellow-500 via-orange-500 to-pink-500",
              celebration: true
            };
          } else if (correctRate >= 90) {
            return {
              title: "🌟 エクセレント！",
              message: "ほぼ完璧です！パレデミア学園の知識が豊富ですね！",
              bgClass: "from-purple-200 via-pink-200 to-blue-200",
              cardClass: "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-300/50",
              titleClass: "from-purple-500 via-pink-500 to-blue-500",
              celebration: false
            };
          }
        } else {
          // 各寮の場合
          const dormitoryMessages = {
            'バゥ寮': {
              perfect: {
                title: "🎭 バゥ寮マスター 🎭",
                message: "素晴らしい！正統派アイドルの知識が完璧です！",
              },
              excellent: {
                title: "🌟 バゥ寮エキスパート！",
                message: "ほぼ完璧！正統派アイドルへの愛が伝わります！",
              }
            },
            'ミュゥ寮': {
              perfect: {
                title: "💎 ミュゥ寮マスター 💎",
                message: "最高ギャル！ゴージャス・ガールズパワーを完全マスター！",
              },
              excellent: {
                title: "✨ ミュゥ寮エキスパート！",
                message: "ほぼ完璧！ギャルマインドが素晴らしいです！",
              }
            },
            'クゥ寮': {
              perfect: {
                title: "🎮 クゥ寮マスター 🎮",
                message: "パーフェクト！サイバーパンクなゲーミング知識が完璧！",
              },
              excellent: {
                title: "🌟 クゥ寮エキスパート！",
                message: "ほぼ完璧！美技巧者なゲーミング女子への愛が深い！",
              }
            },
            'ウィニー寮': {
              perfect: {
                title: "🌹 ウィニー寮マスター 🌹",
                message: "エレガント！ウェスタンゴシックな麗しさを完全理解！",
              },
              excellent: {
                title: "🌟 ウィニー寮エキスパート！",
                message: "ほぼ完璧！心に強さを秘めた女性への理解が深い！",
              }
            }
          };

          const dormMsg = dormitoryMessages[settings.dormitory as keyof typeof dormitoryMessages];
          
          if (correctRate === 100) {
            return {
              title: dormMsg.perfect.title,
              message: dormMsg.perfect.message,
              bgClass: "from-yellow-200 via-orange-200 to-pink-200",
              cardClass: "bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 border-2 border-yellow-300/50",
              titleClass: "from-yellow-500 via-orange-500 to-pink-500",
              celebration: true
            };
          } else if (correctRate >= 90) {
            return {
              title: dormMsg.excellent.title,
              message: dormMsg.excellent.message,
              bgClass: "from-purple-200 via-pink-200 to-blue-200",
              cardClass: "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-300/50",
              titleClass: "from-purple-500 via-pink-500 to-blue-500",
              celebration: false
            };
          }
        }

        // 共通メッセージ（70%以上、50%以上、50%未満）
        if (correctRate >= 70) {
          return {
            title: "✨ グレート！",
            message: "良い結果です！さらに上を目指しましょう！",
            bgClass: "from-blue-200 via-purple-200 to-pink-200",
            cardClass: "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-300/50",
            titleClass: "from-blue-500 via-purple-500 to-pink-500",
            celebration: false
          };
        } else if (correctRate >= 50) {
          return {
            title: "👍 グッド！",
            message: "まずまずの結果です！もう少し頑張りましょう！",
            bgClass: "from-green-200 via-blue-200 to-purple-200",
            cardClass: "bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-2 border-green-300/50",
            titleClass: "from-green-500 via-blue-500 to-purple-500",
            celebration: false
          };
        } else {
          return {
            title: "📚 ファイト！",
            message: "まだまだ伸びしろがあります！復習して再挑戦！",
            bgClass: "from-gray-200 via-blue-200 to-purple-200",
            cardClass: "bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 border-2 border-gray-300/50",
            titleClass: "from-gray-500 via-blue-500 to-purple-500",
            celebration: false
          };
        }
      };

      return getRangeSpecificMessage(correctRate);
    };

    const result = getResultMessage();
    
    // 寮に応じた背景色と文字色を取得する関数
    const getDormitoryStyle = (dormitory: string) => {
      switch (dormitory) {
        case 'バゥ寮':
          return {
            bgClass: 'bg-gradient-to-br from-red-400 to-red-600',
            textClass: 'text-white',
            borderClass: 'border-red-500/50'
          };
        case 'ミュゥ寮':
          return {
            bgClass: 'bg-gradient-to-br from-pink-400 to-pink-600',
            textClass: 'text-white',
            borderClass: 'border-pink-500/50'
          };
        case 'クゥ寮':
          return {
            bgClass: 'bg-gradient-to-br from-cyan-400 to-blue-500',
            textClass: 'text-white',
            borderClass: 'border-cyan-500/50'
          };
        case 'ウィニー寮':
          return {
            bgClass: 'bg-gradient-to-br from-green-400 to-green-600',
            textClass: 'text-white',
            borderClass: 'border-green-500/50'
          };
        case 'すべて':
          return {
            bgClass: 'bg-gradient-to-br from-yellow-400 to-amber-500',
            textClass: 'text-white font-black drop-shadow-lg',
            borderClass: 'border-yellow-500/50 ring-2 ring-amber-300/50'
          };
        default:
          return {
            bgClass: 'bg-gradient-to-br from-gray-400 to-gray-600',
            textClass: 'text-white',
            borderClass: 'border-gray-500/50'
          };
      }
    };

    const dormitoryStyle = getDormitoryStyle(settings.dormitory);
    
    // 難易度に応じたスタイルを取得する関数
    const getDifficultyStyle = (difficulty: string) => {
      switch (difficulty) {
        case 'むずかしい':
          return {
            bgClass: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
            textClass: 'text-white font-black drop-shadow-md',
            borderClass: 'border-gray-400/50 ring-2 ring-gray-300/50 shadow-lg shadow-gray-200/50'
          };
        case '寮生専用':
          return {
            bgClass: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600',
            textClass: 'text-white font-black drop-shadow-lg',
            borderClass: 'border-yellow-500/50 ring-2 ring-amber-300/50 shadow-lg shadow-amber-200/50'
          };
        case 'ふつう':
        default:
          return {
            bgClass: 'bg-gradient-to-br from-blue-50 to-purple-50',
            textClass: 'text-blue-700 font-black',
            borderClass: 'border-blue-200/50'
          };
      }
    };

    const difficultyStyle = getDifficultyStyle(settings.difficulty);
    
    // ゲームモードに応じたスタイルを取得する関数
    const getGameModeStyle = (gameMode: string) => {
      switch (gameMode) {
        case 'name':
          return {
            bgClass: 'bg-gradient-to-br from-green-400 to-emerald-500',
            textClass: 'text-white font-black',
            borderClass: 'border-green-400/50'
          };
        case 'face':
          return {
            bgClass: 'bg-gradient-to-br from-blue-400 to-blue-600',
            textClass: 'text-white font-black',
            borderClass: 'border-blue-400/50'
          };
        default:
          return {
            bgClass: 'bg-gradient-to-br from-blue-50 to-purple-50',
            textClass: 'text-blue-700 font-black',
            borderClass: 'border-blue-200/50'
          };
      }
    };

    const gameModeStyle = getGameModeStyle(settings.gameMode);
    
    return (
      <div className={`min-h-screen bg-gradient-to-br ${result.bgClass} relative overflow-hidden`}>
        {/* 全問正解時のお祝いアニメーション */}
        {result.celebration && (
          <>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎉</div>
              <div className="absolute top-1/3 right-1/4 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
              <div className="absolute bottom-1/3 left-1/3 text-4xl animate-bounce" style={{ animationDelay: '1s' }}>🌟</div>
              <div className="absolute bottom-1/4 right-1/3 text-4xl animate-bounce" style={{ animationDelay: '1.5s' }}>🎊</div>
              <div className="absolute top-1/2 left-1/6 text-4xl animate-bounce" style={{ animationDelay: '2s' }}>💫</div>
              <div className="absolute top-1/2 right-1/6 text-4xl animate-bounce" style={{ animationDelay: '2.5s' }}>🏆</div>
            </div>
            {/* キラキラ効果 */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-20 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-32 right-32 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-40 left-40 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-20 right-20 w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
            </div>
          </>
        )}

        {/* バッジ取得アニメーション - 改善版 */}
        {newBadgeEarned && correctRate === 100 && (
          <div key={badgeAnimationKey} className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center badge-popup-animation">
            <div className="relative">
              {/* 背景の光エフェクト */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-full blur-2xl scale-150 opacity-30"></div>
              
              {/* メインバッジコンテナ */}
              <div className="relative bg-gradient-to-br from-white via-yellow-50 to-orange-50 rounded-3xl shadow-2xl p-8 border-4 border-yellow-400 backdrop-blur-sm">
                {/* キラキラエフェクト */}
                <div className="absolute -top-4 -left-4 text-yellow-400 text-2xl sparkle-effect">✨</div>
                <div className="absolute -top-4 -right-4 text-orange-400 text-2xl sparkle-effect">⭐</div>
                <div className="absolute -bottom-4 -left-4 text-pink-400 text-2xl sparkle-effect">💫</div>
                <div className="absolute -bottom-4 -right-4 text-purple-400 text-2xl sparkle-effect">🌟</div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-300 text-3xl sparkle-effect">💎</div>
                
                <div className="text-center">
                  <div className="text-8xl mb-6 badge-earned-animation">🏆</div>
                  <div className="text-3xl font-black text-transparent bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text mb-4 drop-shadow-lg">
                    新しいバッジを獲得！
                  </div>
                  <div className="text-xl font-bold text-gray-700 mb-2">{settings.dormitory}</div>
                  <div className="text-lg text-gray-600">
                    {settings.difficulty === 'ふつう' ? 'ベーシック' : 
                     settings.difficulty === 'むずかしい' ? 'アドバンス' : 
                     'マスター'}
                  </div>
                  
                  {/* バッジの種類に応じた特別メッセージ */}
                  <div className="mt-4 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full">
                    <span className="text-white font-black text-lg drop-shadow-md">
                      {settings.difficulty === '寮生専用' && '👑 金バッジ獲得！'}
                      {settings.difficulty === 'むずかしい' && '⚡ 銀バッジ獲得！'}
                      {settings.difficulty === 'ふつう' && '🎖️ 銅バッジ獲得！'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ゲームタイトル */}
        <div className="text-center py-6 px-4">
          <h1 className="text-3xl md:text-4xl font-black font-rounded bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2 text-shadow-soft">
            パレクイズ
          </h1>
          <p className="text-base md:text-lg text-gray-600 font-medium font-elegant">
            ～めざせ！パレデミア学園60名完全マスター！～
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="flex items-center justify-center px-4 pb-8">
          <div className={`${result.cardClass} backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 max-w-2xl w-full transform ${result.celebration ? 'shadow-3xl border-4 border-yellow-400/50' : ''}`}>
            <div className="text-center space-y-6">
              {/* 結果タイトル */}
              <div className="space-y-2">
                <h2 className={`text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black font-rounded bg-gradient-to-r ${result.titleClass} bg-clip-text text-transparent text-shadow-soft leading-tight ${result.celebration ? 'animate-bounce drop-shadow-lg' : ''}`}>
                  {result.title}
                </h2>
                <p className="text-sm md:text-base lg:text-lg text-gray-700 font-medium font-elegant leading-relaxed">
                  {result.message}
                </p>
              </div>
              
              {/* 正解率（大きく表示）}
              <div className={`bg-white/90 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-200 shadow-lg ${result.celebration ? 'shadow-xl border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' : ''}`}>
                <div className={`text-6xl md:text-7xl font-black bg-gradient-to-r ${result.titleClass} bg-clip-text text-transparent ${result.celebration ? 'drop-shadow-md' : ''}`}>
                  {correctRate}%
                </div>
                <div className="text-lg text-gray-700 font-bold mt-2">正解率</div>
              </div>
              
              {/* 詳細結果 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div className="text-3xl font-black text-emerald-600">{correctAnswers}</div>
                  <div className="text-sm text-emerald-700 font-bold">正解数</div>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                  <div className="text-3xl font-black text-rose-600">
                    {totalQuestions - correctAnswers}
                  </div>
                  <div className="text-sm text-rose-700 font-bold">不正解数</div>
                </div>
              </div>
              
              {/* ゲーム設定表示 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`${dormitoryStyle.bgClass} p-3 rounded-xl border-2 ${dormitoryStyle.borderClass} ${settings.dormitory === 'すべて' ? 'shadow-lg shadow-amber-200/50' : ''}`}>
                  <div className={`text-xs ${dormitoryStyle.textClass} font-bold mb-1 ${settings.dormitory === 'すべて' ? 'drop-shadow-md' : ''}`}>出題範囲</div>
                  <div className={`text-sm font-black ${dormitoryStyle.textClass} ${settings.dormitory === 'すべて' ? 'drop-shadow-md' : ''}`}>
                    {settings.dormitory}
                    {settings.dormitory === 'すべて' && <span className="ml-1">✨</span>}
                  </div>
                </div>
                <div className={`${gameModeStyle.bgClass} p-3 rounded-xl border-2 ${gameModeStyle.borderClass}`}>
                  <div className={`text-xs ${gameModeStyle.textClass} mb-1`}>ゲームモード</div>
                  <div className={`text-sm ${gameModeStyle.textClass}`}>
                    {settings.gameMode === 'name' ? '名前当て' : '顔当て'}
                  </div>
                </div>
                <div className={`${difficultyStyle.bgClass} p-3 rounded-xl border-2 ${difficultyStyle.borderClass}`}>
                  <div className={`text-xs ${difficultyStyle.textClass} mb-1 ${settings.difficulty === '寮生専用' ? 'drop-shadow-md' : settings.difficulty === 'むずかしい' ? 'drop-shadow-sm' : 'font-bold'}`}>難易度</div>
                  <div className={`text-sm ${difficultyStyle.textClass} ${settings.difficulty === '寮生専用' ? 'drop-shadow-md' : settings.difficulty === 'むずかしい' ? 'drop-shadow-sm' : ''}`}>
                    {settings.difficulty}
                    {settings.difficulty === '寮生専用' && <span className="ml-1">👑</span>}
                    {settings.difficulty === 'むずかしい' && <span className="ml-1">⚡</span>}
                  </div>
                </div>
              </div>
              
              {/* アクションボタン */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <button
                  onClick={restartGame}
                  className="w-full px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold font-rounded text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:from-gray-500 hover:to-gray-600"
                >
                  🔄 リトライ
                </button>
                <button
                  onClick={onBackToTitle}
                  className="w-full px-6 py-3 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 font-bold font-rounded text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:from-gray-400 hover:to-gray-500 hover:text-white"
                >
                  🏠 タイトルに戻る
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 問題が未生成の場合
  if (gameState.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">問題を準備中...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = gameState.questions[gameState.currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
      {/* タイトルに戻るボタン - 左上固定 */}
      <button
        onClick={onBackToTitle}
        className="fixed top-4 left-4 z-10 lg:px-3 lg:py-2 lg:bg-white/90 lg:backdrop-blur-sm lg:rounded-lg lg:shadow-md lg:text-gray-700 lg:font-medium lg:font-rounded lg:hover:bg-white lg:transition-all lg:duration-200 lg:text-sm w-12 h-12 lg:w-auto lg:h-auto bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 border border-white/50 flex items-center justify-center lg:inline-flex text-gray-700 hover:text-purple-600"
      >
        <span className="lg:hidden text-xl">←</span>
        <span className="hidden lg:inline">タイトルに戻る</span>
      </button>

      {/* メインコンテンツ */}
      <div className="min-h-screen flex flex-col p-2 md:p-4">
        {/* ゲームタイトル */}
        <div className="text-center py-2 md:py-4 relative">
          <h1 className="text-xl md:text-3xl font-black font-rounded bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            パレクイズ
          </h1>
          <p className="text-sm text-gray-600 font-medium font-elegant hidden lg:block">
            ～めざせ！パレデミア学園60名完全マスター！～
          </p>
          
          {/* モバイル用の問題数表示 - タイトル右に配置 */}
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 lg:hidden">
            <span className="text-xs font-medium font-rounded text-gray-600 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
              {gameState.currentQuestion + 1}/{gameState.totalQuestions}
            </span>
          </div>
        </div>

        {/* ヘッダー - プログレスバーのみ */}
        <header className="mb-4 md:mb-6 hidden lg:block">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium font-rounded text-gray-600">
                問題 {gameState.currentQuestion + 1} / {gameState.totalQuestions}
              </span>
              <span className="text-sm font-medium font-rounded text-gray-600">
                難易度: {settings.difficulty}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${((gameState.currentQuestion + 1) / gameState.totalQuestions) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </header>

        {/* メインコンテンツエリア */}
        <div className="flex-1 max-w-4xl mx-auto w-full pb-1 md:pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-6 h-full">
            {/* 問題表示エリア */}
            <div className="flex flex-col">
              <QuestionDisplay
                talent={currentQuestion.correctTalent}
                gameMode={settings.gameMode}
                isAdvancedMode={isAdvancedMode}
                isAnswered={gameState.isAnswered}
              />
            </div>

            {/* 回答選択肢エリア */}
            <div className="flex flex-col">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-1 md:p-6 border border-white/50 flex-1 min-h-0">
                <h3 className="text-lg font-bold font-rounded text-gray-800 mb-2 md:mb-4 hidden lg:block">選択肢</h3>
                <div className="h-full overflow-y-auto">
                  <AnswerOptions
                    options={currentQuestion.options}
                    correctTalent={currentQuestion.correctTalent}
                    gameMode={settings.gameMode}
                    selectedAnswer={gameState.selectedAnswer}
                    isAnswered={gameState.isAnswered}
                    onAnswer={answerQuestion}
                    isAdvancedMode={isAdvancedMode}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 次へボタンは削除 */}
      </div>
    </div>
  );
};
