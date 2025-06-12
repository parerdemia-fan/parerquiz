import type { GameSettings, Talent } from '../types';
import { useEffect } from 'react';

export const useImagePreloader = (
  settings: GameSettings | null,
  talents: Talent[]
) => {
  useEffect(() => {
    if (!settings || talents.length === 0) return;

    const preloadImages = () => {
      // 出題範囲に基づくタレント絞り込み
      const filteredTalents = settings.dormitory === 'すべて' 
        ? talents 
        : talents.filter(talent => {
            const dormitoryMap: Record<string, string> = {
              'バゥ寮': 'バゥ',
              'ミュゥ寮': 'ミュゥ',
              'クゥ寮': 'クゥ',
              'ウィニー寮': 'ウィニー'
            };
            return talent.dormitory === dormitoryMap[settings.dormitory];
          });

      // プリロードする画像URLのセット
      const imageUrls = new Set<string>();

      // ゲームモードと難易度に基づく画像選択
      filteredTalents.forEach(talent => {
        if (settings.gameMode === 'name') {
          // 名前当てモード
          if (settings.difficulty === '寮生専用') {
            // 寮生専用モード：ポートレート画像（シルエット用）
            imageUrls.add(`/parerquiz/assets/images/portrait/${talent.studentId}.webp`);
          } else {
            // 通常モード：OGP画像
            imageUrls.add(`/parerquiz/assets/images/ogp/${talent.studentId}.png`);
          }
          // 選択肢用のポートレート画像（回答後表示用）
          imageUrls.add(`/parerquiz/assets/images/portrait/${talent.studentId}.webp`);
        } else {
          // 顔当てモード：ポートレート画像
          imageUrls.add(`/parerquiz/assets/images/portrait/${talent.studentId}.webp`);
        }
      });

      // 画像を非同期でプリロード
      const preloadPromises = Array.from(imageUrls).map(url => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => {
            console.warn(`Failed to preload image: ${url}`);
            resolve(); // エラーでも続行
          };
          img.src = url;
        });
      });

      // 全画像のプリロードを並行実行
      Promise.all(preloadPromises).then(() => {
        console.log(`Preloaded ${imageUrls.size} images for game settings:`, {
          dormitory: settings.dormitory,
          gameMode: settings.gameMode,
          difficulty: settings.difficulty
        });
      });
    };

    // 少し遅延を入れて実行（UIの初期化を優先）
    const timeoutId = setTimeout(preloadImages, 100);
    
    return () => clearTimeout(timeoutId);
  }, [settings, talents]);
};
