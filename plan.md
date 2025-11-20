### 補完・修正した設計書 (code-plan.md)

```markdown
# プロジェクト名: Collaborative SCP Report Game (SCP大喜利)

## 1. 概要
Node.js (Socket.io) と Next.js を使用した、共同でSCP報告書を作成する、即興文作成ゲーム。
ユーザーがルームに入り、４人集まればゲーム開始できる。
それぞれユーザーが自選のお題５つを提出。
その後、全てのお題を集めてシャッフルしてプレイヤーに配り直す。
次に、各プレイヤーにお題の縛りカードを配る。
お題の縛りには、全体に公開される情報と、受け取った人のみ参照できる情報がある。
お題の縛りを踏まえ、各プレイヤーはお題５つのうち３つを選択し、その内容を提示する。
その後、報告書の分担作成フェーズに移る。
選んだお題とお題の縛りをそれぞれ次のプレイヤーに渡し、受け取ったプレイヤーは、その情報に基づいてSCP報告書の一部分を作成する。（制限時間あり）
記載できたら、お題とお題の縛り、記載したSCP報告書の一部分の組を更に次のプレイヤーに渡す。
更にもう一度、この流れを繰り返す。
この次にお題とお題の縛り、SCP報告書の一部分を最後のプレイヤー（お題のもとの持ち主）にわたす。
最後のプレイヤーは、お題、お題の縛りの非公開情報も参照しながら、SCP報告書の最後の部分を記載し、報告書を完成させる。
ここまで完成したら、講評フェーズに移る。
報告書の内容や非公開だったお題の縛りも全体に公開し、時間制限なくお互いに自身の報告書の内容を説明し、紹介する。
紹介が終われば、採点フェーズに移る。
採点フェーズでは、どの作品が最も良かったか投票し、同時に、裏の条件が達成されているかどうかのマルバツをつける。
採点が完了したら、順位点、裏の条件点も踏まえて、１位が決定、表示される。
その後、ゲーム終了を選んだら、最初の画面に戻り、ゲームのログ（参加プレイヤー、作成された報告書、お題、お題の縛り、獲得点数）を記録し、閲覧できるようにする。

## 2. 技術スタック
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, Socket.io
- **Data:** オンメモリ管理 (GameManagerクラスで状態保持)

## 3. ゲーム進行フロー (Phase Enum)
サーバーの `gameState.phase` で管理する定義。

| Phase Key | 日本語名 | 処理概要 |
| :--- | :--- | :--- |
| `LOBBY` | 待機 | 参加者待ち（4人推奨）。Hostが開始。 |
| `SUGGESTION` | お題提出 | 各自5つのお題(Keyword)を入力。完了後、全シャッフル＆再配布。 |
| `CHOICE` | お題・縛り選択 | 配られた5つのお題から3つ選択 + サーバーから縛り(Constraint)付与。 |
| `SCRIPTING_1` | 執筆1: プロトコル | **[Rot 1]** 次の人が「収容プロトコル」を書く。 |
| `SCRIPTING_2` | 執筆2: 説明(前) | **[Rot 2]** さらに次の人が「説明（前半）」を書く。 |
| `SCRIPTING_3` | 執筆3: 説明(後) | **[Rot 3]** さらに次の人が「説明（後半）」を書く。 |
| `SCRIPTING_4` | 執筆4: まとめ | **[Rot 0]** オーナー（最初の人）に戻る。「名前」と「まとめ」を書く。 |
| `PRESENTATION`| 講評 | 1作品ずつ、全員の画面に表示してオーナーが読み上げ/解説。 |
| `VOTING` | 投票・採点 | 「最優秀賞投票」と「裏条件(Hidden Constraint)達成判定」を行う。 |
| `RESULT` | 結果発表 | 順位発表。ログ保存。 |

---

## 4. データ構造詳細 (Types Definitions)

ここが最重要です。レポートがリレーされる構造を定義します。

### 4.1 基本エンティティ

```typescript
// ユーザー情報
interface User {
  id: string;       // Socket ID
  name: string;     // ユーザー名
  isHost: boolean;  // ホスト権限
  score: number;    // 最終獲得スコア
  avatar?: string;  // アイコン（あれば）
}

// お題の縛り（表の顔と裏の顔）
interface Constraint {
  id: string;
  publicDescription: string; // 全員に公開される条件 (例: 「水に関連するオブジェクト」)
  hiddenDescription: string; // 受け取った人(と最後のオーナー)だけの秘密 (例: 「実はトマトである」)
}

