# Empty

## Overview

The Empty component is used to display a placeholder when there is no data to show. It provides visual feedback to users that a container is empty, and can optionally guide them on what actions to take.

## Learning Objectives

- Master the basic usage of the Empty component
- Learn to customize the Empty component's appearance
- Understand how to use the Empty component in different scenarios
- Apply the Empty component in practical applications

## Basic Usage

### Basic Empty

The simplest usage of the Empty component:

```vue
<template>
  <div class="empty-demo">
    <h3>Basic Empty</h3>
    
    <el-empty description="No Data" />
  </div>
</template>

<style scoped>
.empty-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>
```

### Custom Image

You can customize the image displayed in the Empty component:

```vue
<template>
  <div class="custom-image-demo">
    <h3>Custom Image</h3>
    
    <div class="empty-examples">
      <div class="empty-item">
        <h4>Custom Image URL</h4>
        <el-empty 
          image="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          description="No hamburgers available"
        />
      </div>
      
      <div class="empty-item">
        <h4>Custom Image Size</h4>
        <el-empty 
          :image-size="100"
          description="Smaller image"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-image-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 20px;
}

.empty-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.empty-item {
  flex: 1;
  min-width: 300px;
  padding: 20px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}

.empty-item h4 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #606266;
}
</style>
```

### Custom Content

You can add custom content to the Empty component using slots:

```vue
<template>
  <div class="custom-content-demo">
    <h3>Custom Content</h3>
    
    <el-empty description="No search results found">
      <template #image>
        <el-icon :size="60" color="#909399">
          <Search />
        </el-icon>
      </template>
      
      <template #default>
        <el-button type="primary">Clear Search</el-button>
      </template>
    </el-empty>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
</script>

<style scoped>
.custom-content-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>
```

## Practical Application Examples

### Empty Table

```vue
<template>
  <div class="empty-table-demo">
    <h3>Empty Table Example</h3>
    
    <div class="controls">
      <el-input
        v-model="searchQuery"
        placeholder="Search users..."
        clearable
        style="width: 300px; margin-right: 10px"
      />
      <el-button type="primary" @click="search">Search</el-button>
      <el-button @click="resetSearch">Reset</el-button>
    </div>
    
    <el-table
      v-loading="loading"
      :data="filteredUsers"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="role" label="Role" />
      <el-table-column prop="status" label="Status" />
      
      <template #empty>
        <el-empty 
          :image-size="100"
          :description="emptyDescription"
        >
          <el-button v-if="hasSearchQuery" type="primary" @click="resetSearch">
            Clear Search
          </el-button>
          <el-button v-else type="primary" @click="addUser">
            Add First User
          </el-button>
        </el-empty>
      </template>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const users = ref([
  {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'Active'
  },
  {
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'User',
    status: 'Inactive'
  }
])

const searchQuery = ref('')
const loading = ref(false)
const showAllUsers = ref(true)

const filteredUsers = computed(() => {
  if (!showAllUsers.value) {
    return []
  }
  
  if (!searchQuery.value) {
    return users.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.role.toLowerCase().includes(query)
  )
})

const hasSearchQuery = computed(() => searchQuery.value.trim() !== '')

const emptyDescription = computed(() => {
  if (hasSearchQuery.value) {
    return `No results found for "${searchQuery.value}"`
  } else if (!showAllUsers.value) {
    return 'No users available'
  } else {
    return 'No user data'
  }
})

const search = () => {
  loading.value = true
  
  // Simulate API request
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const resetSearch = () => {
  searchQuery.value = ''
  showAllUsers.value = true
  loading.value = false
}

const addUser = () => {
  ElMessage.info('Opening user creation form')
}
</script>

<style scoped>
.empty-table-demo {
  padding: 20px;
}

.controls {
  display: flex;
  align-items: center;
}
</style>
```

### Empty List with Actions

```vue
<template>
  <div class="empty-list-demo">
    <h3>Empty List Example</h3>
    
    <div class="list-container">
      <div class="list-header">
        <h4>{{ listTitle }}</h4>
        <el-button type="primary" size="small" @click="toggleItems">
          {{ hasItems ? 'Clear List' : 'Add Items' }}
        </el-button>
      </div>
      
      <div v-if="hasItems" class="item-list">
        <div v-for="(item, index) in items" :key="index" class="list-item">
          <div class="item-content">
            <el-icon><Document /></el-icon>
            <span>{{ item.name }}</span>
          </div>
          <el-button link type="danger" @click="removeItem(index)">
            Remove
          </el-button>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <el-empty 
          description="No items in your list"
          :image-size="120"
        >
          <template #image>
            <el-image 
              src="https://shadow.elemecdn.com/app/element/empty-file.9a80ae67-55e9-11e9-a976-7f4d0b07eef6.png"
              style="width: 120px"
            />
          </template>
          
          <div class="empty-actions">
            <p class="empty-tip">Add your first item to get started</p>
            <el-button type="primary" @click="toggleItems">Add Items</el-button>
            <el-button @click="showTutorial">View Tutorial</el-button>
          </div>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const hasItems = ref(false)
const items = ref([
  { name: 'Document 1.docx', size: '25KB' },
  { name: 'Spreadsheet.xlsx', size: '48KB' },
  { name: 'Presentation.pptx', size: '1.2MB' },
  { name: 'Report.pdf', size: '3.5MB' }
])

const listTitle = computed(() => {
  return hasItems.value ? `Your Files (${items.value.length})` : 'Your Files'
})

const toggleItems = () => {
  hasItems.value = !hasItems.value
}

const removeItem = (index) => {
  items.value.splice(index, 1)
  
  if (items.value.length === 0) {
    hasItems.value = false
  }
  
  ElMessage.success('Item removed')
}

const showTutorial = () => {
  ElMessage.info('Opening tutorial')
}
</script>

<style scoped>
.empty-list-demo {
  padding: 20px;
}

.list-container {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-header h4 {
  margin: 0;
  color: #303133;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.empty-state {
  padding: 20px 0;
}

.empty-actions {
  margin-top: 20px;
}

.empty-tip {
  color: #909399;
  font-size: 14px;
  margin-bottom: 16px;
}
</style>
```

