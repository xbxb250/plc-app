# PLC瀛﹀爞 鈥?浠庨浂寮€濮嬪PLC缂栫▼

鍩轰簬 **UniApp (Vue3)** + **Supabase** 鐨勮法骞冲彴 PLC 瀛︿範搴旂敤 MVP v1銆?
## 鎶€鏈爤

| 灞?| 鎶€鏈?|
|---|------|
| 鍓嶇妗嗘灦 | UniApp (Vue 3 + Composition API) |
| 鏋勫缓宸ュ叿 | Vite 4 |
| 鐘舵€佺鐞?| Pinia |
| 鍚庣鏈嶅姟 | Supabase (Auth + Database + API) |
| CSS | SCSS |

## 蹇€熷紑濮?
### 1. 鐜瑕佹眰

- **Node.js >= 16.0.0**
- 寰俊寮€鍙戣€呭伐鍏凤紙灏忕▼搴忚皟璇曠敤锛?- Supabase 璐﹀彿锛堟敞鍐屽湴鍧€锛歨ttps://supabase.com锛?
### 2. 瀹夎渚濊禆

```bash
cd plc-app
npm install
```

### 3. 閰嶇疆 Supabase

1. 鍦?[Supabase](https://supabase.com) 鍒涘缓椤圭洰
2. 鍦?SQL Editor 涓墽琛?`data/supabase-schema.sql`
3. 澶嶅埗 `.env` 鏂囦欢锛屽～鍏ヤ綘鐨?Supabase URL 鍜?anon key锛?   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   ```

### 4. 鍚姩寮€鍙?
```bash
# H5 娴忚鍣ㄥ紑鍙?npm run dev:h5

# 寰俊灏忕▼搴忓紑鍙?npm run dev:mp-weixin
```

## 椤圭洰缁撴瀯

```
plc-app/
鈹溾攢鈹€ pages/                  # 椤甸潰鐩綍
鈹?  鈹溾攢鈹€ index/              # 鈶?棣栭〉
鈹?  鈹溾攢鈹€ tutorial/           # 鈶?鏁欑▼鍒楄〃
鈹?  鈹溾攢鈹€ tutorial-detail/    # 鈶?鏁欑▼璇︽儏
鈹?  鈹溾攢鈹€ quiz/               # 鈶?棰樺簱棣栭〉
鈹?  鈹溾攢鈹€ quiz-do/            # 鈶?绛旈椤?鈹?  鈹溾攢鈹€ quiz-result/        # 鈶?绛旈缁撴灉
鈹?  鈹溾攢鈹€ wrong-book/         # 鈶?閿欓鏈?鈹?  鈹溾攢鈹€ favorites/          # 鈶?鏀惰棌椤?鈹?  鈹溾攢鈹€ mine/               # 鈶?鎴戠殑
鈹?  鈹斺攢鈹€ login/              # 鈶?鐧诲綍椤?鈹溾攢鈹€ components/             # 鍏叡缁勪欢
鈹?  鈹斺攢鈹€ tab-bar.vue         # 搴曢儴瀵艰埅鏍?鈹溾攢鈹€ stores/                 # Pinia 鐘舵€佺鐞?鈹?  鈹斺攢鈹€ user.js             # 鐢ㄦ埛鐘舵€?鈹溾攢鈹€ utils/                  # 宸ュ叿鍑芥暟
鈹?  鈹溾攢鈹€ supabase.js         # Supabase 瀹㈡埛绔?鈹?  鈹斺攢鈹€ api.js              # 鏁版嵁璁块棶灞?鈹溾攢鈹€ data/                   # 绉嶅瓙鏁版嵁 & SQL
鈹?  鈹溾攢鈹€ supabase-schema.sql
鈹?  鈹溾攢鈹€ seed-tutorials.json
鈹?  鈹斺攢鈹€ seed-questions.json
鈹溾攢鈹€ static/icons/           # 鍥炬爣璧勬簮
鈹溾攢鈹€ App.vue                 # 鏍圭粍浠?鈹溾攢鈹€ main.js                 # 鍏ュ彛鏂囦欢
鈹溾攢鈹€ pages.json              # 璺敱 & Tab 閰嶇疆
鈹溾攢鈹€ manifest.json           # 搴旂敤閰嶇疆
鈹斺攢鈹€ uni.scss                # 鍏ㄥ眬 SCSS 鍙橀噺
```

## MVP v1 鍔熻兘鑼冨洿

- 鉁?寰俊涓€閿櫥褰?/ 鎵嬫満鍙?楠岃瘉鐮佺櫥褰?- 鉁?鏁欑▼娴忚锛氬垎绫诲垪琛ㄣ€佹悳绱€丮arkdown 娓叉煋
- 鉁?閫夋嫨棰樼粌涔狅細鍒嗙被+闅惧害绛涢€夈€佸嵆鏃跺垽棰樸€佽В鏋?- 鉁?閿欓鏈細鑷姩鏀堕泦銆侀噸鍋氬姛鑳?- 鉁?鏀惰棌鍔熻兘
- 鉁?涓汉涓績锛氬涔犵粺璁°€佽繘搴﹁拷韪?- 鉂?姊舰鍥炬ā鎷熷櫒 鈫?v2
- 鉂?瑙嗛璇剧▼ 鈫?v2
- 鉂?绀惧尯/闂瓟 鈫?v2
