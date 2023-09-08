<script setup lang="ts">
import { showNotify } from 'vant'
import { queryOutbound } from '@/api'

const title = '扫码出库'
const onClickLeft = () => history.back()
const notificationList = ref([]) // 存储通知单信息
const router = useRouter()

// 获取待入库通知单信息的方法
const fetchNotificationList = async () => {
  try {
    // 调用后台 API 获取通知单信息，假设后台 API 返回一个数组
    queryOutbound({ status: [1] }).then((res) => {
      notificationList.value = res
    })
  } catch (error) {
    showNotify('获取通知单信息失败，请重试')
  }
}

// 进入详情页方法
const showNotificationDetail = (notification) => {
  router.push(`/outbound_detail/${notification.id}`)
}

onMounted(() => {
  fetchNotificationList()
})

const formatInStockDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
</script>

<template>
  <div class="container">
    <van-nav-bar :title="title" left-arrow fixed @click-left="onClickLeft" />
    <van-list>
      <van-cell
        v-for="(notification, index) in notificationList"
        :key="notification.id"
        @click="showNotificationDetail(notification)"
      >
        <template #title>
          通知单号: {{ notification.order_id }}
        </template>
        <template #label>
          日 期: {{ formatInStockDate(notification.out_stock_date) }}
          <br>
          车 牌: {{ notification.license_plate_number }}
          <br>
          客 户: {{ notification.customer_name }}
          <br>
          备 注: {{ notification.remark }}
          <br>
        </template>
        <template #right-icon>
          <van-icon name="arrow" />
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 60px 16px;
  position: relative;
}
</style>
