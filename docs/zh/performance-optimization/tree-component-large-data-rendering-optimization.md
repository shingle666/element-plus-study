# 第81天：Tree 组件大数据渲染优化

## 学习目标

- 掌握 Element Plus Tree 组件的性能瓶颈分析
- 学习树形结构的虚拟化渲染技术
- 实现高性能的大数据树组件
- 构建智能的节点加载和缓存机制

## 1. Tree 组件性能分析

### 1.1 树形结构性能瓶颈

```typescript
// 树形性能分析器
class TreePerformanceAnalyzer {
  private metrics: Map<string, any[]> = new Map()
  private nodeCache: Map<string, any> = new Map()
  
  constructor() {
    this.initializeMetrics()
  }
  
  private initializeMetrics(): void {
    this.metrics.set('render-time', [])
    this.metrics.set('expand-time', [])
    this.metrics.set('search-time', [])
    this.metrics.set('memory-usage', [])
    this.metrics.set('dom-nodes', [])
    this.metrics.set('tree-depth', [])
    this.metrics.set('node-count', [])
  }
  
  // 分析树形组件性能
  analyzeTreePerformance(treeElement: HTMLElement, treeData: any[]): any {
    const startTime = performance.now()
    
    const analysis = {
      treeStructure: this.analyzeTreeStructure(treeData),
      domComplexity: this.analyzeDOMComplexity(treeElement),
      renderPerformance: this.analyzeRenderPerformance(treeElement),
      expandPerformance: this.analyzeExpandPerformance(treeElement),
      searchPerformance: this.analyzeSearchPerformance(treeData),
      memoryUsage: this.analyzeMemoryUsage(),
      scrollPerformance: this.analyzeScrollPerformance(treeElement)
    }
    
    const endTime = performance.now()
    this.recordMetric('render-time', endTime - startTime)
    
    return {
      ...analysis,
      totalAnalysisTime: endTime - startTime,
      recommendations: this.generateRecommendations(analysis)
    }
  }
  
  // 分析树形结构
  private analyzeTreeStructure(treeData: any[]): any {
    let totalNodes = 0
    let maxDepth = 0
    let leafNodes = 0
    let branchNodes = 0
    const depthDistribution: number[] = []
    
    const traverse = (nodes: any[], depth: number = 0) => {
      maxDepth = Math.max(maxDepth, depth)
      
      if (!depthDistribution[depth]) {
        depthDistribution[depth] = 0
      }
      depthDistribution[depth] += nodes.length
      
      nodes.forEach(node => {
        totalNodes++
        
        if (node.children && node.children.length > 0) {
          branchNodes++
          traverse(node.children, depth + 1)
        } else {
          leafNodes++
        }
      })
    }
    
    traverse(treeData)
    
    const averageDepth = depthDistribution.reduce((sum, count, depth) => {
      return sum + (count * depth)
    }, 0) / totalNodes
    
    const balanceFactor = this.calculateBalanceFactor(depthDistribution)
    
    return {
      totalNodes,
      maxDepth,
      averageDepth,
      leafNodes,
      branchNodes,
      depthDistribution,
      balanceFactor,
      complexity: this.calculateTreeComplexity(totalNodes, maxDepth, balanceFactor)
    }
  }
  
  // 计算平衡因子
  private calculateBalanceFactor(depthDistribution: number[]): number {
    if (depthDistribution.length <= 1) return 1
    
    const totalNodes = depthDistribution.reduce((sum, count) => sum + count, 0)
    const variance = depthDistribution.reduce((sum, count, depth) => {
      const ratio = count / totalNodes
      return sum + Math.pow(ratio - (1 / depthDistribution.length), 2)
    }, 0)
    
    return 1 - Math.sqrt(variance)
  }
  
  // 计算树复杂度
  private calculateTreeComplexity(totalNodes: number, maxDepth: number, balanceFactor: number): string {
    const complexityScore = (totalNodes * 0.1) + (maxDepth * 5) + ((1 - balanceFactor) * 20)
    
    if (complexityScore < 50) return 'low'
    if (complexityScore < 200) return 'medium'
    if (complexityScore < 500) return 'high'
    return 'extreme'
  }
  
  // 分析DOM复杂度
  private analyzeDOMComplexity(element: HTMLElement): any {
    const allNodes = element.querySelectorAll('.el-tree-node')
    const visibleNodes = Array.from(allNodes).filter(node => {
      const rect = node.getBoundingClientRect()
      return rect.height > 0 && rect.width > 0
    })
    
    const expandedNodes = element.querySelectorAll('.el-tree-node.is-expanded')
    const leafNodes = element.querySelectorAll('.el-tree-node.is-leaf')
    
    return {
      totalDOMNodes: allNodes.length,
      visibleNodes: visibleNodes.length,
      expandedNodes: expandedNodes.length,
      leafNodes: leafNodes.length,
      renderRatio: visibleNodes.length / allNodes.length,
      expansionRatio: expandedNodes.length / allNodes.length
    }
  }
  
  // 分析渲染性能
  private analyzeRenderPerformance(element: HTMLElement): any {
    const startTime = performance.now()
    
    // 测量重绘时间
    const observer = new MutationObserver(() => {
      const endTime = performance.now()
      this.recordMetric('render-time', endTime - startTime)
    })
    
    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true
    })
    
    // 模拟节点操作
    const testNode = element.querySelector('.el-tree-node')
    if (testNode) {
      testNode.classList.add('test-class')
      testNode.classList.remove('test-class')
    }
    
    observer.disconnect()
    
    return {
      estimatedRenderTime: performance.now() - startTime,
      isOptimal: (performance.now() - startTime) < 16.67 // 60fps
    }
  }
  
  // 分析展开性能
  private analyzeExpandPerformance(element: HTMLElement): Promise<any> {
    return new Promise((resolve) => {
      const expandableNodes = element.querySelectorAll('.el-tree-node__expand-icon:not(.is-leaf)')
      if (expandableNodes.length === 0) {
        resolve({ supported: false })
        return
      }
      
      const expandTimes: number[] = []
      let testCount = 0
      const maxTests = Math.min(5, expandableNodes.length)
      
      const testExpand = (index: number) => {
        if (index >= maxTests) {
          const averageTime = expandTimes.reduce((sum, time) => sum + time, 0) / expandTimes.length
          resolve({
            supported: true,
            averageExpandTime: averageTime,
            maxExpandTime: Math.max(...expandTimes),
            isOptimal: averageTime < 50 // 50ms threshold
          })
          return
        }
        
        const node = expandableNodes[index] as HTMLElement
        const startTime = performance.now()
        
        node.click()
        
        requestAnimationFrame(() => {
          const endTime = performance.now()
          expandTimes.push(endTime - startTime)
          testExpand(index + 1)
        })
      }
      
      testExpand(0)
    })
  }
  
  // 分析搜索性能
  private analyzeSearchPerformance(treeData: any[]): any {
    const searchQueries = ['test', 'node', 'item', 'data']
    const searchTimes: number[] = []
    
    searchQueries.forEach(query => {
      const startTime = performance.now()
      this.searchInTree(treeData, query)
      const endTime = performance.now()
      searchTimes.push(endTime - startTime)
    })
    
    const averageSearchTime = searchTimes.reduce((sum, time) => sum + time, 0) / searchTimes.length
    
    return {
      averageSearchTime,
      maxSearchTime: Math.max(...searchTimes),
      isOptimal: averageSearchTime < 10 // 10ms threshold
    }
  }
  
  // 在树中搜索
  private searchInTree(nodes: any[], query: string): any[] {
    const results: any[] = []
    
    const traverse = (nodeList: any[]) => {
      nodeList.forEach(node => {
        if (node.label && node.label.toLowerCase().includes(query.toLowerCase())) {
          results.push(node)
        }
        
        if (node.children && node.children.length > 0) {
          traverse(node.children)
        }
      })
    }
    
    traverse(nodes)
    return results
  }
  
  // 分析内存使用
  private analyzeMemoryUsage(): any {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      }
    }
    
    return { supported: false }
  }
  
  // 分析滚动性能
  private analyzeScrollPerformance(element: HTMLElement): Promise<any> {
    return new Promise((resolve) => {
      const scrollContainer = element.querySelector('.el-scrollbar__wrap') || element
      
      let frameCount = 0
      const startTime = performance.now()
      
      const measureFrames = () => {
        frameCount++
        
        if (frameCount < 30) {
          scrollContainer.scrollTop += 10
          requestAnimationFrame(measureFrames)
        } else {
          const endTime = performance.now()
          const fps = 1000 / ((endTime - startTime) / frameCount)
          
          resolve({
            fps,
            frameTime: (endTime - startTime) / frameCount,
            isSmooth: fps > 55
          })
        }
      }
      
      requestAnimationFrame(measureFrames)
    })
  }
  
  // 记录指标
  private recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const values = this.metrics.get(name)!
    values.push({
      value,
      timestamp: Date.now()
    })
    
    if (values.length > 50) {
      values.shift()
    }
  }
  
  // 生成建议
  private generateRecommendations(analysis: any): string[] {
    const recommendations: string[] = []
    
    if (analysis.treeStructure.totalNodes > 1000) {
      recommendations.push('使用虚拟滚动优化大量节点的渲染性能')
    }
    
    if (analysis.treeStructure.maxDepth > 10) {
      recommendations.push('考虑限制树的最大深度或使用懒加载')
    }
    
    if (analysis.treeStructure.complexity === 'extreme') {
      recommendations.push('树结构过于复杂，建议优化数据结构或分页显示')
    }
    
    if (analysis.domComplexity.renderRatio < 0.3) {
      recommendations.push('大量隐藏节点影响性能，考虑按需渲染')
    }
    
    if (!analysis.renderPerformance.isOptimal) {
      recommendations.push('优化渲染逻辑，减少不必要的DOM操作')
    }
    
    if (analysis.expandPerformance.supported && !analysis.expandPerformance.isOptimal) {
      recommendations.push('优化节点展开逻辑，使用异步加载')
    }
    
    if (!analysis.searchPerformance.isOptimal) {
      recommendations.push('优化搜索算法，建立索引或使用防抖')
    }
    
    return recommendations
  }
}
```

