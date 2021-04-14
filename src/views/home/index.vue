<template>
  <div class="dashboard-container">
    <el-card class="box-card">
      <div class="text item">
        <div style="width:200px">
          <img :src="avatar" alt="">
        </div>
        <div>
          <table>
            <tr>
              <td>欢迎您,  <span id="p_color">{{ name }}</span></td>
              <td>当前角色: <span id="p_color_2">{{ roles | showRole }}</span> </td>
            </tr>
            <tr>
              <td>最近一次登录时间:  <span id="p_color_2">{{ last_time | toTime }}</span></td>
              <td>最近一登录IP: <span id="p_color_2">{{ last_ip }}</span> </td>
            </tr>
          </table>
        </div>
      </div>

    </el-card>
    <!-- <div id="other">
      <div class="module" style="background-color: #00a2ff;">
        <div class="content">
          <p class="p_font_1">xxx模块数据</p>
          <p class="p_font_2">数据展示量：xxxxxx</p>
        </div>
        <div class="icon">
          <i class="iconfont iconfeiji" />
        </div>
      </div>
      <div class="module" style="background-color: #ff9900;">
        <div class="content">
          <p class="p_font_1">xxx模块数据</p>
          <p class="p_font_2">数据展示量：xxxxxx</p>
        </div>
        <div class="icon">
          <i class="iconfont iconfeiji" />
        </div>
      </div>
      <div class="module" style="background-color: #009900;">
        <div class="content">
          <p class="p_font_1">xxx模块数据</p>
          <p class="p_font_2">数据展示量：xxxxxx</p>
        </div>
        <div class="icon">
          <i class="iconfont iconfeiji" />
        </div>
      </div>
      <div class="module" style="background-color: #ff9900;">
        <div class="content">
          <p class="p_font_1">xxx模块数据</p>
          <p class="p_font_2">数据展示量：xxxxxx</p>
        </div>
        <div class="icon">
          <i class="iconfont iconfeiji" />
        </div>
      </div>
      <div class="module" style="background-color: #009900;">
        <div class="content">
          <p class="p_font_1">xxx模块数据</p>
          <p class="p_font_2">数据展示量：xxxxxx</p>
        </div>
        <div class="icon">
          <i class="iconfont iconfeiji" />
        </div>
      </div>
      <div class="module" style="background-color: #00a2ff;">
        <div class="content">
          <p class="p_font_1">xxx模块数据</p>
          <p class="p_font_2">数据展示量：xxxxxx</p>
        </div>
        <div class="icon">
          <i class="iconfont iconfeiji" />
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { timestampToTime } from '@/utils/time'
import '@/assets/icons/iconfont.css'
import store from '../../store'
export default {
  filters: {
    toTime: function(val) {
      return timestampToTime(val)
    },
    showRole: function(val) {
      let role = ''
      for (let i = 0; i < val.length; i++) {
        role = role + val[i] + '-'
      }
      role = role.substr(0, role.length - 1)
      return role
    }
  },
  data() {
    return {
      guid: store.getters.token,
      avatar: store.getters.avatar,
      name: store.getters.name,
      last_ip: store.getters.last_ip,
      last_time: store.getters.last_time,
      roles: store.getters.roles,

      listLoading: true,

      // 分页
      tableDataLength: null,
      params: {
        page: 1,
        pagesize: 2
      }
    }
  }

}
</script>

<style  scoped>
.iconfeiji {
  font-size: 100px;
  color: #e0f4ff;
}
.text {
  font-size: 14px;
  display: flex;
  /* justify-content: flex-start; */
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 85%;
  margin: 20px auto 10px;
}

img {
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-left: 50px;
  align-items: center;
  margin-right: 25px;
}
td {
  width: 500px;
  height: 50px;
}
#p_color {
  color: #ec9d78;
}
#p_color_2 {
  color: #bbb;
}

#other {
  width: 85%;
  margin: 50px auto 10px;
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
}

.module {
  width: 30%;
  min-width: 370px;
  /* display: inline-block; */
  display: flex;
  flex-grow: row;
  justify-content: space-between;
  border-radius: 5px;
  height: 174px;
  margin-left: 20px;
  margin-bottom: 20px;

}
.content {
  width: 65%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 40px;
}
.content .p_font_1 {
  font-weight: 500;
  font-style: normal;
  font-size: 24px;
  color: #FFFFFF;
}
.content .p_font_2 {
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  color: #FFFFFF;
}
.icon {
  width: 35%;
  align-items: center;
  line-height: 174px;
  background-color: rgba(231, 231, 231, 0.376);
  padding-left: 15px;
}

</style>
