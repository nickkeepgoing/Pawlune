# คู่มือตั้งค่า ทีละขั้น (ตั้งแต่สมัครจนได้ key ครบ)

> หน้าตาเว็บอาจเปลี่ยนจากที่เขียนไว้ ถ้าหาปุ่มไม่เจอ ให้มองหาคำที่ใกล้เคียง หรือค้นชื่อเมนูในเว็บนั้น
> เก็บ key ทุกตัวไว้ในไฟล์ `.env.local` บนเครื่องเท่านั้น ห้ามส่งในแชท/ห้ามอัปขึ้น GitHub

ปลายทาง: ได้ไฟล์ `.env.local` (ก๊อปจาก `.env.example`) ที่กรอกครบแบบนี้
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... หรือ sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJ... หรือ sb_secret_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
APP_TIMEZONE=Asia/Bangkok
AI_PROVIDER=        (ไม่บังคับ)
AI_API_KEY=         (ไม่บังคับ)
AI_MODEL=           (ไม่บังคับ)
```

---

## 1. ติดตั้งเครื่องมือบนคอม (~15 นาที)
1. **Node.js**: เข้า https://nodejs.org → ดาวน์โหลดเวอร์ชัน **LTS** → ติดตั้งแบบกด Next ไปเรื่อยๆ
   ตรวจ: เปิด Terminal (Mac) หรือ PowerShell (Windows) พิมพ์ `node -v` ต้องขึ้นเลขเวอร์ชัน
2. **Git**: Windows → https://git-scm.com/download/win ติดตั้งค่าเริ่มต้น / Mac → พิมพ์ `git --version` ถ้ายังไม่มีเครื่องจะชวนติดตั้งเอง
3. **VS Code** (แนะนำ): https://code.visualstudio.com
4. **Python 3** (ไว้รัน engine ต้นแบบ): https://www.python.org/downloads → Windows ให้ติ๊ก "Add python.exe to PATH" ก่อนกด Install
   ตรวจ: `python3 --version` (Windows อาจเป็น `python --version`)

## 2. GitHub (~5 นาที)
1. https://github.com → Sign up → ยืนยันอีเมล
2. มุมขวาบน **+** → **New repository** → ชื่อ `paw-diary` → เลือก **Private** → Create
3. Nick เพิ่มเพื่อนเป็นคนร่วมงาน: repo → **Settings** → **Collaborators** → **Add people** → ใส่ username เพื่อน
4. บนเครื่อง: แตก zip นี้ → เปิด Terminal ในโฟลเดอร์ `paw-diary-kit` แล้วพิมพ์
   ```
   git init
   git add .
   git commit -m "kit"
   git branch -M main
   git remote add origin https://github.com/<username>/paw-diary.git
   git push -u origin main
   ```
   (ครั้งแรกจะเด้งให้ล็อกอิน GitHub ในเบราว์เซอร์)
5. ตรวจว่าไฟล์ `.gitignore` มีบรรทัด `.env*.local` (Next.js สร้างให้ใน Phase 0 — ถ้าไม่มีให้เพิ่มเอง)

## 3. Claude Code (~10 นาที)
1. ต้องมีบัญชี Claude ที่ใช้ Claude Code ได้ (แพ็กเกจ Pro ขึ้นไป หรือ API) — เช็คที่ https://claude.ai
2. ติดตั้ง (เลือกวิธีเดียว ดูวิธีล่าสุดที่ https://docs.claude.com ถ้าคำสั่งเปลี่ยน):
   - ผ่าน npm: `npm install -g @anthropic-ai/claude-code`
   - หรือ Mac/Linux: `curl -fsSL https://claude.ai/install.sh | bash`
3. เข้าโฟลเดอร์โปรเจกต์ แล้วพิมพ์ `claude` → ทำตามขั้นตอนล็อกอินในเบราว์เซอร์
4. ติดตั้ง skill ดีไซน์: พิมพ์ใน Claude Code `/plugin install frontend-design@claude-plugins-official`
   ถ้าไม่ได้: `/plugin marketplace add anthropics/claude-code` แล้ว `/plugin install frontend-design@claude-code-plugins`