// 作成される1つのSCP報告書
interface Report {
  id: string;
  ownerId: string;      // この報告書の「起案者」（最初にお題を決めた人・最後にまとめる人）
  
  // お題フェーズで決まるもの
  selectedKeywords: string[]; // 選ばれた3つのお題
  constraint: Constraint;     // 付与された縛り
  
  // 執筆フェーズで埋まっていく内容
  title: string;                // [SCRIPTING_4] でオーナーが決定
  containmentProcedures: string; // [SCRIPTING_1] で執筆
  descriptionEarly: string;     // [SCRIPTING_2] で執筆
  descriptionLate: string;      // [SCRIPTING_3] で執筆
  conclusion: string;           // [SCRIPTING_4] でオーナーが執筆
  
  // 誰がどこを書いたかの記録（履歴用）
  authors: {
    procedures: string; // userId
    descEarly: string;
    descLate: string;
  };
}
```

### 4.2 サーバーの状態管理 (GameState)

```typescript
interface GameState {
  phase: 'LOBBY' | 'SUGGESTION' | 'CHOICE' | 'SCRIPTING_1' | 'SCRIPTING_2' | 'SCRIPTING_3' | 'SCRIPTING_4' | 'PRESENTATION' | 'VOTING' | 'RESULT';
  
  users: User[];
  
  // ロジック用データ
  keywordsPool: string[];       // [SUGGESTION] 全員から集めたお題のプール
  reports: Report[];            // 進行中の全レポート（プレイヤー人数分ある）
  
  // 進行管理
  timer: {
    remaining: number;  // 秒数
    isActive: boolean;  // カウントダウン中かどうか
    isBlinking: boolean;// 時間切れ後の点滅状態
  };
  
  // 完了フラグ（全員が書き終わったか）
  readyStates: { [userId: string]: boolean };
  
  // 投票結果
  votes: {
    bestReportVotes: { [targetReportId: string]: number }; // 誰に何票入ったか
    constraintChecks: { [reportId: string]: { [voterId: string]: boolean } }; // 裏条件達成のマルバツ
  };
}
```

## 5. 詳細ロジック要件 (Agentへの指示用)

### 5.1 リレー（たらい回し）のロジック
執筆フェーズでは、`users` 配列のインデックスを使って「誰がどのレポートを書くか」を決定する。
ユーザーが4人（Index: 0, 1, 2, 3）の場合：

- **Report[0] (オーナー: User 0)**
    - SCRIPTING_1 (Procedures): User 1 が執筆
    - SCRIPTING_2 (Desc Early): User 2 が執筆
    - SCRIPTING_3 (Desc Late) : User 3 が執筆
    - SCRIPTING_4 (Conclusion): User 0 が執筆 (戻ってくる)

※実装時は `(ownerIndex + currentPhaseOffset) % userCount` の計算式で担当者を割り出すこと。

### 5.2 縛り（Constraint）の表示制御
- **CHOICE & SCRIPTING_4 フェーズ:**
    - オーナー画面: `publicDescription` と `hiddenDescription` **両方**を表示。
- **SCRIPTING_1 ~ 3 フェーズ:**
    - 執筆担当者画面: `publicDescription` のみ表示？ それとも `hidden` も渡す？
    - **仕様確認:** 文脈上「縛りを踏まえて書く」必要があるため、執筆担当者には `hiddenDescription` も表示する必要がある。（ただし、担当していない他のプレイヤーには見せない）
- **PRESENTATION フェーズ:**
    - 全員に `publicDescription` と `hiddenDescription` を公開。

### 5.3 タイマーと進行
- サーバー側で `setInterval` を回し、1秒ごとに時間を減らす。
- 0になったら `isBlinking = true` にし、クライアント側で赤文字点滅などの演出を行う。
- 自動では次のフェーズに行かない。Hostユーザーが「次へ」ボタンを押したときに `changePhase` イベントを発火させる。

### 5.4 得点計算 (Score)
- **最優秀賞:** 1票につき +10点。
- **裏条件達成:**
    - 全員からのマルバツ判定で、過半数が「マル」なら達成とみなす。
    - 達成時: オーナーに +20点。
    - 執筆協力者（リレーした3人）にも +5点（協力ボーナス）。