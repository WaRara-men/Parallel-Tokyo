# Parallel Tokyo (パラレル・トーキョー) - Product Requirements Document

## 1. プロダクト概要
**プロダクト名:** Parallel Tokyo
**コンセプト:** 「今の気分に合わせて、東京のレイヤー（並行世界）を切り替える」
**キャッチコピー:** 孤独も、狂気も、この街の一部だ。

Parallel Tokyoは、都市生活者の精神状態に合わせて2つの異なる「東京」を提供するモバイルWebアプリケーションです。
既存の地図アプリやSNSとは異なり、「情報の正確さ」ではなく「感情の共有」と「物語の体験」を重視します。

## 2. ターゲットユーザー & ペルソナ
**ターゲット:**
- 東京（または都市部）で生活する、20〜30代のデジタルネイティブ。
- 精神的な疲れを感じているが、完全に孤独になるのは怖い人。
- 退屈な日常に刺激や「非日常感」を求めている人。

**ペルソナ:**
- **名前:** ケイ (26歳)
- **職業:** IT企業のデザイナー
- **平日夜:** 仕事で疲れ果て、誰とも話したくないが、独りぼっちは寂しい。「誰かと同じ時間を共有している」感覚だけが欲しい。（→ Layer A: Silence）
- **休日:** 予定がなく退屈。いつもの散歩道がつまらない。何か面白いことが起きないかと期待している。（→ Layer B: Chaos）

## 3. コア機能要件 (Phase 1: Silence Layer)

### 3.1 Layer A: Silence (静寂の東京)
**目的:** マイナスの感情をゼロに戻す。癒やしと緩やかな繋がり。

*   **Shadow Presence (影の気配):**
    *   地図（または抽象的な空間）上に、自分と他ユーザーの現在地を「影」や「灯り」として表示。
    *   具体的なアイコンや名前は出さない。
    *   ユーザーの状態（「疲れた」「眠れない」）によって、影の色や揺らぎ方が変化する。
*   **Bonfire (焚き火):**
    *   ユーザーが吐き出したい言葉（愚痴、悩み）を入力すると、AIがそれを薪として認識。
    *   画面上で言葉が燃え上がり、光と音（パチパチという音）に変わって消えていく。
    *   履歴には残らない。完全に「成仏」させる体験。

### 3.2 共通基盤
*   **Mode Switcher:**
    *   ワンタップで世界（Silence / Chaos）を切り替えるUI。（Phase 1ではSilenceのみ実装し、ChaosはComing Soonとする）
*   **Authentication:**
    *   Supabase Authを利用した匿名性の高いログイン。

## 4. 将来的な機能 (Phase 2: Chaos Layer)

### 4.1 Layer B: Chaos (混沌の東京)
**目的:** ゼロの感情をプラスにする。エンタメと刺激。

*   **Urban Legends (都市伝説生成):**
    *   GPS位置情報に基づき、その場所の「架空の都市伝説」をAIが生成・ナレーション。
*   **Glitch AR (現実バグ):**
    *   カメラを通すと風景が歪み、異界のように見えるフィルタ。

## 5. 技術スタック
*   **Frontend:** React (Vite), Tailwind CSS, Framer Motion
*   **Backend:** Supabase (DB, Auth, Realtime)
*   **AI:** OpenAI API (GPT-4o for text generation, DALL-E 3 for abstract art generation potentially)
*   **Map:** Leaflet or Mapbox (or simple canvas for abstract representation in Phase 1)

## 6. デザイン原則
*   **Ambient:** ユーザーの生活を邪魔しない。通知は最小限。
*   **Anonymous:** 相互監視の疲れを排除するため、プロフィールやフォロワー数は存在しない。
*   **Ephemeral:** 感情も言葉も、一過性のものとして扱う。ログを残さない美学。
