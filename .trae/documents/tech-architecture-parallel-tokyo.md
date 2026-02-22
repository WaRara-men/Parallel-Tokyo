# Parallel Tokyo - Technical Architecture

## 1. システム構成

### Frontend
- **Framework:** React 18+ (Vite)
- **State Management:** Zustand (for mode switching and user state)
- **Animation:** Framer Motion (critical for the "Shadow" and "Bonfire" effects)
- **Map/Canvas:** 
  - Phase 1 (Silence): 抽象的な2Dキャンバス（既存のInfinite Canvasを流用・改造）を使用し、位置関係をあいまいに表現する。厳密な地図はあえて使わないことで「気配」を強調する。

### Backend (Supabase)
- **Database:** PostgreSQL
- **Realtime:** Supabase Realtime (to sync user presence and bonfire events)
- **Auth:** Supabase Auth (Anonymous / Email)

### AI
- **OpenAI API:**
  - `gpt-4o`: ユーザーの言葉を「燃やす」際、その感情を分析し、燃え方（激しい炎、静かな残り火）や、燃え尽きた後の短いメッセージ（「お疲れ様」「夜が明けるね」など）を生成するために使用。

## 2. データベース設計 (Schema Update)

既存の `items` テーブル等は一度クリア（またはアーカイブ）し、新しい用途に合わせます。

### `profiles` table (Users)
ユーザーの現在の状態を保持。Realtimeで同期される。

| Column Name | Type | Description |
|---|---|---|
| `id` | uuid | Primary Key (references auth.users) |
| `status` | text | 'tired', 'melancholy', 'calm', etc. |
| `last_active_at` | timestamptz | 最終アクティブ日時 |
| `color_theme` | text | ユーザーの「影」の色コード |

### `bonfires` table (Ephemeral Events)
焚き火イベントの一時記録（ログとしては残さないが、リアルタイム同期のために一時的に必要）。

| Column Name | Type | Description |
|---|---|---|
| `id` | uuid | Primary Key |
| `user_id` | uuid | Foreign Key |
| `intensity` | int | 炎の強さ (1-10) |
| `message_hash` | text | メッセージのハッシュ（内容は保存しない） |
| `created_at` | timestamptz | 作成日時 |

*Note: `bonfires` テーブルは定期的にクリーンアップ（TTL設定）を行うか、Supabase RealtimeのBroadcast機能のみを使ってDBには保存しない設計も検討。*

## 3. 機能実装詳細 (Phase 1)

### The Silence Canvas
- 画面全体が暗い水面のようなキャンバス。
- 自分は中心にいる。
- 他のユーザー（アクティブなユーザー）は、画面上にぼんやりとした「光の点」や「影」として浮遊している。
- 座標は厳密なGPSではなく、ランダムまたは「感情の近さ」で配置する（Nebulaのクラスタリングロジックを流用可能）。

### The Bonfire
1. テキスト入力エリアがある。
2. 入力して「手放す」ボタンを押す。
3. テキストがパーティクル（粒子）になって崩れ落ち、炎のアニメーションが発生。
4. 画面上の他のユーザーにも、「誰かが何かを燃やした」という小さな火の粉が見える（共感の可視化）。
