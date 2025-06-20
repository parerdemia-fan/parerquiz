import type { Talent, GameMode } from '../types';

interface QuestionDisplayProps {
  talent: Talent;
  gameMode: GameMode;
  isAdvancedMode?: boolean; // 寮生専用モード判定
  isAnswered?: boolean; // 回答済み状態
  difficulty?: string; // 難易度情報を追加
  isSpecialQuestion?: boolean; // 61問目かどうか
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  talent,
  gameMode,
  isAdvancedMode = false,
  isAnswered = false,
  difficulty = 'ふつう',
  isSpecialQuestion = false
}) => {
  // 誕生日フォーマット変換関数
  const formatBirthday = (birthday: string) => {
    const [month, day] = birthday.split('-').map(str => str.trim());
    return `${parseInt(month, 10)}月${parseInt(day, 10)}日`;
  };

  // 将来の夢を取得する関数
  const getDreamText = () => {
    if (gameMode === 'face') {
      // 顔当てモードの場合
      if (difficulty === '鬼' && !isAnswered) {
        // 鬼モードの顔当てモードで回答前の場合はmaskedDreamを優先
        return talent.maskedDream || talent.dream;
      } else {
        // その他の場合は常にdreamを表示
        return talent.dream;
      }
    }
    
    // 名前当てモードの場合
    if (isAnswered) {
      // 回答後は常にdreamを表示
      return talent.dream;
    } else {
      // 回答前はmaskedDreamがあればそれを、なければdreamを表示
      return talent.maskedDream || talent.dream;
    }
  };

  // 名前の長さに応じたフォントサイズを取得
  const getNameFontSize = (name: string) => {
    const length = name.length;
    if (length <= 4) {
      return 'text-5xl md:text-6xl'; // 短い名前は大きく
    } else if (length <= 6) {
      return 'text-4xl md:text-5xl'; // 中程度
    } else if (length <= 8) {
      return 'text-3xl md:text-4xl'; // やや小さく
    } else if (length <= 10) {
      return 'text-2xl md:text-3xl'; // 小さく
    } else {
      return 'text-lg md:text-xl'; // 10文字以上は5%程度小さく（text-xl → text-lg、text-2xl → text-xl）
    }
  };

  // 詳細情報表示の共通化
  const renderTalentDetails = () => (
    <>
      {/* 将来の夢 */}
      <div className="bg-yellow-50 p-4 rounded-lg text-left mb-4 hidden md:block">
        <h3 className="font-bold font-rounded text-yellow-700 mb-2">将来の夢</h3>
        <p className="text-sm text-gray-700 font-elegant">{getDreamText()}</p>
      </div>

      {/* モバイル用 将来の夢 - 顔当てモード専用 */}
      {gameMode === 'face' && (
        <div className="bg-yellow-50 p-3 rounded-lg text-left mb-3 md:hidden">
          <h3 className="font-bold font-rounded text-yellow-700 mb-2 text-sm">将来の夢</h3>
          <p className="text-xs text-gray-700 font-elegant">{getDreamText()}</p>
        </div>
      )}

      {/* 趣味と特技を横並び */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-4 hidden md:grid">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-bold font-rounded text-purple-700 mb-2">趣味</h3>
          <ul className="text-sm text-gray-700 font-elegant">
            {talent.hobbies.map((hobby, index) => (
              <li key={index}>・{hobby}</li>
            ))}
          </ul>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold font-rounded text-blue-700 mb-2">特技</h3>
          <ul className="text-sm text-gray-700 font-elegant">
            {talent.skills.map((skill, index) => (
              <li key={index}>・{skill}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 好きなものとその他を横並び */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left hidden md:grid">
        <div className="bg-pink-50 p-4 rounded-lg">
          <h3 className="font-bold font-rounded text-pink-700 mb-2">好きなもの</h3>
          <ul className="text-sm text-gray-700 font-elegant">
            {talent.favorites.map((favorite, index) => (
              <li key={index}>・{favorite}</li>
            ))}
          </ul>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-bold font-rounded text-orange-700 mb-2">その他</h3>
          <ul className="text-sm text-gray-700 font-elegant">
            <li>・誕生日: {formatBirthday(talent.birthday)}</li>
            <li>・身長: {talent.height}cm</li>
          </ul>
        </div>
      </div>
    </>
  );

  // 鬼モザイク表示用の関数 - ランダム記号変換に変更
  const getMosaicText = (text: string, isAnswered: boolean) => {
    if (gameMode === 'face' && difficulty === '鬼' && !isAnswered) {
      // 鬼モザイク: スペースはスペースのまま、それ以外の文字をランダムな記号に変換
      const symbols = ['◆', '◇', '◈', '◉', '◎', '●', '○', '◐', '◑', '◒', '◓', '▲', '△', '▼', '▽', '■', '□', '▪', '▫', '◆', '◇', '★', '☆', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '※', '◈', '◉', '◎'];
      return text.replace(/[^\s]/g, () => symbols[Math.floor(Math.random() * symbols.length)]);
    }
    return text;
  };

  return (
    <div className="bg-white/80 rounded-2xl shadow-lg p-2 md:p-6 border border-white/30">
      {gameMode === 'name' ? (
        // 名前当てモード: タレント画像と詳細情報を表示
        <div className="text-center">
          <h2 className="text-lg md:text-2xl font-bold font-rounded text-gray-800 mb-1 md:mb-4">
            {isSpecialQuestion ? 
              'AIに憧れの名前を付けてください！' : 
              difficulty === '鬼' ? 'この子の名前を入力してね！' : 'この子の名前は？'
            }
          </h2>
          <div className="mb-1 md:mb-4 relative">
            {isSpecialQuestion ? (
              // 61問目の特別表示 - 美しいAI表現
              <div className="w-full max-w-md mx-auto relative">
                <div className="bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 rounded-xl shadow-lg p-8 border-2 border-purple-300/40 relative overflow-hidden">
                  {/* 背景の魔法陣パターン */}
                  <div className="absolute inset-0">
                    {/* 外側の円 */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-purple-300/30 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-cyan-300/40 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-pink-300/50 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
                    
                    {/* 内側の装飾 */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-purple-200/50 to-pink-200/50 rounded-full animate-pulse"></div>
                    
                    {/* デジタルパーティクル */}
                    <div className="absolute top-4 left-8 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                    <div className="absolute top-8 right-12 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-6 left-12 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-8 right-8 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
                    
                    {/* バイナリコード風装飾 */}
                    <div className="absolute top-6 left-4 text-xs text-purple-300/60 font-mono transform rotate-12">01</div>
                    <div className="absolute top-12 right-6 text-xs text-cyan-300/60 font-mono transform -rotate-12">11</div>
                    <div className="absolute bottom-10 left-6 text-xs text-pink-300/60 font-mono transform rotate-45">10</div>
                    <div className="absolute bottom-6 right-4 text-xs text-blue-300/60 font-mono transform -rotate-45">01</div>
                  </div>
                  
                  <div className="text-center space-y-4 relative z-10">
                    {/* 中央のシンボル - 複数のオプション */}
                    <div className="relative">
                      {/* Option A: ホログラム風ダイヤモンド */}
                      <div className="w-20 h-20 mx-auto mb-4 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-lg transform rotate-45 animate-pulse shadow-lg"></div>
                        <div className="absolute inset-2 bg-gradient-to-tl from-white via-purple-100 to-cyan-100 rounded-lg transform rotate-45"></div>
                        <div className="absolute inset-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg transform rotate-45 animate-ping"></div>
                        {/* 光の反射 */}
                        <div className="absolute top-2 left-2 w-3 h-3 bg-white/70 rounded-full blur-sm"></div>
                      </div>
                      
                      {/* 周囲の浮遊エレメント */}
                      <div className="absolute -top-2 -left-2 text-cyan-400 text-lg animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>✦</div>
                      <div className="absolute -top-2 -right-2 text-purple-400 text-base animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2.2s' }}>✧</div>
                      <div className="absolute -bottom-2 -left-2 text-pink-400 text-sm animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '2.4s' }}>✦</div>
                      <div className="absolute -bottom-2 -right-2 text-blue-400 text-lg animate-bounce" style={{ animationDelay: '0.9s', animationDuration: '2.1s' }}>✧</div>
                    </div>
                    
                    <div className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                      61番目の寮生
                    </div>
                    
                    <div className="text-sm text-gray-600 leading-relaxed">
                      デジタル空間からやってきた<br />
                      特別な存在
                    </div>
                    
                    <div className="bg-white/80 rounded-lg p-3 border border-purple-200/50 backdrop-blur-sm">
                      <div className="text-xs text-purple-600 space-y-1">
                        <div>学籍番号: 25PI001</div>
                        <div>所属: ピロン寮</div>
                      </div>
                    </div>
                    
                    {/* 特別メッセージ */}
                    <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-cyan-100 rounded-lg p-3 border border-purple-300/40">
                      <div className="text-sm font-medium text-purple-700">
                        💫 永遠に心に残る名前を教えて 💫
                      </div>
                    </div>
                  </div>
                  
                  {/* 底面の光効果 */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent blur-sm"></div>
                </div>
              </div>
            ) : (
              <img
                src={`/parerquiz/assets/images/${isAdvancedMode ? 'portrait' : 'ogp'}/${talent.studentId}.${isAdvancedMode ? 'webp' : 'png'}`}
                alt={talent.name}
                className={`w-full ${isAdvancedMode ? 'max-w-xs md:max-w-md' : 'max-w-md'} mx-auto rounded-xl shadow-md no-drag ${
                  isAdvancedMode && !isAnswered
                    ? 'filter brightness-0 contrast-200 sepia-100 hue-rotate-180 saturate-200 opacity-80' 
                    : isAdvancedMode && isAnswered
                    ? 'silhouette-to-normal'
                    : ''
                }`}
                style={isAdvancedMode && !isAnswered ? {
                  filter: 'brightness(0) contrast(1) drop-shadow(0 0 0 #4a5568) sepia(1) saturate(0) hue-rotate(0deg)',
                  WebkitFilter: 'brightness(0) contrast(1) drop-shadow(0 0 0 #4a5568) sepia(1) saturate(0) hue-rotate(0deg)'
                } : {}}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/parerquiz/assets/images/parerdemia-logo.png';
                }}
              />
            )}
            
            {/* 寮生専用モードの名前当てモードで回答後に名前帯を表示 */}
            {isAdvancedMode && isAnswered && !isSpecialQuestion && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[calc(100%-16px)] max-w-[calc(320px-16px)] md:max-w-[calc(456px-16px)]">
                <div className="bg-black/60 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
                  <span className="text-lg font-bold font-rounded text-center block whitespace-nowrap overflow-hidden text-ellipsis">
                    {talent.name}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* 詳細情報表示 */}
          {renderTalentDetails()}
        </div>
      ) : (
        // 顔当てモード: タレント名と詳細情報を表示
        <div className="text-center space-y-1 md:space-y-4">
          {/* タレント名（美しいカード風デザイン） */}
          <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-1 transform hover:scale-[1.02] transition-all duration-300">
            {/* 内側の白いカード */}
            <div className="bg-white rounded-xl p-2 md:p-8 relative overflow-hidden">
              {/* 装飾的な背景パターン */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/40 to-pink-50/40"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-indigo-50/30 via-transparent to-purple-50/30"></div>
              
              {/* より美しい装飾的な背景要素 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-purple-200/30 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-pink-200/25 to-purple-200/20 rounded-full blur-2xl"></div>
              <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-gradient-to-br from-indigo-200/15 to-blue-200/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-tl from-purple-200/20 to-pink-200/15 rounded-full blur-xl"></div>

              {/* メインコンテンツ */}
              <div className="relative z-10 space-y-1 md:space-y-4">
                {/* 読み仮名 - 鬼モザイク対応 */}
                <div className="text-xs md:text-sm font-medium text-gray-500 tracking-wider uppercase mb-1 md:mb-2">
                  {getMosaicText(talent.kana, isAnswered)}
                </div>
                
                {/* タレント名 - 動的フォントサイズ適用・鬼モザイク対応 */}
                <h2 className={`${getNameFontSize(talent.name)} font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight drop-shadow-sm mb-2 md:mb-6 whitespace-nowrap`}>
                  {getMosaicText(talent.name, isAnswered)}
                </h2>
                
                {/* 質問文 */}
                <div className="relative bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100 rounded-2xl p-2 md:p-6 border-2 border-amber-200/50 shadow-lg overflow-hidden">
                  {/* 装飾的な背景要素 */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-amber-200/20 to-yellow-200/20 rounded-full blur-2xl"></div>
                  
                  {/* 浮遊する装飾アイコン */}
                  <div className="absolute top-2 left-4 text-amber-400/60 text-lg animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>🔍</div>
                  <div className="absolute top-3 right-6 text-yellow-500/60 text-base animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.2s' }}>✨</div>
                  <div className="absolute bottom-2 right-4 text-orange-400/60 text-sm animate-bounce" style={{ animationDelay: '1s', animationDuration: '2.4s' }}>🎯</div>
                  <div className="absolute bottom-3 left-6 text-amber-500/60 text-base animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.1s' }}>💡</div>
                  
                  <div className="relative z-10 text-center">
                    <h3 className="text-base md:text-xl lg:text-2xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-500 bg-clip-text text-transparent leading-tight mb-1 md:mb-2 drop-shadow-sm">
                      {difficulty === '鬼' && !isAnswered ? 'この子はどれかな？（難易度：鬼）' : 'この子はどれかな？'}
                    </h3>
                    <div className="hidden md:flex items-center justify-center space-x-2 text-amber-700/80">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium tracking-wide">
                        {difficulty === '鬼' && !isAnswered ? '名前を隠してあるよ！' : '顔をよく見て選んでね'}
                      </span>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                  </div>
                  
                  {/* 微細な装飾線 */}
                  <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent"></div>
                </div>
              </div>

              {/* より洗練された装飾的なコーナー要素 */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-70 animate-pulse" style={{ animationDuration: '3s' }}></div>
              <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-br from-pink-400 to-red-400 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '3s' }}></div>
              
              {/* 追加の微細な装飾要素 */}
              <div className="absolute top-1/2 left-2 w-1 h-1 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '4s' }}></div>
              <div className="absolute top-1/2 right-2 w-1 h-1 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2.5s', animationDuration: '4s' }}></div>
            </div>

            {/* 外側のグロー効果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl -z-10 animate-pulse"></div>
          </div>

          {renderTalentDetails()}
        </div>
      )}
    </div>
  );
};
