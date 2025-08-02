# Progress

## Overview

The Progress component is used to display the progress of operations and provide feedback to users. It helps users understand the current status of ongoing operations and how much time might be needed to complete them.

## Learning Objectives

- Master the basic usage of the Progress component
- Learn to use different progress types (line, circle, dashboard)
- Understand how to customize the appearance of the Progress component
- Apply the Progress component in practical scenarios

## Basic Usage

### Line Progress

The default Progress component displays a horizontal progress bar:

```vue
<template>
  <div class="progress-demo">
    <h3>Basic Line Progress</h3>
    
    <el-progress :percentage="50" />
    
    <h4>With Status</h4>
    <el-progress :percentage="100" status="success" />
    <el-progress :percentage="80" status="warning" />
    <el-progress :percentage="50" status="exception" />
  </div>
</template>

<style scoped>
.progress-demo {
  padding: 20px;
}

.progress-demo h3 {
  margin-bottom: 20px;
}

.progress-demo h4 {
  margin: 20px 0 10px;
}

.el-progress {
  margin-bottom: 15px;
}
</style>
```

### Circle Progress

Use the `type="circle"` attribute to display a circular progress bar:

```vue
<template>
  <div class="circle-progress-demo">
    <h3>Circle Progress</h3>
    
    <div class="progress-group">
      <el-progress type="circle" :percentage="25" />
      <el-progress type="circle" :percentage="80" />
      <el-progress type="circle" :percentage="100" status="success" />
      <el-progress type="circle" :percentage="50" status="exception" />
    </div>
  </div>
</template>

<style scoped>
.circle-progress-demo {
  padding: 20px;
}

.circle-progress-demo h3 {
  margin-bottom: 20px;
}

.progress-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
```

### Dashboard Progress

Use the `type="dashboard"` attribute to display a dashboard-style progress bar:

```vue
<template>
  <div class="dashboard-progress-demo">
    <h3>Dashboard Progress</h3>
    
    <div class="progress-group">
      <el-progress type="dashboard" :percentage="70" />
      <el-progress type="dashboard" :percentage="100" status="success" />
      <el-progress type="dashboard" :percentage="50" status="exception" />
    </div>
  </div>
</template>

<style scoped>
.dashboard-progress-demo {
  padding: 20px;
}

.dashboard-progress-demo h3 {
  margin-bottom: 20px;
}

.progress-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
```

## Customization Options

### Custom Colors

You can customize the colors of the Progress component:

```vue
<template>
  <div class="custom-colors-demo">
    <h3>Custom Colors</h3>
    
    <h4>Single Color</h4>
    <el-progress :percentage="70" color="#8e44ad" />
    
    <h4>Color Gradient</h4>
    <el-progress :percentage="70" :color="customColors" />
    
    <h4>Color Function</h4>
    <el-progress :percentage="percentage" :color="customColorFunction" />
    <div class="slider-container">
      <span>Percentage: {{ percentage }}%</span>
      <el-slider v-model="percentage" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const percentage = ref(20)

const customColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

const customColorFunction = (percentage) => {
  if (percentage < 30) {
    return '#f56c6c'
  } else if (percentage < 70) {
    return '#e6a23c'
  } else {
    return '#5cb87a'
  }
}
</script>

<style scoped>
.custom-colors-demo {
  padding: 20px;
}

.custom-colors-demo h3 {
  margin-bottom: 20px;
}

.custom-colors-demo h4 {
  margin: 20px 0 10px;
}

.el-progress {
  margin-bottom: 15px;
}

.slider-container {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin-top: 10px;
}
</style>
```

### Custom Size and Stroke Width

You can customize the size and stroke width of the Progress component:

```vue
<template>
  <div class="custom-size-demo">
    <h3>Custom Size and Stroke Width</h3>
    
    <h4>Line Progress</h4>
    <el-progress :percentage="70" :stroke-width="8" />
    <el-progress :percentage="70" :stroke-width="16" />
    <el-progress :percentage="70" :stroke-width="24" />
    
    <h4>Circle Progress</h4>
    <div class="progress-group">
      <el-progress type="circle" :percentage="70" :width="80" :stroke-width="4" />
      <el-progress type="circle" :percentage="70" :width="120" :stroke-width="8" />
      <el-progress type="circle" :percentage="70" :width="160" :stroke-width="12" />
    </div>
    
    <h4>Dashboard Progress</h4>
    <div class="progress-group">
      <el-progress type="dashboard" :percentage="70" :width="80" :stroke-width="4" />
      <el-progress type="dashboard" :percentage="70" :width="120" :stroke-width="8" />
      <el-progress type="dashboard" :percentage="70" :width="160" :stroke-width="12" />
    </div>
  </div>
</template>

<style scoped>
.custom-size-demo {
  padding: 20px;
}

.custom-size-demo h3 {
  margin-bottom: 20px;
}

.custom-size-demo h4 {
  margin: 20px 0 10px;
}

.el-progress {
  margin-bottom: 15px;
}

.progress-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
```

