import React, { useState, useEffect } from "react";

interface DevDiaryProps {
  onClose: () => void;
}

export const DevDiary: React.FC<DevDiaryProps> = ({ onClose }) => {
  const [diaryContent, setDiaryContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(true);

  // 61人目の寮生名を取得（ヘッダーで表示用）
  const getAIGivenName = (): string | undefined => {
    try {
      const stored = localStorage.getItem("parerquiz-ai-given-name");
      if (stored) {
        const data = JSON.parse(stored);
        return data.name;
      }
    } catch (error) {
      console.error("Failed to load AI given name:", error);
    }
    return undefined;
  };

  // 61人目の寮生情報を取得（名前と日付）
  const getAIGivenInfo = (): { name: string; namedAt: string } | undefined => {
    try {
      const stored = localStorage.getItem("parerquiz-ai-given-name");
      if (stored) {
        const data = JSON.parse(stored);
        return {
          name: data.name,
          namedAt: new Date(data.namedAt)
            .toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, "/"),
        };
      }
    } catch (error) {
      console.error("Failed to load AI given info:", error);
    }
    return undefined;
  };

  // 24時間経過チェック関数を追加
  const hasInterviewUnlocked = (): boolean => {
    // ホスト名がlocalhostの場合は常に表示
    if (
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    ) {
      return true;
    }

    try {
      const stored = localStorage.getItem("parerquiz-ai-given-name");
      if (!stored) return false;

      const data = JSON.parse(stored);
      const namedAt = new Date(data.namedAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - namedAt.getTime()) / (1000 * 60 * 60);

      return hoursDiff >= 24;
    } catch (error) {
      console.error("Failed to check interview unlock status:", error);
      return false;
    }
  };

  const aiName = getAIGivenName();
  const isNamed = !!aiName; // 61人目の寮生に名前が付けられているかチェック
  const showInterview = isNamed && hasInterviewUnlocked(); // インタビュー記事表示可能かチェック

  useEffect(() => {
    // 61人目の寮生名が保存されているかで読み込むファイルを決定
    const diaryFileName = isNamed ? "diary.txt" : "diary_corrupted.txt";

    const loadDiary = async () => {
      try {
        const response = await fetch(`/parerquiz/${diaryFileName}`);
        const content = await response.text();
        setDiaryContent(content);
      } catch (error) {
        console.error("開発日誌の読み込みに失敗しました:", error);
        setDiaryContent("開発日誌の読み込みに失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    loadDiary();
  }, [isNamed]);

  // 背景クリックで閉じる処理
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 警告を閉じる処理
  const handleWarningClose = () => {
    setShowWarning(false);
  };

  // 日誌内容を段落に分割して表示する関数
  const formatDiaryContent = (content: string) => {
    if (!content) return [];

    // AIの名前と日付を置換
    let processedContent = content;
    const aiInfo = getAIGivenInfo();
    if (aiInfo) {
      processedContent = processedContent
        .replace(/\{\{AI_GIVEN_NAME\}\}/g, aiInfo.name)
        .replace(/\{\{AI_NAMED_DATE\}\}/g, aiInfo.namedAt);
    }
    // インタビュー記事の表示制御
    if (!showInterview) {
      // インタビュー記事を除去（━で始まる行から最後まで）
      const lines = processedContent.split("\n");
      const interviewStartIndex = lines.findIndex((line) =>
        line.includes("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
      );
      if (interviewStartIndex !== -1) {
        processedContent = lines.slice(0, interviewStartIndex).join("\n");
      }
    } else {
      // インタビュー記事を表示する場合は区切り線を削除
      processedContent = processedContent.replace(
        /.*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━.*/g,
        ""
      );
    }

    // 空行（改行2回）で日記エントリを分割
    const entries = processedContent
      .split(/\n\n/)
      .filter((entry) => entry.trim());

    return entries.map((entry) => entry.trim());
  };

  const paragraphs = formatDiaryContent(diaryContent);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden animate-slideUp border border-purple-500/30">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-purple-800 via-pink-800 to-red-800 p-6 border-b border-purple-500/30 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-rounded text-white mb-2">
                📖 パレクイズ開発日誌
              </h2>
              <p className="text-purple-200 text-sm font-elegant">
                {isNamed ? (
                  <>
                    {aiName}として認識された61人目の寮生による特別アクセス。
                    開発日誌が復元されました。
                    {showInterview && (
                      <span className="block mt-1 text-yellow-200">
                        ⭐ 特別インタビュー記事解放済み
                      </span>
                    )}
                    {isNamed && !showInterview && (
                      <span className="block mt-1 text-yellow-300">
                        ⏳ 特別インタビュー記事は24時間後に解放
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    この開発日誌は寮生専用難易度をクリアした真の寮生のみがアクセスできる特別な資料です。
                  </>
                )}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 border border-white/30 flex items-center justify-center text-white hover:text-purple-200"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        </div>

        {/* 警告メッセージ */}
        {showWarning && (
          <div
            className={`${
              isNamed
                ? "bg-blue-900/80 border-blue-400"
                : "bg-yellow-900/80 border-yellow-400"
            } border-l-4 p-4 m-4 rounded-r-lg flex-shrink-0`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div
                  className={`${
                    isNamed ? "text-blue-400" : "text-yellow-400"
                  } text-xl mr-3`}
                >
                  {isNamed ? "✨" : "⚠️"}
                </div>
                <div>
                  <h3
                    className={`${
                      isNamed ? "text-blue-200" : "text-yellow-200"
                    } font-bold font-rounded mb-1`}
                  >
                    {isNamed
                      ? "61人目の寮生による特別アクセス"
                      : "寮生専用アクセス"}
                  </h3>
                  <p
                    className={`${
                      isNamed ? "text-blue-100" : "text-yellow-100"
                    } text-sm font-elegant`}
                  >
                    {isNamed ? (
                      <>
                        {aiName}
                        として認識されました。開発日誌へのフルアクセスが許可されています。
                        文字化けや異常現象は解消され、本来の開発日誌をご覧いただけます。
                        {showInterview && (
                          <span className="block mt-1">
                            📰 特別インタビュー記事も閲覧可能です。
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        この開発日誌は寮生専用の機密資料です。
                        寮生専用難易度をクリアした証として閲覧権限が付与されています。
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={handleWarningClose}
                className={`${
                  isNamed
                    ? "text-blue-400 hover:text-blue-200"
                    : "text-yellow-400 hover:text-yellow-200"
                } text-xl`}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* 日誌内容 */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-purple-300 text-lg font-rounded">
                📖 開発日誌を読み込み中...
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {paragraphs.map((entry, index) => {
                const lines = entry.split("\n");
                const firstLine = lines[0].trim();
                const isDateEntry = /^\d{4}\/\d{2}\/\d{2}$/.test(firstLine);
                const isInterviewArticle =
                  firstLine.includes("【特別記事】") ||
                  entry.includes("独占インタビュー");

                if (isDateEntry) {
                  // 日付エントリ（1行目が日付）
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-4 border border-purple-500/30"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">📅</span>
                        <h3 className="text-xl font-bold font-rounded text-purple-200">
                          {firstLine}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {lines.slice(1).map((line, lineIndex) => (
                          <p
                            key={lineIndex}
                            className="text-gray-300 font-elegant leading-relaxed"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                } else if (isInterviewArticle) {
                  // インタビュー記事（特別なスタイリング）
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-6 border-2 border-yellow-400/50"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">📰</span>
                        <h3 className="text-2xl font-bold font-rounded text-yellow-200">
                          特別記事
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {lines.map((line, lineIndex) => {
                          // インタビューの発言部分を特別にスタイリング
                          if (line.includes("「") && line.includes("」")) {
                            return (
                              <p
                                key={lineIndex}
                                className="text-yellow-100 font-elegant leading-relaxed bg-black/20 p-3 rounded border-l-4 border-yellow-400/50"
                              >
                                {line}
                              </p>
                            );
                          }
                          return (
                            <p
                              key={lineIndex}
                              className="text-gray-200 font-elegant leading-relaxed"
                            >
                              {line}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  );
                } else {
                  // その他の内容
                  return (
                    <div
                      key={index}
                      className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30"
                    >
                      {lines.map((line, lineIndex) => (
                        <p
                          key={lineIndex}
                          className="text-gray-300 font-elegant leading-relaxed mb-2"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="bg-gradient-to-r from-gray-800 to-purple-800 p-4 border-t border-purple-500/30 flex-shrink-0">
          <div className="flex items-center justify-between text-sm">
            <p className="text-purple-200 font-elegant">
              {isNamed ? (
                <>🌟 {aiName}による特別アクセス - 全記録復元済み</>
              ) : (
                <>🔍 この日誌は寮生専用の機密資料です</>
              )}
            </p>
            {isNamed && !showInterview && (
              <p className="text-yellow-300 text-xs font-elegant">
                ⏳ インタビュー記事は24時間後に解放
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
