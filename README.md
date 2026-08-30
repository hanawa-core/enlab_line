# エンラボ LINE ── 実装一式

STEP 05（LIFF登録）まで終わっている前提。ここから公開までの作業。

```
enlab-liff/                  ← GitHub Pages に置く（公開して問題ないファイルだけ）
  config.js                  ← ★ここだけ埋める
  routine/index.html         ← エンラボルーティン
  assessment/index.html      ← 初期テスト
supabase/functions/enlab/
  index.ts                   ← Edge Function（サーバ側。GitHubには置かない）
enlab_schema.sql             ← Supabase の SQL Editor に貼る
```

---

## 1. Supabase にスキーマを流す

SQL Editor で `enlab_schema.sql` を実行。Table Editor 左上のスキーマを
`public` → `enlab` に切り替えると、7テーブルが見えます。

## 2. Edge Function をデプロイする（ブラウザだけで完結します）

CLIは要りません。

**2-1. 環境変数を先に登録する**
Dashboard → Edge Functions → Secrets → Add new secret

| 変数名 | 値 |
|---|---|
| `LINE_LOGIN_CHANNEL_ID` | **LINEログインチャネル**のチャネルID（数字だけ） |
| `ALLOW_ORIGIN` | `https://hanawa-core.github.io` |

`SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY` は最初から入っているので設定不要です。

**2-2. 関数を作る**
1. 左メニュー **Edge Functions**
2. **Deploy a new function** → **Via Editor**
3. 関数名を `enlab` にする
4. エディタの中身を全部消して、`supabase/functions/enlab/index.ts` の中身を貼る
5. 下の **Deploy function** を押す（10〜30秒）

**2-3. URLを控える**
`https://xxxxxxxx.supabase.co/functions/v1/enlab`

> JWT検証はオンのままで構いません。フロントから anon キーを付けて呼ぶので、
> それで通ります。anon キーはブラウザに置く前提のキーで、RLSと revoke により
> これ単体では何も読めません。

## 3. config.js を埋める

```js
LIFF_ID_ROUTINE:    '1234567890-AbcdEfgh',
LIFF_ID_ASSESSMENT: '1234567890-IjklMnop',
API:  'https://xxxxxxxx.supabase.co/functions/v1/enlab',
ANON: 'eyJhbGci...',        // Settings → API の anon / publishable キー
MEMBER: { top:'...', care:'...', train:'...', read:'...' },
```

`config.js` はブラウザから読めます。**service_role キーは絶対に書かないこと。**
ここに置く値は、すべて見られても問題のないものだけです。

## 4. 動画URLを DB に入れる

会員サイトの各ページのURLを `enlab.test_items` に入れます。SQL Editor で：

```sql
update enlab.test_items set video_url = 'https://…' where item_group = 'iliopsoas';
update enlab.test_items set video_url = 'https://…' where item_group = 'calf';
update enlab.test_items set video_url = 'https://…' where item_group = 'hamstring';
update enlab.test_items set video_url = 'https://…' where item_group = 'adductor';
update enlab.test_items set video_url = 'https://…' where item_group = 'glute';
update enlab.test_items set video_url = 'https://…' where item_group = 'ohsq';
update enlab.test_items set video_url = 'https://…' where item_group = 'pushup';
update enlab.test_items set video_url = 'https://…' where item_group = 'rotary';
```

左右ある項目も `item_group` 単位で一括更新されます。
**YouTubeのURLではなく、会員サイトのページURL**を入れてください。

## 5. GitHub Pages に上げる

`enlab-liff/` の中身を、リポジトリのルートに置きます。

```
enlab-liff（リポジトリ）
  config.js
  routine/index.html
  assessment/index.html
```

Settings → Pages → Source を `main` / `root` に。
STEP 05 で登録したURLと一致します。

---

## 動作の仕組み

```
LIFF画面                Edge Function              Supabase
  │  idToken ─────────────→ │
  │                         │ ─ LINEに検証を依頼 ──→ api.line.me
  │                         │ ←─ sub（ユーザーID）──
  │                         │ ─ service_role で読み書き ──→ enlab スキーマ
  │ ←──────── JSON ─────────│
```

フロントは **idToken しか持ちません**。DBの鍵はサーバ側だけにあります。
全テーブル RLS 有効・ポリシーゼロなので、anon キーが漏れても何も読めません。

### API

| action | 返すもの |
|---|---|
| `record.get` | 連続日数・通算・今月の内訳・今日の記録 |
| `record.put` | 上と同じ（`type` は run / care / rest） |
| `test.items` | 測定項目マスタ |
| `test.get` | 最新回＋前回＋履歴（`assessmentId` 指定で任意の回） |
| `test.put` | 保存して `test.get` と同じ形を返す |

会員行（`members`）は、初回にどちらかのLIFFを開いた時点で自動的に作られます。
友だち追加のWebhookは無くても成立します。

---

## 確認すること

- [ ] ルーティンを押して、連続1日と返る
- [ ] もう一度押して、`daily_records` が2行にならない（同日はUPSERT）
- [ ] 日をまたいで、連続2日になる
- [ ] 初期テストを8項目通して、結果画面が出る
- [ ] 1項目を0点（痛み）にして、合計から除外される
- [ ] 「やり方を見る」で会員サイトが LINE 内で開く
- [ ] シェア画像が生成される
- [ ] 管理画面（`v_member_status`）に自分の行が出る

## 詰まりやすいところ

**401 が返る** … `config.js` の `ANON` が未設定か、
`LINE_LOGIN_CHANNEL_ID` がMessaging APIチャネルのIDになっている。
必要なのは **LINEログインチャネル**のチャネルIDです。

**CORS エラー** … `ALLOW_ORIGIN` が GitHub Pages のオリジンと一致していない。
`https://hanawa-core.github.io`（パスは付けない）。

**空白の画面** … `config.js` の LIFF ID が未設定。ブラウザのコンソールに
`liff.init` のエラーが出ます。

**テーブルが見つからない** … Table Editor のスキーマが `public` のまま。
`enlab` に切り替えてください。
