export interface Talent {
  name: string;
  kana: string;
  dormitory: string;
  studentId: string;
  hairColor: string;
  dream: string;
  maskedDream?: string; // マスクされた将来の夢（回答前表示用）
  birthday: string;
  url: string;
  hashtags: string[];
  hobbies: string[];
  skills: string[];
  favorites: string[];
  height: number;
}

export type GameMode = 'name' | 'face';
export type Difficulty = 'ふつう' | 'むずかしい' | '寮生専用' | '鬼';
export type Dormitory = 'バゥ寮' | 'ミュゥ寮' | 'クゥ寮' | 'ウィニー寮' | 'すべて';

export interface GameSettings {
  dormitory: Dormitory;
  gameMode: GameMode;
  difficulty: Difficulty;
  isAdvancedMode?: boolean; // 寮生専用モード判定用
}

export interface QuizQuestion {
  correctTalent: Talent;
  options: Talent[];
}

export interface GameState {
  currentQuestion: number;
  totalQuestions: number;
  correctAnswers: number; // 現在の正解数（AI メッセージ表示判定で使用）
  isAnswered: boolean;
  selectedAnswer: number | null;
  questions: QuizQuestion[];
  gameFinished: boolean;
  debugForceFinish?: { correctAnswers: number; totalQuestions: number }; // デバッグ用強制終了
  textAnswer?: string; // 鬼モード用テキスト回答
  isTextAnswerCorrect?: boolean; // 鬼モード用正誤判定結果
  isSpecialQuestion?: boolean; // 61問目の特別問題フラグ
  aiGivenName?: string; // AIに付けられた名前
  showingStaffRoll?: boolean; // スタッフロール表示中フラグ
  staffRollCompleted?: boolean; // スタッフロール完了フラグ
}

// デバッグモード用の型定義を追加
export interface DebugMode {
  correctAnswers: number;
  totalQuestions: number;
}

// バッジ関連の型定義を追加
export interface Badge {
  dormitory: Dormitory;
  difficulty: Difficulty;
  earnedAt: string; // ISO 8601 形式の日時文字列
}

export type BadgeRarity = 'bronze' | 'silver' | 'gold';

// 寮情報の型定義（App.tsx で使用）
export interface DormitoryInfo {
  name: Dormitory;
  color: string;
  textColor: string;
  imagePath: string;
}

// 寮コードマッピング用の型定義
export const DORMITORY_CODE_MAP: Record<Dormitory, string | null> = {
  'バゥ寮': 'wa',
  'ミュゥ寮': 'me',
  'クゥ寮': 'co',
  'ウィニー寮': 'wh',
  'すべて': null
};

