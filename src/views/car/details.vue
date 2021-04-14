<template>
  <div class="dashboard-container">
    <el-tabs v-model="activeName" @tab-click="tabChange">
      <el-tab-pane label="律师函详情" name="first">
        <div>
          <el-card class="box-card">
            <table>
              <tr>
                <td>提交账户: <span class="content"> {{ detailsData.user_phone }} </span> </td>
                <td v-if="detailsData.car_type == 1 || detailsData.car_type == 3">当前角色:
                  <span class="content"> 公司 </span>
                </td>
                <td v-else>当前角色: <span class="content"> 个人 </span></td>
              </tr>
              <tr>
                <td>委托人: <span class="content"> {{ detailsData.request_name }} </span> </td>
                <td>收函方联系电话: <span class="content"> {{ detailsData.receive_phone }} </span>  </td>
              </tr>
              <tr>
                <td>联系电话: <span class="content"> {{ detailsData.request_phone }} </span> </td>
                <td>收函方e-mail: <span class="content"> {{ detailsData.receive_email | nullvalue }} </span>  </td>
              </tr>
              <tr>
                <td>身份证号: <span class="content"> {{ detailsData.request_num }} </span> </td>
                <td>收函方详细地址: <span class="content"> {{ detailsData.receive_address | nullvalue }} </span>  </td>
              </tr>
              <tr>
                <td>时间: <span class="content"> {{ detailsData.add_time | toTime }} </span> </td>
                <td>近一次修改时间: <span class="content"> {{ detailsData.update_time | toTime }} </span>  </td>
              </tr>
            </table>
          </el-card>

          <el-card class="box-card_2">
            <div style="display: flex; justify-content: start;">
              <div style="width:50px"> 描述:</div>

              <div style="width:95%">  {{ detailsData.desc }}</div>
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

          <el-card class="box-card_3">
            律师函文件：
            <div v-if="pdfurl != '' && pdfurl != null " class="pdfdiv" @click="viewPdf">
              <pdf
                ref="pdf"
                style="width:200px;margin: 10px auto 10px"
                :src="pdfurl"
              />
            </div>
            <div v-else style="margin-left: 100px;margin-top: 20px">
              无上传文件
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="历史修改记录" name="second">
        <div>
          <el-card v-for="(item,index) in listoryData" :key="index" class="box-card_2">
            <div style="display: flex; justify-content: start;">
              <div style="width:50px"> 描述:</div>

              <div style="width:95%">{{ item.desc }}</div>
            </div>
            <div>
              <img
                v-for="(item_1,index_1) in JSON.parse(item.files)"
                :key="index_1"
                class="file"
                :src="item_1"
                @click="pictureCardPreview(item_1)"
              >
            </div>
            <p>提交时间 : {{ item.addtime | toTime }}</p>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getCarDetails } from '@/api/car'
import { getList } from '@/api/logcar'
import { timestampToTime } from '@/utils/time'
import '@/assets/icons/iconfont.css'
import pdf from 'vue-pdf'

export default {
  components: {
    pdf
  },
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
      pdfurl: '',
      dialogVisible: false,
      dialogImageUrl: '',
      // 标签
      activeName: 'first',
      car: [],
      // 文件列表
      fileList: [],
      // 发送请求参数
      params: {
        guid: ''
      },
      logParams: {
        car_guid: '',
        page: 1,
        pagesize: 5
      },
      //
      detailsData: {},
      // 历史修改数据
      listoryData: []
    }
  },
  created() {
    this.params.guid = this.$route.query.guid
    this.logParams.car_guid = this.$route.query.guid
    // 详细信息 获取
    this.fetchData()
    // 获取 历史修改数据
    getList(this.logParams).then(response => {
      this.listoryData = response.list
    })
  },
  methods: {
    fetchData() {
      getCarDetails(this.params).then(response => {
        this.detailsData = response
        this.fileList = JSON.parse(response.files)
        this.pdfurl = response.push_file
      })
    },
    tabChange(tab, event) {
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
.box-card_2 {
  width: 85%;
  margin-top: 10px;
}
.box-card_3 {
  width: 85%;
  margin-top: 10px;
}
.file {
  width: 100px;
  margin-right: 20px;
  margin-top: 20px;
  cursor: pointer;
}
.pdfdiv {
  width:210px;
  background:#ccc;
  margin-left:100px;
  padding-top:2px;
  padding-bottom:2px;
  cursor: pointer;
}
.content {
  color: #aaa;
}
</style>

