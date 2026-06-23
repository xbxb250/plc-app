-- ============================================================
-- PLC瀛﹀爞 - Supabase 鏁版嵁搴撳缓琛ㄨ剼鏈?-- 鍦?Supabase SQL Editor 涓墽琛屾鏂囦欢
-- ============================================================

-- 1. 鐢ㄦ埛璧勬枡琛紙鎵╁睍 Supabase auth.users锛?CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT,
  avatar TEXT,
  company TEXT,
  learn_days INTEGER DEFAULT 0,
  completed_tutorials INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  correct_rate INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: 鐢ㄦ埛鍙兘璇诲啓鑷繁鐨勮祫鏂?ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 鑷姩鍒涘缓 profile锛堟敞鍐屾椂瑙﹀彂锛?CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, learn_days)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', '瀛﹀憳'), 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================

-- 2. 鏁欑▼琛?CREATE TABLE IF NOT EXISTS public.tutorials (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '閫氱敤',
  difficulty TEXT NOT NULL DEFAULT '鍏ラ棬',
  cover_icon TEXT DEFAULT '馃搫',
  duration_min INTEGER DEFAULT 10,
  student_count INTEGER DEFAULT 0,
  "order" INTEGER DEFAULT 0,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;

-- 鏁欑▼鎵€鏈変汉鍙
CREATE POLICY "Tutorials are viewable by everyone"
  ON public.tutorials FOR SELECT
  USING (true);

-- ============================================================

-- 3. 鐢ㄦ埛瀛︿範杩涘害琛?CREATE TABLE IF NOT EXISTS public.user_tutorial_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tutorial_id INTEGER NOT NULL REFERENCES public.tutorials(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tutorial_id)
);

ALTER TABLE public.user_tutorial_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own progress"
  ON public.user_tutorial_progress
  USING (auth.uid() = user_id);

-- ============================================================

