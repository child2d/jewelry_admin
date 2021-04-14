<template>
  <div class="dashboard-container">
    <div style="margin-bottom:10px">
      <el-row style="margin-bottom: 10px">
        <el-col :span="20">
          <span class="header_font">用户</span>
          <el-input
            v-model="params.where.user_name"
            style="width:180px;"
            size="small"
            placeholder="请输入"
            clearable
          />
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-date-picker
            v-model="dateSelect"
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="发布开始时间"
            end-placeholder="发布结束时间"
            @change="changeDate"
          />
          <el-button
            style="margin-left:5px;width:100px"
            type="primary"
            size="small"
            @click="fetchList"
          >搜索</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 列表 -->
    <div class="list">
      <el-table
        v-loading="listLoading"
        :data="carList"
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
        <el-table-column align="center" label="用户" prop="nick_name" width="90" />

        <el-table-column align="center" label="商品" width="250" prop="item_name" />

        <el-table-column align="center" label="商品图片" width="150">
          <template slot-scope="scope">
            <img class="item_img" :src="scope.row.item_img" alt="" @click="viewFile(scope.row)">
          </template>
        </el-table-column>

        <el-table-column align="center" label="所属系列" width="300" prop="serie_name" />

        <!-- <el-table-column
          align="center"
          width="150"
          label="状态"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" class="el_tag_margin" size="small" type="info">待起草</el-tag>
          </template>
        </el-table-column> -->

        <el-table-column align="center" label="添加数量" width="110" prop="quantity" />

        <el-table-column align="center" label="添加时间" width="300">
          <template slot-scope="scope">
            {{ scope.row.add_time | toTime }}
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="'/car/info'"
              size="small"
              type="warning"
              @click="detailsInfo(scope.row.guid)"
            >查看详情</el-button>
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

    <div>
      <!-- 附件 -->
      <el-dialog
        title="附件列表"
        :visible.sync="showFileDialog"
        width="30%"
      >
        <div style="text-align:center">
          <img
            v-for="(item,index) in fileList"
            :key="index"
            class="file"
            :src="item"
            @click="pictureCardPreview(item)"
          >
        </div>
      </el-dialog>

      <!-- 修改内容 弹窗 -->
      <el-dialog
        title="修改内容"
        :visible.sync="showContentDialog"
        width="50%"
      >
        <el-form ref="ruleForm" :inline="true" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
          <p>委托方信息</p>

        </el-form>
        <br>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showContentDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
        </span>
      </el-dialog>
      <!-- 图片预览弹窗 -->
      <el-dialog
        title="预览"
        :visible.sync="imgDialogVisible"
      >
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getList, updata } from '@/api/car'
import { timestampToTime } from '@/utils/time'
import { getSerieNameList } from '@/api/serie'

import axios from 'axios'

import '@/assets/icons/iconfont.css'