5. ทุกครั้งที่จบ phase พิมพ์ `/clear` เพื่อประหยัดโควต้า

## 4. Supabase — ฐานข้อมูล + ระบบล็อกอิน (~15 นาที)
1. https://supabase.com → **Start your project** → **Continue with GitHub**
2. **New project** → Organization: สร้างใหม่ (ฟรี) → Project name `paw-diary`
   → **Database Password**: กด Generate แล้ว **จดเก็บไว้** → Region: **Southeast Asia (Singapore)** → Create (รอ 1–2 นาที)
3. เอา key: เมนูซ้ายล่าง **Project Settings** (รูปเฟือง) → หัวข้อ **API** หรือ **API Keys**
   - **Project URL** → ใส่ `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** (หรือ **publishable**) key → ใส่ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (หรือ **secret**) key → กด Reveal → ใส่ `SUPABASE_SERVICE_ROLE_KEY`
     ⚠️ ตัวนี้เข้าถึงข้อมูลทุกคนได้ ห้ามใส่ในโค้ดฝั่งเบราว์เซอร์ ห้ามส่งให้ใคร
4. สร้างตาราง: เมนูซ้าย **SQL Editor** → **New query** → เปิดไฟล์ `supabase/migrations/0001_init.sql` ก๊อปทั้งหมดมาวาง → **Run**
   ต้องขึ้น Success → ไปดูที่ **Table Editor** ต้องเห็น `profiles, pets, checkins, who5_entries`
   และที่ **Storage** ต้องเห็น bucket `pet-photos` (Private)
5. ตั้งค่าล็อกอินอีเมล: **Authentication** → **Sign In / Providers** → Email เปิดอยู่แล้ว
   (ช่วงพัฒนา ถ้าไม่อยากรออีเมลยืนยัน ปิด "Confirm email" ได้ชั่วคราว — เปิดกลับก่อนใช้จริง)
6. ตั้ง URL: **Authentication** → **URL Configuration**
   - Site URL: `http://localhost:3000` (เปลี่ยนเป็นลิงก์ Vercel ทีหลัง)
   - Redirect URLs: เพิ่ม `http://localhost:3000/**` (และ `https://<ชื่อ>.vercel.app/**` หลังขั้นที่ 6)

## 5. Google Login (~20 นาที) — ข้ามได้ถ้าเวลาไม่พอ (ใช้อีเมลอย่างเดียว)
1. https://console.cloud.google.com → ล็อกอิน Google → ด้านบนกดเลือกโปรเจกต์ → **New Project** → ชื่อ `paw-diary` → Create → เลือกโปรเจกต์นี้
2. ไปที่ **APIs & Services** → **OAuth consent screen** (บางทีชื่อ **Google Auth Platform**) → **Get started**
   - App name: `Paw Diary` · User support email: อีเมลเรา
   - Audience: **External** · Contact email: อีเมลเรา → ยอมรับเงื่อนไข → Create
3. **Audience** (หรือหัวข้อ Test users) → เพิ่มอีเมลของทุกคนที่จะลองล็อกอิน (ระหว่างแอปอยู่โหมดทดสอบ มีแค่คนในรายชื่อที่ล็อกอินได้)
   ก่อนเดโมจริงให้กด **Publish app** หรือใส่อีเมลกรรมการ/บัญชีเดโมไว้ล่วงหน้า
4. **Clients** (หรือ Credentials → Create credentials → OAuth client ID) → Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:3000` (+ ลิงก์ Vercel ทีหลัง)
   - Authorized redirect URIs: ไปก๊อปจาก Supabase → **Authentication** → **Sign In / Providers** → **Google** →
     ช่อง **Callback URL** (หน้าตา `https://xxxx.supabase.co/auth/v1/callback`) มาวาง
   - Create → ได้ **Client ID** และ **Client secret**
5. กลับ Supabase → **Authentication** → **Sign In / Providers** → **Google** → เปิด Enable → วาง Client ID + Client secret → Save

