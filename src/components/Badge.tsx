import type { Dormitory, Difficulty } from '../types';

interface BadgeProps {
  dormitory: Dormitory;
  difficulty?: Difficulty;
  earned?: boolean;
  size?: 'small' | 'medium' | 'large';
  enableGlow?: boolean; // タイトル画面での輝きエフェクト制御
}

export const Badge: React.FC<BadgeProps> = ({
  dormitory,
  difficulty = 'ふつう',
  earned = false,
  size = 'medium',
  enableGlow = false
}) => {
  // 寮に応じたエンブレム画像パスを取得
  const getEmblemPath = (dormitory: Dormitory): string => {
    const dormitoryMap: Record<Dormitory, string> = {
      'バゥ寮': 'wa',
      'ミュゥ寮': 'me',
      'クゥ寮': 'co',
      'ウィニー寮': 'wh',
      'すべて': 'parerdemia-logo'
    };

    const filename = dormitoryMap[dormitory];
    if (dormitory === 'すべて') {
      return `/parerquiz/assets/images/${filename}.png`;
    }
    return `/parerquiz/assets/images/dormitory/${filename}.webp`;
  };

  // 難易度に応じた縁取りスタイルを取得
  const getBorderStyle = (difficulty: Difficulty) => {
    if (!earned) {
      return 'border-4 border-gray-300 bg-gray-100';
    }

    switch (difficulty) {
      case 'ふつう':
        return 'border-4 border-amber-600 bg-gradient-to-br from-amber-100 to-amber-200 shadow-lg shadow-amber-200/50';
      case 'むずかしい':
        return 'border-4 border-gray-500 bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg shadow-gray-200/50';
      case '寮生専用':
        return 'border-4 border-yellow-500 bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-lg shadow-yellow-200/50';
    }
  };

  // サイズに応じたクラスを取得
  const getSizeClasses = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small':
        return 'w-12 h-12';
      case 'medium':
        return 'w-16 h-16';
      case 'large':
        return 'w-20 h-20';
    }
  };

  // 輝きアニメーションクラスを取得
  const getGlowClass = (difficulty: Difficulty, enableGlow: boolean, earned: boolean) => {
    if (!enableGlow || !earned) return '';
    
    switch (difficulty) {
      case 'むずかしい':
        return 'badge-silver';
      case '寮生専用':
        return 'badge-gold-enhanced';
      default:
        return '';
    }
  };

  return (
    <div className={`
      relative ${getSizeClasses(size)} rounded-full 
      ${getBorderStyle(difficulty)}
      flex items-center justify-center p-2
      ${earned ? 'hover:scale-105' : 'opacity-50'}
      transition-all duration-200
      ${getGlowClass(difficulty, enableGlow, earned)}
    `}>
      {/* 装飾的な背景パターン */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/50 to-transparent"></div>
      
      {/* エンブレム画像 */}
      <img
        src={getEmblemPath(dormitory)}
        alt={`${dormitory}のエンブレム`}
        className={`
          w-full h-full object-contain relative z-10 rounded-full
          ${!earned ? 'grayscale opacity-40' : 'drop-shadow-sm'}
        `}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      
      {/* 金色バッジの特別演出 */}
      {earned && difficulty === '寮生専用' && (
        <div className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-br from-yellow-400/20 to-transparent"></div>
      )}
    </div>
  );
};
