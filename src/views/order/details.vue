<template>
  <div class="dashboard-container">
    <div>
      <el-card class="box-card">
        <table>
          <tr>
            <td>订单号: <span class="content"> {{ orderData.order_num }} </span></td>
            <td>订单金额:  <span class="content">{{ orderData.money }}</span> </td>
          </tr>
          <tr />
          <tr>
            <td>订单状态:
              <el-tag v-if="orderData.status == 1" type="info">待支付</el-tag>
              <el-tag v-if="orderData.status == 2">待发货</el-tag>
              <el-tag v-if="orderData.status == 3" type="success">待收货</el-tag>
              <el-tag v-if="orderData.status == 4" type="danger">待评价</el-tag>
            </td>
            <td>订单生成时间:  <span class="content">{{ orderData.order_time | toTime }}</span> </td>
          </tr>
          <tr>
            <td>支付时间:  <span class="content">{{ orderData.pay_time | toTime }}</span></td>
          </tr>
          <tr>
            <td>收货地址:  <span class="content">{{ orderData.pay_time }}</span></td>
          </tr>
        </table>
      </el-card>

      <el-card class="box-card_1">
        购买时商品历史信息
        <!-- v-loading="listLoading" -->

        <div class="list">
          <el-table
            :data="itemList"
            element-loading-text="Loading"
            border
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'0px'}"
          >
            <el-table-column align="center" label="序号" width="60">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="珠宝名称" prop="name" width="250" />

            <el-table-column align="center" label="图片" width="170">
              <template slot-scope="scope">
                <img :style="{width: '100px',}" :src="scope.row.item_img" alt="">
              </template>
            </el-table-column>

            <el-table-column align="center" label="所属系列" prop="serie_name" width="200" />

            <el-table-column align="center" label="类型" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.type == 1" type="success" class="el_tag_margin">戒指</el-tag>
                <el-tag v-if="scope.row.type == 2" class="el_tag_margin" type="info">项链</el-tag>
                <el-tag v-if="scope.row.type == 3" type="info" class="el_tag_margin">手镯</el-tag>
                <el-tag v-if="scope.row.type == 4" class="el_tag_margin" type="warning">吊坠</el-tag>
                <el-tag v-if="scope.row.type == 5" class="el_tag_margin" type="info">耳环</el-tag>
                <el-tag v-if="scope.row.type == 6" class="el_tag_margin" type="info">手链/脚链</el-tag>
              </template>
            </el-table-column>

            <el-table-column align="center" label="材质" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.texture == 1" class="el_tag_margin" type="success">黄金</el-tag>
                <el-tag v-if="scope.row.texture == 2" class="el_tag_margin" type="info">铂金</el-tag>
                <el-tag v-if="scope.row.texture == 3" class="el_tag_margin" type="warning">钻石</el-tag>
                <el-tag v-if="scope.row.texture == 4" class="el_tag_margin" type="info">宝石</el-tag>
                <el-tag v-if="scope.row.texture == 5" class="el_tag_margin" type="warning">翡翠</el-tag>
                <el-tag v-if="scope.row.texture == 6" class="el_tag_margin" type="success">K金</el-tag>
                <el-tag v-if="scope.row.texture == 7" class="el_tag_margin" type="danger">珍珠</el-tag>
              </template>
            </el-table-column>

            <el-table-column align="center" label="价格" width="150" prop="price">
              <template slot-scope="scope">
                {{ scope.row.price }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="购买数量" width="150" prop="quantity" />

          </el-table>
        </div>
      </el-card>

      <el-card class="box-card_2">

        <div style="display: flex; justify-content: start;">
          <div style="width:50px"> 描述:</div>

          <div style="width:95%">{{ itemData.desc }}</div>
        </div>
        <div>
          <img
            v-for="(item,index) in fileList"
            :key="index"
            class="file"
            :src="item"
            @click="pictureCardPreview(item)"
          >
        </div>
      </el-card>

    </div>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getOrderDetails } from '@/api/order'
import { timestampToTime } from '@/utils/time'
import '@/assets/icons/iconfont.css'

export default {

  filters: {
    toTime: function(val) {
      if (val === '' || val === null) {
        return '————'
      }
      return timestampToTime(val)
    },
    userphone: function(val) {
      if (val === '') {
        return '————'
      }
      return val
    },
    nullvalue: function(val) {
      if (val === '' || val === null) {
        return '————'
      }
      return val
    }
  },
  data() {
    return {

      dialogVisible: false,
      dialogImageUrl: '',

      car: [],
      // 文件列表
      fileList: [],
      // 发送请求参数
      carParams: {
        guid: ''
      },
      orderParams: {
        order_num: ''
      },

      // 律师函 单条数据
      itemData: {},
      // 订单 单条数据
      orderData: {},
      itemList: []
    }
  },
  created() {
    this.orderParams.order_num = this.$route.query.order_num
    // 详细信息 获取
    this.fetchData()
  },
  methods: {
    fetchData() {
      getOrderDetails(this.orderParams).then(response => {
        this.orderData = response
        const temp = JSON.parse(response.orderinfo)
        for (let i = 0; i < temp.length; i++) {
          const item_info = temp[i].item_info
          item_info.quantity = temp[i].quantity
          this.itemList.push(item_info)
        }
      })
    },
    // 10位时间戳转换
    timestampToTime(timestamp) {
      return timestampToTime(timestamp)
    },
    pictureCardPreview(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    viewPdf() {
      window.open(this.pdfurl, '_blank')
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  margin: 10px 20px 0;
}
.box-card {
  width: 85%;
}
td {
  width: 500px;
  height: 50px;
}
.box-card_1 {
  width: 85%;
  margin-top: 10px;
}

.box-card_2 {
  width: 85%;
  margin-top: 10px;
}

.file {
  width: 100px;
  margin-right: 20px;
  margin-top: 20px;
}
.pdfdiv {
  width:210px;
  background:#ccc;
  margin-left:100px;
  padding-top:2px;
  padding-bottom:2px
}
.content {
  color: #aaa;
}
.list {
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>

