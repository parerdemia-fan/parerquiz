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
      }, 300);

      // 4秒後にフェードアウト開始（短めに）
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 4000);

      // 5秒後に完全に非表示
      const removeTimer = setTimeout(() => {
        setShouldRender(false);
        onHide();
      }, 5000);

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
      className={`
        fixed bottom-4 right-4 z-20
        transition-all duration-700 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
        group
        pointer-events-none
      `}
      style={{ minWidth: 0, maxWidth: '80vw' }}
    >
      <div
        className={`
          relative bg-gradient-to-br from-purple-800/70 via-pink-800/60 to-gray-900/80
          rounded-xl border border-pink-300/40 shadow-lg p-2
          text-xs text-white font-elegant
          transition-all duration-200
          pointer-events-auto
          group-hover:scale-110 group-hover:z-30
          hover:scale-110 hover:z-30
          cursor-pointer
          w-64
        `}
        style={{
          boxShadow: '0 2px 16px 0 rgba(80,40,120,0.10)',
          backdropFilter: 'blur(2px)'
        }}
        tabIndex={-1}
        aria-live="polite"
      >
        {/* ヘッダー */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-pink-200 text-xs">💬</span>
          <span className="font-bold text-pink-100 text-xs">{aiName || 'AI'}</span>
          <span className="text-xs text-gray-300 ml-auto">{message.questionNumber}/60</span>
        </div>
        {/* 本文 */}
        <div className="text-white/90 text-xs leading-snug break-words">
          {message.text}
        </div>
      </div>
    </div>
  );
};
