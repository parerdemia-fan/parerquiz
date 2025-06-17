import React from 'react';

interface OGPCaptureScreenProps {
  onBackToTitle: () => void;
}

export const OGPCaptureScreen: React.FC<OGPCaptureScreenProps> = ({ onBackToTitle }) => {
  return (
    <div className="w-[1200px] h-[630px] bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 relative overflow-hidden title-background-scroll">
      {/* 背景装飾 - シンプル化 */}
      <div className="absolute inset-0">
        {/* 時計台画像 - より目立つ位置に */}
        <div className="absolute top-16 right-16 opacity-15">
          <img 
            src="/parerquiz/assets/images/clocktower.webp" 
            alt="" 
            className="w-64 h-64 object-cover rounded-3xl"
          />
        </div>
        
        {/* キラキラエフェクト - 数を減らして整理 */}
        <div className="absolute top-20 left-20 text-pink-400 text-4xl animate-pulse">✨</div>
        <div className="absolute bottom-24 right-32 text-purple-400 text-4xl animate-bounce">⭐</div>
        <div className="absolute bottom-32 left-32 text-blue-400 text-4xl animate-pulse">💫</div>
      </div>

      {/* メインコンテンツ - 大幅簡素化 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-16">
        
        {/* メインタイトル */}
        <div className="text-center mb-8">
          <h1 className="text-8xl font-black font-rounded bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
            パレクイズ
          </h1>
          
          {/* キャッチコピー - 1つに集約 */}
          <div className="bg-white/95 rounded-3xl shadow-2xl px-12 py-8 border-4 border-white/70">
            <p className="text-4xl font-black text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text mb-4 drop-shadow-sm">
              🌟 パレデミア学園60名 🌟
            </p>
            <p className="text-4xl font-black text-transparent bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text mb-6 drop-shadow-sm">
              君は何人知ってる？
            </p>
            
            {/* シンプルな特徴表示 */}
            <div className="flex justify-center gap-8 text-2xl font-bold text-gray-700">
              <div className="flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-4 rounded-2xl border-2 border-green-300/50">
                <span className="text-3xl">📝</span>
                <span className="text-green-700">名前当て</span>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-100 to-cyan-100 px-6 py-4 rounded-2xl border-2 border-blue-300/50">
                <span className="text-3xl">👤</span>
                <span className="text-blue-700">顔当て</span>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-4 rounded-2xl border-2 border-purple-300/50">
                <span className="text-3xl">👹</span>
                <span className="text-purple-700">鬼モード</span>
              </div>
            </div>
            
            {/* 行動喚起 */}
            <div className="mt-8 p-6 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-2xl border-3 border-orange-300/50">
              <p className="text-3xl font-black text-white drop-shadow-lg">
                今すぐ挑戦！
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 戻るボタン */}
      <button
        onClick={onBackToTitle}
        className="fixed top-4 left-4 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 border border-white/50 flex items-center justify-center text-gray-700 hover:text-purple-600"
      >
        <span className="text-xl">←</span>
      </button>

      {/* OGP撮影用の注意事項 */}
      <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-xs text-yellow-800 max-w-xs">
        <p className="font-bold mb-1">📸 OGP撮影用ページ</p>
        <p>このページは1200x630pxで設計されています。ブラウザを該当サイズに調整してスクリーンショットを撮影してください。</p>
      </div>
    </div>
  );
};
