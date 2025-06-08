import type { GameSettings, Talent, GameState, QuizQuestion } from '../types';
import { useState, useEffect } from 'react';
import talentsData from '../../assets/data/talents.json';

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

  // タレントデータをフィルタリング
  const getFilteredTalents = (): Talent[] => {
    const dormitoryName = DORMITORY_MAP[settings.dormitory];
    let talents = !dormitoryName ? talentsData as Talent[] : 
      (talentsData as Talent[]).filter(talent => talent.dormitory === dormitoryName);
    
    return talents;
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
      
      if (settings.difficulty === 'むずかしい') {
        // 似た髪色のタレントを優先的に選択
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
  }, [settings]);

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

  // 次の問題へ
  const nextQuestion = () => {
    if (!gameState.isAnswered) return;

    const nextIndex = gameState.currentQuestion + 1;
    
    if (nextIndex >= gameState.totalQuestions) {
      setGameState(prev => ({
        ...prev,
        gameFinished: true
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        currentQuestion: nextIndex,
        isAnswered: false,
        selectedAnswer: null
      }));
    }
  };

  // ゲーム再開
  const restartGame = () => {
    const questions = generateQuestions();
    setGameState({
      currentQuestion: 0,
      totalQuestions: questions.length,
      correctAnswers: 0,
      isAnswered: false,
      selectedAnswer: null,
      questions,
      gameFinished: false,
      debugForceFinish: undefined
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

  return {
    gameState,
    answerQuestion,
    nextQuestion,
    restartGame,
    debugForceFinish, // デバッグ用関数を追加
    isAdvancedMode: settings.difficulty === '寮生専用' // 寮生専用モード判定を返す
  };
};