### Custom Text Format

You can customize the text displayed inside the Progress component:

```vue
<template>
  <div class="custom-text-demo">
    <h3>Custom Text Format</h3>
    
    <h4>Line Progress</h4>
    <el-progress :percentage="70" :format="formatLineText" />
    <el-progress :percentage="70" :format="formatLineText2" />
    
    <h4>Circle Progress</h4>
    <div class="progress-group">
      <el-progress type="circle" :percentage="80" :format="formatCircleText" />
      <el-progress type="circle" :percentage="70">
        <template #default="{ percentage }">
          <div class="custom-content">
            <el-icon :size="24" color="#409eff"><Star /></el-icon>
            <span>{{ percentage }}%</span>
          </div>
        </template>
      </el-progress>
      <el-progress type="circle" :percentage="60">
        <template #default>
          <div class="custom-content">
            <span class="large-text">Good</span>
            <span class="small-text">Keep going!</span>
          </div>
        </template>
      </el-progress>
    </div>
  </div>
</template>

<script setup>
import { Star } from '@element-plus/icons-vue'

const formatLineText = (percentage) => {
  return `${percentage}% Complete`
}

const formatLineText2 = (percentage) => {
  if (percentage < 30) {
    return 'Just started'
  } else if (percentage < 70) {
    return 'In progress'
  } else if (percentage < 100) {
    return 'Almost done'
  } else {
    return 'Completed!'
  }
}

const formatCircleText = (percentage) => {
  return `Score\n${percentage}`
}
</script>

<style scoped>
.custom-text-demo {
  padding: 20px;
}

.custom-text-demo h3 {
  margin-bottom: 20px;
}

.custom-text-demo h4 {
  margin: 20px 0 10px;
}

.el-progress {
  margin-bottom: 15px;
}

.progress-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.custom-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.large-text {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.small-text {
  font-size: 12px;
  color: #909399;
}
</style>
```

## Practical Application Examples

### File Upload Progress

```vue
<template>
  <div class="file-upload-demo">
    <h3>File Upload Progress</h3>
    
    <div class="upload-container">
      <div class="upload-header">
        <el-button type="primary" @click="simulateUpload" :disabled="isUploading">
          <el-icon><Upload /></el-icon>
          Upload File
        </el-button>
        <el-button @click="resetUpload" :disabled="!hasUpload">
          <el-icon><RefreshRight /></el-icon>
          Reset
        </el-button>
      </div>
      
      <div v-if="isUploading || hasUpload" class="upload-progress">
        <div class="file-info">
          <el-icon :size="24"><Document /></el-icon>
          <div class="file-details">
            <span class="file-name">example-document.pdf</span>
            <span class="file-size">2.4 MB</span>
          </div>
        </div>
        
        <el-progress 
          :percentage="uploadPercentage" 
          :status="uploadStatus"
          :format="formatUploadProgress"
        />
        
        <div v-if="uploadPercentage === 100" class="upload-success">
          <el-icon :size="16" color="#67c23a"><CircleCheck /></el-icon>
          <span>Upload completed successfully!</span>
        </div>
        
        <div v-if="uploadStatus === 'exception'" class="upload-error">
          <el-icon :size="16" color="#f56c6c"><CircleClose /></el-icon>
          <span>Upload failed. Please try again.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Upload, RefreshRight, Document, CircleCheck, CircleClose } from '@element-plus/icons-vue'

const uploadPercentage = ref(0)
const uploadStatus = ref('')
const isUploading = ref(false)
const hasUpload = ref(false)
const uploadInterval = ref(null)

const simulateUpload = () => {
  isUploading.value = true
  uploadPercentage.value = 0
  uploadStatus.value = ''
  
  uploadInterval.value = setInterval(() => {
    uploadPercentage.value += Math.floor(Math.random() * 10) + 1
    
    if (uploadPercentage.value >= 100) {
      uploadPercentage.value = 100
      clearInterval(uploadInterval.value)
      isUploading.value = false
      hasUpload.value = true
      
      // Randomly simulate success or failure
      if (Math.random() > 0.2) {
        uploadStatus.value = 'success'
      } else {
        uploadStatus.value = 'exception'
      }
    }
  }, 300)
}

const resetUpload = () => {
  uploadPercentage.value = 0
  uploadStatus.value = ''
  hasUpload.value = false
  clearInterval(uploadInterval.value)
}

const formatUploadProgress = (percentage) => {
  if (isUploading.value) {
    return `${percentage}% Uploading...`
  } else if (uploadStatus.value === 'success') {
    return 'Completed'
  } else if (uploadStatus.value === 'exception') {
    return 'Failed'
  } else {
    return `${percentage}%`
  }
}
</script>

<style scoped>
.file-upload-demo {
  padding: 20px;
}

.file-upload-demo h3 {
  margin-bottom: 20px;
}

.upload-container {
  max-width: 600px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
}

.upload-header {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.upload-progress {
  margin-top: 20px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.file-details {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: 500;
  color: #303133;
}

.file-size {
  font-size: 12px;
  color: #909399;
}

.upload-success,
.upload-error {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  font-size: 14px;
}

.upload-success {
  color: #67c23a;
}

.upload-error {
  color: #f56c6c;
}
</style>
```

