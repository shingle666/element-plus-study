})

### 4.2 Build Scripts

```typescript
// scripts/build.ts
import { build } from 'vite'
import { resolve } from 'path'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'

const root = resolve(__dirname, '..')
const outDir = resolve(root, 'dist')

async function buildLibrary() {
  console.log('🚀 Starting component library build...')
  
  // Clean output directory
  if (existsSync(outDir)) {
    execSync(`rm -rf ${outDir}`)
  }
  mkdirSync(outDir, { recursive: true })
  
  // Build components
  await build({
    configFile: resolve(root, 'build/vite.config.ts'),
    build: {
      outDir
    }
  })
  
  // Build styles
  console.log('📦 Building style files...')
  execSync('pnpm run -C packages/theme-chalk build', { stdio: 'inherit' })
  
  // Copy style files to output directory
  const stylesSrc = resolve(root, 'packages/theme-chalk/dist')
  const stylesDest = resolve(outDir, 'theme-chalk')
  execSync(`cp -r ${stylesSrc} ${stylesDest}`)
  
  // Copy package.json
  copyFileSync(
    resolve(root, 'packages/my-ui/package.json'),
    resolve(outDir, 'package.json')
  )
  
  // Copy README.md
  copyFileSync(
    resolve(root, 'README.md'),
    resolve(outDir, 'README.md')
  )
  
  console.log('✅ Build complete!')
}

buildLibrary().catch(console.error)
```

## 5. Practice Exercises

### Exercise 1: Component Development
```typescript
// Develop a custom Input component
// 1. Design component API
// 2. Implement component logic
// 3. Write component styles
// 4. Add type definitions
```

### Exercise 2: Theme Customization
```scss
// Create custom theme
// 1. Define color variables
// 2. Implement theme switching
// 3. Support dark mode
// 4. Adapt component styles
```

### Exercise 3: Build Optimization
```typescript
// Optimize build configuration
// 1. Support for on-demand loading
// 2. Tree-shaking optimization
// 3. Code splitting strategy
// 4. Performance monitoring
```

### Exercise 4: Documentation Site
```vue
<!-- Build component documentation -->
<!-- 1. VitePress configuration -->
<!-- 2. Component example display -->
<!-- 3. API documentation generation -->
<!-- 4. Online demo functionality -->
```

## Learning Resources

### Official Documentation
- [Vue 3 Component Development](https://vuejs.org/guide/components/)
- [Vite Build Tool](https://vitejs.dev/)
- [TypeScript Type System](https://www.typescriptlang.org/)

### Open Source Projects
- [Element Plus](https://github.com/element-plus/element-plus)
- [Ant Design Vue](https://github.com/vueComponent/ant-design-vue)
- [Naive UI](https://github.com/tusen-ai/naive-ui)

### Tools and Libraries
- [Vue SFC Playground](https://sfc.vuejs.org/)
- [Rollup.js](https://rollupjs.org/)
- [Sass](https://sass-lang.com/)

## Assignment

1. **Component Library Architecture**: Design and set up a complete component library project structure
2. **Component Development**: Implement 3-5 basic components (Button, Input, Select, etc.)
3. **Style System**: Establish a complete design token and style system
4. **Build Configuration**: Configure the component library's build and packaging process
5. **Documentation Site**: Create documentation and demo site for the component library

## Next Steps

Tomorrow we will learn about "Element Plus Plugin Ecosystem Construction", including:
- Plugin architecture design
- Plugin development specifications
- Plugin marketplace building
- Community ecosystem maintenance
- Plugin quality assurance

## Summary

Today we've deeply explored custom component library development based on Element Plus:

1. **Architecture Design**: Mastered component library project structure and Monorepo management
2. **Component Development**: Learned component design principles and development specifications
3. **Style System**: Established a complete SCSS variable system and style architecture
4. **Type System**: Implemented comprehensive TypeScript type definitions
5. **Build and Package**: Configured Vite build and automation scripts

Through this learning, you are now able to:
- Design and set up component library architecture
- Develop high-quality Vue 3 components
- Establish complete style and theme systems
- Configure modern build processes
- Publish and maintain component libraries
