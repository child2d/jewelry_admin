<template>
  <div class="dashboard-container">
    <div class="top_bar">
      <div style="width: 1000px">
        <el-row style="margin-bottom: 10px">
          <el-col :span="20">
            <span class="header_font">商品名称</span>
            <el-input
              v-model="params.where.name"
              style="width:180px;"
              size="small"
              placeholder="请输入"
              clearable
            />
            <span class="header_font">所属系列</span>
            <el-select
              v-model="params.where.serie_guid"
              style="width:180px;"
              size="small"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="(item, index) in serieArray"
                :key="index"
                :label="item.name"
                :value="item.guid"
              />
            </el-select>
            <span class="header_font">珠宝状态</span>
            <el-select
              v-model="params.where.status"
              style="width:180px;"
              size="small"
              placeholder="请选择"
              clearable
            >
              <el-option label="正常" value="1" />
              <el-option label="停售" value="2" />
            </el-select>
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
      <div class="head_button">
        <!-- v-permission="'/admin/add'" -->
        <el-button
          type="primary"
          @click="addItem"
        >添加商品</el-button>
      </div>
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
            {{ scope.row.price.toFixed(2) }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="剩余数量" width="150" prop="remain" />

        <el-table-column
          align="center"
          width="150"
          label="状态"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" class="el_tag_margin" size="small" type="success">正常</el-tag>
            <el-tag v-if="scope.row.status == 2" class="el_tag_margin" size="small">停售</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="350"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="'/car/info'"
              size="small"
              type="warning"
              @click="detailsInfo(scope.row.guid)"
            >查看详情</el-button>

            <el-button
              v-permission="'/car/info'"
              size="small"
              type="danger"
              @click="viewFile(scope.row, scope.$index)"
            >轮播图编辑</el-button>

            <el-button
              v-permission="'/car/modify'"
              size="small"
              @click="editeInfo(scope.row)"
            >编辑内容</el-button>

            <!-- <el-button
              v-permission="'/car/modify'"
              size="small"
              @click="show11(scope.row)"
            >111</el-button> -->
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
        title="轮播图编辑"
        :visible.sync="showFileDialog"
        width="50%"
      >
        <div style="text-align:center">
          <div
            v-for="(item,index) in fileList"
            :key="index"
            style="display: inline-block;"
          >
            <div style="margin-right: 6px;">
              <img
                class="file"
                :src="item"
              >
              <br>
              <i
                class="el-icon-circle-close"
                :style="{cursor: 'pointer'}"
                @click="deleteImg(index)"
              />
            </div>
          </div>

          <el-upload
            style="margin-top: 5px;"
            class="upload-demo"
            action="#"
            :show-file-list="false"
            :http-request="()=>{return false}"
            :before-upload="addImg"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>

        </div>
      </el-dialog>

      <!-- 修改内容 弹窗 -->
      <el-dialog
        :title="title"
        :visible.sync="showContentDialog"
        width="52%"
      >
        <el-form ref="ruleForm" :inline="true" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="ruleForm.name" class="dialog_input" />
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input type="number" v-model="ruleForm.price" class="dialog_input" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="ruleForm.status" class="dialog_input">
              <el-option label="正常" :value="1" />
              <el-option label="停售" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="剩余" prop="remain">
            <el-input v-model="ruleForm.remain" type="number" style="width: 80px" />
          </el-form-item>
          <el-form-item label="增加">
            <el-input v-model="ruleForm.addnum" type="number" style="width: 70px" />
          </el-form-item>
          <el-form-item label="所属系列" prop="serie_guid">
            <el-select v-model="ruleForm.serie_guid" class="dialog_input">
              <el-option
                v-for="(item, index) in serieArray"
                :key="index"
                :label="item.name"
                :value="item.guid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="ruleForm.type" class="dialog_input">
              <el-option :value="1" label="戒指" />
              <el-option :value="2" label="项链" />
              <el-option :value="3" label="手镯" />
              <el-option :value="4" label="吊坠" />
              <el-option :value="5" label="耳环" />
              <el-option :value="6" label="手链" />
            </el-select>
          </el-form-item>
          <el-form-item label="材质" prop="texture">
            <el-select v-model="ruleForm.texture" class="dialog_input">
              <el-option :value="1" label="黄金" />
              <el-option :value="2" label="铂金" />
              <el-option :value="3" label="钻石" />
              <el-option :value="4" label="宝石" />
              <el-option :value="5" label="翡翠" />
              <el-option :value="6" label="K金" />
              <el-option :value="7" label="珍珠" />
            </el-select>
          </el-form-item>
          <el-form-item /><br>

          <el-form-item label="商品图片" prop="item_img">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :http-request="()=>{return false}"
              :before-upload="beforeAvatarUpload"
            >
              <div
                v-loading="imgLoading"
                :element-loading-text="imgText"
                :element-loading-spinner="imgIcon"
                element-loading-background="rgba(0, 0, 0, 0.8)"
              >
                <img v-if="ruleForm.item_img" :src="ruleForm.item_img" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <br>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showContentDialog = false">取 消</el-button>
          <el-button
            type="primary"
            :disabled="buttonType"

            @click="submitForm('ruleForm')"
          >{{ buttonContent }}</el-button>
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
import { getList, updata, goodsAdd, rollImgDelete, rollImgAdd } from '@/api/commodity'
import { ossRequest } from '@/api/user'
import { getSerieNameList } from '@/api/serie'
import { timestampToTime } from '@/utils/time'
import '@/assets/icons/iconfont.css'

// import { getOssSign } from '@/api/user'

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
    }
  },
  data() {
    return {
      listLoading: true,
      // 图片预览弹窗
      imgDialogVisible: false,
      dialogImageUrl: '',
      // 附件列表弹窗
      showFileDialog: false,
      // 修改内容弹窗
      showContentDialog: false,

      // 当前时间戳
      nowtime: Date.parse(new Date()),
      // 用户列表
      carList: [],
      // 分页
      tableDataLength: null,
      // 初始请求参数
      params: {
        page: 1,
        pagesize: 10,
        where: {
          name: '',
          serie_guid: '',
          status: '',
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
      ossUrl: 'http://jewelry3510.com/api/getsign',
      local: 'https://jewelry-1304044450.cos.ap-guangzhou.myqcloud.com/admin/',
      addImageUrl: '',
      imageUrl: '',
      imgLoading: false,
      imgIcon: 'el-icon-loading',
      imgText: '图片上传中',
      buttonType: false,

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

      title: '修改内容',
      buttonContent: '',
      rollImg_guid: '',
      currentRowIndex: null,

      // 系列 筛选 数组
      serieArray: [],

      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '商品名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '价格', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态', trigger: 'blur' }
        ],
        remain: [
          { required: true, message: '剩余', trigger: 'blur' }
        ],
        serie_guid: [
          { required: true, message: '所属系列', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '类型', trigger: 'blur' }
        ],
        texture: [
          { required: true, message: '材质', trigger: 'blur' }
        ],
        item_img: [
          { required: true, message: '商品图片', trigger: 'blur' }
        ]

      }
    }
  },
  created() {
    this.ruleFormBat = JSON.parse(JSON.stringify(this.ruleForm))
    if (this.$route.query.serie_guid) {
      this.params.where.serie_guid = this.$route.query.serie_guid
    }
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      getSerieNameList({}).then(response => {
        this.serieArray = response.list
      })
      getList(this.params).then(response => {
        this.carList = response.list
        this.tableDataLength = response.count
        this.listLoading = false
      })
    },
    addItem() {
      this.title = '新增商品'
      this.buttonContent = '确定'
      this.ruleForm = JSON.parse(JSON.stringify(this.ruleFormBat))
      this.showContentDialog = true
    },
    updateItem() {
      updata(this.updata).then(response => {
        this.$message({
          type: 'info',
          message: response
        })
        this.fetchList()
      })
    },
    goodsAdd() {
      goodsAdd(this.updata).then(response => {
        this.$message({
          type: 'info',
          message: response
        })
        this.fetchList()
      })
    },

    show11() {
      this.fileDialogVisible = true
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
    viewFile(row, index) {
      console.log('row: ', row)
      console.log('index: ', index)
      const file = row.rollImg
      this.showFileDialog = true
      this.rollImg_guid = row.guid
      this.currentRowIndex = index
      this.fileList = JSON.parse(file)
    },
    //  跳转
    detailsInfo(guid) {
      const questionInfo = this.$router.resolve({
        path: '/commodity/details',
        query: {
          guid: guid
        }
      })
      window.open(questionInfo.href, '_blank')
    },
    editeInfo(row) {
      this.title = '修改信息'
      this.buttonContent = '修改'
      this.showContentDialog = true
      this.ruleForm = JSON.parse(JSON.stringify(row))
      // oneInfo 用于比对修改过的信息
      this.oneInfo = JSON.parse(JSON.stringify(row))
    },
    // 表单验证
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.showContentDialog = false
          this.findDiffData()
        } else {
          return false
        }
      })
    },

    // 寻找修改过的字段
    findDiffData() {
      // 必传字段
      const obj = { 'guid': this.ruleForm.guid }
      for (const key in this.ruleForm) {
        if (this.ruleForm[key] !== this.oneInfo[key]) {
          obj[key] = this.ruleForm[key]
        }
      }
      this.updata = JSON.parse(JSON.stringify(obj))
      if (this.title === '新增商品') {
        this.goodsAdd()
      } else {
        this.updateItem()
      }
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
    },

    // 提交 文件
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      this.imgText = '图片上传中'
      this.buttonType = true
      this.imgLoading = true

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }

      var getSuffix = function(filename) {
        var pos = filename.lastIndexOf('.')
        var suffix = ''
        if (pos !== -1) {
          suffix = filename.substring(pos)
        }
        return suffix
      }

      var filename = new Date().getTime() + getSuffix(file.name)
      var formData = new FormData()
      formData.append('key', filename) // 存储在oss的文件路径
      formData.append('file', file)

      const fileUrl = this.local + filename
      ossRequest(formData).then(response => {
        this.ruleForm.item_img = fileUrl
        this.buttonType = false
        this.imgLoading = false
      })
    },
    deleteImg(index) {
      const params = { 'guid': this.rollImg_guid, 'index': index }
      rollImgDelete(params).then(res => {
        this.$message('删除成功')
        this.carList[this.currentRowIndex].rollImg = res
        this.fileList = JSON.parse(res)
      })
    },
    addImg(file) {
      console.log(this.fileList)
      const path = this.beforeAvatarUpload_2(file)
      const obj = { 'guid': this.rollImg_guid, 'imgurl': path }
      rollImgAdd(obj).then(res => {
        this.$message('添加成功')
        this.carList[this.currentRowIndex].rollImg = res
        // this.fileList = JSON.parse(res)
      })
      // this.fileList.push(path)
    },
    // 提交 文件
    beforeAvatarUpload_2(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
        return false
      }
      var getSuffix = function(filename) {
        var pos = filename.lastIndexOf('.')
        var suffix = ''
        if (pos !== -1) {
          suffix = filename.substring(pos)
        }
        return suffix
      }
      var filename = new Date().getTime() + getSuffix(file.name)
      var formData = new FormData()
      formData.append('key', filename) // 存储在oss的文件路径
      formData.append('file', file)

      const fileUrl = this.local + filename
      ossRequest(formData).then(response => {
        this.fileList.push(fileUrl)
      })
      return fileUrl
    }

  }
}
</script>

<style scoped>
.top_bar {
  margin-bottom:10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.dashboard-container {
  margin: 10px 20px 0;

}
.head_button {
  /* padding: 20px 20px 20px 20px; */
  widows: 200px;
  margin-top: 20px;
}
.header_font {
  font-size: 14px;
  text-align: left;
  color: #747774;
  margin-left:10px;
  margin-right:10px;
}
.iconpic {
  font-size: 100px;
  line-height: 120px;
  cursor: pointer;
  color: #b1b1b1;
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

.file {
  width: 100px;
  text-align: center;
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

/*  */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

