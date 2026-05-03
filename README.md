🇬🇧 English | [🇮🇷 فارسی](README-fa.md)

# vue-shortcut-manager v1.0.0

**Powerful keyboard shortcut manager for Vue 3** – multi‑key bindings, conditional actions, focus navigation, and auto‑generated help panel.

## 📦 Installation

```
npm install @mojskin/vue-shortcut-manager
```

## 🚀 Quick Start

```
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import { ShortcutPlugin } from '@mojskin/vue-shortcut-manager'

const app = createApp(App)
app.use(ShortcutPlugin)
app.mount('#app')
```

## ⚙️ Basic Usage inside a Component

```
<template>
  <form ref="formRef">
    <input name="patient_name" placeholder="Patient name" />
    <button type="submit">Save</button>
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
    description: 'Save form and print',
    target: { type: 'call', method: 'submitForm', params: { print: true }, scope: 'component' },
    confirm: 'Save changes?'
  },
  {
    keys: ['shift+tab', 'up'],
    description: 'Move to previous field',
    target: { type: 'navigate', direction: 'prev', step: 1 }
  }
]

const submitForm = (params) => {
  console.log('Submitted', params)
  if (params.print) window.print()
}

onMounted(() => {
  register(shortcuts)
  // manually set current component for navigation (automatic inside useShortcutManager)
})
</script>
```

## 🧩 Advanced Features

### ➤ Conditional execution

```
{
  keys: ['f1'],
  description: 'Open patient selector only when focus is on patient_name',
  when: { focused: '[name="patient_name"]' },
  target: { type: 'call', method: 'selectPatient', scope: 'component' }
}
```

### ➤ Navigate multiple steps

```
{ keys: ['page-down'], target: { type: 'navigate', direction: 'next', step: 3 } }
```

### ➤ Click an element by selector

```
{
  keys: ['alt+x'],
  target: { type: 'click', selector: { by: 'id', value: 'hidden-submit' } }
}
```

### ➤ Emit custom event

```
{
  keys: ['ctrl+shift+e'],
  target: { type: 'emit', event: 'export-data', payload: { format: 'csv' } }
}
```

## 🖼️ Generating a Help Menu (HTML)

Call `getShortcutManager().getHelpHTML(componentInstance)` to get raw HTML describing all global and local shortcuts (local ones from that component). Then display it anywhere (dialog, tooltip, sidebar).

```
import { getShortcutManager } from '@mojskin/vue-shortcut-manager'

function showHelp() {
  const html = getShortcutManager().getHelpHTML(this) // or pass component instance
  // insert into a modal
  document.getElementById('helpModalBody').innerHTML = html
  openModal()
}
```

📘 The returned HTML is unstyled – you can add your own CSS classes or framework styling (Tailwind, Bootstrap, etc.).

## 🌐 Registering Global Shortcuts

```
import { getShortcutManager } from '@mojskin/vue-shortcut-manager'
const manager = getShortcutManager()
manager.registerGlobal({
  keys: ['f1'],
  description: 'Global help',
  target: { type: 'call', method: 'openGlobalHelp', scope: 'global' }
})
```

## 🔧 API Reference

* `useShortcutManager()` – returns `{ register, unregister, manager }` (local shortcuts).
* `getShortcutManager()` – returns the global manager instance.
* `registerGlobal(shortcut)` – adds a global shortcut (works everywhere).
* `registerLocal(component, shortcuts)` – normally called via `register` from composable.
* `getHelpHTML(component?)` – generates help HTML string.

## 📄 License

MIT · Created by [mojskin](https://github.com/mojskin)

Built for Vue 3 – enhance productivity with keyboard‑first design.