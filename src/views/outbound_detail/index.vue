<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify, Form, Field, RadioGroup, Cell, Uploader, Button, Radio } from 'vant';
import { showNotify } from 'vant' // 导入 Vant 的 Notify 组件
import { queryOutboundDetail, outboundScan, outboundCommit, outboundAdd, outboundRemove } from '@/api'

const title = '出库通知单详情'
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
    queryOutboundDetail({ notification_id: Number(notificationId) }).then((res) => {
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
  if (status === 5)
    return '未扫码'
  else if (status === 6)
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
  if (status === 5)
    return 'status-red' // 未扫码，红色
  else if (status === 6)
    return 'status-green' // 已扫码，绿色
  else
    return 'status-yellow' // 其他状态，黄色
}
// 表单数据
const formData = ref({
  barcode: '',
  customerBarcode: '',
  remark: '',
  damageLayers: 0,
  damageWeight: 0,
  damageResponsibility: '无',
  damagePhotos: [], // 存储上传的破损照片
})

// 表单验证规则
const rules = {
  barcode: [{ required: true, message: '请填写条形码' }],
  customerBarcode: [{ required: true, message: '请填写客户条码' }],
  damageLayers: [{ required: true, message: '请填写破损层数' }],
  damageWeight: [{ required: true, message: '请填写破损重量' }],
  damageResponsibility: [{ required: true, message: '请选择破损责任方' }],
}


// 提交整张通知单
const submitNotification = () => {
  // 发送请求到后端，包含当前通知单的 ID
  const data = {
    notificationId: Number(notificationId)
  }
  outboundCommit(data).then((res) => {
    if (res.success)
    {
      showNotify({type: 'success', message: '通知单提交成功'});
      onClickLeft()
    } else {
      showNotify('通知单提交失败：' + res.message);
    }
  }).catch((error)=>{
    showNotify('通知单提交失败：' + error)
      console.error(error);
  })
}

// 提交扫码表单
const submitForm = () => {
  // 验证表单
  // 构建要发送给后端的数据对象
  const data = {
    notificationId: Number(notificationId),
    barcode: formData.value.barcode,
    remark: formData.value.remark,
  }
  outboundScan(data).then((res) => {
    // 发送表单数据到后端的 API
    showNotify({type: 'success', message: '提交成功'})
    // 刷新数据
    fetchNotificationDetail()
  }).catch((error) => {
    showNotify('扫码失败，请重试')
    console.error(error);
  })
}

const addForm = () => {
  // 构建要发送给后端的数据对象
  const data = {
    outbound_notification_id: Number(notificationId),
    barcodes: [formData.value.barcode],
    remark: formData.value.remark,
  }
  outboundAdd(data).then((res) => {
    // 发送表单数据到后端的 API
    showNotify({type: 'success', message: '添加成功'})
    // 刷新数据
    fetchNotificationDetail()
  }).catch((error) => {
    showNotify('添加失败，请重试')
    console.error(error);
  })
}

const removeForm = () => {
  // 构建要发送给后端的数据对象
  const data = {
    notificationId: Number(notificationId),
    barcodes: [formData.value.barcode],
    remark: formData.value.remark,
  }
  outboundRemove(data).then((res) => {
    // 发送表单数据到后端的 API
    showNotify({type: 'success', message: '移除成功'})
    // 刷新数据
    fetchNotificationDetail()
  }).catch((error) => {
    showNotify('移除失败，请重试')
    console.error(error);
  })
}

const showButtons = ref<bool>(false)

</script>

<template>
  <div class="container">
    <van-nav-bar :title="title" left-arrow fixed @click-left="onClickLeft" />
    <div class="notification-details">
      <div><strong>订单号：</strong>{{ notification.order_id }}</div>
      <div><strong>客户名：</strong>{{ notification.customer_name }}</div>
      <div><strong>车牌号：</strong>{{ notification.license_plate_number }}</div>
      <div><strong>出库日期：</strong>{{ formatInStockDate(notification.out_stock_date) }}</div>
      <div><strong>备注：</strong>{{ notification.remark }}</div>
      <div><strong>总重量：</strong>{{ notification.total_weight }}Kg</div>
      <!-- 添加提交按钮 -->
      <van-button type="primary" @click="submitNotification">提交通知单</van-button>
    </div>

    <!-- 添加表单 -->
    <van-form ref="form" :model="formData" :rules="rules">
      <van-field v-model="formData.barcode" label="条形码" required clearable />
      <van-field v-model="formData.remark" label="备注" clearable />
      <van-space>
        <van-button type="primary" block @click="submitForm">提交扫码</van-button>
        <van-button
          icon="plus" type="danger"
          block
          @click="showButtons=!showButtons"
          v-show="!showButtons" 
        >
          点击显示按钮
        </van-button>
        <van-button type="danger" block @click="addForm" v-show="showButtons">扫码加货</van-button>
        <van-button type="danger" block @click="removeForm" v-show="showButtons">扫码退货</van-button>
      </van-space>
    </van-form>

    <!-- 展示物料列表 -->
    <div class="material-list">
      <div v-for="(material, index) in notification.stocks" :key="index" class="material">
        <div><strong>物料名称：</strong>{{ material.material_name }}</div>
        <div><strong>条形码：</strong>{{ material.barcode }}</div>
        <div><strong>规格宽：</strong>{{ material.spec }} mm</div>
        <div><strong>规格长：</strong>{{ material.spec_length }} mm</div>
        <div><strong>克重：</strong>{{ material.material_weight }}</div>
        <div><strong>重量：</strong>{{ material.stock_weight }} kg</div>
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
