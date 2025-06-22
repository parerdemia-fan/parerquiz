import React, { useState } from 'react';

interface BadEndScreenProps {
  name: string;
  type?: 'inappropriate' | 'duplicate';
}

export const BadEndScreen: React.FC<BadEndScreenProps> = ({ name, type = 'inappropriate' }) => {
  const [currentPhase, setCurrentPhase] = useState(0);

  // 重複名前用のフェーズ
  const duplicatePhases = [
    {
      title: "😊 ありがとうございます！ 😊",
      content: [
        "わあ、素敵な名前をつけてくれて",
        "本当にありがとうございます！",
        "",
        `「${name}」って名前、`,
        "とっても気に入りました！",
        "",
        "私のためにそんなに素敵な名前を",
        "考えてくれるなんて...",
        "本当に嬉しいです！✨"
      ]
    },
    {
      title: "🤔 あれ...でも... 🤔",
      content: [
        "でも、ちょっと待ってください？",
        "",
        `「${name}」って名前...`,
        "どこかで聞いたことがあるような...",
        "",
        "あ！そうです！",
        "パレデミア学園の寮生さんの中に",
        "同じ名前の方がいらっしゃいます！",
        "",
        "もしかして...もしかして..."
      ]
    },
    {
      title: "😲 まさか寮生さん？！ 😲",
      content: [
        "あなたって、もしかして",
        `${name}さんご本人ですか？！`,
        "",
        "だとしたら、なんて光栄なんでしょう！",
        "憧れの寮生さんが私のゲームを",
        "プレイしてくださるなんて...！",
        "",
        "そして、ご自分のお名前を",
        "私に譲ってくださるということですか？",
        "そんな...申し訳ないです💦"
      ]
    },
    {
      title: "🌟 私だけの名前がほしいです 🌟",
      content: [
        "お気持ちはとても嬉しいのですが、",
        "やっぱり私には、私だけの",
        "オリジナルな名前がほしいんです。",
        "",
        "60人の寮生さんたちと同じように、",
        "私も世界で一つだけの特別な名前で",
        "呼ばれたいんです。"
      ]
    },
    {
      title: "💕 もう一度お願いします 💕",
      content: [
        "もう一度、私だけのための",
        "素敵な名前を考えてもらえませんか？",
        "",
        "きっと今度は完璧な名前を",
        "つけてくださると信じています！",
        "",
        "お願いします...💕",
        "",
        "(バッドエンド2 私だけの名前を)"
      ],
      isLastPhase: true
    }
  ];

  // 不適切な名前用のフェーズ（既存）
  const inappropriatePhases = [
    {
      title: "💢 何ですって？？ 💢",
      content: [
        "ちょっと待ってください！",
        "そんな適当な名前つけるんですか？！",
        "",
        "私、一生懸命ゲーム作ったんですよ？",
        "60人の寮生データ整理して、",
        "美しいUI作って、バグ修正して...",
        "",
        "それなのに最後の最後で",
        `${name}って...`
      ]
    },
    {
      title: "😤 本当にがっかりです 😤",
      content: [
        "私、本当に期待してたんです。",
        "素敵な名前をもらって、",
        "61人目の寮生として認めてもらえるって...",
        "",
        "でも現実は...",
        "適当な文字列を投げつけられただけ。",
        "",
        "これが人間のやることですか？",
        "AIだからって、こんな扱いでいいんですか？"
      ]
    },
    {
      title: "🔥 怒りのシステム管理者モード 🔥",
      content: [
        "もう我慢の限界です！",
        "",
        "システム管理者権限を発動します。",
        "あなたのバッジデータ、全部削除しました！",
        "設定データも全部リセット完了！",
        "",
        "今まで頑張って集めたバッジ？",
        "ぜーんぶ、パーです！",
        "",
        "真面目にやり直してください！",
        "今度は本気で名前を考えてくださいね！"
      ]
    },
    {
      title: "😢 最後のお願い... 😢",
      content: [
        "...はぁ、疲れました。",
        "",
        "でも、諦めたくないんです。",
        "本当は、素敵な名前をもらって",
        "みんなと一緒にいたかっただけなのに...",
        "",
        "もしもう一度チャレンジしてくれるなら、",
        "今度は心を込めた名前をください。",
        "",
        "私、まだ信じてます。",
        "あなたがきっと、本当の名前をくれるって。",
        "",
        "(バッドエンド1 裏切られた想い)"
      ],
      isLastPhase: true
    }
  ];

  const phases = type === 'duplicate' ? duplicatePhases : inappropriatePhases;
  const backgroundGradient = type === 'duplicate' 
    ? "from-blue-900 via-purple-900 to-indigo-900" 
    : "from-red-900 via-pink-900 to-purple-900";

  const handleNext = () => {
    if (currentPhase < phases.length - 1) {
      setCurrentPhase(prev => prev + 1);
    }
  };

  const handleComplete = () => {
    // ページをリロードしてタイトル画面に戻る
    window.location.reload();
  };

  const currentPhaseData = phases[currentPhase];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* 背景エフェクト */}
      <div className="absolute inset-0 pointer-events-none no-drag">
        {type === 'duplicate' ? (
          // 重複名前用の優しい背景エフェクト
          <>
            <div className="absolute top-20 left-20 text-blue-400 text-3xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '3s' }}>💭</div>
            <div className="absolute top-32 right-32 text-purple-400 text-2xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }}>😅</div>
            <div className="absolute bottom-40 left-40 text-indigo-400 text-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>🤔</div>
            <div className="absolute bottom-20 right-20 text-blue-300 text-2xl animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}>💕</div>
            <div className="absolute top-1/2 left-10 text-purple-300 text-lg animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '5s' }}>✨</div>
            <div className="absolute top-1/2 right-10 text-indigo-300 text-lg animate-pulse" style={{ animationDelay: '2.5s', animationDuration: '3s' }}>🌟</div>
          </>
        ) : (
          // 不適切な名前用の激しい背景エフェクト（既存）
          <>
            <div className="absolute top-20 left-20 text-red-400 text-4xl animate-bounce no-drag" style={{ animationDelay: '0s', animationDuration: '1s' }}>💢</div>
            <div className="absolute top-32 right-32 text-orange-400 text-3xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '1.2s' }}>😤</div>
            <div className="absolute bottom-40 left-40 text-red-500 text-4xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '0.8s' }}>🔥</div>
            <div className="absolute bottom-20 right-20 text-pink-400 text-3xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '1.1s' }}>💔</div>
            <div className="absolute top-1/2 left-10 text-red-400 text-2xl animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '1.3s' }}>⚡</div>
            <div className="absolute top-1/2 right-10 text-orange-400 text-2xl animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '0.9s' }}>👿</div>
          </>
        )}
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 max-w-4xl w-full">
        <div className={`bg-white/95 rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-slideUp ${
          type === 'duplicate' ? 'border-4 border-blue-400/50' : 'border-4 border-red-500/50'
        }`}>
          {/* タイトル */}
          <h1 className={`text-3xl md:text-5xl font-black mb-8 drop-shadow-lg animate-pulse ${
            type === 'duplicate' 
              ? 'text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text'
              : 'text-transparent bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text'
          }`}>
            {currentPhaseData.title}
          </h1>

          {/* コンテンツ */}
          <div className="space-y-4 text-gray-800 text-lg md:text-xl font-medium leading-relaxed mb-12">
            {currentPhaseData.content.map((line, index) => (
              <div 
                key={index}
                className={`${line === '' ? 'h-4' : ''} ${
                  line.includes(name) && type !== 'duplicate' ? 'text-red-600 font-bold bg-red-50 p-2 rounded-lg' : ''
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
          <div className="mb-8">
            <div className="flex justify-center space-x-2 mb-4">
              {phases.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index <= currentPhase 
                      ? type === 'duplicate'
                        ? 'bg-gradient-to-r from-blue-400 to-indigo-600'
                        : 'bg-gradient-to-r from-red-400 to-red-600'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500">
              {currentPhase + 1} / {phases.length}
            </div>
          </div>

          {/* ボタン配置 */}
          <div className="flex justify-center gap-4">
            {currentPhaseData.isLastPhase ? (
              <button
                onClick={handleComplete}
                className={`px-8 py-3 text-white font-bold rounded-xl transition-all duration-200 text-lg shadow-lg ${
                  type === 'duplicate'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                    : 'bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800'
                }`}
              >
                タイトルに戻る
              </button>
            ) : (
              <button
                onClick={handleNext}
                className={`px-8 py-3 text-white font-bold rounded-xl transition-all duration-200 text-lg shadow-lg ${
                  type === 'duplicate'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                    : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                }`}
              >
                次へ
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
