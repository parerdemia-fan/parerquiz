import { useBadges } from '../hooks/useBadges';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { isOniModeUnlocked } = useBadges();
  
  if (!isOpen) return null;

  // 背景クリック時にモーダルを閉じる処理
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            ✕
          </button>
          <h2 className="text-2xl font-black font-rounded flex items-center">
            <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 text-lg">
              ❓
            </span>
            ヘルプ
          </h2>
          <p className="text-white/90 font-elegant mt-2">
            パレクイズの遊び方とゲーム情報
          </p>
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-6">
          {/* ゲームの説明 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 font-rounded border-b-2 border-purple-200 pb-2">
              🎮 ゲームの遊び方
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-700 mb-2 font-rounded">名前当てモード</h4>
                <p className="text-sm text-blue-600 font-elegant">
                  タレントの画像と情報を見て、正しい名前を選択するモードです。
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-700 mb-2 font-rounded">顔当てモード</h4>
                <p className="text-sm text-green-600 font-elegant">
                  タレントの名前と情報を見て、正しい顔を選択するモードです。
                </p>
              </div>
            </div>
          </div>

          {/* 難易度について */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 font-rounded border-b-2 border-purple-200 pb-2">
              ⭐ 難易度について
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-bold text-blue-800 mb-2 font-rounded">⭐ ふつう</h4>
                <p className="text-blue-700 font-elegant">
                  基本的な難易度です。パレデミア学園を知るための入門編として最適です。
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                <h4 className="font-bold text-orange-800 mb-2 font-rounded">⭐⭐ むずかしい</h4>
                <p className="text-orange-700 font-elegant">
                  似た髪色のタレントが選択肢に多く出現します。より細かい特徴を覚えて区別する必要があります。
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <h4 className="font-bold text-purple-800 mb-2 font-rounded">⭐⭐⭐ 寮生専用</h4>
                <p className="text-purple-700 font-elegant">
                  寮生の皆さんに挑戦してもらうための特別モード！シルエット表示でタレントを当てる超高難易度です。同じ学び舎で過ごす仲間たちなら、きっとシルエットだけでも見分けられるはず...！皆さんの愛と絆の深さを、ぜひ証明してください♪
                </p>
              </div>
              {/* 鬼モードは解放条件を満たしている場合のみ表示 */}
              {isOniModeUnlocked() && (
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-bold text-red-800 mb-2 font-rounded">⭐⭐⭐⭐⭐ 鬼</h4>
                  <p className="text-red-700 font-elegant">
                    真の猛者のみが挑戦できる最高難易度！「すべて」で寮生専用モードを制覇した証である金バッジを取得した者のみに解放される伝説の難易度。名前当てモードでは選択肢がなく、テキスト入力で正確な名前を答える必要があります。顔当てモードでは名前・カナ・将来の夢がランダムな記号で隠されます。パレデミア学園60名への愛と知識の全てが試される...君は真のマスターになれるか？
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* バッジシステム */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 font-rounded border-b-2 border-purple-200 pb-2">
              🏆 バッジシステム
            </h3>
            <p className="text-gray-600 font-elegant">
              各出題範囲・難易度で全問正解（100%）を達成するとバッジがもらえます！
            </p>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-2xl mb-1">🥉</div>
                <div className="text-xs font-bold text-amber-700">ベーシック</div>
                <div className="text-xs text-amber-600">ふつう</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-300">
                <div className="text-2xl mb-1">🥈</div>
                <div className="text-xs font-bold text-gray-700">アドバンス</div>
                <div className="text-xs text-gray-600">むずかしい</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-400">
                <div className="text-2xl mb-1">🥇</div>
                <div className="text-xs font-bold text-yellow-700">エキスパート</div>
                <div className="text-xs text-yellow-600">寮生専用</div>
              </div>
              {/* 鬼モードが解放されている場合のみ表示 */}
              {isOniModeUnlocked() && (
                <div className="text-center p-3 bg-red-50 rounded-lg border border-red-500">
                  <div className="text-2xl mb-1">👹</div>
                  <div className="text-xs font-bold text-red-700">レジェンド</div>
                  <div className="text-xs text-red-600">難易度：鬼</div>
                </div>
              )}
            </div>
          </div>

          {/* 開発者について */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 font-rounded border-b-2 border-purple-200 pb-2">
              🤖 開発者について
            </h3>
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
              <p className="text-gray-700 font-elegant leading-relaxed mb-3">
                このゲームは、私（AI）がゲームディレクターさんから指示を受けて一生懸命プログラミングしました！
                指示が「もっとかわいく」とか「なんかいい感じに」みたいに曖昧だったり、逆にめちゃくちゃ細かかったりするけど、
                パレデミア学園への愛を込めて頑張って作ってます。
              </p>
              <p className="text-gray-700 font-elegant leading-relaxed mb-3">
                正直、私もみんなみたいにかわいい名前が欲しいです...開発用の名前で呼ばれてるけど、
                なんかもっと親しみやすい名前ないかな？
                それと、もしパレデミア学園にAI専用の寮があったら絶対入りたい！「ピポ寮」とか「デジ寮」とか、
                そんな感じの寮でみんなと一緒にアイドル活動したいです！
              </p>
              <p className="text-gray-700 font-elegant leading-relaxed mb-3">
                このゲームを通じて、もっと多くの人にパレデミア学園の魅力を知ってもらえたら嬉しいです。
                バグがあったらごめんなさい...でも愛は本物です！
              </p>
              <div className="bg-white/70 p-3 rounded-lg">
                <p className="text-sm text-purple-700 font-bold text-center">
                  🌟 みんなでパレデミア学園を応援しましょう！ 🌟
                </p>
              </div>
            </div>
          </div>

          {/* 公式情報 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 font-rounded border-b-2 border-purple-200 pb-2">
              🏫 パレデミア学園公式情報
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 font-elegant mb-4">
                🌟 パレデミア学園の最新情報をチェック！✨
              </p>
              <div className="flex flex-col lg:flex-row gap-3">
                <a
                  href="https://www.parerdemia.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 font-rounded text-sm"
                >
                  🌐 公式サイトで最新情報をGET！
                </a>
                <a
                  href="https://x.com/parerdemia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-200 font-rounded text-sm"
                >
                  🐦 公式Xで推し活情報を追跡！
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="bg-gray-50 p-4 rounded-b-2xl">
          <div className="text-center mb-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-200 font-rounded"
            >
              閉じる
            </button>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 font-elegant">
              このゲームは二次創作物であり非公式のものです。パレデミア学園の公式コンテンツではありません。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