export default {
  filters: {
    userphone: function(val) {
      if (val === '') {
        return '—————'
      }
      return val
    },
    isNull: function(val) {
      if (val === '' || val === null) {
        return 'null'
      }
      return val
    },
    toTime: function(val) {
      if (val === '' || val === null) {
        return '————'
      }
      return timestampToTime(val)
    }
  },
  data() {
    var idCardPass = (rule, value, callback) => {
      const reg1 = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/
      if (value === '') {
        callback(new Error('身份证号不能为空'))
      } else if (!reg1.test(value)) {
        callback(new Error('请输入正确的身份证号'))
      } else {
        callback()
      }
    }
    return {
      listLoading: true,
      // 图片预览弹窗
      imgDialogVisible: false,
      showContentDialog: false,
      dialogImageUrl: '',
      // 附件列表弹窗
      showFileDialog: false,
      // 用户列表
      carList: [],
      // 分页
      tableDataLength: null,
      // 初始请求参数
      params: {
        page: 1,
        pagesize: 10,
        where: {
          user_name: '',
          serie_guid: '',
          add_time: []
        }
      },
      // 日期选择
      dateSelect: '',
      // 附件列表
      fileList: [],
      // 律师函文件
      push_file: '',
      // 上传文件 设置
      signature: '',
      dir: '',
      accessid: '',
      policy: '',
      ossUrl: 'https://hn-lvshi.oss-cn-beijing.aliyuncs.com',
      fileUrl: '',
      imageUrl: '',

      // 表单信息
      ruleForm: {
        guid: ''
      },
      oneInfo: {},
      // 表单备份
      ruleFormBat: '',
      updata: {
        guid: ''
      },

      // 表单验证规则
      rules: {
        request_company: [
          { required: true, message: '公司名称', trigger: 'blur' }
        ],
        company_num: [
          { required: true, message: '机构代码', trigger: 'change' }
        ],
        receive_num: [
          { required: true, validator: idCardPass, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.ruleFormBat = JSON.parse(JSON.stringify(this.ruleForm))
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      getList(this.params).then(response => {
        this.carList = response.list
        console.log('this.carList: ', this.carList)
        this.tableDataLength = response.count
        this.listLoading = false
      })
    },
    updatacar() {
      updata(this.updata).then(response => {
        this.$message({
          type: 'info',
          message: response
        })
        this.fetchList()
      })
    },
    upload() {
      var getSuffix = function(fileName) {
        var pos = fileName.lastIndexOf('.')
        var suffix = ''
        if (pos !== -1) {
          suffix = fileName.substring(pos)
        }
        if (suffix !== '.pdf') {
          return false
        }
        return suffix
      }

      var file = document.getElementById('file').value
      if (file.length === 0) {
        alert('请选择文件')
        return
      }
      if (getSuffix(file) === false) {
        alert('请选择pdf文件')
        return
      }

      var filename = new Date().getTime() + getSuffix(file)
      var formData = new FormData()

      // 注意formData里append添加的键的大小写
      formData.append('key', this.dir + filename) // 存储在oss的文件路径
      formData.append('OSSAccessKeyId', this.accessid) // accessKeyId
      formData.append('policy', this.policy) // policy
      formData.append('Signature', this.signature) // 签名
      // 如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了

      formData.append('file', document.getElementById('file').files[0])
      console.log('document.getElementById ', document.getElementById('file').files[0])

      formData.append('success_action_status', 200) // 成功后返回的操作码

      var fileUrl = this.ossUrl + '/' + this.dir + filename
      axios.post(this.ossUrl, formData).then((response) => {
        this.updata.push_file = fileUrl
        this.updatacar()
        this.fileDialogVisible = false
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
    // 预览图片
    pictureCardPreview(url) {
      this.dialogImageUrl = url
      this.imgDialogVisible = true
    },

    // 点击附件图标
    viewFile(file) {
      console.log('file: ', file)
      this.showFileDialog = true
      const filelist = JSON.parse(file)
      this.fileList = filelist
    },
    //  跳转
    detailsInfo(guid) {
      const questionInfo = this.$router.resolve({
        path: '/car/details',
        query: {
          guid: guid
        }
      })
      window.open(questionInfo.href, '_blank')
    },

    // 数据 筛选
    changeDate() {
      if (this.dateSelect === null) {
        this.params.where.add_time = []
        return
      }
      const start = Date.parse(this.dateSelect[0])
      const end = Date.parse(this.dateSelect[1])
      const date = [start / 1000, end / 1000]
      this.params.where.add_time = date
    }

  }
}
</script>

<style scoped>
.dashboard-container {
  margin: 10px 20px 0;
}
.header_font {  font-size: 14px;
  text-align: left;
  color: #747774;
  margin-left:10px;
  margin-right:10px;
}

.table_span_color {
  color: #aaa;
}
.info-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.list {
  margin-bottom: 10px;
}
.font_align_left {
  text-align: left;
}
.file {
  width: 100px;
  margin-right: 20px;
  margin-top: 20px;
  cursor: pointer;
}
.dialog_input {
  width: 300px;
}
.thepages {
  margin-bottom: 10px;
}
.el_tag_margin {
  margin-bottom: 5px;
  margin-top: 5px;
  margin-left: 2px;
  margin-right: 2px;
}
.item_img {
  width:100px;
}
</style>