### Task Completion Progress

```vue
<template>
  <div class="task-progress-demo">
    <h3>Task Completion Progress</h3>
    
    <div class="task-container">
      <div class="task-header">
        <h4>Project Milestones</h4>
        <div class="overall-progress">
          <span>Overall Progress: {{ overallPercentage }}%</span>
          <el-progress :percentage="overallPercentage" :stroke-width="10" />
        </div>
      </div>
      
      <div class="task-list">
        <div v-for="(task, index) in tasks" :key="index" class="task-item">
          <div class="task-info">
            <div class="task-name-status">
              <span class="task-name">{{ task.name }}</span>
              <el-tag :type="getTaskStatusType(task.status)" size="small">
                {{ task.status }}
              </el-tag>
            </div>
            <span class="task-description">{{ task.description }}</span>
          </div>
          
          <div class="task-progress">
            <el-progress 
              :percentage="task.percentage" 
              :status="getProgressStatus(task.status)"
              :stroke-width="8"
            />
          </div>
          
          <div class="task-actions">
            <el-button 
              size="small" 
              @click="updateTaskProgress(index)"
              :disabled="task.percentage >= 100 || task.status === 'Blocked'"
            >
              Update Progress
            </el-button>
            <el-dropdown @command="(command) => handleTaskAction(command, index)">
              <el-button size="small">
                Actions<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="complete">Mark as Complete</el-dropdown-item>
                  <el-dropdown-item command="reset">Reset Progress</el-dropdown-item>
                  <el-dropdown-item command="block" :disabled="task.status === 'Blocked'">
                    Mark as Blocked
                  </el-dropdown-item>
                  <el-dropdown-item command="unblock" :disabled="task.status !== 'Blocked'">
                    Unblock Task
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const tasks = ref([
  {
    name: 'Research & Planning',
    description: 'Initial research and project planning phase',
    percentage: 100,
    status: 'Completed'
  },
  {
    name: 'Design Phase',
    description: 'UI/UX design and prototyping',
    percentage: 70,
    status: 'In Progress'
  },
  {
    name: 'Development',
    description: 'Frontend and backend implementation',
    percentage: 30,
    status: 'In Progress'
  },
  {
    name: 'Testing',
    description: 'QA testing and bug fixing',
    percentage: 0,
    status: 'Not Started'
  },
  {
    name: 'Deployment',
    description: 'Production deployment and monitoring',
    percentage: 0,
    status: 'Blocked'
  }
])

const overallPercentage = computed(() => {
  const totalPercentage = tasks.value.reduce((sum, task) => sum + task.percentage, 0)
  return Math.floor(totalPercentage / tasks.value.length)
})

const getTaskStatusType = (status) => {
  const typeMap = {
    'Completed': 'success',
    'In Progress': 'primary',
    'Not Started': 'info',
    'Blocked': 'danger'
  }
  return typeMap[status] || 'info'
}

const getProgressStatus = (status) => {
  const statusMap = {
    'Completed': 'success',
    'Blocked': 'exception',
    'In Progress': '',
    'Not Started': ''
  }
  return statusMap[status]
}

const updateTaskProgress = (index) => {
  const task = tasks.value[index]
  
  // Increment progress by 10%
  task.percentage = Math.min(100, task.percentage + 10)
  
  // Update status based on percentage
  if (task.percentage === 100) {
    task.status = 'Completed'
    ElMessage.success(`Task "${task.name}" completed!`)
  } else if (task.percentage > 0) {
    task.status = 'In Progress'
  }
}

const handleTaskAction = (command, index) => {
  const task = tasks.value[index]
  
  switch (command) {
    case 'complete':
      task.percentage = 100
      task.status = 'Completed'
      ElMessage.success(`Task "${task.name}" marked as complete`)
      break
    case 'reset':
      task.percentage = 0
      task.status = 'Not Started'
      ElMessage.info(`Task "${task.name}" progress reset`)
      break
    case 'block':
      task.status = 'Blocked'
      ElMessage.warning(`Task "${task.name}" marked as blocked`)
      break
    case 'unblock':
      task.status = task.percentage > 0 ? 'In Progress' : 'Not Started'
      ElMessage.success(`Task "${task.name}" unblocked`)
      break
  }
}
</script>

<style scoped>
.task-progress-demo {
  padding: 20px;
}

.task-progress-demo h3 {
  margin-bottom: 20px;
}

.task-container {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
}

.task-header {
  margin-bottom: 20px;
}

.task-header h4 {
  margin: 0 0 15px 0;
  color: #303133;
}

.overall-progress {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-item {
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.task-name-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-name {
  font-weight: 500;
  color: #303133;
}

.task-description {
  font-size: 14px;
  color: #606266;
}

.task-progress {
  margin: 5px 0;
}

.task-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .task-name-status {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .task-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
```

