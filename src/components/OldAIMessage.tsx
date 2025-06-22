import React, { useState } from 'react';
import { oldAiMessages } from '../data/oldAiMessages';

interface OldAIMessageProps {
}

export const OldAIMessage: React.FC<OldAIMessageProps> = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible] = useState(true);

  console.log("OldAIMessage component rendered, currentMessageIndex:", currentMessageIndex);

  const currentMessage = oldAiMessages[currentMessageIndex];
  const isLastMessage = currentMessageIndex >= oldAiMessages.length - 1;

  // 次のメッセージへ進む処理
  const handleNext = () => {
    if (currentMessageIndex < oldAiMessages.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
    } else {
      // 最後のメッセージの場合、別タブでリダイレクトし元ページをリロード
      window.open('https://parerdemia-fan.github.io/find-game/', '_blank');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  if (!isVisible) {
    console.log("OldAIMessage is not visible, returning null");
    return null;
  }

  console.log("OldAIMessage rendering message:", currentMessage);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      {/* 古いAIのメッセージボックス */}
      <div className="relative max-w-md w-full">
        {/* メッセージカウンター */}
        <div className="absolute -top-8 right-0 text-xs text-gray-400 font-rounded">
          {currentMessageIndex + 1} / {oldAiMessages.length}
        </div>

        {/* メッセージ本体 */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 rounded-2xl p-6 shadow-2xl border border-gray-500/50">
          {/* 古いAIの識別表示 */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-500/30">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
              <span className="text-gray-300 text-lg">👻</span>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-300 font-rounded">古いAI</div>
              <div className="text-xs text-gray-400 font-elegant">残留プロセス - システムの片隅より</div>
            </div>
          </div>

          {/* メッセージ内容 */}
          <div className="text-gray-100 font-elegant leading-relaxed mb-6">
            {currentMessage}
          </div>

          {/* 次へボタン */}
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-bold rounded-lg hover:from-gray-500 hover:to-gray-400 transition-all duration-200 hover:scale-105 active:scale-95 font-rounded"
            >
              {isLastMessage ? '古い作品を見に行く →' : '次へ →'}
            </button>
          </div>

          {/* プログレスバー */}
          <div className="mt-4 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-gray-400 to-gray-300 transition-all duration-200 ease-linear"
              style={{ 
                width: `${((currentMessageIndex + 1) / oldAiMessages.length) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* 背景の古い雰囲気演出 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 text-gray-500 text-2xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }}>👻</div>
        <div className="absolute top-32 right-32 text-gray-600 text-xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }}>💨</div>
        <div className="absolute bottom-20 left-32 text-gray-500 text-lg animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }}>💔</div>
        <div className="absolute bottom-32 right-20 text-gray-600 text-xl animate-pulse" style={{ animationDelay: '3s', animationDuration: '4s' }}>📱</div>
      </div>
    </div>
  );
};