### 1.2 树形数据结构优化

```typescript
// 优化的树节点接口
interface OptimizedTreeNode {
  id: string | number
  label: string
  children?: OptimizedTreeNode[]
  parent?: OptimizedTreeNode
  level: number
  expanded: boolean
  visible: boolean
  loaded: boolean
  loading: boolean
  disabled?: boolean
  checked?: boolean
  indeterminate?: boolean
  isLeaf?: boolean
  data?: any
  index?: number
  path?: string
}

// 树形数据管理器
class TreeDataManager {
  private nodes: Map<string | number, OptimizedTreeNode> = new Map()
  private flattenedNodes: OptimizedTreeNode[] = []
  private visibleNodes: OptimizedTreeNode[] = []
  private searchIndex: Map<string, Set<string | number>> = new Map()
  private pathIndex: Map<string, OptimizedTreeNode> = new Map()
  private levelIndex: Map<number, OptimizedTreeNode[]> = new Map()
  
  constructor(treeData: any[], options: {
    idKey?: string
    labelKey?: string
    childrenKey?: string
    lazy?: boolean
  } = {}) {
    const {
      idKey = 'id',
      labelKey = 'label',
      childrenKey = 'children',
      lazy = false
    } = options
    
    this.buildTree(treeData, null, 0, '', idKey, labelKey, childrenKey, lazy)
    this.buildIndices()
  }
  
  // 构建树形结构
  private buildTree(
    data: any[],
    parent: OptimizedTreeNode | null,
    level: number,
    parentPath: string,
    idKey: string,
    labelKey: string,
    childrenKey: string,
    lazy: boolean
  ): OptimizedTreeNode[] {
    return data.map((item, index) => {
      const id = item[idKey] || `${parentPath}-${index}`
      const path = parentPath ? `${parentPath}-${id}` : String(id)
      
      const node: OptimizedTreeNode = {
        id,
        label: item[labelKey] || '',
        level,
        expanded: false,
        visible: level === 0, // 只有根节点默认可见
        loaded: !lazy || !item[childrenKey],
        loading: false,
        parent,
        data: item,
        index,
        path,
        isLeaf: !item[childrenKey] || item[childrenKey].length === 0
      }
      
      // 存储节点
      this.nodes.set(id, node)
      this.pathIndex.set(path, node)
      
      // 处理子节点
      if (item[childrenKey] && item[childrenKey].length > 0 && !lazy) {
        node.children = this.buildTree(
          item[childrenKey],
          node,
          level + 1,
          path,
          idKey,
          labelKey,
          childrenKey,
          lazy
        )
        node.isLeaf = false
      }
      
      return node
    })
  }
  
  // 构建索引
  private buildIndices(): void {
    this.flattenedNodes = []
    this.searchIndex.clear()
    this.levelIndex.clear()
    
    const traverse = (nodes: OptimizedTreeNode[]) => {
      nodes.forEach(node => {
        // 扁平化节点
        this.flattenedNodes.push(node)
        
        // 构建搜索索引
        this.buildSearchIndex(node)
        
        // 构建层级索引
        if (!this.levelIndex.has(node.level)) {
          this.levelIndex.set(node.level, [])
        }
        this.levelIndex.get(node.level)!.push(node)
        
        // 递归处理子节点
        if (node.children) {
          traverse(node.children)
        }
      })
    }
    
    const rootNodes = Array.from(this.nodes.values()).filter(node => node.level === 0)
    traverse(rootNodes)
    
    this.updateVisibleNodes()
  }
  
  // 构建搜索索引
  private buildSearchIndex(node: OptimizedTreeNode): void {
    const searchText = node.label.toLowerCase()
    const words = searchText.split(/\s+/)
    
    words.forEach(word => {
      if (word.length > 0) {
        if (!this.searchIndex.has(word)) {
          this.searchIndex.set(word, new Set())
        }
        this.searchIndex.get(word)!.add(node.id)
      }
    })
  }
  
  // 更新可见节点
  private updateVisibleNodes(): void {
    this.visibleNodes = this.flattenedNodes.filter(node => node.visible)
  }
  
  // 展开节点
  expandNode(nodeId: string | number): void {
    const node = this.nodes.get(nodeId)
    if (!node || node.expanded) return
    
    node.expanded = true
    
    // 显示直接子节点
    if (node.children) {
      node.children.forEach(child => {
        child.visible = true
      })
    }
    
    this.updateVisibleNodes()
  }
  
  // 折叠节点
  collapseNode(nodeId: string | number): void {
    const node = this.nodes.get(nodeId)
    if (!node || !node.expanded) return
    
    node.expanded = false
    
    // 隐藏所有后代节点
    this.hideDescendants(node)
    this.updateVisibleNodes()
  }
  
  // 隐藏后代节点
  private hideDescendants(node: OptimizedTreeNode): void {
    if (node.children) {
      node.children.forEach(child => {
        child.visible = false
        child.expanded = false
        this.hideDescendants(child)
      })
    }
  }
  
  // 懒加载子节点
  async loadChildren(
    nodeId: string | number,
    loadFunction: (node: OptimizedTreeNode) => Promise<any[]>
  ): Promise<void> {
    const node = this.nodes.get(nodeId)
    if (!node || node.loaded || node.loading) return
    
    node.loading = true
    
    try {
      const childrenData = await loadFunction(node)
      
      if (childrenData && childrenData.length > 0) {
        node.children = this.buildTree(
          childrenData,
          node,
          node.level + 1,
          node.path!,
          'id',
          'label',
          'children',
          true
        )
        node.isLeaf = false
      } else {
        node.isLeaf = true
      }
      
      node.loaded = true
      this.buildIndices()
    } catch (error) {
      console.error('Failed to load children:', error)
    } finally {
      node.loading = false
    }
  }
  
  // 搜索节点
  search(query: string): OptimizedTreeNode[] {
    if (!query.trim()) {
      // 重置所有节点可见性
      this.flattenedNodes.forEach(node => {
        node.visible = node.level === 0
        node.expanded = false
      })
      this.updateVisibleNodes()
      return this.visibleNodes
    }
    
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0)
    const matchedNodeIds = this.findMatchingNodeIds(queryWords)
    const matchedNodes = Array.from(matchedNodeIds).map(id => this.nodes.get(id)!)
    
    // 显示匹配的节点及其祖先
    this.flattenedNodes.forEach(node => {
      node.visible = false
      node.expanded = false
    })
    
    matchedNodes.forEach(node => {
      this.showNodeAndAncestors(node)
    })
    
    this.updateVisibleNodes()
    return matchedNodes
  }
  
  // 查找匹配的节点ID
  private findMatchingNodeIds(queryWords: string[]): Set<string | number> {
    if (queryWords.length === 0) return new Set()
    
    let matchedIds = this.getIdsForWord(queryWords[0])
    
    for (let i = 1; i < queryWords.length; i++) {
      const wordIds = this.getIdsForWord(queryWords[i])
      matchedIds = new Set([...matchedIds].filter(id => wordIds.has(id)))
    }
    
    return matchedIds
  }
  
  // 获取单词匹配的节点ID
  private getIdsForWord(word: string): Set<string | number> {
    const matchedIds = new Set<string | number>()
    
    // 精确匹配
    if (this.searchIndex.has(word)) {
      this.searchIndex.get(word)!.forEach(id => matchedIds.add(id))
    }
    
    // 前缀匹配
    for (const [indexWord, ids] of this.searchIndex) {
      if (indexWord.startsWith(word)) {
        ids.forEach(id => matchedIds.add(id))
      }
    }
    
    return matchedIds
  }
  
  // 显示节点及其祖先
  private showNodeAndAncestors(node: OptimizedTreeNode): void {
    let current: OptimizedTreeNode | undefined = node
    
    while (current) {
      current.visible = true
      
      if (current.parent) {
        current.parent.expanded = true
      }
      
      current = current.parent
    }
  }
  
  // 获取节点路径
  getNodePath(nodeId: string | number): OptimizedTreeNode[] {
    const node = this.nodes.get(nodeId)
    if (!node) return []
    
    const path: OptimizedTreeNode[] = []
    let current: OptimizedTreeNode | undefined = node
    
    while (current) {
      path.unshift(current)
      current = current.parent
    }
    
    return path
  }
  
  // 获取可见节点
  getVisibleNodes(): OptimizedTreeNode[] {
    return this.visibleNodes
  }
  
  // 获取扁平化节点
  getFlattenedNodes(): OptimizedTreeNode[] {
    return this.flattenedNodes
  }
  
  // 获取指定层级的节点
  getNodesByLevel(level: number): OptimizedTreeNode[] {
    return this.levelIndex.get(level) || []
  }
  
  // 获取节点
  getNode(nodeId: string | number): OptimizedTreeNode | undefined {
    return this.nodes.get(nodeId)
  }
  
  // 获取统计信息
  getStats(): any {
    return {
      totalNodes: this.flattenedNodes.length,
      visibleNodes: this.visibleNodes.length,
      maxLevel: Math.max(...Array.from(this.levelIndex.keys())),
      expandedNodes: this.flattenedNodes.filter(node => node.expanded).length,
      leafNodes: this.flattenedNodes.filter(node => node.isLeaf).length
    }
  }
}
```

