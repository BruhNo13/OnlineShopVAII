# FakeShein – E-shop Simulácia

FakeShein je webová aplikácia simulujúca e-shop, postavená na **SvelteKit** a **Supabase**. Umožňuje používateľom prehliadať produkty, spravovať obľúbené položky, pridávať recenzie a spravovať produkty v admin sekcii.

---

##  Požiadavky
Pred inštaláciou sa uisti, že máš na svojom zariadení nainštalované:
- **Node.js** (verzia `18.x` alebo novšia) – [stiahnuť tu](https://nodejs.org/)
- **npm** (automaticky súčasťou Node.js)
- **Supabase účet** – [supabase.com](https://supabase.com/)

---

##  Inštalácia a spustenie

### 1. Klonovanie projektu
Najskôr si stiahni repozitár:

git clone https://github.com/BruhNo13/OnlineShopVAII.git

cd fakeshein

---

### 2. Inštalácia závislostí
Spusti nasledujúci príkaz na nainštalovanie všetkých potrebných knižníc:

- npm install

- npm install -D @sveltejs/adapter-auto @sveltejs/kit @sveltejs/vite-plugin-svelte autoprefixer postcss svelte svelte-check svelte-preprocess tailwindcss typescript vite

- npm install @supabase/supabase-js zod

---

### 3. Nastavenie Supabase
V koreňovom priečinku projektu vytvor súbor .env a doplň svoje Supabase údaje:
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_ANON_KEY=your-anon-key

---

### 4. Spustenie aplikácie
Ak chceš spustiť aplikáciu v vývojovom režime, použi:
npm run dev
Aplikácia bude dostupná na http://localhost:5173/.

---

🌟 Použité technológie
Frontend: SvelteKit
Backend: SvelteKit Server Endpoints
Databáza a Storage: Supabase
Autentifikácia: Supabase Auth
Štýlovanie: CSS + Svelte komponenty