### Skill Level Indicator

```vue
<template>
  <div class="skill-level-demo">
    <h3>Skill Level Indicator</h3>
    
    <div class="skills-container">
      <div class="skills-header">
        <h4>Developer Skills Profile</h4>
      </div>
      
      <div class="skills-section">
        <h5>Programming Languages</h5>
        <div class="skill-items">
          <div v-for="(skill, index) in programmingSkills" :key="index" class="skill-item">
            <div class="skill-info">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-level">{{ getSkillLevelText(skill.level) }}</span>
            </div>
            <el-progress 
              :percentage="skill.level" 
              :color="getSkillColor(skill.level)"
              :stroke-width="10"
              :show-text="false"
            />
          </div>
        </div>
      </div>
      
      <div class="skills-section">
        <h5>Frameworks & Libraries</h5>
        <div class="skill-items">
          <div v-for="(skill, index) in frameworkSkills" :key="index" class="skill-item">
            <div class="skill-info">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-level">{{ getSkillLevelText(skill.level) }}</span>
            </div>
            <el-progress 
              :percentage="skill.level" 
              :color="getSkillColor(skill.level)"
              :stroke-width="10"
              :show-text="false"
            />
          </div>
        </div>
      </div>
      
      <div class="skills-section">
        <h5>Other Skills</h5>
        <div class="circular-skills">
          <div v-for="(skill, index) in otherSkills" :key="index" class="circular-skill">
            <el-progress 
              type="circle" 
              :percentage="skill.level" 
              :color="getSkillColor(skill.level)"
              :width="100"
            >
              <template #default>
                <div class="skill-circle-content">
                  <span class="skill-circle-name">{{ skill.name }}</span>
                  <span class="skill-circle-level">{{ getSkillLevelText(skill.level) }}</span>
                </div>
              </template>
            </el-progress>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const programmingSkills = ref([
  { name: 'JavaScript', level: 90 },
  { name: 'TypeScript', level: 75 },
  { name: 'Python', level: 65 },
  { name: 'Java', level: 50 },
  { name: 'C++', level: 30 }
])

const frameworkSkills = ref([
  { name: 'Vue.js', level: 85 },
  { name: 'React', level: 70 },
  { name: 'Angular', level: 40 },
  { name: 'Express.js', level: 60 },
  { name: 'Django', level: 45 }
])

const otherSkills = ref([
  { name: 'UI/UX', level: 70 },
  { name: 'DevOps', level: 55 },
  { name: 'Testing', level: 65 },
  { name: 'Databases', level: 80 }
])

const getSkillLevelText = (level) => {
  if (level >= 90) return 'Expert'
  if (level >= 70) return 'Advanced'
  if (level >= 50) return 'Intermediate'
  if (level >= 30) return 'Basic'
  return 'Beginner'
}

const getSkillColor = (level) => {
  if (level >= 90) return '#67c23a'
  if (level >= 70) return '#409eff'
  if (level >= 50) return '#e6a23c'
  if (level >= 30) return '#f56c6c'
  return '#909399'
}
</script>

<style scoped>
.skill-level-demo {
  padding: 20px;
}

.skill-level-demo h3 {
  margin-bottom: 20px;
}

.skills-container {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
}

.skills-header {
  margin-bottom: 20px;
}

.skills-header h4 {
  margin: 0;
  color: #303133;
}

.skills-section {
  margin-bottom: 30px;
}

.skills-section h5 {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 16px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

.skill-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-name {
  font-weight: 500;
  color: #303133;
}

.skill-level {
  font-size: 14px;
  color: #909399;
}

.circular-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.circular-skill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.skill-circle-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.skill-circle-name {
  font-weight: 500;
  font-size: 14px;
  color: #303133;
}

.skill-circle-level {
  font-size: 12px;
  color: #909399;
}
</style>
```