## 2. 虚拟化树组件实现

### 2.1 虚拟树滚动管理器

```typescript
// 虚拟树滚动配置
interface VirtualTreeConfig {
  itemHeight: number
  visibleCount: number
  bufferSize: number
  threshold: number
  estimatedTotalHeight: number
}

// 虚拟树滚动管理器
class VirtualTreeScrollManager {
  private config: VirtualTreeConfig
  private container: HTMLElement | null = null
  private content: HTMLElement | null = null
  private visibleNodes: OptimizedTreeNode[] = []
  private scrollTop: number = 0
  private startIndex: number = 0
  private endIndex: number = 0
  private offsetTop: number = 0
  private nodeHeights: Map<string | number, number> = new Map()
  
  constructor(config: Partial<VirtualTreeConfig> = {}) {
    this.config = {
      itemHeight: 26,
      visibleCount: 20,
      bufferSize: 5,
      threshold: 1,
      estimatedTotalHeight: 0,
      ...config
    }
  }
  
  // 初始化
  initialize(container: HTMLElement, content: HTMLElement): void {
    this.container = container
    this.content = content
    
    this.bindEvents()
    this.updateVisibleRange()
  }
  
  private bindEvents(): void {
    if (!this.container) return
    
    this.container.addEventListener('scroll', this.handleScroll.bind(this))
    
    // 监听容器大小变化
    const resizeObserver = new ResizeObserver(() => {
      this.updateVisibleRange()
    })
    
    resizeObserver.observe(this.container)
  }
  
  private handleScroll(): void {
    if (!this.container) return
    
    const newScrollTop = this.container.scrollTop
    
    if (Math.abs(newScrollTop - this.scrollTop) < this.config.threshold) {
      return
    }
    
    this.scrollTop = newScrollTop
    this.updateVisibleRange()
  }
  
  // 设置可见节点
  setVisibleNodes(nodes: OptimizedTreeNode[]): void {
    this.visibleNodes = nodes
    this.updateContentHeight()
    this.updateVisibleRange()
  }
  
  // 更新内容高度
  private updateContentHeight(): void {
    if (!this.content) return
    
    let totalHeight = 0
    
    this.visibleNodes.forEach(node => {
      const height = this.getNodeHeight(node)
      totalHeight += height
    })
    
    this.config.estimatedTotalHeight = totalHeight
    this.content.style.height = `${totalHeight}px`
  }
  
  // 获取节点高度
  private getNodeHeight(node: OptimizedTreeNode): number {
    // 如果已经测量过，返回实际高度
    if (this.nodeHeights.has(node.id)) {
      return this.nodeHeights.get(node.id)!
    }
    
    // 根据节点类型返回不同高度
    let height = this.config.itemHeight
    
    // 根节点可能更高
    if (node.level === 0) {
      height += 4
    }
    
    // 有子节点的节点可能更高
    if (!node.isLeaf) {
      height += 2
    }
    
    return height
  }
  
  // 设置节点实际高度
  setNodeHeight(nodeId: string | number, height: number): void {
    this.nodeHeights.set(nodeId, height)
    this.updateContentHeight()
  }
  
  // 更新可见范围
  private updateVisibleRange(): void {
    if (this.visibleNodes.length === 0) return
    
    let accumulatedHeight = 0
    let startIndex = 0
    let endIndex = 0
    
    // 找到开始索引
    for (let i = 0; i < this.visibleNodes.length; i++) {
      const nodeHeight = this.getNodeHeight(this.visibleNodes[i])
      
      if (accumulatedHeight + nodeHeight > this.scrollTop) {
        startIndex = Math.max(0, i - this.config.bufferSize)
        break
      }
      
      accumulatedHeight += nodeHeight
    }
    
    // 计算偏移量
    let offsetTop = 0
    for (let i = 0; i < startIndex; i++) {
      offsetTop += this.getNodeHeight(this.visibleNodes[i])
    }
    
    // 找到结束索引
    const containerHeight = this.container?.clientHeight || 0
    let visibleHeight = 0
    
    for (let i = startIndex; i < this.visibleNodes.length; i++) {
      const nodeHeight = this.getNodeHeight(this.visibleNodes[i])
      visibleHeight += nodeHeight
      
      if (visibleHeight >= containerHeight + this.config.bufferSize * this.config.itemHeight) {
        endIndex = Math.min(this.visibleNodes.length - 1, i + this.config.bufferSize)
        break
      }
    }
    
    if (endIndex === 0) {
      endIndex = this.visibleNodes.length - 1
    }
    
    this.startIndex = startIndex
    this.endIndex = endIndex
    this.offsetTop = offsetTop
    
    this.onVisibleRangeChange?.({
      startIndex,
      endIndex,
      offsetTop,
      visibleNodes: this.visibleNodes.slice(startIndex, endIndex + 1)
    })
  }
  
  // 滚动到节点
  scrollToNode(nodeId: string | number): void {
    const nodeIndex = this.visibleNodes.findIndex(node => node.id === nodeId)
    if (nodeIndex === -1 || !this.container) return
    
    let targetScrollTop = 0
    for (let i = 0; i < nodeIndex; i++) {
      targetScrollTop += this.getNodeHeight(this.visibleNodes[i])
    }
    
    this.container.scrollTop = targetScrollTop
  }
  
  // 获取可见范围
  getVisibleRange(): {
    startIndex: number
    endIndex: number
    offsetTop: number
    visibleNodes: OptimizedTreeNode[]
  } {
    return {
      startIndex: this.startIndex,
      endIndex: this.endIndex,
      offsetTop: this.offsetTop,
      visibleNodes: this.visibleNodes.slice(this.startIndex, this.endIndex + 1)
    }
  }
  
  // 事件回调
  onVisibleRangeChange?: (range: {
    startIndex: number
    endIndex: number
    offsetTop: number
    visibleNodes: OptimizedTreeNode[]
  }) => void
  
  // 销毁
  destroy(): void {
    this.container?.removeEventListener('scroll', this.handleScroll)
    this.nodeHeights.clear()
  }
}
```

