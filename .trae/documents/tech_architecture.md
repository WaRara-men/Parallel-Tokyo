# Nebula - Technical Architecture Document

## 1. 技術スタック

### Frontend
- **Framework:** React 18+ (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion (for smooth interactions and physics simulation)
- **State Management:** Zustand
- **Canvas Library:** Custom implementation using React + Framer Motion (or exploring `react-draggable` / `tldraw` stripped down). *MVPでは軽量化のため自前実装または軽量ライブラリを選定。*

### Backend & Database (BaaS)
- **Platform:** Supabase
- **Database:** PostgreSQL
- **Vector Search:** pgvector extension (for storing embeddings)
- **Auth:** Supabase Auth (Email/Password, Social Login)
- **Storage:** Supabase Storage (for user uploaded images)

### AI & LLM
- **Model:** OpenAI API (GPT-4o or GPT-3.5-turbo for text generation, text-embedding-3-small for embeddings)
- **Function:**
  - Embeddings generation for notes/images.
  - Clustering logic support.
  - Title generation for clusters.

## 2. データベース設計 (Schema)

### `items` table
キャンバス上のすべてのオブジェクト（メモ、画像、リンク）を格納。

| Column Name | Type | Description |
|---|---|---|
| `id` | uuid | Primary Key |
| `user_id` | uuid | Foreign Key to auth.users |
| `type` | text | 'text', 'image', 'link' |
| `content` | text | メモの内容、画像のURL、リンク先URL |
| `position_x` | float | キャンバス上のX座標 |
| `position_y` | float | キャンバス上のY座標 |
| `embedding` | vector(1536) | OpenAI Embeddings ベクトル |
| `cluster_id` | uuid | 所属するクラスターID (Optional) |
| `created_at` | timestamptz | 作成日時 |

### `clusters` table
AIによって生成されたグループ情報。

| Column Name | Type | Description |
|---|---|---|
| `id` | uuid | Primary Key |
| `user_id` | uuid | Foreign Key to auth.users |
| `title` | text | クラスターのタイトル（AI生成） |
| `centroid_x` | float | クラスターの中心X座標 |
| `centroid_y` | float | クラスターの中心Y座標 |
| `created_at` | timestamptz | 作成日時 |

## 3. データフロー (AI Auto-Grouping)

1. **Input:** ユーザーがアイテム（メモ等）を追加。
2. **Process (Real-time/Async):**
   - アプリがバックエンド経由（Edge Function）でOpenAI APIを呼び出し、テキストのEmbedding（ベクトル）を取得。
   - `items` テーブルの `embedding` カラムに保存。
3. **Action:** ユーザーが "Organize" ボタンをクリック。
4. **Analysis:**
   - Supabase Edge Function または クライアントサイドロジックで、アイテム間のコサイン類似度を計算。
   - クラスタリングアルゴリズム（K-Means または DBSCAN的なロジック）を実行。
5. **Update:**
   - 各アイテムの新しい `position_x`, `position_y` を計算し、DBを更新。
   - `clusters` テーブルに新しいグループを作成。
6. **Reflect:**
   - フロントエンドが変更を検知（Realtime Subscription）し、アイテムがアニメーションして新しい位置に移動。

## 4. セキュリティ (RLS)
- SupabaseのRow Level Security (RLS) を有効化。
- ユーザーは自分自身のデータ（`user_id = auth.uid()`）のみ読み書き可能にする。
