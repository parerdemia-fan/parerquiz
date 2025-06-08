import type { Badge, Dormitory, Difficulty } from '../types';
import { useState, useEffect, useCallback } from 'react';

const BADGES_STORAGE_KEY = 'parerquiz-badges';

// 難易度の優先度
const DIFFICULTY_PRIORITY: Record<Difficulty, number> = {
  'ふつう': 1,
  'むずかしい': 2,
  '寮生専用': 3
};

export const useBadges = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // LocalStorageからバッジを復元
  useEffect(() => {
    try {
      const storedBadges = localStorage.getItem(BADGES_STORAGE_KEY);
      if (storedBadges) {
        const parsedBadges = JSON.parse(storedBadges);
        setBadges(parsedBadges);
      }
    } catch (error) {
      console.error('Failed to load badges from localStorage:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // バッジをLocalStorageに保存し即座に状態を更新
  const saveBadges = useCallback((newBadges: Badge[]) => {
    try {
      localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(newBadges));
      setBadges(newBadges);
    } catch (error) {
      console.error('Failed to save badges to localStorage:', error);
    }
  }, []);

  // バッジ取得処理 - 即座に状態を更新
  const earnBadge = useCallback((dormitory: Dormitory, difficulty: Difficulty): boolean => {
    // 現在のバッジ状態を取得（LocalStorageから最新を取得）
    let currentBadges: Badge[];
    try {
      const storedBadges = localStorage.getItem(BADGES_STORAGE_KEY);
      currentBadges = storedBadges ? JSON.parse(storedBadges) : [];
    } catch (error) {
      console.error('Failed to load current badges:', error);
      currentBadges = badges;
    }

    const existingBadgeIndex = currentBadges.findIndex(badge => badge.dormitory === dormitory);
    const newBadge: Badge = {
      dormitory,
      difficulty,
      earnedAt: new Date().toISOString()
    };

    let updatedBadges: Badge[];

    if (existingBadgeIndex !== -1) {
      const existingBadge = currentBadges[existingBadgeIndex];
      const existingPriority = DIFFICULTY_PRIORITY[existingBadge.difficulty];
      const newPriority = DIFFICULTY_PRIORITY[difficulty];

      // 上位難易度の場合のみ更新
      if (newPriority > existingPriority) {
        updatedBadges = [...currentBadges];
        updatedBadges[existingBadgeIndex] = newBadge;
        saveBadges(updatedBadges);
        return true;
      }
      return false; // 下位難易度の場合は取得しない
    } else {
      // 新規バッジ取得
      updatedBadges = [...currentBadges, newBadge];
      saveBadges(updatedBadges);
      return true;
    }
  }, [badges, saveBadges]);

  // バッジ状態を強制的に再読み込み
  const reloadBadges = useCallback(() => {
    try {
      const storedBadges = localStorage.getItem(BADGES_STORAGE_KEY);
      if (storedBadges) {
        const parsedBadges = JSON.parse(storedBadges);
        setBadges(parsedBadges);
      }
    } catch (error) {
      console.error('Failed to reload badges from localStorage:', error);
    }
  }, []);

  // 特定の出題範囲と難易度でバッジを取得しているかチェック
  const hasBadge = useCallback((dormitory: Dormitory, difficulty: Difficulty): boolean => {
    return badges.some(badge => 
      badge.dormitory === dormitory && badge.difficulty === difficulty
    );
  }, [badges]);

  // 特定の出題範囲で取得している最高難易度のバッジを取得
  const getBadgeForDormitory = useCallback((dormitory: Dormitory): Badge | null => {
    return badges.find(badge => badge.dormitory === dormitory) || null;
  }, [badges]);

  // バッジの希少度を取得
  const getBadgeRarity = useCallback((difficulty: Difficulty): 'bronze' | 'silver' | 'gold' => {
    switch (difficulty) {
      case 'ふつう': return 'bronze';
      case 'むずかしい': return 'silver';
      case '寮生専用': return 'gold';
    }
  }, []);

  // バッジが輝くべきかどうかを判定（タイトル画面用）
  const shouldBadgeGlow = useCallback((difficulty: Difficulty): boolean => {
    return difficulty === 'むずかしい' || difficulty === '寮生専用';
  }, []);

  // バッジを全てリセット
  const resetAllBadges = useCallback(() => {
    try {
      localStorage.removeItem(BADGES_STORAGE_KEY);
      setBadges([]);
    } catch (error) {
      console.error('Failed to reset badges:', error);
    }
  }, []);

  return {
    badges,
    earnBadge,
    hasBadge,
    getBadgeForDormitory,
    getBadgeRarity,
    shouldBadgeGlow,
    resetAllBadges,
    reloadBadges,
    isInitialized
  };
};