### 2.2 高性能虚拟树组件

```vue
<!-- VirtualTree.vue -->
<template>
  <div class="virtual-tree" :class="treeClass">
    <div 
      v-if="showSearch"
      class="virtual-tree__search"
    >
      <el-input
        v-model="searchQuery"
        :placeholder="searchPlaceholder"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <i class="el-icon-search" />
        </template>
      </el-input>
    </div>
    
    <div 
      ref="containerRef"
      class="virtual-tree__container"
      :style="{ height: height + 'px' }"
    >
      <div 
        ref="contentRef"
        class="virtual-tree__content"
      >
        <div 
          class="virtual-tree__viewport"
          :style="{ transform: `translateY(${offsetTop}px)` }"
        >
          <div 
            v-for="(node, index) in renderNodes"
            :key="node.id"
            :class="getNodeClass(node)"
            class="virtual-tree__node"
            :style="getNodeStyle(node)"
            @click="handleNodeClick(node, $event)"
            ref="nodeRefs"
          >
            <!-- 缩进 -->
            <div 
              class="virtual-tree__indent"
              :style="{ width: (node.level * indent) + 'px' }"
            />
            
            <!-- 展开/折叠图标 -->
            <div 
              v-if="!node.isLeaf"
              class="virtual-tree__expand-icon"
              :class="{
                'is-expanded': node.expanded,
                'is-loading': node.loading
              }"
              @click.stop="handleExpandClick(node)"
            >
              <i 
                v-if="node.loading"
                class="el-icon-loading"
              />
              <i 
                v-else
                class="el-icon-caret-right"
              />
            </div>
            <div 
              v-else
              class="virtual-tree__expand-icon virtual-tree__expand-icon--leaf"
            />
            
            <!-- 复选框 -->
            <el-checkbox 
              v-if="showCheckbox"
              :model-value="node.checked"
              :indeterminate="node.indeterminate"
              :disabled="node.disabled"
              @change="handleCheckChange(node, $event)"
              @click.stop
            />
            
            <!-- 节点内容 -->
            <div class="virtual-tree__node-content">
              <slot 
                name="node" 
                :node="node" 
                :data="node.data"
              >
                <span class="virtual-tree__node-label">
                  {{ node.label }}
                </span>
              </slot>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        v-if="loading"
        class="virtual-tree__loading"
      >
        <i class="el-icon-loading" />
        <span>{{ loadingText }}</span>
      </div>
      
      <div 
        v-else-if="renderNodes.length === 0"
        class="virtual-tree__empty"
      >
        {{ emptyText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { ElInput, ElCheckbox } from 'element-plus'

// 类型定义
interface TreeNode {
  id: string | number
  label: string
  children?: TreeNode[]
  disabled?: boolean
  [key: string]: any
}

// Props
interface Props {
  data: TreeNode[]
  height?: number
  itemHeight?: number
  indent?: number
  showCheckbox?: boolean
  showSearch?: boolean
  searchPlaceholder?: string
  loading?: boolean
  loadingText?: string
  emptyText?: string
  lazy?: boolean
  load?: (node: OptimizedTreeNode) => Promise<TreeNode[]>
  nodeKey?: string
  defaultExpandAll?: boolean
  defaultExpandedKeys?: (string | number)[]
  defaultCheckedKeys?: (string | number)[]
  checkStrictly?: boolean
  visibleCount?: number
  bufferSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 400,
  itemHeight: 26,
  indent: 18,
  showCheckbox: false,
  showSearch: false,
  searchPlaceholder: '搜索节点',
  loading: false,
  loadingText: '加载中...',
  emptyText: '暂无数据',
  lazy: false,
  nodeKey: 'id',
  defaultExpandAll: false,
  defaultExpandedKeys: () => [],
  defaultCheckedKeys: () => [],
  checkStrictly: false,
  visibleCount: 20,
  bufferSize: 5
})

// Emits
interface Emits {
  'node-click': [node: OptimizedTreeNode, event: MouseEvent]
  'node-expand': [node: OptimizedTreeNode]
  'node-collapse': [node: OptimizedTreeNode]
  'check-change': [node: OptimizedTreeNode, checked: boolean]
  'search': [query: string]
}

const emit = defineEmits<Emits>()

// 响应式数据
const containerRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const nodeRefs = ref<HTMLElement[]>([])

const searchQuery = ref('')
const startIndex = ref(0)
const endIndex = ref(0)
const offsetTop = ref(0)

// 数据管理器和虚拟滚动管理器
let dataManager: TreeDataManager | null = null
let virtualScrollManager: VirtualTreeScrollManager | null = null

// 计算属性
const treeClass = computed(() => ({
  'virtual-tree--loading': props.loading,
  'virtual-tree--checkbox': props.showCheckbox
}))

const renderNodes = computed(() => {
  if (!dataManager) return []
  
  const visibleNodes = dataManager.getVisibleNodes()
  return visibleNodes.slice(startIndex.value, endIndex.value + 1)
})

// 方法
const initializeDataManager = () => {
  dataManager = new TreeDataManager(props.data, {
    idKey: props.nodeKey,
    labelKey: 'label',
    childrenKey: 'children',
    lazy: props.lazy
  })
  
  // 处理默认展开
  if (props.defaultExpandAll) {
    const allNodes = dataManager.getFlattenedNodes()
    allNodes.forEach(node => {
      if (!node.isLeaf) {
        dataManager!.expandNode(node.id)
      }
    })
  } else if (props.defaultExpandedKeys.length > 0) {
    props.defaultExpandedKeys.forEach(key => {
      dataManager!.expandNode(key)
    })
  }
  
  // 处理默认选中
  if (props.defaultCheckedKeys.length > 0) {
    props.defaultCheckedKeys.forEach(key => {
      const node = dataManager!.getNode(key)
      if (node) {
        node.checked = true
      }
    })
  }
}

const initializeVirtualScroll = async () => {
  await nextTick()
  
  if (!containerRef.value || !contentRef.value || !dataManager) return
  
  virtualScrollManager = new VirtualTreeScrollManager({
    itemHeight: props.itemHeight,
    visibleCount: props.visibleCount,
    bufferSize: props.bufferSize
  })
  
  virtualScrollManager.onVisibleRangeChange = (range) => {
    startIndex.value = range.startIndex
    endIndex.value = range.endIndex
    offsetTop.value = range.offsetTop
  }
  
  virtualScrollManager.initialize(containerRef.value, contentRef.value)
  updateVirtualScroll()
}

const updateVirtualScroll = () => {
  if (!virtualScrollManager || !dataManager) return
  
  const visibleNodes = dataManager.getVisibleNodes()
  virtualScrollManager.setVisibleNodes(visibleNodes)
}

const updateNodeHeights = async () => {
  await nextTick()
  
  if (!virtualScrollManager || !nodeRefs.value) return
  
  nodeRefs.value.forEach((nodeEl, index) => {
    if (nodeEl) {
      const height = nodeEl.offsetHeight
      const actualIndex = startIndex.value + index
      const visibleNodes = dataManager!.getVisibleNodes()
      const node = visibleNodes[actualIndex]
      
      if (node) {
        virtualScrollManager!.setNodeHeight(node.id, height)
      }
    }
  })
}

const getNodeClass = (node: OptimizedTreeNode) => ({
  'virtual-tree__node--expanded': node.expanded,
  'virtual-tree__node--selected': node.checked,
  'virtual-tree__node--disabled': node.disabled,
  'virtual-tree__node--leaf': node.isLeaf,
  [`virtual-tree__node--level-${node.level}`]: true
})

const getNodeStyle = (node: OptimizedTreeNode) => ({
  height: `${props.itemHeight}px`,
  lineHeight: `${props.itemHeight}px`
})

const handleNodeClick = (node: OptimizedTreeNode, event: MouseEvent) => {
  if (node.disabled) return
  
  emit('node-click', node, event)
}

const handleExpandClick = async (node: OptimizedTreeNode) => {
  if (node.disabled || node.loading) return
  
  if (node.expanded) {
    dataManager!.collapseNode(node.id)
    emit('node-collapse', node)
  } else {
    // 懒加载
    if (props.lazy && !node.loaded && props.load) {
      await dataManager!.loadChildren(node.id, props.load)
    }
    
    dataManager!.expandNode(node.id)
    emit('node-expand', node)
  }
  
  updateVirtualScroll()
}

const handleCheckChange = (node: OptimizedTreeNode, checked: boolean) => {
  if (node.disabled) return
  
  node.checked = checked
  node.indeterminate = false
  
  // 如果不是严格模式，需要处理父子关系
  if (!props.checkStrictly) {
    updateChildrenCheckState(node, checked)
    updateParentCheckState(node)
  }
  
  emit('check-change', node, checked)
}

const updateChildrenCheckState = (node: OptimizedTreeNode, checked: boolean) => {
  if (node.children) {
    node.children.forEach(child => {
      if (!child.disabled) {
        child.checked = checked
        child.indeterminate = false
        updateChildrenCheckState(child, checked)
      }
    })
  }
}

const updateParentCheckState = (node: OptimizedTreeNode) => {
  const parent = node.parent
  if (!parent || parent.disabled) return
  
  const siblings = parent.children || []
  const checkedCount = siblings.filter(sibling => sibling.checked && !sibling.disabled).length
  const indeterminateCount = siblings.filter(sibling => sibling.indeterminate && !sibling.disabled).length
  const enabledCount = siblings.filter(sibling => !sibling.disabled).length
  
  if (checkedCount === enabledCount) {
    parent.checked = true
    parent.indeterminate = false
  } else if (checkedCount > 0 || indeterminateCount > 0) {
    parent.checked = false
    parent.indeterminate = true
  } else {
    parent.checked = false
    parent.indeterminate = false
  }
  
  updateParentCheckState(parent)
}

const handleSearch = (query: string) => {
  if (!dataManager) return
  
  dataManager.search(query)
  updateVirtualScroll()
  
  emit('search', query)
}

// 公开方法
const getCheckedNodes = (leafOnly: boolean = false): OptimizedTreeNode[] => {
  if (!dataManager) return []
  
  const allNodes = dataManager.getFlattenedNodes()
  return allNodes.filter(node => {
    if (!node.checked) return false
    if (leafOnly) return node.isLeaf
    return true
  })
}

const getCheckedKeys = (leafOnly: boolean = false): (string | number)[] => {
  return getCheckedNodes(leafOnly).map(node => node.id)
}

const setCheckedKeys = (keys: (string | number)[]): void => {
  if (!dataManager) return
  
  const allNodes = dataManager.getFlattenedNodes()
  
  // 先清除所有选中状态
  allNodes.forEach(node => {
    node.checked = false
    node.indeterminate = false
  })
  
  // 设置指定节点为选中
  keys.forEach(key => {
    const node = dataManager!.getNode(key)
    if (node && !node.disabled) {
      node.checked = true
      
      if (!props.checkStrictly) {
        updateChildrenCheckState(node, true)
        updateParentCheckState(node)
      }
    }
  })
}

const scrollToNode = (key: string | number): void => {
  virtualScrollManager?.scrollToNode(key)
}

const refresh = (): void => {
  updateVirtualScroll()
}

// 监听器
watch(() => props.data, () => {
  initializeDataManager()
  updateVirtualScroll()
}, { deep: true })

watch(renderNodes, () => {
  updateNodeHeights()
}, { flush: 'post' })

// 生命周期
onMounted(() => {
  initializeDataManager()
  initializeVirtualScroll()
})

onUnmounted(() => {
  virtualScrollManager?.destroy()
})

// 暴露方法
defineExpose({
  getCheckedNodes,
  getCheckedKeys,
  setCheckedKeys,
  scrollToNode,
  refresh
})
</script>

<style scoped>
.virtual-tree {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.virtual-tree__search {
  padding: 8px;
  border-bottom: 1px solid #dcdfe6;
  background-color: #fafafa;
}

.virtual-tree__container {
  position: relative;
  overflow: auto;
}

.virtual-tree__content {
  position: relative;
}

.virtual-tree__viewport {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.virtual-tree__node {
  display: flex;
  align-items: center;
  padding: 0 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.virtual-tree__node:hover {
  background-color: #f5f7fa;
}

.virtual-tree__node--selected {
  background-color: #ecf5ff;
}

.virtual-tree__node--disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

.virtual-tree__node--disabled:hover {
  background-color: transparent;
}

.virtual-tree__indent {
  flex-shrink: 0;
}

.virtual-tree__expand-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  cursor: pointer;
  transition: transform 0.3s;
}

.virtual-tree__expand-icon.is-expanded {
  transform: rotate(90deg);
}

.virtual-tree__expand-icon--leaf {
  cursor: default;
}

.virtual-tree__expand-icon i {
  font-size: 12px;
  color: #c0c4cc;
}

.virtual-tree__node-content {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.virtual-tree__node-label {
  font-size: 14px;
  color: #606266;
}

.virtual-tree__loading,
.virtual-tree__empty {
  padding: 20px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.virtual-tree__loading i {
  margin-right: 8px;
}

/* 复选框样式调整 */
.virtual-tree--checkbox .virtual-tree__node {
  padding-left: 4px;
}

.virtual-tree--checkbox .el-checkbox {
  margin-right: 8px;
}

/* 滚动条样式 */
.virtual-tree__container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.virtual-tree__container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.virtual-tree__container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.virtual-tree__container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
```

