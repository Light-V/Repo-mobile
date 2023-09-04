<script setup lang="ts">
import { time } from 'console'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showNotify } from 'vant'
import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import { localStorage } from '@/utils/local-storage'
import { login, token } from '@/api'

const title = '登录'
const onClickLeft = () => history.back()
const username = ref('')
const password = ref('')
const router = useRouter()

const do_login = () => {
  // 这里可以添加登录逻辑，例如验证用户名和密码
  // 如果登录成功，可以导航到其他页面
  // 如果登录失败，可以显示错误提示或进行其他处理
  try {
    // 调用后台 API 获取通知单信息，假设后台 API 返回一个数组
    login(username.value, password.value).then((res) => {
      showNotify({ type: 'success', message: '登录成功' })
      localStorage.set(STORAGE_TOKEN_KEY, res.token)
      router.push('/')
    })
  } catch (error) {
    showNotify('帐号或密码验证失败')
  }
}
</script>

<template>
  <div class="container">
    <van-nav-bar :title="title" left-arrow fixed @click-left="onClickLeft" />
    <van-cell-group class="login-form">
      <van-field v-model="username" label="用户名" placeholder="请输入用户名" />
      <van-field v-model="password" label="密码" placeholder="请输入密码" type="password" />
      <van-button type="primary" block @click="do_login">
        登录
      </van-button>
    </van-cell-group>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 60px 16px;
  position: relative;
}

.login-form {
  margin-top: 20px;
}

/* 可以根据需要添加更多样式 */
</style>
