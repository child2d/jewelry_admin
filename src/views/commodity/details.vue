<template>
  <div class="dashboard-container">
    <el-tabs v-model="activeName" @tab-click="tabChange">
      <el-tab-pane label="商品详情" name="first">
        <div>
          <el-card class="box-card">
            <table>
              <tr>
                <td>珠宝名称: <span class="content"> {{ detailsData.name }} </span> </td>
                <td>图片: <span class="content"> <img style="width: 100px" :src="detailsData.item_img" alt="" srcset=""> {{ }} </span> </td>
              </tr>
              <tr>
                <td>所属系列: <span class="content"> {{ detailsData.serie_name }} </span> </td>
                <td>剩余数量: <span class="content"> {{ detailsData.remain }} </span> </td>
              </tr>
              <tr>
                <td>类型:
                  <el-tag v-if="detailsData.type == 1" class="el_tag_margin" type="info">戒指</el-tag>
                  <el-tag v-if="detailsData.type == 2" class="el_tag_margin" type="info">项链</el-tag>
                  <el-tag v-if="detailsData.type == 3" class="el_tag_margin" type="info">手镯</el-tag>
                  <el-tag v-if="detailsData.type == 4" class="el_tag_margin" type="info">吊坠</el-tag>
                  <el-tag v-if="detailsData.type == 5" class="el_tag_margin" type="info">耳环</el-tag>
                  <el-tag v-if="detailsData.type == 6" class="el_tag_margin" type="info">手链/脚链</el-tag>
                </td>

                <td>材质:
                  <el-tag v-if="detailsData.texture == 1" class="el_tag_margin" type="info">黄金</el-tag>
                  <el-tag v-if="detailsData.texture == 2" class="el_tag_margin" type="info">铂金</el-tag>
                  <el-tag v-if="detailsData.texture == 3" class="el_tag_margin" type="info">钻石</el-tag>
                  <el-tag v-if="detailsData.texture == 4" class="el_tag_margin" type="info">宝石</el-tag>
                  <el-tag v-if="detailsData.texture == 5" class="el_tag_margin" type="info">翡翠</el-tag>
                  <el-tag v-if="detailsData.texture == 6" class="el_tag_margin" type="info">K金</el-tag>
                  <el-tag v-if="detailsData.texture == 7" class="el_tag_margin" type="info">珍珠</el-tag>
                </td>
              </tr>
              <tr>
                <td v-if="detailsData.status == 1">状态: <span class="content"> 正常 </span></td>
                <td v-else>状态: <span class="content"> 停售 </span></td>
                <td>价格: <span class="content"> {{ detailsData.price }} </span>  </td>
              </tr>
              <tr>
                <td>剩余数量: <span class="content"> {{ detailsData.remain }} </span> </td>
                <td>添加时间: <span class="content"> {{ detailsData.add_time | toTime }} </span>  </td>
              </tr>
            </table>
          </el-card>

          <el-card class="box-card_2">
            <div style="display: flex; justify-content: start;">
              <div style="width:170px"> 更多图片:</div>

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
            其他：

          </el-card>
        </div>

      </el-tab-pane>

      <el-tab-pane label="商品评论" name="second">
        <div>
          <el-card v-for="(item,index) in commentData" :key="index" class="box-card_2">
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
import { getitemDetails, getComment } from '@/api/commodity'

import { timestampToTime } from '@/utils/time'
import '@/assets/icons/iconfont.css'

export default {
  components: {
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

      //
      detailsData: {},
      // 评论数据
      commentData: []
    }
  },
  created() {
    this.params.guid = this.$route.query.guid
    this.fetchData()
  },
  methods: {
    fetchData() {
      getitemDetails(this.params).then(response => {
        this.detailsData = response
        this.fileList = JSON.parse(response.rollImg)
      })
      getComment(this.params).then(response => {
        this.commentData = response
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
  vertical-align: middle;
}
</style>

