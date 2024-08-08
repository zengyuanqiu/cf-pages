<!--
 * @Descripttion: 
 * @Author: zengyuanqiu
 * @Date: 2024-04-20 11:33:58
 * @LastEditors: zengyuanqiu
 * @LastEditTime: 2024-08-06 19:30:08
-->
<template>
  <div class="app">
    <h2>美团数据接口</h2>
    <hr />
    <h3>
      商品分类：https://e.waimai.meituan.com/gw/bizproduct/v3/tag/r/tagList?{{commonQuery}}
    </h3>
    <ul>
      <li>请求方法：POST</li>
      <li>
        请求体 body: tabStatus=-1&inRecycleBin=0&wmPoiId=21525283&appType=3
      </li>
      <li>请求头 Content-Type: application/x-www-form-urlencoded</li>
      <li>
        响应 data：
        <pre><code>{{ JSON.stringify([{ "id": 848438306, "level": 1, "name":
            "宠粉福利🎉🎉🎉", "parentId": 0, "sequence": 1, "spuCount": 8,
            "subTags": null, "tagType": 0, "timeZone": "[[]]", "timeZoneForHuman":
            "每周一二三四五六日<br />00:00-23:59", "topFlag": 1 }], null, 2) }}</code>
        </pre>
      </li>
    </ul>
    <h3>
      商品列表：https://e.waimai.meituan.com/gw/bizproduct/v3/food/r/getSpuListCommon?{{commonQuery}}
    </h3>
    <ul>
      <li>请求方法：POST</li>
      <li>
        请求体 body:
        tagId=-99&pageNum=1&pageSize=30&needAllCount=1&tabStatus=-1&inRecycleBin=0&wmPoiId=21525283&appType=3
      </li>
      <li>请求头 Content-Type: application/x-www-form-urlencoded</li>
      <li>
        响应 data.spuListVos：<a href="javascript:;" @click="showResponse('goods')">查看数据模型</a>
      </li>
    </ul>
    <h3>
      订单列表：https://e.waimai.meituan.com/gw/api/order/mix/history/list/common?{{commonQuery}}
    </h3>
    <ul>
      <li>请求方法：POST</li>
      <li>
        请求体 body:
        tag=all&startDate=2024-08-06&endDate=2024-08-06&pageNum=1&pageSize=10&pageGray=1
      </li>
      <li>请求头 Content-Type: application/x-www-form-urlencoded</li>
      <li>
        响应 data：<a href="javascript:;" @click="showResponse('order')">查看数据模型</a>
      </li>
    </ul>
  </div>

  <dialog ref="dialogRef">
    <div class="dialog-header">
      <span class="close" @click="closeDialog">&times;</span>
    </div>
    <div class="dialog-wrapper">
      <JsonViewer :value="result" :expand-depth="3" />
    </div>
  </dialog>
</template>

<script setup>
  import goods from './assets/meituan/goods'
  import order from './assets/meituan/order'
  import {ref} from 'vue'

  const commonQuery = 'region_id=1000441300&region_version=1716185466'
  const dialogRef = ref()
  const result = ref({})
  const jsons = {
    goods,
    order
  }
  function showResponse(path) {
    result.value = jsons[path]
    dialogRef.value?.showModal()
  }

  function closeDialog() {
    dialogRef.value?.close()
  }
</script>

<style scoped>
.app {
  padding: 40px;
}
.dialog-header {
  display: flex;
  justify-content: end;
  height: 40px;
}
.close {
  padding: 5px;
  font-size: 24px;
  cursor: pointer;
}
.dialog-wrapper {
  width: 720px;
  height: 76vh;
  overflow: auto;
}
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