-- 4. 棰樺簱琛?CREATE TABLE IF NOT EXISTS public.questions (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL DEFAULT '閫氱敤',
  difficulty TEXT NOT NULL DEFAULT '鍏ラ棬',
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  answer INTEGER NOT NULL,
  explanation TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions are viewable by everyone"
  ON public.questions FOR SELECT
  USING (true);

-- ============================================================

-- 5. 绛旈璁板綍琛?CREATE TABLE IF NOT EXISTS public.user_answers (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  answered_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own answers"
  ON public.user_answers
  USING (auth.uid() = user_id);

-- 鍔犻€熼敊棰樻煡璇?CREATE INDEX IF NOT EXISTS idx_user_answers_wrong
  ON public.user_answers(user_id, is_correct)
  WHERE is_correct = FALSE;

-- ============================================================

-- 6. 鏀惰棌琛?CREATE TABLE IF NOT EXISTS public.user_favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tutorial_id INTEGER NOT NULL REFERENCES public.tutorials(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tutorial_id)
);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites"
  ON public.user_favorites
  USING (auth.uid() = user_id);

-- ============================================================
-- 绉嶅瓙鏁版嵁鎻掑叆锛堝彲閫夋墽琛岋級
-- ============================================================

-- 鎻掑叆鏁欑▼绀轰緥鏁版嵁
INSERT INTO public.tutorials (title, category, difficulty, cover_icon, duration_min, student_count, "order", content) VALUES
('瑗块棬瀛怱7-1200鍏ラ棬锛氱‖浠舵帴绾挎寚鍗?, '瑗块棬瀛?, '鍏ラ棬', '馃攲', 15, 3200, 1,
 '## 1. S7-1200 绠€浠媆n\nS7-1200 鏄タ闂ㄥ瓙鍏徃鎺ㄥ嚭鐨勪竴娆剧揣鍑戝瀷 PLC锛屽睘浜?Simatic 绯诲垪浜у搧绾裤€俓n\n## 2. 纭欢缁勬垚\n\n### CPU 妯″潡\n鎵€鏈夊瀷鍙烽兘鍐呯疆 PROFINET 鎺ュ彛锛屾敮鎸佷互澶綉閫氫俊銆俓n\n### 淇″彿妯″潡 (SM)\n- 鏁板瓧閲忚緭鍏ユā鍧?(DI)\n- 鏁板瓧閲忚緭鍑烘ā鍧?(DO)\n- 妯℃嫙閲忚緭鍏ユā鍧?(AI)\n- 妯℃嫙閲忚緭鍑烘ā鍧?(AO)'),
('姊舰鍥惧熀纭€锛氬父寮€甯搁棴瑙︾偣涓庣嚎鍦?, '姊舰鍥?, '鍏ラ棬', '馃搻', 20, 5100, 2,
 '## 1. 浠€涔堟槸姊舰鍥撅紵\n\n姊舰鍥撅紙Ladder Diagram, LD锛夋槸 PLC 缂栫▼涓渶甯哥敤鐨勮瑷€锛屾簮鑷户鐢靛櫒鎺у埗鐢佃矾鍥俱€俓n\n## 2. 鍩烘湰鍏冧欢\n\n### 甯稿紑瑙︾偣 (NO)\n绗﹀彿锛?| |-\n杈撳叆涓?1 鏃堕棴鍚堬紝涓?0 鏃舵柇寮€銆俓n\n### 甯搁棴瑙︾偣 (NC)\n绗﹀彿锛?|/|-\n杈撳叆涓?0 鏃堕棴鍚堬紝涓?1 鏃舵柇寮€銆俓n\n### 绾垮湀 (Coil)\n绗﹀彿锛?( )-\n宸︿晶閫氳矾鏃惰緭鍑?ON銆?),
('瀹氭椂鍣═ON/TOF鎸囦护璇﹁В', '姊舰鍥?, '杩涢樁', '鈴憋笍', 25, 2800, 3,
 '## 1. 瀹氭椂鍣ㄦ杩癨n\nPLC 瀹氭椂鍣ㄦ槸鐢ㄦ潵瀹炵幇寤舵椂鎺у埗鐨勮蒋鍏冧欢銆俓n\n## 2. TON (鎺ラ€氬欢鏃跺畾鏃跺櫒)\n浣胯兘绔?(IN) 鎺ラ€氬悗寮€濮嬭鏃讹紝杈惧埌璁惧畾鍊?PT 鍚庤緭鍑?Q 鎺ラ€氥€俓n\n## 3. TOF (鏂紑寤舵椂瀹氭椂鍣?\nIN 鎺ラ€氭椂 Q 绔嬪嵆鎺ラ€氾紝IN 鏂紑鍚庡紑濮嬭鏃讹紝杈惧埌 PT 鍚?Q 鏂紑銆?),
('PLC纭欢缁勬垚涓庡伐浣滃師鐞?, '鐢靛伐鍩虹', '鍏ラ棬', '馃敡', 12, 4500, 4,
 '## 1. PLC 鍩烘湰缁撴瀯\n\nCPU銆佸瓨鍌ㄥ櫒銆両/O鎺ュ彛銆佺數婧愭ā鍧椼€俓n\n## 2. 鎵弿鍛ㄦ湡\n\n1. 杈撳叆閲囨牱\n2. 绋嬪簭鎵ц\n3. 杈撳嚭鍒锋柊');

-- 鎻掑叆棰樼洰绀轰緥鏁版嵁
INSERT INTO public.questions (category, difficulty, question, options, answer, explanation) VALUES
('鐢靛伐鍩虹', '鍏ラ棬', 'PLC鐨勬壂鎻忓懆鏈熶笉鍖呮嫭浠ヤ笅鍝釜闃舵锛?,
  '["杈撳叆閲囨牱闃舵", "绋嬪簭鎵ц闃舵", "杈撳嚭鍒锋柊闃舵", "鏁版嵁澶囦唤闃舵"]', 3,
  'PLC鐨勬壂鎻忓懆鏈熷寘鍚笁涓樁娈碉細杈撳叆閲囨牱 鈫?绋嬪簭鎵ц 鈫?杈撳嚭鍒锋柊銆傛暟鎹浠戒笉灞炰簬鎵弿鍛ㄦ湡鐨勪竴閮ㄥ垎銆?),
('鐢靛伐鍩虹', '鍏ラ棬', '浠ヤ笅鍝釜涓嶆槸PLC鐨勮緭鍏ヨ澶囷紵',
  '["鎸夐挳寮€鍏?, "琛岀▼寮€鍏?, "鎺ヨЕ鍣?, "鍏夌數浼犳劅鍣?]', 2,
  '鎺ヨЕ鍣ㄦ槸杈撳嚭璁惧锛堟墽琛屽櫒锛夛紝瀹冩帴鏀禤LC鐨勮緭鍑轰俊鍙锋潵鎺у埗澶у姛鐜囪礋杞姐€?),
('瑗块棬瀛?, '鍏ラ棬', '瑗块棬瀛怱7-1200鐨勭紪绋嬭蒋浠舵槸浠€涔堬紵',
  '["GX Works3", "CX-Programmer", "TIA Portal", "RSLogix 5000"]', 2,
  'TIA Portal锛堝崥閫旓級鏄タ闂ㄥ瓙鏂颁竴浠ｅ伐绋嬫鏋讹紝鐢ㄤ簬S7-1200/1500绛塒LC鐨勭紪绋嬬粍鎬併€?),
('姊舰鍥?, '鍏ラ棬', '姊舰鍥句腑锛屽父寮€瑙︾偣鐨勭鍙锋槸浠€涔堬紵',
  '["-| |-", "-|/|-", "-( )-", "-|P|-"]', 0,
  '-| |- 鏄父寮€瑙︾偣锛圢O锛夛紝姝ｅ父鎯呭喌涓嬫柇寮€锛屽緱鐢靛悗闂悎銆?);