## 6. Vercel — เอาเว็บขึ้นออนไลน์ (~10 นาที, ทำหลัง Phase 0 เสร็จ)
1. https://vercel.com → **Sign Up** → **Continue with GitHub** (แผน Hobby ฟรี)
2. **Add New…** → **Project** → เลือก repo `paw-diary` → **Import**
3. เปิด **Environment Variables** → ใส่ทุกบรรทัดจาก `.env.local` (ยกเว้น `NEXT_PUBLIC_SITE_URL` ให้ใส่ลิงก์ Vercel)
4. **Deploy** → ได้ลิงก์ `https://paw-diary-xxxx.vercel.app`
5. กลับไปเพิ่มลิงก์นี้ใน: Supabase (Site URL + Redirect URLs) และ Google (JavaScript origins)
6. ทุกครั้งที่ `git push` Vercel จะ deploy ให้อัตโนมัติ

## 7. AI key (ไม่บังคับ — ใช้แค่ฟีเจอร์สรุปรายสัปดาห์ใน Phase 6)
ถ้าโควต้าหรือเวลาไม่พอ **ข้ามได้เลย** แอปทำงานครบโดยไม่ต้องมี AI
- ทางเลือก A — Anthropic (Claude API):
  1. https://console.anthropic.com → Sign up → ยืนยันอีเมล/เบอร์
  2. **Billing** → เติมเครดิต (API คิดเงินตามการใช้ แยกจากแพ็กเกจ claude.ai)
  3. **API Keys** → **Create Key** → ตั้งชื่อ `paw-diary` → ก๊อปทันที (แสดงครั้งเดียว)
  4. ใส่ `.env.local`: `AI_PROVIDER=anthropic`, `AI_API_KEY=<key>`, `AI_MODEL=<ชื่อโมเดลจากหน้า docs.claude.com>`
- ทางเลือก B — Google AI Studio (Gemini):
  1. https://aistudio.google.com → ล็อกอิน Google → **Get API key** → **Create API key** → เลือกโปรเจกต์ → ก๊อป
  2. ใส่ `.env.local`: `AI_PROVIDER=google`, `AI_API_KEY=<key>`, `AI_MODEL=<ชื่อโมเดลจากหน้า AI Studio>`
  3. เงื่อนไขโควต้าฟรีเปลี่ยนบ่อย ให้เช็คในหน้า AI Studio เอง
- ทั้งสองทาง: key อยู่ฝั่ง server เท่านั้น (ห้ามขึ้นต้นด้วย `NEXT_PUBLIC_`) และเติม key เดียวกันใน Vercel ด้วย

## 8. ตรวจว่าพร้อม
- [ ] `node -v`, `git --version`, `python3 --version` ขึ้นเลข
- [ ] `python3 tools/reference_engine.py --check` ขึ้น "expected.json up to date"
- [ ] `.env.local` ครบ และ **ไม่อยู่** ใน GitHub (เปิดดูหน้า repo บนเว็บ)
- [ ] Supabase มี 4 ตาราง + bucket `pet-photos`
- [ ] (ถ้าทำ) ล็อกอิน Google ด้วยอีเมล test user ได้

## แก้ปัญหาที่เจอบ่อย
| อาการ | แก้ |
|---|---|
| Google ขึ้น `redirect_uri_mismatch` | Redirect URI ใน Google ต้องตรงกับ Callback URL ของ Supabase ทุกตัวอักษร |
| ล็อกอินแล้วเด้งกลับ localhost ทั้งที่อยู่บน Vercel | เพิ่มลิงก์ Vercel ใน Supabase Redirect URLs และแก้ Site URL |
| Google บอก "access blocked / app not verified" | เพิ่มอีเมลนั้นเป็น Test user หรือกด Publish app |
| `permission denied` ตอนอ่านตาราง | ยังไม่ได้ล็อกอิน หรือรัน SQL ไม่ครบ (RLS) — รัน 0001_init.sql ใหม่ในโปรเจกต์เปล่า |
| key หลุด | Supabase/Anthropic/Google: เข้าหน้า key → ลบ/rotate → ใส่ key ใหม่ใน `.env.local` และ Vercel |
