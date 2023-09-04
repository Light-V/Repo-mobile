<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showNotify } from 'vant' // 导入 Vant 的 Notify 组件
import { queryInboundDetail } from '@/api'

const title = '通知单详情'
const router = useRouter()
const notificationId = router.currentRoute.value.params.id
const notification = ref({}) // 存储通知单的详细信息

const formatInStockDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const onClickLeft = () => {
  router.back() // 返回上一页
}

// 获取通知单详细信息的方法
const fetchNotificationDetail = async () => {
  try {
    // 调用后台 API 获取通知单信息，假设后台 API 返回一个数组
    queryInboundDetail({ notification_id: Number(notificationId) }).then((res) => {
      notification.value = res
    })
  } catch (error) {
    showNotify('获取通知单详情失败，请重试')
  }
}

// 在页面加载时调用获取通知单详细信息的方法
onMounted(() => {
  fetchNotificationDetail()
})

// 根据状态值返回对应的状态文本
const materialStatusText = (status) => {
  if (status === 1)
    return '未扫码'
  else if (status === 2)
    return '已扫码'
  else
    return '未知'
}

const sortedMaterials = computed(() => {
  const unscannedMaterials = notification.value.materials.filter(material => material.status === 1)
  const scannedMaterials = notification.value.materials.filter(material => material.status === 2)
  const otherMaterials = notification.value.materials.filter(material => (material.status !== 1 && material.status !== 2))
  return [...unscannedMaterials, ...scannedMaterials, ...otherMaterials]
})

// 根据状态值返回对应的 CSS 类名
const materialStatusClass = (status) => {
  if (status === 1)
    return 'status-red' // 未扫码，红色
  else if (status === 2)
    return 'status-green' // 已扫码，绿色
  else
    return 'status-yellow' // 其他状态，黄色
}
</script>

<template>
  <div class="container">
    <van-nav-bar :title="title" left-arrow fixed @click-left="onClickLeft" />
    <div class="notification-details">
      <div><strong>订单号：</strong>{{ notification.order_id }}</div>
      <div><strong>客户名：</strong>{{ notification.customer_name }}</div>
      <div><strong>车牌号：</strong>{{ notification.license_plate_number }}</div>
      <div><strong>入库日期：</strong>{{ formatInStockDate(notification.inbound_date) }}</div>
      <div><strong>备注：</strong>{{ notification.remark }}</div>
      <div><strong>总重量：</strong>{{ notification.total_weight }}Kg</div>
      <!-- 添加其他字段的展示 -->
    </div>

    <!-- 展示物料列表 -->
    <div class="material-list">
      <div v-for="(material, index) in notification.materials" :key="index" class="material">
        <div><strong>物料名称：</strong>{{ material.material_info.name }}</div>
        <div><strong>条形码：</strong>{{ material.barcode }}</div>
        <div><strong>规格宽：</strong>{{ material.material_info.spec }} mm</div>
        <div><strong>规格长：</strong>{{ material.material_info.spec_length }} mm</div>
        <div><strong>克重：</strong>{{ material.material_info.weight }}</div>
        <div><strong>重量：</strong>{{ material.weight }} kg</div>
        <div :class="materialStatusClass(material.status)">
          <strong>状态：</strong>{{ materialStatusText(material.status) }}
        </div>
        <div><strong>创建时间：</strong>{{ formatInStockDate(material.created_at) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 60px 16px;
  position: relative;
}

.notification-details {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.material-list {
  margin-top: 20px;
}

.material {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.status-red {
  color: red;
}

.status-green {
  color: green;
}

.status-yellow {
  color: rgba(255, 146, 4, 0.945);
}

/* 可以根据需要添加更多样式 */
</style>
