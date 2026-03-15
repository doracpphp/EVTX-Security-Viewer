# EVTX Security Viewer

Windowsイベントログ（`.evtx`）をブラウザ上で解析・可視化するツールです。
バックエンド不要で、EVTXファイルをドロップするだけでセキュリティイベントを確認できます。

## 特徴

- **ブラウザのみで完結** — サーバー不要。ファイルはローカルで処理され外部に送信されません
- **Web Worker による非同期パース** — UIをブロックせずバックグラウンドで解析し、結果をリアルタイムにストリーミング表示
- **仮想スクロール** — 数万件のイベントでもDOM負荷なく高速に描画
- **3段階ナビゲーション** — カテゴリ → サブカテゴリ → イベントID の階層で絞り込み（Windows Security Auditingの公式分類に準拠）
- **ログオン失敗の可視化** — イベント4625についてターゲットユーザー・IPアドレス別の円グラフを表示
- **日本語 / 英語切り替え** — ナビゲーション・詳細ダイアログのラベルとステータスコードの説明を切り替え可能
- **イベント詳細の自動変換** — LogonType・FailureReason・Status・SubStatus を人間が読める文字列で表示

## ナビゲーション構造

Windows Security Auditingの公式カテゴリに従い、3段のタブで絞り込みます。

| カテゴリ | 主なサブカテゴリ例 |
|---------|-----------------|
| システム | セキュリティ システムの拡張 / システムの整合性 / IPsec ドライバー |
| ログオン/ログオフ | ログオン / ログオフ / アカウント ロックアウト / 特殊なログオン |
| オブジェクト アクセス | ファイル システム / レジストリ / ファイルの共有 / 証明書サービス |
| 特権の使用 | 重要な特権の使用 / 重要でない特権の使用 |
| 詳細追跡 | プロセス作成 / プロセス終了 / DPAPI アクティビティ |
| ポリシーの変更 | ポリシーの変更の監査 / MPSSVC ルールレベル ポリシーの変更 |
| アカウント管理 | ユーザー アカウント管理 / セキュリティ グループ管理 |
| DS アクセス | ディレクトリ サービス アクセス / ディレクトリ サービスの変更 |
| アカウント ログオン | Kerberos サービス チケット操作 / Kerberos 認証サービス |
| その他 | イベント ログ（1100 / 1102 / 1104 など） |


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
3. カテゴリタブ → サブカテゴリタブ → イベントIDタブの順に選択して絞り込み
4. **ログオン失敗**（4625）選択時は、ターゲットユーザー別・IPアドレス別の円グラフを表示
   - 「グラフを隠す/表示」ボタンでグラフの表示切り替えが可能
5. 行をクリックするとイベント詳細モーダルを表示（システム情報・イベントデータ・RAW JSONを確認可能）
6. ヘッダーの **EN / 日本語** ボタンで表示言語を切り替え
7. 「別のファイルを開く」ボタンで別のEVTXファイルに切り替え

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
│   ├── eventDefinitions.ts          # LogonType・FailureReason・Status変換ラベル
│   ├── securityCategories.ts        # カテゴリ/サブカテゴリ/イベントID定義（日英）
│   ├── sidClassifier.ts             # SIDベースのシステムユーザー判定
│   └── fileDataSource.ts            # File → winevtx DataSource アダプター
├── workers/
│   └── evtxParser.worker.ts         # Web Worker：EVTXパース処理
└── components/
    ├── FileUpload.tsx                # ドラッグ&ドロップ アップロード
    ├── ParseProgress.tsx             # プログレスバー
    ├── SecurityNav.tsx               # 3段階ナビゲーション（カテゴリ/サブカテゴリ/イベントID）
    ├── EventTable.tsx                # 仮想スクロールテーブル
    ├── EventDetail.tsx               # イベント詳細モーダル（フィールド自動変換付き）
    ├── FailureChart.tsx              # ログオン失敗グラフ（ユーザー + IP）
    └── PieChartCard.tsx              # 汎用円グラフカード
```
