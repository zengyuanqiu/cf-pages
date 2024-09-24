/*
 * @Descripttion: 
 * @Author: zengyuanqiu
 * @Date: 2024-08-06 19:31:50
 * @LastEditors: zengyuanqiu
 * @LastEditTime: 2024-09-24 15:23:46
 */
export function onRequest(context) {
  console.log('商品列表数据')
  return new Response(JSON.stringify([
    {
      "allSoldOut": false,
      "attrList": [
        {
          "id": 20537051148,
          "mode": 2,
          "name": "份量",
          "no": 1,
          "price": 2.22,
          "value": "1个"
        }
      ],
      "canBeSelected": 0,
      "cannotSelectedReason": null,
      "categoryName": null,
      "comboPriceIllegal": false,
      "comboSpu": null,
      "defaultPicUrl": "",
      "discountPrice": 0.01,
      "discountPriceDiffDesc": null,
      "discountTips": "0.05折",
      "foodKioskInfoVo": null,
      "hasEmptyRequiredField": false,
      "id": 15106868775,
      "isNewCombo": false,
      "isStopSell": -1,
      "maxPrice": 2.22,
      "monthSale": 286,
      "name": "【点击右上角☆即送】现烤绿豆饼",
      "onlySellInCombo": false,
      "overrangeOperationStatus": 0,
      "price": 2.22,
      "recommendNameByIntelligent": null,
      "riskManaVo": {
        "longDescribe": null,
        "recoveryTime": null,
        "shortDescribe": null
      },
      "sellStatus": 0,
      "shippingTimeX": "",
      "showDefaultPic": false,
      "singleOrderNoDelivery": 1,
      "someSoldOut": false,
      "spTagId": 116034,
      "specialFoodCategory": "热销",
      "stock": -1,
      "tagId": 848438306,
      "tagName": "宠粉福利🎉🎉🎉",
      "toppingSpu": false,
      "wmProductActivities": [
        {
          "actId": 102319164581,
          "actInfo": "0.05折",
          "actType": 17
        }
      ],
      "wmProductLabelVos": [
        {
          "groupId": 18,
          "groupName": "单点不送",
          "id": 32,
          "subAttr": "0"
        },
        {
          "groupId": 32,
          "groupName": "建品方式",
          "id": 44,
          "subAttr": "8"
        },
        {
          "groupId": 36,
          "groupName": "建品角色",
          "id": 48,
          "subAttr": "0"
        }
      ],
      "wmProductPicVos": [
        {
          "content": null,
          "detailList": [],
          "id": 233415630230,
          "isLowQuality": 0,
          "isMaster": 0,
          "picLargeUrl": "http://p0.meituan.net/wmproduct/a49783bd7a46c9715455ce12a9a2ee5c91649.jpg",
          "picMaterialId": 0,
          "picUrl": "http://p0.meituan.net/100.100.90/wmproduct/a49783bd7a46c9715455ce12a9a2ee5c91649.jpg",
          "score": 1.0,
          "specialEffectEnable": 0,
          "specialEffectLargeUrl": null,
          "specialEffectUrl": null,
          "type": 0
        }
      ],
      "wmProductSkuVos": [
        {
          "attrList": [],
          "autoRefresh": 0,
          "boxNum": 1,
          "boxPrice": 0.5,
          "dinePrice": null,
          "id": 23268019509,
          "maxStock": -1,
          "price": 2.22,
          "skuCode": "",
          "spec": "1个",
          "stock": -1
        }
      ],
      "wmProductVideo": null
    }
  ], null, 2), {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
}

