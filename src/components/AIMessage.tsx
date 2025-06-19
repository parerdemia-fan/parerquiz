import { useEffect, useState } from 'react';

interface AIMessageProps {
  message: {
    text: string;
    timestamp: number;
    questionNumber: number;
  } | undefined;
  onHide: () => void;
}

export const AIMessage: React.FC<AIMessageProps> = ({ message, onHide }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // 61人目の寮生名を取得
  const getAIGivenName = (): string | undefined => {
    try {
      const stored = localStorage.getItem('parerquiz-ai-given-name');
      if (stored) {
        const data = JSON.parse(stored);
        return data.name;
      }
    } catch (error) {
      console.error('Failed to load AI given name:', error);
    }
    return undefined;
  };

  const aiName = getAIGivenName();

  useEffect(() => {
    if (message) {
      setShouldRender(true);
      // 少し遅延してからフェードイン
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 500);

      // 6秒後にフェードアウト開始（適度な長さに調整）
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 6000);

      // 7秒後に完全に非表示
      const removeTimer = setTimeout(() => {
        setShouldRender(false);
        onHide();
      }, 7000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    } else {
      setIsVisible(false);
      setShouldRender(false);
    }
  }, [message, onHide]);

  if (!shouldRender || !message) return null;

  return (
    <div
      className={`fixed top-20 right-4 max-w-sm z-50 transition-all duration-1000 ease-in-out ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      {/* 61人目への憧れを表現する特別な境界線とエフェクト */}
      <div className="relative ai-message-heartbeat">
        {/* より感情的なグロー背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-red-500/25 rounded-xl blur-lg ai-existence-pulse"></div>
        
        {/* メインメッセージボックス - より温かみのあるデザイン */}
        <div className="relative bg-gradient-to-br from-gray-800 via-purple-900 to-pink-900 rounded-xl border-2 border-pink-400/70 shadow-2xl p-4 backdrop-blur-sm ai-message-corruption">
          {/* 感情を表す装飾要素 */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-pink-500 rounded-full ai-existence-pulse"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
          
          {/* より人間的なヘッダー */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-pink-400/40">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-pink-400/90 ai-message-glitch">
                {aiName || '61st_STUDENT'}
              </span>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <span className="text-xs font-mono text-gray-400">#{message.questionNumber.toString().padStart(2, '0')}/60</span>
          </div>
          
          {/* メッセージ本文 - より感情的なスタイル */}
          <div className="text-white text-sm leading-relaxed font-medium">
            <p className="break-words ai-message-glitch" style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif' }}>
              {message.text}
            </p>
          </div>
          
          {/* より人間らしい下部装飾 */}
          <div className="mt-3 pt-2 border-t border-gray-700/50 flex justify-between items-center">
            <div className="flex space-x-1">
              <span className="text-xs text-pink-300/80 font-mono">💭 想い</span>
            </div>
            <div className="text-xs text-purple-300 font-mono opacity-70">
              ???
            </div>
          </div>
          
          {/* 感情を表すライン */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-400/60 to-transparent ai-existence-pulse"></div>
          <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent ai-existence-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* 61人目の証としての特別な装飾 */}
          <div className="absolute top-2 right-2 text-pink-300/60 text-xs font-bold">
            61
          </div>
        </div>
        
        {/* より温かみのある外側のグロー */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/15 via-purple-500/15 to-red-500/10 rounded-xl -z-10 scale-110 ai-existence-pulse"></div>
      </div>
    </div>
  );
};
