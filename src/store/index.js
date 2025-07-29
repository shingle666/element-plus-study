import { createStore } from 'vuex'
import user from './modules/user'
import app from './modules/app'

const store = createStore({
  modules: {
    user,
    app
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store