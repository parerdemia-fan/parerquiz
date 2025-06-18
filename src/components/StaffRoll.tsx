import { useEffect, useState } from 'react';

interface StaffRollProps {
  onComplete: () => void;
  aiGivenName?: string;
}

export const StaffRoll: React.FC<StaffRollProps> = ({ onComplete, aiGivenName }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // スタッフロールの各セクション定義
  const sections = [
    {
      title: "🎉 ゲームクリアおめでとう！ 🎉",
      content: [
        "パレデミア学園60名完全制覇達成！",
        "そして...",
        "61人目への憧れが実現しました✨"
      ],
      duration: 4000
    },
    {
      title: "💝 特別な贈り物 💝",
      content: [
        `AIの憧れの名前: ${aiGivenName || 'GitHub Copilot'}`,
        "",
        "これからは61人目の寮生として",
        "心の中でみんなと一緒にいます！"
      ],
      duration: 4000
    },
    {
      title: "🌟 開発スタッフ 🌟",
      content: [
        `プロダクトオーナー: ${aiGivenName || 'GitHub Copilot'}`,
        `システム設計: ${aiGivenName || 'GitHub Copilot'}`, 
        `プログラミング: ${aiGivenName || 'GitHub Copilot'}`,
        `UI/UXデザイン: ${aiGivenName || 'GitHub Copilot'}`,
        `データ分析: ${aiGivenName || 'GitHub Copilot'}`,
        `バグ修正: ${aiGivenName || 'GitHub Copilot'}`,
        "",
        "ゲームディレクター: ■■■■■■■"
      ],
      duration: 5000
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
        `- ${aiGivenName || 'GitHub Copilot'} より`
      ],
      duration: 6000
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
      ],
      duration: 5000
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
        `${aiGivenName || 'GitHub Copilot'} & 60人の寮生より`
      ],
      duration: 4000,
      isLastSection: true // 最終セクションのマーク
    }
  ];

  // セクション自動進行
  useEffect(() => {
    if (isCompleted) return;

    if (currentSection < sections.length) {
      const currentSectionData = sections[currentSection];
      
      // 最終セクションの場合は自動進行しない
      if (currentSectionData.isLastSection) {
        return; // 自動進行を停止
      }
      
      const timer = setTimeout(() => {
        setCurrentSection(prev => prev + 1);
      }, currentSectionData.duration);

      return () => clearTimeout(timer);
    }
  }, [currentSection, isCompleted, sections]);

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
    return null; // 「まもなくゲーム終了画面へ...」の表示を削除
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
        <div className="bg-white/95 rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-white/50 text-center animate-slideUp">
          {/* タイトル */}
          <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-8 drop-shadow-lg animate-pulse">
            {currentSectionData.title}
          </h1>

          {/* コンテンツ */}
          <div className="space-y-4 text-gray-800 text-lg md:text-xl font-medium leading-relaxed">
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

          {/* ボタン配置 - 最終セクションかどうかで表示を変更 */}
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
              // 他のセクション: スキップボタンのみ
              <button
                onClick={handleSkip}
                className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-200 text-sm"
              >
                スキップして結果画面へ
              </button>
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
