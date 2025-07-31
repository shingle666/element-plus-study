# Quick Start

## Installation

### NPM
```bash
npm install element-plus --save
```

### Yarn
```bash
yarn add element-plus
```

### CDN
```html
<!-- Import style -->
<link rel="stylesheet" href="//unpkg.com/element-plus/dist/index.css" />
<!-- Import Vue 3 -->
<script src="//unpkg.com/vue@next"></script>
<!-- Import component library -->
<script src="//unpkg.com/element-plus"></script>
```

## Usage

### Full Import

```typescript
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
```

### On-demand Import

```typescript
// main.ts
import { createApp } from 'vue'
import { ElButton, ElSelect } from 'element-plus'
import App from './App.vue'

const app = createApp(App)
app.component('ElButton', ElButton)
app.component('ElSelect', ElSelect)

/* or
app.use(ElButton).use(ElSelect)
*/

app.mount('#app')
```

### Auto Import (Recommended)

First, install `unplugin-vue-components` and `unplugin-auto-import`:

```bash
npm install -D unplugin-vue-components unplugin-auto-import
```

Then add the code below into your `Vite` config file:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

## Global Configuration

```typescript
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus, {
  // options
  size: 'small',
  zIndex: 3000,
})
```

## Hello World

```vue
<template>
  <div id="app">
    <el-button @click="visible = true">Button</el-button>
    <el-dialog v-model="visible" title="Hello world">
      <p>Try Element Plus</p>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const visible = ref(false)
    return {
      visible,
    }
  },
}
</script>
```

## Next Steps

- [📚 Study Guide](/en/element-plus-study-guide) - Start systematic learning
- [🎯 Basic Concepts](/en/basic-concepts/design-principles-and-basic-concepts) - Understand design principles
- [🧩 Basic Components](/en/basic-components/button) - Learn basic components
- [📝 Form Components](/en/form-components/input) - Master form components

---

**Congratulations! You have successfully set up Element Plus.** 🎉