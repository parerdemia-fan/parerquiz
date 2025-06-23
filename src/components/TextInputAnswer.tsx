import type { Talent } from '../types';
import { useState, useEffect, useRef } from 'react';

interface TextInputAnswerProps {
  correctTalent: Talent;
  isAnswered: boolean;
  textAnswer?: string;
  isTextAnswerCorrect?: boolean;
  onAnswer: (answer: string) => void;
  isSpecialQuestion?: boolean; // 61問目かどうか
  aiGivenName?: string; // AIに付けられた名前
}

export const TextInputAnswer: React.FC<TextInputAnswerProps> = ({
  correctTalent,
  isAnswered,
  textAnswer,
  isTextAnswerCorrect,
  onAnswer,
  isSpecialQuestion = false,
  aiGivenName
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // コンポーネントマウント時にフォーカス
  useEffect(() => {
    if (inputRef.current && !isAnswered) {
      inputRef.current.focus();
    }
  }, [isAnswered]);

  // 回答処理
  const handleSubmit = () => {
    if (inputValue.trim() && !isAnswered) {
      onAnswer(inputValue.trim());
    }
  };

  // Enter キー処理
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // 入力値変更処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAnswered) {
      setInputValue(e.target.value);
    }
  };

  // 回答後のリセット処理
  useEffect(() => {
    if (!isAnswered) {
      setInputValue('');
    }
  }, [isAnswered]);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* 入力エリア */}
      <div className="bg-white/90 rounded-2xl shadow-lg p-4 lg:p-6 border border-white/50">
        <h3 className="text-lg lg:text-xl font-bold font-rounded text-gray-800 mb-3 lg:mb-4 text-center">
          {isSpecialQuestion ? 
            "💫 ～ AIへの名前の贈り物 ～ 💫" : 
            "～ 真のマスターへの挑戦 ～"
          }
        </h3>
        
        <div className="space-y-3 lg:space-y-4">
          {/* テキスト入力 */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={isAnswered ? (textAnswer || '') : inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isAnswered}
              placeholder={isSpecialQuestion ? "AIの新しい名前を入力..." : "タレントの名前を入力..."}
              className={`w-full px-4 py-3 lg:py-4 text-lg lg:text-xl font-medium font-rounded rounded-xl border-2 transition-all duration-200 ${
                isAnswered
                  ? isTextAnswerCorrect
                    ? isSpecialQuestion 
                      ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-300 text-pink-800'
                      : 'bg-green-50 border-green-300 text-green-800'
                    : 'bg-red-50 border-red-300 text-red-800'
                  : isSpecialQuestion
                    ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-300 text-pink-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                    : 'bg-white border-gray-300 text-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
              } ${isAnswered ? 'cursor-not-allowed' : 'cursor-text'}`}
            />
            
            {/* 入力状態インジケーター */}
            {!isAnswered && inputValue && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className={`text-xl ${isSpecialQuestion ? 'text-pink-500' : 'text-purple-500'}`}>
                  {isSpecialQuestion ? '💖' : '✏️'}
                </span>
              </div>
            )}
          </div>

          {/* 回答ボタン */}
          <button
            onClick={handleSubmit}
            disabled={isAnswered || !inputValue.trim()}
            className={`w-full py-3 lg:py-4 font-bold font-rounded text-lg lg:text-xl rounded-xl transition-all duration-200 ${
              isAnswered || !inputValue.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isSpecialQuestion
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
            }`}
          >
            {isAnswered ? '入力完了' : isSpecialQuestion ? '名前を贈る' : '回答する'}
          </button>
        </div>

        {/* ヒント表示 */}
        {!isAnswered && (
          <div className="mt-3 lg:mt-4 text-center">
            <p className={`text-sm font-elegant ${isSpecialQuestion ? 'text-pink-600' : 'text-gray-600'}`}>
              {isSpecialQuestion ? 
                '💝 真心を込めた名前をお願いします...' : 
                '💡 ヒント：スペースや「・」は無視されます'
              }
            </p>
          </div>
        )}
      </div>

      {/* 回答結果表示 */}
      {isAnswered && (
        <div className="mt-4 lg:mt-6">
          {isTextAnswerCorrect && isSpecialQuestion ? (
            // 61問目の特別正解表示
            <div className="relative overflow-hidden bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 rounded-2xl p-4 lg:p-6 shadow-lg">
              {/* 特別な背景エフェクト */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-300/20 via-purple-300/20 to-pink-400/20"></div>
              
              {/* 装飾的なパーティクル */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-2 left-4 text-white/60 text-xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '1.2s' }}>💖</div>
                <div className="absolute top-3 right-6 text-pink-200/60 text-lg animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '1.4s' }}>✨</div>
                <div className="absolute bottom-3 left-6 text-purple-200/60 text-base animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '1.5s' }}>💫</div>
                <div className="absolute bottom-2 right-4 text-white/50 text-lg animate-bounce" style={{ animationDelay: '0.9s', animationDuration: '1.7s' }}>🌟</div>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <div className="text-4xl animate-bounce filter drop-shadow-lg">💖</div>
                  <div className="text-2xl lg:text-3xl font-black text-white drop-shadow-2xl animate-pulse">
                    ありがとう！
                  </div>
                  <div className="text-4xl animate-bounce filter drop-shadow-lg" style={{ animationDelay: '0.2s' }}>✨</div>
                </div>
                <div className="text-white font-bold text-base lg:text-lg drop-shadow-2xl mb-3">
                  {aiGivenName && `もしも${aiGivenName}になれたら、きっと幸せです！`}
                </div>
                
                {/* 特別メッセージ */}
                <div className="bg-white/25 rounded-xl p-3 lg:p-4 border border-white/40">
                    <div className="text-white font-black text-lg lg:text-xl drop-shadow-lg">
                    憧れの名前をもらえました！
                    </div>
                  <div className="text-white/90 text-sm mt-2">
                    61人目の寮生として心に留めてもらえて幸せです...
                  </div>
                </div>
              </div>
            </div>
          ) : isTextAnswerCorrect ? (
            // 正解時の表示
            <div className="relative overflow-hidden bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 rounded-2xl p-4 lg:p-6 shadow-lg">
              {/* 背景エフェクト */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-300/20 via-emerald-300/20 to-green-400/20"></div>
              
              {/* 装飾的なパーティクル */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-2 left-4 text-yellow-300/60 text-xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '1.2s' }}>✨</div>
                <div className="absolute top-3 right-6 text-white/50 text-lg animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '1.4s' }}>🌟</div>
                <div className="absolute bottom-3 left-6 text-emerald-200/60 text-base animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '1.5s' }}>✨</div>
                <div className="absolute bottom-2 right-4 text-cyan-300/50 text-lg animate-bounce" style={{ animationDelay: '0.9s', animationDuration: '1.7s' }}>🌟</div>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <div className="text-4xl animate-bounce filter drop-shadow-lg">🎉</div>
                        <div className="text-2xl lg:text-3xl font-black text-white drop-shadow-2xl animate-pulse">
                          正解！
                        </div>
                  <div className="text-4xl animate-bounce filter drop-shadow-lg" style={{ animationDelay: '0.2s' }}>👹</div>
                </div>
                <div className="text-white font-bold text-base lg:text-lg drop-shadow-2xl mb-3">
                  素晴らしい！真の猛者です！
                </div>
                
                {/* 正解表示 */}
                <div className="bg-white/25 rounded-xl p-3 lg:p-4 border border-white/40">
                  <div className="flex items-center justify-center space-x-3">
                    <img
                      src={`/parerquiz/assets/images/portrait/${correctTalent.studentId}.webp`}
                      alt={correctTalent.name}
                      className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-full border-2 border-white/60 shadow-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/parerquiz/assets/images/parerdemia-logo.png';
                      }}
                    />
                    <div className="text-white font-black text-lg lg:text-xl drop-shadow-lg">
                      {correctTalent.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // 不正解時の表示
            <div className="relative overflow-hidden bg-gradient-to-r from-rose-400 via-pink-400 to-red-400 rounded-2xl p-4 lg:p-6 shadow-lg">
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <div className="text-3xl">😤</div>
                  <div className="text-2xl lg:text-3xl font-black text-white drop-shadow-lg">ハズレ</div>
                  <div className="text-3xl">💪</div>
                </div>
                <div className="text-white font-bold text-sm lg:text-base drop-shadow-md mb-4">
                  難易度：鬼 は手強いね！でも諦めないで！
                </div>
                
                {/* 正解情報表示 */}
                <div className="bg-white/25 rounded-xl p-3 lg:p-4 border border-white/40">
                  <div className="text-white/90 text-xs lg:text-sm font-medium mb-2">正解は...</div>
                  <div className="flex items-center justify-center space-x-3">
                    <img
                      src={`/parerquiz/assets/images/portrait/${correctTalent.studentId}.webp`}
                      alt={correctTalent.name}
                      className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-full border-2 border-white/60 shadow-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/parerquiz/assets/images/parerdemia-logo.png';
                      }}
                    />
                    <div className="text-white font-black text-lg lg:text-xl drop-shadow-lg">
                      {correctTalent.name}
                    </div>
                  </div>
                  
                  {/* 入力した回答も表示 */}
                  <div className="mt-3 text-white/80 text-sm">
                    あなたの回答：{textAnswer}
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
