/* ============================================================================
   Endurance Lab ── LIFF 共通設定
   このファイルはブラウザから読めます。秘密の値は絶対に書かないこと。
   ============================================================================ */

window.ENLAB = {

  // LINEログインチャネル → LIFF タブ
  LIFF_ID_ROUTINE:    '2011330570-2bgyt8cs',   // エンラボルーティン
  LIFF_ID_ASSESSMENT: '2011330570-1tyqyzfb',   // エンラボフィジカルテスト

  // バックエンド（Cloudflare Worker + D1）
  // 2026/9/29 に Supabase から移行。旧URLは
  // https://lzlizdcrgarojpmrdbrj.supabase.co/functions/v1/enlab
  API: 'https://enlab-line.s-hanawa.workers.dev',

  // Cloudflare では不要だが、画面側が参照しているため空文字で残す
  ANON: '',

  // フィジカルテストの結果画面から飛ぶ、会員サイトの導線
  // 空にしておくと top に飛びます。
  MEMBER: {
    top:   'https://coredesign-tr.com/sp/gbK5lXHr/DczvjqO9/member/',
    care:  '',
    train: '',
    read:  '',
  },

  DISCORD: 'https://discord.gg/4qyRmAeB5J',
};
