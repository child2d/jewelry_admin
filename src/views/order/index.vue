<template>
  <div class="dashboard-container">
    <div style="margin-bottom:10px">
      <el-row style="margin-bottom: 10px">
        <el-col :span="20">
          <span class="header_font">订单号</span>
          <el-input
            v-model="params.where.order_num"
            style="width:180px;"
            size="small"
            placeholder="请输入"
            clearable
          />
          <span class="header_font">订单状态</span>
          <el-select
            v-model="params.where.status"
            style="width:180px;"
            size="small"
            placeholder="请选择"
            clearable
          >
            <el-option label="待支付" value="1" />
            <el-option label="待发货" value="2" />
            <el-option label="待收货" value="3" />
            <el-option label="待评价" value="4" />
          </el-select>

          <el-date-picker
            v-model="dateSelect"
            style="margin-left:10px"
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="订单开始时间"
            end-placeholder="订单结束时间"
            @change="changeDate"
          />
          <el-button
            style="margin-left:5px;width:100px"
            type="primary"
            size="small"
            @click="fetchList"
          >搜索</el-button>

        </el-col></el-row>
    </div>
    <!-- 列表 -->
    <div class="list">
      <el-table
        v-loading="listLoading"
        :data="orderList"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        element-loading-text="Loading"
        border
      >
        <el-table-column align="center" label="序号" width="60">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="订单号" width="150">
          <template slot-scope="scope">
            {{ scope.row.order_num }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="客户信息" width="220">
          <template slot-scope="scope">

            <span class="nicknameColor">{{ scope.row.nick_name }}</span> | <span class="nicknameColor">{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单金额">
          <template slot-scope="scope">
            {{ scope.row.money }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="订单状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="info">待支付</el-tag>
            <el-tag v-if="scope.row.status == 2">待发货</el-tag>
            <el-tag v-if="scope.row.status == 3" type="success">待收货</el-tag>
            <el-tag v-if="scope.row.status == 4" type="danger">待评价</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单生成时间">
          <template slot-scope="scope">
            {{ timestampToTime(scope.row.order_time) }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="支付时间">
          <template slot-scope="scope">
            {{ scope.row.pay_time | toTime }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="360">
          <template slot-scope="scope">
            <el-button
              v-permission="'/order/info'"
              size="small"
              type="warning"
              @click="detailsInfo(scope.row)"
            >查看详情</el-button>
            <!-- v-permission="'/order/refund'" -->
            <el-button
              size="small"
              type="primary"
              :disabled="scope.row.status !== 2"
              @click="shipment(scope.row.order_num)"
            >发货</el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="thepages">
      <div class="block">
        <el-pagination
          :current-page="params.page"
          :page-sizes="[10, 20, 50]"
          :page-size="params.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableDataLength"
          @size-change="pageSizeChange"
          @current-change="pageCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getList, updata, refund, shipment } from '@/api/order'
import { timestampToTime } from '@/utils/time'

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
        return '—————'
      }
      return val
    }
  },
  data() {
    return {
      listLoading: true,
      // 用户列表
      orderList: [],
      // 分页
      tableDataLength: null,
      // 列表参数
      params: {
        page: 1,
        pagesize: 10,
        where: {
          order_num: '',
          status: '',
          order_time: []
        }
      },
      value_1: '',
      option_1: '',
      // 日期选择
      dateSelect: '',
      // 更新的数据
      updata: {
        order_num: ''
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      getList(this.params).then(response => {
        this.orderList = response.list
        this.tableDataLength = response.count
        this.listLoading = false
      })
    },
    // 发送更改订单请求
    updataOrder() {
      updata(this.updata).then(response => {
        this.$message({
          type: 'info',
          message: response
        })
        this.fetchList()
      })
    },

    // 订单 发货
    shipment(order_num) {
      shipment({ order_num }).then(response => {
        this.$message({
          type: 'info',
          message: response
        })
        this.fetchList()
      })
    },
    sendRefund() {
      refund(this.updata).then(response => {
        this.$message({
          type: 'info',
          message: response
        })
        this.fetchList()
      })
    },
    //  分页
    pageSizeChange(val) {
      this.params.pagesize = val
      this.fetchList()
    },
    pageCurrentChange(val) {
      this.params.page = val
      this.fetchList()
    },
    // 10位时间戳转换
    timestampToTime(timestamp) {
      return timestampToTime(timestamp)
    },
    //  跳转
    detailsInfo(row) {
      const user_guid = row.user_guid
      const order_num = row.order_num
      const carInfo = this.$router.resolve({
        path: '/order/details',
        query: {
          user_guid: user_guid,
          order_num
        }
      })
      window.open(carInfo.href, '_blank')
    },
    refund(order_num, car_guid) {
      this.updata.order_num = order_num
      this.updata.car_guid = car_guid
      this.updata.status = 5
      this.sendRefund()
    },

    // 日期筛选
    changeDate() {
      if (this.dateSelect === null) {
        this.params.where.order_time = []
        return
      }
      const start = Date.parse(this.dateSelect[0])
      const end = Date.parse(this.dateSelect[1])
      const date = [start / 1000, end / 1000]
      this.params.where.order_time = date
    },
    // 打开 确实退出退款提示框
    open(order_num, car_guid) {
      this.$confirm('是否继续退款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.refund(order_num, car_guid)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }

  }
}
</script>

<style scoped>
.dashboard-container {
  margin: 20px 20px 0;
}
.header_font {
  font-size: 14px;
  text-align: left;
  color: #747774;
  margin-left:10px;
  margin-right:10px;
}
.nicknameColor {
  color: #f3c061;
}
.thepages {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