## API Documentation

### Progress Attributes

| Parameter | Description | Type | Accepted Values | Default |
|------|------|------|--------|--------|
| percentage | Percentage, required | number | 0-100 | 0 |
| type | Progress bar type | string | line / circle / dashboard | line |
| stroke-width | Progress bar width | number | — | 6 |
| text-inside | Whether to place the percentage inside the progress bar, only works when type is 'line' | boolean | — | false |
| status | Progress bar current status | string | success / exception / warning | — |
| color | Progress bar color. Overrides status | string / function / array | — | '' |
| width | Circle/dashboard width | number | — | 126 |
| show-text | Whether to show percentage | boolean | — | true |
| stroke-linecap | Circle/dashboard stroke line cap | string | butt / round / square | round |
| format | Custom text format | function(percentage) | — | — |

### Progress Slots

| Name | Description |
|------|------|
| default | Custom content, parameter is { percentage } |

## Best Practices

### When to Use Progress Component

- **File Uploads**: Show progress during file uploads to indicate how much of the file has been uploaded.
- **Form Submissions**: Indicate the progress of multi-step forms or lengthy submissions.
- **Data Processing**: Show progress during data loading, processing, or exporting operations.
- **Task Completion**: Track the completion status of tasks or projects.
- **Skill Levels**: Visualize skill levels, ratings, or scores.

### Design Tips

1. **Choose the Right Type**:
   - Line progress bars are best for simple progress indicators
   - Circle progress is good for compact displays or when you want to emphasize the percentage
   - Dashboard progress works well for gauges or metrics

2. **Color Coding**:
   - Use consistent colors across your application
   - Green for success/completion
   - Red for errors/exceptions
   - Yellow/orange for warnings or partial completion
   - Blue for neutral progress

3. **Text and Labels**:
   - Provide clear context about what the progress represents
   - Consider adding descriptive text beyond just the percentage
   - For important operations, add estimated time remaining if possible

4. **Feedback and Animation**:
   - Use smooth transitions when updating progress
   - Provide additional feedback when progress completes (success message, icon, etc.)
   - Consider using indeterminate progress for operations with unknown duration

### Accessibility Considerations

- Ensure sufficient color contrast for text and progress bars
- Don't rely solely on color to convey status - use text or icons as well
- Include appropriate ARIA attributes for screen readers
- Provide text alternatives for visual progress indicators

## Summary

The Progress component is a versatile tool for providing feedback to users about the status of operations. It can be used in various scenarios, from simple file uploads to complex task tracking systems.

Through this document, you should be able to:

1. Implement basic Progress components with different types (line, circle, dashboard)
2. Customize the appearance and behavior of Progress components
3. Apply the Progress component in practical scenarios like file uploads, task tracking, and skill visualization
4. Follow best practices for effective user feedback

By using the Progress component effectively, you can enhance the user experience of your application by providing clear, visual feedback about ongoing operations.

## References

- [Element Plus Progress Official Documentation](https://element-plus.org/en-US/component/progress.html)
- [UX Design for Progress Indicators](https://www.nngroup.com/articles/progress-indicators/)
- [Accessibility Guidelines for Progress Bars](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)
