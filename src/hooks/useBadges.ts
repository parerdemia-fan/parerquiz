import type { Badge, Dormitory, Difficulty } from '../types';
import { useState, useEffect, useCallback } from 'react';

const BADGES_STORAGE_KEY = 'parerquiz-badges';

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
    // LocalStorageから現在のバッジを直接読み込み
    let currentBadges: Badge[] = [];
    try {
      const storedBadges = localStorage.getItem(BADGES_STORAGE_KEY);
      if (storedBadges) {
        currentBadges = JSON.parse(storedBadges);
      }
    } catch (error) {
      console.error('Failed to load current badges:', error);
      currentBadges = [];
    }

    const dormitoryKey = dormitory as Dormitory;
    
    // 既存のバッジをチェック
    const existingBadgeIndex = currentBadges.findIndex(badge => badge.dormitory === dormitoryKey);
    
    if (existingBadgeIndex >= 0) {
      const existingBadge = currentBadges[existingBadgeIndex];
      
      // 難易度の順序を定義（数字が大きいほど上位）
      const difficultyOrder: Record<string, number> = {
        'ふつう': 1,
        'むずかしい': 2,
        '寮生専用': 3,
        '鬼': 4
      };
      
      const currentDifficultyLevel = difficultyOrder[difficulty] || 0;
      const existingDifficultyLevel = difficultyOrder[existingBadge.difficulty] || 0;
      
      // より上位の難易度の場合のみ更新
      if (currentDifficultyLevel > existingDifficultyLevel) {
        currentBadges[existingBadgeIndex] = {
          dormitory: dormitoryKey,
          difficulty,
          earnedAt: new Date().toISOString()
        };
        saveBadges(currentBadges);
        return true;
      }
      
      return false; // 下位難易度または同等の場合は取得しない
    } else {
      // 新しいバッジを追加
      const newBadge: Badge = {
        dormitory: dormitoryKey,
        difficulty,
        earnedAt: new Date().toISOString()
      };
      
      const updatedBadges = [...currentBadges, newBadge];
      saveBadges(updatedBadges);
      return true;
    }
  }, [saveBadges]);

  // バッジ状態を強制的に再読み込み
  const reloadBadges = useCallback(() => {
    try {
      const storedBadges = localStorage.getItem(BADGES_STORAGE_KEY);
      if (storedBadges) {
        const parsedBadges = JSON.parse(storedBadges);
        setBadges(parsedBadges);
      } else {
        // LocalStorageにバッジがない場合は空配列をセット
        setBadges([]);
      }
    } catch (error) {
      console.error('Failed to reload badges from localStorage:', error);
      setBadges([]);
    }
  }, []);

  // 特定の出題範囲と難易度でバッジを取得しているかチェック
  const hasBadge = useCallback((dormitory: Dormitory, difficulty: Difficulty): boolean => {
    return badges.some(badge => badge.dormitory === dormitory && badge.difficulty === difficulty);
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
      case '鬼': return 'gold'; // 鬼も金バッジとして扱う（見た目は赤色）
    }
  }, []);

  // バッジが輝くべきかどうかを判定（タイトル画面用）
  const shouldBadgeGlow = useCallback((difficulty: Difficulty): boolean => {
    return difficulty === 'むずかしい' || difficulty === '寮生専用' || difficulty === '鬼';
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

  // 「すべて」の寮生専用以上のバッジを取得しているかチェック（鬼モード解放条件）
  const hasAllDormitoriesAdvancedBadge = useCallback((): boolean => {
    return badges.some(badge => 
      badge.dormitory === 'すべて' && (badge.difficulty === '寮生専用' || badge.difficulty === '鬼')
    );
  }, [badges]);

  // 鬼モードが解放されているかチェック
  const isOniModeUnlocked = useCallback((): boolean => {
    return hasAllDormitoriesAdvancedBadge();
  }, [hasAllDormitoriesAdvancedBadge]);

  // 破損日誌へのアクセス権をチェック（寮生専用の金バッジを持っているか、または61人目の寮生名が保存されているか）
  const hasCorruptedDiaryAccess = useCallback((): boolean => {
    // 61人目の寮生名が保存されているかチェック
    try {
      const aiGivenName = localStorage.getItem('parerquiz-ai-given-name');
      if (aiGivenName) {
        return true; // 名前が保存されていればアクセス可能
      }
    } catch (error) {
      console.error('Failed to check AI given name:', error);
    }

    // 名前が保存されていない場合は、どの寮でも寮生専用以上のバッジを持っていればアクセス可能
    const hasAdvancedBadge = badges.some(badge => 
      badge.difficulty === '寮生専用' || badge.difficulty === '鬼'
    );
    return hasAdvancedBadge;
  }, [badges]);

  return {
    badges,
    isInitialized,
    earnBadge,
    reloadBadges,
    hasBadge,
    getBadgeForDormitory,
    getBadgeRarity,
    shouldBadgeGlow,
    resetAllBadges,
    hasAllDormitoriesAdvancedBadge,
    isOniModeUnlocked,
    hasCorruptedDiaryAccess
  };
};