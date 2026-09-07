/* ============================================================================
   Endurance Lab ── LIFF 共通設定
   このファイルはブラウザから読めます。秘密の値は絶対に書かないこと。
   （service_role / sb_secret_ で始まるキーは、ここには置きません）
   ============================================================================ */

window.ENLAB = {

  // LINEログインチャネル → LIFF タブ
  LIFF_ID_ROUTINE:    '2011330570-2bgyt8cs',   // エンラボルーティン
  LIFF_ID_ASSESSMENT: '2011330570-1tyqyzfb',   // 初期テスト

  // Supabase Edge Function
  API: 'https://lzlizdcrgarojpmrdbrj.supabase.co/functions/v1/enlab',

  // Supabase の anon / publishable キー（ブラウザに置く前提のキー）
  ANON: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bGl6ZGNyZ2Fyb2pwbXJkYnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5ODk4MDUsImV4cCI6MjEwMzU2NTgwNX0.81Sx8pwCx6SVG-f9xxZqM0MWa1EVHDQKPV85_jeOHsE',

  // 初期テストの結果画面から飛ぶ、会員サイトの導線
  // 空にしておくと top に飛びます。あとで埋めれば十分です。
  MEMBER: {
    top:   'https://coredesign-tr.com/sp/gbK5lXHr/DczvjqO9/member/',
    care:  '',                             // ケア動画のセクション（アンカーが決まったら）
    train: '',                             // トレーニング動画（解説付き）
    read:  '',                             // 解説記事
  },

  DISCORD: 'https://discord.gg/4qyRmAeB5J',
};
