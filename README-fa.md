[🇬🇧 English](README.md) | 🇮🇷 فارسی

# vue-shortcut-manager نسخه ۱.۰.۰

**مدیر قدرتمند میانبرهای صفحه کلید برای Vue 3** – پشتیبانی از کلیدهای چندگانه، اجرای شرطی، ناوبری بین فیلدها و پنل راهنمای خودکار.

## 📦 نصب

```
npm install @mojskin/vue-shortcut-manager
```

## 🚀 شروع سریع

```
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import { ShortcutPlugin } from '@mojskin/vue-shortcut-manager'

const app = createApp(App)
app.use(ShortcutPlugin)
app.mount('#app')
```

## ⚙️ استفاده پایه در یک کامپوننت

```
<template>
  <form ref="formRef">
    <input name="patient_name" placeholder="نام بیمار" />
    <button type="submit">ذخیره</button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useShortcutManager } from '@mojskin/vue-shortcut-manager'

const formRef = ref(null)
const { register } = useShortcutManager()

const shortcuts = [
  {
    keys: ['ctrl+s', 'f5'],
    description: 'ذخیره فرم و پرینت',
    target: { type: 'call', method: 'submitForm', params: { print: true }, scope: 'component' },
    confirm: 'تغییرات ذخیره شود؟'
  },
  {
    keys: ['shift+tab', 'up'],
    description: 'رفتن به فیلد قبلی',
    target: { type: 'navigate', direction: 'prev', step: 1 }
  }
]

const submitForm = (params) => {
  console.log('ارسال شد', params)
  if (params.print) window.print()
}

onMounted(() => {
  register(shortcuts)
})
</script>
```

## 🧩 قابلیت‌های پیشرفته

### ➤ اجرای شرطی

```
{
  keys: ['f1'],
  description: 'باز کردن انتخابگر بیمار تنها وقتی فوکوس روی فیلد نام بیمار است',
  when: { focused: '[name="patient_name"]' },
  target: { type: 'call', method: 'selectPatient', scope: 'component' }
}
```

### ➤ پرش چند مرحله‌ای

```
{ keys: ['page-down'], target: { type: 'navigate', direction: 'next', step: 3 } }
```

### ➤ کلیک روی یک المان با سلکتور

```
{
  keys: ['alt+x'],
  target: { type: 'click', selector: { by: 'id', value: 'hidden-submit' } }
}
```

### ➤ ارسال رویداد سفارشی

```
{
  keys: ['ctrl+shift+e'],
  target: { type: 'emit', event: 'export-data', payload: { format: 'csv' } }
}
```

## 🖼️ تولید منوی راهنما (HTML)

با فراخوانی `getShortcutManager().getHelpHTML(componentInstance)` می‌توانید اچ‌تی‌امال خامی دریافت کنید که شامل تمام میانبرهای سراسری و محلی (مربوط به آن کامپوننت) است. سپس آن را در هر جایی (دیالوگ، tooltip، سایدبار) نمایش دهید.

```
import { getShortcutManager } from '@mojskin/vue-shortcut-manager'

function showHelp() {
  const html = getShortcutManager().getHelpHTML(this)
  document.getElementById('helpModalBody').innerHTML = html
  openModal()
}
```

📘 اچ‌تی‌امال خروجی بدون استایل است – شما می‌توانید کلاس‌های CSS دلخواه خود را اضافه کنید (Tailwind، Bootstrap و ...).

## 🌐 ثبت میانبر سراسری

```
import { getShortcutManager } from '@mojskin/vue-shortcut-manager'
const manager = getShortcutManager()
manager.registerGlobal({
  keys: ['f1'],
  description: 'راهنمای عمومی',
  target: { type: 'call', method: 'openGlobalHelp', scope: 'global' }
})
```

## 🔧 مرجع API

* `useShortcutManager()` – خروجی `{ register, unregister, manager }` (میانبرهای محلی).
* `getShortcutManager()` – نمونه مدیریار سراسری را برمی‌گرداند.
* `registerGlobal(shortcut)` – میانبر سراسری (در همه جا کار می‌کند) اضافه می‌کند.
* `registerLocal(component, shortcuts)` – معمولاً توسط `register` از کامپوزابل صدا زده می‌شود.
* `getHelpHTML(component?)` – رشته اچ‌تی‌امال راهنما را تولید می‌کند.

## 📄 مجوز

MIT · ساخته شده توسط [mojskin](https://github.com/mojskin)

ساخته شده برای Vue 3 – بهره‌وری را با طراحی صفحه کلید‑محور افزایش دهید.