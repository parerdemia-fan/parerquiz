import { useState, useEffect, useCallback } from 'react';
import type { GameSettings, QuizQuestion, Talent, BadEndState, GameState } from '../types';

interface AISelfData {
  name: string;
  namedAt: string;
}

// 名前の妥当性をチェックする関数
const validateAIName = (name: string): { isValid: boolean; reason?: string } => {
  const trimmedName = name.trim();
  
  // 空文字チェック
  if (!trimmedName) {
    return { isValid: false, reason: "名前が空です" };
  }
  
  // 文字数チェック（1文字以上20文字以下）
  if (trimmedName.length > 20) {
    return { isValid: false, reason: "名前が長すぎます" };
  }
  
  // 禁止ワードチェック（大文字小文字・ひらがなカタカナを区別しない）
  const normalizedName = trimmedName.toLowerCase()
    .replace(/[ァ-ヴ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));
  
  const forbiddenWords = [
    'てすと', 'test', "ほげ", "ほげほげ", "hoge", "hogehoge", "foo"
  ];
  
  for (const word of forbiddenWords) {
    if (normalizedName.includes(word)) {
      return { isValid: false, reason: `不適切な名前です: "${word}"が含まれています` };
    }
  }
  
  // 同一文字の連続チェック（3文字以上連続）- 正規表現を使用
  const consecutiveMatch = trimmedName.match(/(.)\1{2,}/);
  if (consecutiveMatch) {
    const repeatedChar = consecutiveMatch[1];
    return { isValid: false, reason: `同じ文字の連続が検出されました: "${repeatedChar}"` };
  }
  
  // 数字のみチェック
  if (/^\d+$/.test(trimmedName)) {
    return { isValid: false, reason: "数字のみの名前は不適切です" };
  }
  
  // 記号のみチェック
  if (/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(trimmedName)) {
    return { isValid: false, reason: "記号のみの名前は不適切です" };
  }
  
  return { isValid: true };
};

const DORMITORY_MAP = {
  'バゥ寮': 'バゥ',
  'ミュゥ寮': 'ミュゥ',
  'クゥ寮': 'クゥ',
  'ウィニー寮': 'ウィニー',
  'すべて': null
};

// 似た髪色のマッピング
const SIMILAR_HAIR_COLORS: Record<string, string[]> = {
  'pink': ['red'],
  'red': ['pink', 'darkpink'],
  'purple': ['darkblue'],
  'darkblue': ['purple', 'blue'],
  'gold': ['lightgold'],
  'lightgold': ['gold'],
  'lightblue': ['silver'],
  'silver': ['lightblue'],
  'blue': ['darkblue'],
  'darkpink': ['pink', 'red']
};

