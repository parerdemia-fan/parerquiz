import type { Talent, GameMode } from '../types';

interface AnswerOptionsProps {
  options: Talent[];
  correctTalent: Talent;
  gameMode: GameMode;
  selectedAnswer: number | null;
  isAnswered: boolean;
  onAnswer: (index: number) => void;
  isAdvancedMode?: boolean; // 寮生専用モード判定
}

export const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  options,
  correctTalent,
  gameMode,
  selectedAnswer,
  isAnswered,
  onAnswer,
  isAdvancedMode = false
}) => {
  // 名前の長さに応じたフォントサイズを取得（選択肢用）- 10%大きくし、短い名前はさらに大きく
  const getOptionNameFontSize = (name: string) => {
    const length = name.length;
    if (length <= 4) {
      return 'text-3xl'; // 短い名前はより大きく（text-xl -> text-3xl）
    } else if (length <= 6) {
      return 'text-2xl'; // 中程度も大きく（text-lg -> text-2xl）
    } else if (length <= 8) {
      return 'text-xl'; // やや小さくも大きく（text-base -> text-xl）
    } else if (length <= 10) {
      return 'text-lg'; // 小さくも大きく（text-sm -> text-lg）
    } else {
      return 'text-sm'; // 10文字以上は5%程度小さく（text-base -> text-sm）
    }
  };

  // 名前帯用のフォントサイズを取得（回答後表示用）
  const getNameBandFontSize = (name: string) => {
    const length = name.length;
    if (length <= 4) {
      return 'text-base'; // 短い名前は標準より大きく
    } else if (length <= 6) {
      return 'text-sm'; // 中程度は標準サイズ
    } else if (length <= 8) {
      return 'text-sm'; // やや長めも標準サイズ
    } else if (length <= 10) {
      return 'text-xs'; // 長い名前は小さく
    } else {
      return 'text-xs'; // 非常に長い名前は小さく
    }
  };

  // カナのフォントサイズを取得（名前当てモード用）- サイズを調整
  const getKanaFontSize = (kana: string) => {
    const length = kana.length;
    if (length <= 6) {
      return 'text-sm'; // 短いカナは標準サイズ（text-xs -> text-sm）
    } else if (length <= 8) {
      return 'text-sm'; // 中程度のカナは標準サイズ
    } else if (length <= 10) {
      return 'text-xs'; // やや長いカナは小さく
    } else if (length <= 12) {
      return 'text-xs'; // 長いカナはより小さく
    } else {
      return 'text-xs'; // 非常に長いカナは最小サイズ
    }
  };

  const getOptionStyle = (index: number, talent: Talent) => {
    if (!isAnswered) {
      return "bg-gradient-to-br from-white via-gray-50 to-gray-100 hover:from-blue-50 hover:via-blue-100 hover:to-blue-200 hover:scale-[1.02] text-gray-800 border-2 border-gray-200 hover:border-blue-300";
    }

    const isCorrect = talent.studentId === correctTalent.studentId;
    const isSelected = selectedAnswer === index;

    if (isSelected && isCorrect) {
      // 選択された正答
      return "bg-gradient-to-r from-green-400 to-green-600 text-white ring-4 ring-green-200";
    } else if (isSelected && !isCorrect) {
      // 選択された誤答
      return "bg-gradient-to-r from-red-400 to-red-600 text-white ring-4 ring-red-200";
    } else if (!isSelected && isCorrect) {
      // 選択されなかった正答
      return "bg-gradient-to-r from-green-300 to-green-500 text-white ring-2 ring-green-300";
    } else {
      // 選択されなかった誤答
      return "bg-gray-200 text-gray-500";
    }
  };

  // 結果判定
  const isCorrect = isAnswered && selectedAnswer !== null && options[selectedAnswer]?.studentId === correctTalent.studentId;

  // 正解時のメッセージパターンを追加
  const getRandomCorrectMessage = () => {
    const messages = [
      "素晴らしい！その調子です！",
      "すごい！完璧ですね！",
      "やったね！大正解！",
      "見事！流石です！",
      "お見事！さすがですね！",
      "素敵！よく知ってますね！",
      "凄い！その通りです！",
      "ブラボー！正解です！",
      "最高！バッチリです！",
      "グレート！その調子！",
      "ワンダフル！完璧！",
      "エクセレント！素晴らしい！",
      "ファンタスティック！",
      "パーフェクト！最高です！",
      "アメージング！凄いです！"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getRandomPerfectMessage = () => {
    const perfectMessages = [
      "🏆 パーフェクト！ 🏆",
      "🌟 ブリリアント！ 🌟",
      "✨ ファンタスティック！ ✨",
      "💎 エクセレント！ 💎",
      "🎉 アメージング！ 🎉",
      "⭐ ワンダフル！ ⭐",
      "🔥 インクレディブル！ 🔥",
      "💫 マーベラス！ 💫",
      "🌈 スペクタキュラー！ 🌈",
      "🎊 アウトスタンディング！ 🎊"
    ];
    return perfectMessages[Math.floor(Math.random() * perfectMessages.length)];
  };

  return (
    <div className="space-y-1 md:space-y-4">
      {/* 選択肢グリッド */}
      <div className="grid grid-cols-2 gap-0.5 md:gap-4 p-0 md:p-2">
        {options.map((talent, index) => (
          <button
            key={talent.studentId}
            onClick={() => onAnswer(index)}
            disabled={isAnswered}
            className={`
              relative rounded-lg md:rounded-xl font-medium font-rounded transition-all duration-300 shadow-lg hover:shadow-xl
              ${getOptionStyle(index, talent)}
              ${!isAnswered ? 'active:scale-[0.98] cursor-pointer transform hover:scale-[1.01] hover:-translate-y-0.5' : 'cursor-default'}
            `}
          >
            {gameMode === 'name' ? (
              // 名前当てモード: 回答前は名前のみ、回答後は画像付き
              <div>
                {!isAnswered ? (
                  <div className="w-full aspect-[4/3] md:aspect-square flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-md md:rounded-lg relative overflow-hidden border-2 border-indigo-200/50 shadow-inner">
                    {/* 装飾的な背景パターン */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/20 to-pink-100/30"></div>
                    <div className="absolute inset-0">
                      <div className="absolute top-2 right-3 w-8 h-8 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-lg"></div>
                      <div className="absolute bottom-3 left-2 w-6 h-6 bg-gradient-to-br from-pink-200/40 to-purple-200/40 rounded-full blur-lg"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full blur-xl"></div>
                    </div>
                    
                    {/* 幾何学的装飾パターン */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 left-4 w-3 h-3 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full"></div>
                      <div className="absolute top-6 right-6 w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                      <div className="absolute bottom-4 left-6 w-2.5 h-2.5 bg-gradient-to-br from-pink-400 to-red-400 rounded-full"></div>
                      <div className="absolute bottom-6 right-4 w-3 h-3 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full"></div>
                      
                      {/* 線形パターン */}
                      <div className="absolute top-0 left-1/3 w-0.5 h-full bg-gradient-to-b from-transparent via-indigo-300/20 to-transparent"></div>
                      <div className="absolute top-0 right-1/3 w-0.5 h-full bg-gradient-to-b from-transparent via-purple-300/20 to-transparent"></div>
                      <div className="absolute left-0 top-1/3 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-300/20 to-transparent"></div>
                      <div className="absolute left-0 bottom-1/3 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-300/20 to-transparent"></div>
                    </div>
                    
                    {/* 中央の装飾的な枠 */}
                    <div className="absolute inset-6 border border-indigo-200/30 rounded-lg bg-gradient-to-br from-white/20 via-transparent to-purple-100/20"></div>
                    
                    {/* メインコンテンツ - 縦方向中央揃えに調整 */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-1 md:p-4">
                      {/* カナ表示 - 名前の上に配置 */}
                      <div className={`${getKanaFontSize(talent.kana)} font-medium text-indigo-500/80 mb-1 leading-tight`}>
                        {talent.kana}
                      </div>
                      {/* 名前表示 - 縦方向完全中央、カナ削除 */}
                      <div className={`${getOptionNameFontSize(talent.name)} font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight drop-shadow-sm whitespace-nowrap px-1 md:px-2`}>
                        {talent.name}
                      </div>
                    </div>
                    
                    {/* 装飾的なコーナー要素 - より洗練されたデザイン */}
                    <div className="absolute top-2 left-2 w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-60 shadow-sm"></div>
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-60 shadow-sm"></div>
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-gradient-to-br from-pink-400 to-red-400 rounded-full opacity-60 shadow-sm"></div>
                    <div className="absolute bottom-2 right-2 w-2 h-2 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full opacity-60 shadow-sm"></div>
                    
                    {/* ホバー時の追加エフェクト */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/0 via-purple-400/0 to-pink-400/0 hover:from-indigo-400/10 hover:via-purple-400/10 hover:to-pink-400/10 transition-all duration-300 rounded-lg"></div>
                  </div>
                ) : (
                  <div>
                    <img
                      src={`/parerquiz/assets/images/portrait/${talent.studentId}.webp`}
                      alt={talent.name}
                      className="w-full aspect-[4/3] md:aspect-square object-cover rounded-md md:rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzllYTNhOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                    <div className="absolute bottom-1 left-1 right-1 bg-black/60 text-white px-2 py-1 rounded-b-md md:rounded-b-lg">
                      <span className={`${getNameBandFontSize(talent.name)} font-medium font-rounded whitespace-nowrap`}>{talent.name}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // 顔当てモード: 回答前は画像のみ、回答後は名前付き
              <div>
                <img
                  src={`/parerquiz/assets/images/portrait/${talent.studentId}.webp`}
                  alt={isAnswered ? talent.name : '???'}
                  className={`w-full aspect-[4/3] md:aspect-square object-cover rounded-md md:rounded-lg ${
                    isAdvancedMode && !isAnswered 
                      ? 'filter brightness-0 contrast-200 sepia-100 hue-rotate-180 saturate-200 opacity-80' 
                      : ''
                  }`}
                  style={isAdvancedMode && !isAnswered ? {
                    filter: 'brightness(0) contrast(1) drop-shadow(0 0 0 #4a5568) sepia(1) saturate(0) hue-rotate(0deg)',
                    WebkitFilter: 'brightness(0) contrast(1) drop-shadow(0 0 0 #4a5568) sepia(1) saturate(0) hue-rotate(0deg)'
                  } : {}}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzllYTNhOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                {isAnswered && (
                  <div className="absolute bottom-1 left-1 right-1 bg-black/60 text-white px-2 py-1 rounded-b-md md:rounded-b-lg">
                    <span className={`${getNameBandFontSize(talent.name)} font-medium font-rounded whitespace-nowrap`}>{talent.name}</span>
                  </div>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* 回答結果表示 */}
      {isAnswered && (
        <div className="mt-2 md:mt-6">
          {isCorrect ? (
            // 正解時の表示 - 派手なエフェクト
            <div className="relative overflow-hidden bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 rounded-2xl p-4 shadow-lg correct-celebration correct-glow correct-shimmer correct-particles">
              {/* 複数レイヤーの背景エフェクト */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-300/20 via-emerald-300/20 to-green-400/20"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/10 via-green-300/10 to-emerald-400/10"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-lime-300/10 via-emerald-300/10 to-cyan-400/10"></div>
              
              {/* 動的パーティクルエフェクト */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-1 left-2 text-yellow-300/60 text-xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '1.2s' }}>✨</div>
                <div className="absolute top-2 right-3 text-white/50 text-lg animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '1.4s' }}>🌟</div>
                <div className="absolute top-3 left-1/3 text-yellow-200/60 text-base animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '1.6s' }}>💫</div>
                <div className="absolute top-1 right-1/4 text-lime-300/50 text-lg animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '1.3s' }}>⭐</div>
                <div className="absolute bottom-2 left-3 text-emerald-200/60 text-base animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '1.5s' }}>✨</div>
                <div className="absolute bottom-3 right-2 text-cyan-300/50 text-lg animate-bounce" style={{ animationDelay: '1s', animationDuration: '1.7s' }}>🌟</div>
                <div className="absolute bottom-1 left-1/4 text-yellow-300/60 text-sm animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '1.4s' }}>💫</div>
                <div className="absolute bottom-2 right-1/3 text-green-200/50 text-base animate-bounce" style={{ animationDelay: '1.4s', animationDuration: '1.6s' }}>⭐</div>
                
                {/* 追加の浮遊エフェクト */}
                <div className="absolute top-1/2 left-1/6 text-white/30 text-2xl animate-ping" style={{ animationDelay: '0.5s' }}>🎉</div>
                <div className="absolute top-1/2 right-1/6 text-yellow-200/40 text-2xl animate-ping" style={{ animationDelay: '1s' }}>🎊</div>
              </div>
              
              {/* 光る境界線エフェクト */}
              <div className="absolute inset-0 rounded-2xl border-2 border-white/30 shadow-inner"></div>
              <div className="absolute inset-1 rounded-2xl border border-yellow-300/40"></div>
              
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className="text-4xl animate-bounce filter drop-shadow-lg" style={{ animationDuration: '0.8s' }}>🎉</div>
                  <div className="text-3xl font-black text-white drop-shadow-2xl correct-rainbow-text" 
                       style={{ 
                         textShadow: '0 0 10px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(34,197,94,0.6)' 
                       }}>
                    正解！
                  </div>
                  <div className="text-4xl animate-bounce filter drop-shadow-lg" style={{ animationDelay: '0.2s', animationDuration: '0.8s' }}>🎊</div>
                </div>
                <div className="text-white font-bold text-base drop-shadow-2xl" 
                     style={{ 
                       textShadow: '0 0 8px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.7), 0 0 15px rgba(34,197,94,0.4)' 
                     }}>
                  {getRandomCorrectMessage()}
                </div>
                
                {/* 追加の賞賛メッセージ */}
                <div className="mt-2 text-yellow-100 font-medium text-sm drop-shadow-lg animate-pulse" 
                     style={{ 
                       textShadow: '0 0 6px rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.6)' 
                     }}>
                  {getRandomPerfectMessage()}
                </div>
              </div>
            </div>
          ) : (
            // 不正解時の表示
            <div className="relative overflow-hidden bg-gradient-to-r from-rose-400 via-pink-400 to-red-400 rounded-2xl p-4 shadow-lg">
              {/* 背景エフェクト - 控えめに調整 */}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-300/10 via-pink-300/10 to-red-300/10"></div>
              
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className="text-3xl">😅</div>
                  <div className="text-2xl font-black text-white drop-shadow-lg">不正解</div>
                  <div className="text-3xl">💪</div>
                </div>
                <div className="text-white font-bold text-sm drop-shadow-md mb-3">
                  惜しい！次は頑張りましょう！
                </div>
                
                {/* 正解情報表示 */}
                <div className="bg-white/25 rounded-xl p-3 border border-white/40">
                  <div className="text-white/90 text-xs font-medium mb-1">正解は...</div>
                  <div className="flex items-center justify-center space-x-3">
                    <img
                      src={`/parerquiz/assets/images/portrait/${correctTalent.studentId}.webp`}
                      alt={correctTalent.name}
                      className="w-12 h-12 object-cover rounded-full border-2 border-white/60 shadow-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5ZWEzYTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4/PC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                    <div className="text-white font-black text-lg drop-shadow-lg">
                      {correctTalent.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
