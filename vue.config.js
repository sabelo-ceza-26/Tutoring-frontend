const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/tutoring': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  }
})
