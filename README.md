# EVTX Security Viewer

Windowsイベントログ（`.evtx`）をブラウザ上で解析・可視化するツールです。
バックエンド不要で、EVTXファイルをドロップするだけでセキュリティイベントを確認できます。

## 特徴

- **ブラウザのみで完結** — サーバー不要。ファイルはローカルで処理され外部に送信されません
- **Web Worker による非同期パース** — UIをブロックせずバックグラウンドで解析し、結果をリアルタイムにストリーミング表示
- **仮想スクロール** — 数万件のイベントでもDOM負荷なく高速に描画
- **イベントID別タブ** — セキュリティ上重要な14種のイベントIDで即座に絞り込み
- **ログオン失敗の可視化** — イベント4625についてターゲットユーザー・IPアドレス別の円グラフを表示

## 対応イベントID

| タブ | EventID | 説明 |
|------|---------|------|
| ログオン成功 | 4624 | An account was successfully logged on |
| ログオン失敗 | 4625 | An account failed to log on |
| ログオフ | 4634 | An account was logged off |
| 明示的ログオン | 4648 | A logon was attempted using explicit credentials |
| 特権割り当て | 4672 | Special privileges assigned to new logon |
| プロセス作成 | 4688 | A new process has been created |
| タスク作成 | 4698 | A scheduled task was created |
| アカウント作成 | 4720 | A user account was created |
| パスワードリセット | 4724 | An attempt was made to reset an account's password |
| アカウントロック | 4740 | A user account was locked out |
| 資格情報検証 | 4776 | The computer attempted to validate credentials |
| サービス追加 | 7045 | A new service was installed in the system |

## 使い方

### 開発サーバー起動

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開き、EVTXファイルをドロップしてください。

### ビルド

```bash
npm run build
```

`dist/` ディレクトリに静的ファイルが生成されます。任意のWebサーバーやローカルファイルとして提供できます。

## 操作方法

1. EVTXファイルをドロップエリアにドラッグ＆ドロップ（またはクリックして選択）
2. プログレスバーで解析の進捗を確認（結果はリアルタイムで表示）
3. タブをクリックしてイベントIDで絞り込み
4. **ログオン失敗** タブでは、ターゲットユーザー別・IPアドレス別の円グラフを表示
   - 「グラフを隠す/表示」ボタンでグラフの表示切り替えが可能
5. 行をクリックするとイベント詳細モーダルを表示（EventData・RAW JSONを確認可能）
6. 「別のファイルを開く」ボタンで別のEVTXファイルに切り替え

## 技術スタック

| 用途 | ライブラリ |
|------|-----------|
| UIフレームワーク | React 19 + TypeScript |
| ビルドツール | Vite 7 |
| EVTXパース | [winevtx](https://www.npmjs.com/package/winevtx) |
| 仮想スクロール | [@tanstack/react-virtual](https://tanstack.com/virtual) |
| グラフ | [Recharts](https://recharts.org/) |
| Bufferポリフィル | [buffer](https://www.npmjs.com/package/buffer) |

## ファイル構成

```
src/
├── types/events.ts                  # TypeScript型定義
├── utils/
│   ├── eventDefinitions.ts          # イベントIDメタデータ・LogonTypeラベル
│   └── fileDataSource.ts            # File → winevtx DataSource アダプター
├── workers/
│   └── evtxParser.worker.ts         # Web Worker：EVTXパース処理
└── components/
    ├── FileUpload.tsx                # ドラッグ&ドロップ アップロード
    ├── ParseProgress.tsx             # プログレスバー
    ├── EventTabs.tsx                 # タブナビゲーション
    ├── EventTable.tsx                # 仮想スクロールテーブル
    ├── EventDetail.tsx               # イベント詳細モーダル
    ├── FailureChart.tsx              # ログオン失敗グラフ（ユーザー + IP）
    └── PieChartCard.tsx              # 汎用円グラフカード
```
