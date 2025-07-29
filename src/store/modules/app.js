const state = {
  theme: localStorage.getItem('theme') || 'light',
  language: localStorage.getItem('language') || 'zh-cn',
  sidebarCollapsed: false,
  loading: false,
  breadcrumbs: []
}

const mutations = {
  SET_THEME(state, theme) {
    state.theme = theme
    localStorage.setItem('theme', theme)
    // 切换主题时更新 HTML 类名
    document.documentElement.className = theme === 'dark' ? 'dark' : ''
  },
  SET_LANGUAGE(state, language) {
    state.language = language
    localStorage.setItem('language', language)
  },
  TOGGLE_SIDEBAR(state) {
    state.sidebarCollapsed = !state.sidebarCollapsed
  },
  SET_SIDEBAR_COLLAPSED(state, collapsed) {
    state.sidebarCollapsed = collapsed
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_BREADCRUMBS(state, breadcrumbs) {
    state.breadcrumbs = breadcrumbs
  }
}

const actions = {
  // 切换主题
  toggleTheme({ commit, state }) {
    const newTheme = state.theme === 'light' ? 'dark' : 'light'
    commit('SET_THEME', newTheme)
  },
  
  // 设置主题
  setTheme({ commit }, theme) {
    commit('SET_THEME', theme)
  },
  
  // 设置语言
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  
  // 切换侧边栏
  toggleSidebar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  
  // 设置加载状态
  setLoading({ commit }, loading) {
    commit('SET_LOADING', loading)
  },
  
  // 更新面包屑
  updateBreadcrumbs({ commit }, breadcrumbs) {
    commit('SET_BREADCRUMBS', breadcrumbs)
  }
}

const getters = {
  theme: state => state.theme,
  isDarkTheme: state => state.theme === 'dark',
  language: state => state.language,
  sidebarCollapsed: state => state.sidebarCollapsed,
  loading: state => state.loading,
  breadcrumbs: state => state.breadcrumbs
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}