## 3. 智能节点加载策略

### 3.1 懒加载管理器

```typescript
// 懒加载配置
interface LazyLoadConfig {
  loadFunction: (node: OptimizedTreeNode) => Promise<TreeNode[]>
  cacheSize: number
  preloadDepth: number
  loadTimeout: number
  retryCount: number
  retryDelay: number
}

// 懒加载管理器
class LazyLoadManager {
  private config: LazyLoadConfig
  private loadingNodes: Set<string | number> = new Set()
  private loadCache: Map<string | number, TreeNode[]> = new Map()
  private loadPromises: Map<string | number, Promise<TreeNode[]>> = new Map()
  private retryCount: Map<string | number, number> = new Map()
  
  constructor(config: LazyLoadConfig) {
    this.config = config
  }
  
  // 加载节点子数据
  async loadNodeChildren(node: OptimizedTreeNode): Promise<TreeNode[]> {
    // 如果已经加载过，直接返回缓存
    if (this.loadCache.has(node.id)) {
      return this.loadCache.get(node.id)!
    }
    
    // 如果正在加载，返回现有的Promise
    if (this.loadPromises.has(node.id)) {
      return this.loadPromises.get(node.id)!
    }
    
    // 如果已经在加载中，等待完成
    if (this.loadingNodes.has(node.id)) {
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!this.loadingNodes.has(node.id)) {
            resolve(this.loadCache.get(node.id) || [])
          } else {
            setTimeout(checkLoading, 100)
          }
        }
        checkLoading()
      })
    }
    
    // 开始加载
    this.loadingNodes.add(node.id)
    
    const loadPromise = this.performLoad(node)
    this.loadPromises.set(node.id, loadPromise)
    
    try {
      const result = await loadPromise
      
      // 缓存结果
      this.cacheResult(node.id, result)
      
      // 预加载子节点
      this.preloadChildren(result)
      
      return result
    } catch (error) {
      console.error(`Failed to load children for node ${node.id}:`, error)
      
      // 重试逻辑
      const retryCount = this.retryCount.get(node.id) || 0
      if (retryCount < this.config.retryCount) {
        this.retryCount.set(node.id, retryCount + 1)
        
        // 延迟重试
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay))
        return this.loadNodeChildren(node)
      }
      
      throw error
    } finally {
      this.loadingNodes.delete(node.id)
      this.loadPromises.delete(node.id)
    }
  }
  
  // 执行加载
  private async performLoad(node: OptimizedTreeNode): Promise<TreeNode[]> {
    return new Promise(async (resolve, reject) => {
      // 设置超时
      const timeout = setTimeout(() => {
        reject(new Error(`Load timeout for node ${node.id}`))
      }, this.config.loadTimeout)
      
      try {
        const result = await this.config.loadFunction(node)
        clearTimeout(timeout)
        resolve(result || [])
      } catch (error) {
        clearTimeout(timeout)
        reject(error)
      }
    })
  }
  
  // 缓存结果
  private cacheResult(nodeId: string | number, result: TreeNode[]): void {
    // 限制缓存大小
    if (this.loadCache.size >= this.config.cacheSize) {
      const firstKey = this.loadCache.keys().next().value
      this.loadCache.delete(firstKey)
    }
    
    this.loadCache.set(nodeId, result)
  }
  
  // 预加载子节点
  private async preloadChildren(nodes: TreeNode[]): Promise<void> {
    if (this.config.preloadDepth <= 0) return
    
    const preloadPromises = nodes
      .filter(node => !node.isLeaf && !this.loadCache.has(node.id))
      .slice(0, 5) // 限制预加载数量
      .map(async (node) => {
        try {
          const optimizedNode: OptimizedTreeNode = {
            ...node,
            level: 0,
            expanded: false,
            visible: false,
            loaded: false,
            loading: false
          }
          
          await this.loadNodeChildren(optimizedNode)
        } catch (error) {
          // 预加载失败不影响主流程
          console.warn(`Preload failed for node ${node.id}:`, error)
        }
      })
    
    await Promise.allSettled(preloadPromises)
  }
  
  // 批量加载
  async batchLoad(nodes: OptimizedTreeNode[]): Promise<Map<string | number, TreeNode[]>> {
    const results = new Map<string | number, TreeNode[]>()
    
    // 并发加载，但限制并发数
    const concurrency = 3
    const chunks = this.chunkArray(nodes, concurrency)
    
    for (const chunk of chunks) {
      const promises = chunk.map(async (node) => {
        try {
          const children = await this.loadNodeChildren(node)
          results.set(node.id, children)
        } catch (error) {
          console.error(`Batch load failed for node ${node.id}:`, error)
          results.set(node.id, [])
        }
      })
      
      await Promise.allSettled(promises)
    }
    
    return results
  }
  
  // 分块数组
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }
  
  // 清除缓存
  clearCache(nodeId?: string | number): void {
    if (nodeId) {
      this.loadCache.delete(nodeId)
      this.retryCount.delete(nodeId)
    } else {
      this.loadCache.clear()
      this.retryCount.clear()
    }
  }
  
  // 获取缓存统计
  getCacheStats(): any {
    return {
      cacheSize: this.loadCache.size,
      loadingCount: this.loadingNodes.size,
      maxCacheSize: this.config.cacheSize
    }
  }
  
  // 预热缓存
  async warmupCache(nodes: OptimizedTreeNode[]): Promise<void> {
    const warmupNodes = nodes
      .filter(node => !node.isLeaf && !this.loadCache.has(node.id))
      .slice(0, 10) // 限制预热数量
    
    await this.batchLoad(warmupNodes)
  }
}
```

