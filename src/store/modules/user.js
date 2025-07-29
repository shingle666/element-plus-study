const state = {
  userInfo: null,
  token: localStorage.getItem('token') || '',
  isLoggedIn: false
}

const mutations = {
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    state.isLoggedIn = !!userInfo
  },
  SET_TOKEN(state, token) {
    state.token = token
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },
  CLEAR_USER_DATA(state) {
    state.userInfo = null
    state.token = ''
    state.isLoggedIn = false
    localStorage.removeItem('token')
  }
}

const actions = {
  // 登录
  async login({ commit }, loginData) {
    try {
      // 这里应该调用实际的登录 API
      // const response = await api.login(loginData)
      
      // 模拟登录响应
      const mockResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        userInfo: {
          id: 1,
          username: loginData.username,
          email: loginData.email || 'user@example.com',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        }
      }
      
      commit('SET_TOKEN', mockResponse.token)
      commit('SET_USER_INFO', mockResponse.userInfo)
      
      return mockResponse
    } catch (error) {
      throw error
    }
  },
  
  // 登出
  logout({ commit }) {
    commit('CLEAR_USER_DATA')
  },
  
  // 更新用户信息
  updateUserInfo({ commit }, userInfo) {
    commit('SET_USER_INFO', userInfo)
  }
}

const getters = {
  isLoggedIn: state => state.isLoggedIn,
  userInfo: state => state.userInfo,
  token: state => state.token,
  username: state => state.userInfo?.username || '',
  avatar: state => state.userInfo?.avatar || ''
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}