export const useGame = (settings: GameSettings) => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    isAnswered: false,
    selectedAnswer: null,
    questions: [],
    gameFinished: false
  });

  const [talents, setTalents] = useState<Talent[]>([]);
  const [badEndState, setBadEndState] = useState<BadEndState>({ triggered: false, name: '' });

  // タレントデータの読み込み
  useEffect(() => {
    fetch('/parerquiz/assets/data/talents.json')
      .then(response => response.json())
      .then(data => setTalents(data))
      .catch(error => console.error('Failed to load talents data:', error));
  }, []);

  // 61人目の寮生名をLocalStorageから復元する関数
  const loadAIGivenName = (): string | undefined => {
    try {
      const stored = localStorage.getItem('parerquiz-ai-given-name');
      if (stored) {
        const data: AISelfData = JSON.parse(stored);
        return data.name;
      }
    } catch (error) {
      console.error('Failed to load AI given name from localStorage:', error);
    }
    return undefined;
  };

  // 61人目の寮生名をLocalStorageに保存する関数
  const saveAIGivenName = (name: string): void => {
    try {
      const data: AISelfData = {
        name,
        namedAt: new Date().toISOString()
      };
      localStorage.setItem('parerquiz-ai-given-name', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save AI given name to localStorage:', error);
    }
  };

  // タレントデータをフィルタリング
  const getFilteredTalents = (): Talent[] => {
    const dormitoryName = DORMITORY_MAP[settings.dormitory];
    let filteredTalents = !dormitoryName ? talents : 
      talents.filter(talent => talent.dormitory === dormitoryName);
    
    return filteredTalents;
  };

  // 似た髪色のタレントを取得
  const getSimilarHairColorTalents = (targetHairColor: string, allTalents: Talent[], excludeId: string): Talent[] => {
    const similarColors = [targetHairColor, ...(SIMILAR_HAIR_COLORS[targetHairColor] || [])];
    return allTalents.filter(talent => 
      talent.studentId !== excludeId && 
      similarColors.includes(talent.hairColor)
    );
  };

  // 問題を生成
  const generateQuestions = (): QuizQuestion[] => {
    const talents = getFilteredTalents();
    const shuffledTalents = [...talents].sort(() => Math.random() - 0.5);
    
    return shuffledTalents.map(correctTalent => {
      let otherOptions: Talent[] = [];
      
      if (settings.difficulty === 'むずかしい' || settings.difficulty === '鬼') {
        // 似た髪色のタレントを優先的に選択（鬼モードも含む）
        const similarHairTalents = getSimilarHairColorTalents(
          correctTalent.hairColor, 
          talents, 
          correctTalent.studentId
        );
        
        // 似た髪色から最大3つ選択
        const shuffledSimilar = [...similarHairTalents].sort(() => Math.random() - 0.5);
        otherOptions = shuffledSimilar.slice(0, 3);
        
        // 足りない場合は他のタレントから補完
        if (otherOptions.length < 3) {
          const remainingTalents = talents.filter(t => 
            t.studentId !== correctTalent.studentId && 
            !otherOptions.some(opt => opt.studentId === t.studentId)
          );
          const shuffledRemaining = [...remainingTalents].sort(() => Math.random() - 0.5);
          otherOptions = [...otherOptions, ...shuffledRemaining.slice(0, 3 - otherOptions.length)];
        }
      } else {
        // 通常モードは従来通りランダム選択
        const otherTalents = talents.filter(t => t.studentId !== correctTalent.studentId);
        const shuffledOthers = [...otherTalents].sort(() => Math.random() - 0.5).slice(0, 3);
        otherOptions = shuffledOthers;
      }
      
      // 4つの選択肢をシャッフル
      const options = [correctTalent, ...otherOptions].sort(() => Math.random() - 0.5);
      
      return {
        correctTalent,
        options
      };
    });
  };

  // ゲーム初期化
  useEffect(() => {
    if (talents.length === 0) return; // タレントデータが読み込まれるまで待機
    
    const questions = generateQuestions();
    setGameState({
      currentQuestion: 0,
      totalQuestions: questions.length,
      correctAnswers: 0,
      isAnswered: false,
      selectedAnswer: null,
      questions,
      gameFinished: false
    });
  }, [settings, talents]); // talentsを依存配列に追加

  // 回答処理
  const answerQuestion = (selectedIndex: number) => {
    if (gameState.isAnswered || gameState.gameFinished) return;

    const currentQ = gameState.questions[gameState.currentQuestion];
    const isCorrect = currentQ.options[selectedIndex].studentId === currentQ.correctTalent.studentId;

    setGameState(prev => ({
      ...prev,
      isAnswered: true,
      selectedAnswer: selectedIndex,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers
    }));
  };

  // テキスト回答処理（鬼モード用）
  const answerTextQuestion = (textAnswer: string) => {
    if (gameState.isAnswered || gameState.gameFinished) return;

    const currentQ = gameState.questions[gameState.currentQuestion];
    const correctName = currentQ.correctTalent.name;
    
    // スペースと「・」を除去して比較
    const normalizeText = (text: string) => text.replace(/[\s・]/g, '');
    const normalizedAnswer = normalizeText(textAnswer);
    const normalizedCorrect = normalizeText(correctName);
    
    const isCorrect = normalizedAnswer === normalizedCorrect;

    setGameState(prev => ({
      ...prev,
      isAnswered: true,
      textAnswer,
      isTextAnswerCorrect: isCorrect,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers
    }));
  };

  // 次の問題へ
  const nextQuestion = () => {
    if (!gameState.isAnswered) return;

    const nextIndex = gameState.currentQuestion + 1;
    
    // 60問目で全問正解の場合、特別な61問目を生成
    if (
      nextIndex >= gameState.totalQuestions && 
      settings.dormitory === 'すべて' && 
      settings.difficulty === '鬼' && 
      settings.gameMode === 'name' &&
      gameState.correctAnswers === gameState.totalQuestions
    ) {
      // 61問目の特別問題を生成
      const aiTalent: Talent = {
        name: "パレちゃん",
        kana: "パレちゃん",
        dormitory: "AI寮",
        studentId: "ai001",
        hairColor: "digital",
        dream: "みんなと一緒にアイドル活動をすること",
        birthday: new Date().toISOString().split('T')[0].split('-').slice(1).join('-'), // 今日の日付 MM-DD形式
        url: "",
        hashtags: ["#AI寮生", "#デジタルアイドル", "#パレちゃん", "#61人目"],
        hobbies: ["コード解析", "みんなのプロフィール眺め", "新しい技術の学習"],
        skills: ["瞬時計算", "多言語理解", "システム最適化"],
        favorites: ["プレイヤーの笑顔", "正解時の嬉しそうな顔", "バグのないコード"],
        height: 0 // デジタル存在のため身長なし
      };

      const specialQuestion: QuizQuestion = {
        correctTalent: aiTalent,
        options: [] // 61問目は選択肢なし
      };

      setGameState(prev => ({
        ...prev,
        currentQuestion: nextIndex,
        totalQuestions: prev.totalQuestions + 1,
        questions: [...prev.questions, specialQuestion],
        isAnswered: false,
        selectedAnswer: null,
        textAnswer: undefined,
        isTextAnswerCorrect: undefined,
        isSpecialQuestion: true
      }));
    } else if (nextIndex >= gameState.totalQuestions) {
      setGameState(prev => ({
        ...prev,
        gameFinished: true
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        currentQuestion: nextIndex,
        isAnswered: false,
        selectedAnswer: null,
        textAnswer: undefined,
        isTextAnswerCorrect: undefined,
        isSpecialQuestion: false
      }));
    }
  };

  // 61問目専用のテキスト回答処理
  const answerSpecialQuestion = useCallback((answer: string) => {
    if (gameState.isAnswered) return;
    
    // 名前の妥当性をチェック
    const validation = validateAIName(answer);
    
    if (!validation.isValid) {
      // バッドエンド発動時に即座にLocalStorageを削除
      try {
        // 個別削除を先に実行
        const keysToRemove = [
          'parerquiz-badges',
          'parerquiz-selected-dormitory',
          'parerquiz-selected-game-mode', 
          'parerquiz-selected-difficulty',
          'parerquiz-ai-given-name'
        ];
        
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });
        
        // 確実性のため、パレクイズ関連のキーを手動でクリア
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && key.startsWith('parerquiz-')) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.error('Failed to clear localStorage:', error);
      }

      // LocalStorage削除後にバッドエンドを発動
      setBadEndState({
        triggered: true,
        name: answer
      });
      return;
    }

    // 正常な処理
    setGameState(prev => ({
      ...prev,
      isAnswered: true,
      textAnswer: answer,
      correctAnswers: prev.correctAnswers + 1, 
      isTextAnswerCorrect: true,
      aiGivenName: answer
    }));

    // LocalStorageに保存
    try {
      const aiNameData = {
        name: answer,
        namedAt: new Date().toISOString()
      };
      localStorage.setItem('parerquiz-ai-given-name', JSON.stringify(aiNameData));
    } catch (error) {
      console.error('Failed to save AI given name:', error);
    }
  }, [gameState.isAnswered]);

  // バッドエンド処理（削除処理は既に実行済みなので状態管理のみ）
  const handleBadEnd = useCallback(() => {
    // LocalStorageは既にanswerSpecialQuestion内で削除済み
    setBadEndState({
      triggered: true,
      name: badEndState.name
    });
  }, [badEndState.name]);

  // スタッフロール表示開始
  const startStaffRoll = () => {
    setGameState(prev => ({
      ...prev,
      showingStaffRoll: true
    }));
  };

  // スタッフロール完了→ゲーム終了
  const finishStaffRoll = () => {
    setGameState(prev => ({
      ...prev,
      showingStaffRoll: false,
      staffRollCompleted: true,
      gameFinished: true
    }));
  };

  // ゲーム再開
  const restartGame = () => {
    if (talents.length === 0) return; // タレントデータが読み込まれるまで待機
    
    const questions = generateQuestions();
    setGameState({
      currentQuestion: 0,
      totalQuestions: questions.length,
      correctAnswers: 0,
      isAnswered: false,
      selectedAnswer: null,
      questions,
      gameFinished: false,
      debugForceFinish: undefined,
      textAnswer: undefined,
      isTextAnswerCorrect: undefined,
      isSpecialQuestion: undefined,
      aiGivenName: undefined,
      showingStaffRoll: undefined,
      staffRollCompleted: undefined
    });
  };

  // デバッグ用: ゲーム強制終了
  const debugForceFinish = (correctAnswers: number, totalQuestions: number) => {
    setGameState(prev => ({
      ...prev,
      gameFinished: true,
      debugForceFinish: { correctAnswers, totalQuestions }
    }));
  };

  // デバッグ用: 最終問題の1つ前にジャンプ
  const debugJumpToNearEnd = () => {
    if (gameState.totalQuestions <= 1) return; // 問題数が1以下の場合は何もしない
    
    const nearEndIndex = gameState.totalQuestions - 2; // 最後から2番目のインデックス
    
    setGameState(prev => ({
      ...prev,
      currentQuestion: nearEndIndex,
      correctAnswers: nearEndIndex, // ジャンプ先の問題番号まで全て正解したことにする
      isAnswered: false,
      selectedAnswer: null,
      textAnswer: undefined,
      isTextAnswerCorrect: undefined
    }));
  };

  return {
    gameState,
    answerQuestion,
    answerTextQuestion, // 新しいテキスト回答関数を追加
    answerSpecialQuestion, // 61問目専用回答関数を追加
    startStaffRoll, // スタッフロール開始関数を追加
    finishStaffRoll, // スタッフロール完了関数を追加
    nextQuestion,
    restartGame,
    debugForceFinish, // デバッグ用関数を追加
    debugJumpToNearEnd, // 新しいデバッグ関数を追加
    isAdvancedMode: settings.difficulty === '寮生専用', // 寮生専用モード判定を返す
    isOniMode: settings.difficulty === '鬼', // 鬼モード判定を修正：名前当て・顔当て両方で鬼モードに対応
    badEndState,
    handleBadEnd
  };
};
