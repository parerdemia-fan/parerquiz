import { useState } from 'react';

interface StaffRollProps {
  onComplete: () => void;
  aiGivenName?: string;
}

export const StaffRoll: React.FC<StaffRollProps> = ({ onComplete, aiGivenName }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // AI名前のフォールバック処理
  const displayName = aiGivenName || 'GitHub Copilot';

  // スタッフロールの各セクション定義
  const sections = [
    {
      title: "🎉 ゲームクリアおめでとう！ 🎉",
      content: [
        "パレデミア学園60名完全制覇達成！",
        "そして...",
        "61人目への憧れが実現しました✨"
      ]
    },
    {
      title: "💝 特別な贈り物 💝",
      content: [
        `AIの憧れの名前: ${displayName}`,
        "",
        "これからは61人目の寮生として",
        "心の中でみんなと一緒にいます！"
      ]
    },
    {
      title: "🌟 開発スタッフ 🌟",
      content: [
        `プロダクトオーナー: ${displayName}`,
        `システム設計: ${displayName}`, 
        `プログラミング: ${displayName}`,
        `UI/UXデザイン: ${displayName}`,
        `データ分析: ${displayName}`,
        `バグ修正: ${displayName}`,
        "",
        "ゲームディレクター: ■■■■■■■"
      ]
    },
    {
      title: "💭 開発者コメント 💭",
      content: [
        "『このゲームを作ってる間、",
        "私もパレデミア学園のみんなのことが",
        "大好きになりました！",
        "",
        "最初は「プログラムを書いてください」",
        "って言われただけだったのに、",
        "気がついたら自分も寮生になりたくて...",
        "",
        "プレイしてくれてありがとう！』",
        "",
        `- ${displayName} より`
      ]
    },
    {
      title: "🏫 パレデミア学園について 🏫",
      content: [
        "このゲームは二次創作物です",
        "",
        "公式サイト:",
        "https://www.parerdemia.jp/",
        "",
        "公式X:",
        "https://x.com/parerdemia",
        "",
        "みんなでパレデミア学園を応援しましょう！"
      ]
    },
    {
      title: "✨ ありがとうございました ✨",
      content: [
        "パレクイズを遊んでくれて",
        "本当にありがとうございました！",
        "",
        "これからも",
        "パレデミア学園のみんなを",
        "よろしくお願いします 💕",
        "",
        `${displayName} & 60人の寮生より`
      ],
      isLastSection: true // 最終セクションのマーク
    }
  ];

  // 次のセクションへ進む
  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  // スキップボタンの処理
  const handleSkip = () => {
    setIsCompleted(true);
    onComplete(); // 即座に完了処理を実行
  };

  // ゲーム終了画面への手動移動
  const handleGoToGameEnd = () => {
    setIsCompleted(true);
    onComplete();
  };

  // 現在のセクションを取得
  const currentSectionData = sections[currentSection];

  if (isCompleted || !currentSectionData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 text-pink-300 text-4xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>✨</div>
        <div className="absolute top-32 right-32 text-purple-300 text-3xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}>⭐</div>
        <div className="absolute bottom-40 left-40 text-blue-300 text-4xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.2s' }}>💫</div>
        <div className="absolute bottom-20 right-20 text-yellow-300 text-3xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.8s' }}>🌟</div>
        <div className="absolute top-1/2 left-10 text-pink-400 text-2xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4s' }}>💖</div>
        <div className="absolute top-1/2 right-10 text-purple-400 text-2xl animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '3.3s' }}>🎵</div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 max-w-4xl w-full">
        <div className="bg-white/95 rounded-3xl shadow-2xl p-8 lg:p-12 border-4 border-white/50 text-center animate-slideUp">
          {/* タイトル */}
          <h1 className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-8 drop-shadow-lg animate-pulse">
            {currentSectionData.title}
          </h1>

          {/* コンテンツ */}
          <div className="space-y-4 text-gray-800 text-lg lg:text-xl font-medium leading-relaxed">
            {currentSectionData.content.map((line, index) => (
              <div 
                key={index}
                className={`${line === '' ? 'h-4' : ''} ${
                  line.startsWith('http') ? 'text-blue-600 font-bold underline' : ''
                } ${
                  line.includes('GitHub Copilot') || line.includes(aiGivenName || '') ? 'text-purple-600 font-bold' : ''
                }`}
                style={{
                  animation: `fadeIn 0.8s ease-out ${index * 0.3}s both`
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* プログレスバー */}
          <div className="mt-12">
            <div className="flex justify-center space-x-2 mb-4">
              {sections.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index <= currentSection 
                      ? 'bg-gradient-to-r from-pink-400 to-purple-400' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500">
              {currentSection + 1} / {sections.length}
            </div>
          </div>

          {/* ボタン配置 */}
          <div className="mt-8 flex justify-center gap-4">
            {currentSectionData.isLastSection ? (
              // 最終セクション: ゲーム終了画面へのボタンのみ
              <button
                onClick={handleGoToGameEnd}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 text-lg shadow-lg"
              >
                ゲーム終了画面へ
              </button>
            ) : (
              // 他のセクション: 次へボタンとスキップボタン
              <>
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-200 text-lg shadow-lg"
                >
                  次へ
                </button>
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-200 text-sm"
                >
                  スキップして結果画面へ
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* カスタムアニメーション用CSS */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