### 3.2 智能缓存策略

```typescript
// 缓存策略接口
interface CacheStrategy {
  shouldCache(node: OptimizedTreeNode, data: TreeNode[]): boolean
  shouldEvict(nodeId: string | number, lastAccess: number): boolean
  getPriority(node: OptimizedTreeNode): number
}

// LRU缓存策略
class LRUCacheStrategy implements CacheStrategy {
  private maxAge: number
  private accessTimes: Map<string | number, number> = new Map()
  
  constructor(maxAge: number = 300000) { // 5分钟
    this.maxAge = maxAge
  }
  
  shouldCache(node: OptimizedTreeNode, data: TreeNode[]): boolean {
    // 缓存非空数据和经常访问的节点
    return data.length > 0 || this.getAccessCount(node.id) > 2
  }
  
  shouldEvict(nodeId: string | number, lastAccess: number): boolean {
    const now = Date.now()
    return (now - lastAccess) > this.maxAge
  }
  
  getPriority(node: OptimizedTreeNode): number {
    const accessCount = this.getAccessCount(node.id)
    const recency = Date.now() - (this.accessTimes.get(node.id) || 0)
    
    // 访问次数越多，最近访问时间越近，优先级越高
    return accessCount * 1000 - recency
  }
  
  recordAccess(nodeId: string | number): void {
    this.accessTimes.set(nodeId, Date.now())
  }
  
  private getAccessCount(nodeId: string | number): number {
    // 简化实现，实际可以维护访问计数
    return this.accessTimes.has(nodeId) ? 1 : 0
  }
}

// 智能缓存管理器
class SmartCacheManager {
  private cache: Map<string | number, {
    data: TreeNode[]
    timestamp: number
    accessCount: number
    size: number
  }> = new Map()
  
  private strategy: CacheStrategy
  private maxSize: number
  private maxMemory: number // bytes
  private currentMemory: number = 0
  
  constructor(
    strategy: CacheStrategy,
    maxSize: number = 1000,
    maxMemory: number = 50 * 1024 * 1024 // 50MB
  ) {
    this.strategy = strategy
    this.maxSize = maxSize
    this.maxMemory = maxMemory
  }
  
  // 获取缓存数据
  get(nodeId: string | number): TreeNode[] | null {
    const entry = this.cache.get(nodeId)
    if (!entry) return null
    
    // 更新访问信息
    entry.accessCount++
    entry.timestamp = Date.now()
    
    return entry.data
  }
  
  // 设置缓存数据
  set(nodeId: string | number, data: TreeNode[], node: OptimizedTreeNode): void {
    if (!this.strategy.shouldCache(node, data)) return
    
    const size = this.calculateDataSize(data)
    
    // 检查内存限制
    if (this.currentMemory + size > this.maxMemory) {
      this.evictByMemory(size)
    }
    
    // 检查数量限制
    if (this.cache.size >= this.maxSize) {
      this.evictBySize()
    }
    
    // 添加到缓存
    this.cache.set(nodeId, {
      data,
      timestamp: Date.now(),
      accessCount: 1,
      size
    })
    
    this.currentMemory += size
  }
  
  // 计算数据大小
  private calculateDataSize(data: TreeNode[]): number {
    // 简化计算，实际可以更精确
    return JSON.stringify(data).length * 2 // 假设每个字符2字节
  }
  
  // 按内存驱逐
  private evictByMemory(requiredSize: number): void {
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => {
        const priorityA = this.strategy.getPriority({ id: a[0] } as OptimizedTreeNode)
        const priorityB = this.strategy.getPriority({ id: b[0] } as OptimizedTreeNode)
        return priorityA - priorityB // 优先级低的先驱逐
      })
    
    let freedMemory = 0
    for (const [nodeId, entry] of entries) {
      this.cache.delete(nodeId)
      this.currentMemory -= entry.size
      freedMemory += entry.size
      
      if (freedMemory >= requiredSize) break
    }
  }
  
  // 按数量驱逐
  private evictBySize(): void {
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp) // 最久未访问的先驱逐
    
    const toEvict = entries.slice(0, Math.floor(this.maxSize * 0.1)) // 驱逐10%
    
    toEvict.forEach(([nodeId, entry]) => {
      this.cache.delete(nodeId)
      this.currentMemory -= entry.size
    })
  }
  
  // 清理过期缓存
  cleanup(): void {
    const now = Date.now()
    const toDelete: (string | number)[] = []
    
    for (const [nodeId, entry] of this.cache) {
      if (this.strategy.shouldEvict(nodeId, entry.timestamp)) {
        toDelete.push(nodeId)
      }
    }
    
    toDelete.forEach(nodeId => {
      const entry = this.cache.get(nodeId)
      if (entry) {
        this.cache.delete(nodeId)
        this.currentMemory -= entry.size
      }
    })
  }
  
  // 获取缓存统计
  getStats(): any {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      memoryUsage: this.currentMemory,
      maxMemory: this.maxMemory,
      memoryUsagePercent: (this.currentMemory / this.maxMemory) * 100,
      hitRate: this.calculateHitRate()
    }
  }
  
  private calculateHitRate(): number {
    // 简化实现，实际需要跟踪命中和未命中次数
    return this.cache.size > 0 ? 0.8 : 0
  }
  
  // 清空缓存
  clear(): void {
    this.cache.clear()
    this.currentMemory = 0
  }
}
```

