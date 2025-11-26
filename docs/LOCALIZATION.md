# 🌍 FinnaBBear Localization (i18n)

เอกสารนี้กำหนดมาตรฐานการรองรับหลายภาษา (Thai/English) โดยใช้ **`next-intl`** แบบ **Cookie-based Routing**

## 1. Architecture

เราใช้ระบบ **Cookie-based Localization** เพื่อให้ URL สะอาดและไม่มี Prefix ภาษา

- **URL:** `finnabbear.com/dashboard` (เหมือนกันทุกภาษา)
- **Persistence:** เก็บภาษาที่เลือกไว้ใน Cookie ชื่อ **`finna_locale`**

### 1.1 Tech Stack

- **Library:** `next-intl`
- **Storage:** Cookies (`finna_locale`)

## 2. Directory Structure

เรา **ไม่ต้อง** ย้าย Pages เข้าไปใน `[locale]` โฟลเดอร์ ให้วางไว้ที่ root ของ `app` ได้เลย

```text
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── layout.tsx      # Root Layout (ใช้ getLocale)
│   ├── page.tsx
│   ├── api/
│   └── not-found.tsx
│
├── messages/           # 🗂️ เก็บไฟล์คำแปล
│   ├── en.json
│   └── th.json
│
├── i18n/
│   ├── request.ts      # อ่าน locale จาก Cookie
│   └── routing.ts      # Config (localePrefix: 'never')
```

## 3. Translation Files (`src/messages/*.json`)

เก็บคำแปลเป็นหมวดหมู่ (Namespaces) เหมือนเดิม

**`messages/th.json`**

```json
{
  "Common": {
    "save": "บันทึก"
  }
}
```

## 4. Usage Guide

### 4.1 In Server Components

ใช้ `getTranslations` ตามปกติ แต่ไม่ต้องรับ params locale

```tsx
// src/app/page.tsx
import { getTranslations } from 'next-intl/server'

export default async function Page() {
  const t = await getTranslations('Dashboard')
  return <h1>{t('totalBalance')}</h1>
}
```

### 4.2 In Client Components

ใช้ `useTranslations` ได้เลย (ต้องมี `NextIntlClientProvider` ใน Layout)

```tsx
'use client'
import { useTranslations } from 'next-intl'

export function SaveButton() {
  const t = useTranslations('Common')
  return <button>{t('save')}</button>
}
```

### 4.3 Switching Languages

การเปลี่ยนภาษาทำโดยการ **Set Cookie** และ **Refresh Page**

```tsx
'use client'
import { useRouter } from 'next/navigation'

export function LanguageSwitcher() {
  const router = useRouter()

  const changeLang = (lang: string) => {
    // 1. Set Cookie
    document.cookie = `finna_locale=${lang}; path=/; max-age=31536000; SameSite=Lax`
    // 2. Refresh Page
    router.refresh()
  }

  return (
    <select onChange={(e) => changeLang(e.target.value)}>
      <option value="th">ไทย</option>
      <option value="en">English</option>
    </select>
  )
}
```

## 5. Rules for AI Agent 🤖

1.  **Cookie Name:** ใช้ `finna_locale` เสมอ
2.  **No Middleware Rewrites:** เราลบ `middleware.ts` ออกแล้ว เพื่อป้องกัน 404 และให้ URL ทำงานแบบปกติ
3.  **Request Config:** `src/i18n/request.ts` ต้องอ่านจาก `cookies()` ถ้า `requestLocale` เป็น undefined