### Empty State in Tabs

```vue
<template>
  <div class="empty-tabs-demo">
    <h3>Empty Tabs Example</h3>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="All Projects" name="all">
        <div class="tab-content">
          <div v-if="projects.length > 0" class="projects-grid">
            <div v-for="project in projects" :key="project.id" class="project-card">
              <h4>{{ project.name }}</h4>
              <p>{{ project.description }}</p>
              <div class="project-footer">
                <span>{{ project.date }}</span>
                <el-button size="small" type="primary">View</el-button>
              </div>
            </div>
          </div>
          <el-empty v-else description="No projects found">
            <el-button type="primary" @click="createProject">Create Project</el-button>
          </el-empty>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="Active" name="active">
        <div class="tab-content">
          <el-empty 
            description="No active projects"
            image="https://shadow.elemecdn.com/app/element/empty-state.9a5cac37-55e9-11e9-a976-7f4d0b07eef6.png"
          >
            <el-button type="primary" @click="createProject">Create Project</el-button>
          </el-empty>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="Archived" name="archived">
        <div class="tab-content">
          <el-empty description="No archived projects">
            <template #image>
              <el-icon :size="60" color="#909399">
                <Folder />
              </el-icon>
            </template>
            <p class="empty-description">Projects will be archived here when you no longer need them</p>
          </el-empty>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Folder } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('all')
const projects = ref([
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Redesign of the company website with new branding',
    date: '2023-04-15'
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'Development of iOS and Android mobile applications',
    date: '2023-03-22'
  },
  {
    id: 3,
    name: 'Marketing Campaign',
    description: 'Q2 digital marketing campaign planning and execution',
    date: '2023-04-01'
  }
])

const createProject = () => {
  ElMessage.info('Opening project creation form')
}
</script>

<style scoped>
.empty-tabs-demo {
  padding: 20px;
}

.tab-content {
  padding: 20px 0;
  min-height: 300px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.project-card {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 16px;
  background-color: #fff;
}

.project-card h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.project-card p {
  margin: 0 0 16px 0;
  color: #606266;
  font-size: 14px;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #909399;
  font-size: 13px;
}

.empty-description {
  color: #909399;
  font-size: 14px;
  margin-top: 16px;
}
</style>
```

## API Documentation

### Empty Attributes

| Parameter | Description | Type | Accepted Values | Default |
|------|------|------|--------|--------|
| image | URL of image | string | — | — |
| image-size | Size of image | number | — | — |
| description | Description | string | — | — |

### Empty Slots

| Name | Description |
|------|------|
| default | Custom content at the bottom |
| image | Custom image content |
| description | Custom description content |

## Best Practices

### When to Use the Empty Component

- **Data Lists**: Use when a list, table, or grid has no items to display
- **Search Results**: Show when a search returns no results
- **Filtered Content**: Display when filters have eliminated all content
- **Initial States**: Use for sections that start with no content until the user adds items
- **Error States**: Show when content cannot be loaded due to errors

### Design Tips

1. **Clear Communication**:
   - Use descriptive text that explains why the content is empty
   - For search/filter results, include the search terms in the message
   - Avoid negative language like "failed" or "error" unless appropriate

2. **Actionable Guidance**:
   - Provide clear next steps for the user
   - Include action buttons when appropriate (e.g., "Create New", "Clear Filters")
   - Consider linking to help documentation for complex features

3. **Visual Design**:
   - Use appropriate imagery that relates to the empty state context
   - Keep the design simple and uncluttered
   - Ensure the empty state is visually distinct but consistent with your app's design

4. **Contextual Adaptation**:
   - Adjust the empty state based on the context (e.g., different messages for "no items" vs "no search results")
   - Consider the user's journey and what led them to the empty state
   - Tailor the call to action based on the user's permissions and capabilities

### Accessibility Considerations

- Ensure that empty state messages are available to screen readers
- Provide sufficient color contrast for text
- Make sure any actionable elements are keyboard accessible
- Use semantic HTML elements for structure

## Summary

The Empty component is a useful tool for providing feedback to users when there is no data to display. It helps improve the user experience by clearly communicating the state of the application and guiding users on what actions they can take.

Through this document, you should be able to:

1. Implement basic Empty components with custom images and descriptions
2. Customize the appearance and content of Empty components
3. Apply the Empty component in practical scenarios like tables, lists, and tabs
4. Follow best practices for effective empty state design

By using the Empty component effectively, you can turn potentially confusing "no data" situations into opportunities for user guidance and engagement.

## References

- [Element Plus Empty Official Documentation](https://element-plus.org/en-US/component/empty.html)
- [UX Design for Empty States](https://www.smashingmagazine.com/2017/02/designing-empty-states-in-complex-applications/)
- [Empty States UX Design](https://www.nngroup.com/articles/empty-state-interface-design/)