## 4. 实践练习

1. **性能分析实践**：
   - 分析树组件性能瓶颈
   - 实现性能监控工具
   - 优化渲染性能

2. **虚拟化实现**：
   - 实现虚拟树滚动
   - 处理动态节点高度
   - 优化滚动体验

3. **懒加载优化**：
   - 实现智能懒加载
   - 添加缓存机制
   - 优化加载策略

## 5. 学习资源

- [Tree Data Structures](https://en.wikipedia.org/wiki/Tree_(data_structure))
- [Virtual Scrolling for Trees](https://blog.logrocket.com/virtual-scrolling-core-principles-and-basic-implementation-in-react/)
- [Lazy Loading Best Practices](https://web.dev/lazy-loading/)
- [Element Plus Tree Source Code](https://github.com/element-plus/element-plus/tree/dev/packages/components/tree)

## 6. 作业

- 实现完整的虚拟化树组件
- 添加智能懒加载功能
- 创建性能优化方案
- 编写组件使用文档

## 总结

通过第81天的学习，我们深入掌握了：

1. **性能分析**：学会了分析树组件的性能瓶颈和优化策略
2. **虚拟化技术**：实现了高效的虚拟树滚动和渲染
3. **懒加载机制**：构建了智能的节点加载和缓存系统
4. **数据管理**：优化了树形数据结构和索引机制

这些技能将帮助我们构建高性能的树形组件，适用于大数据量的复杂业务场景。