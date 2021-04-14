<template>
  <div class="dashboard-container">
    <div class="head_button">
      <el-button type="primary">日志管理</el-button>
    </div>
    <div class="list">
      <el-table
        v-loading="listLoading"
        :data="roleList"
        element-loading-text="Loading"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        border
      >
        <el-table-column align="center" label="序号" width="60">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作人" width="150">
          <template slot-scope="scope">
            <div class="user">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作数据">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
            <el-tag v-if="scope.row.status == 0" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作时间">
          <template slot-scope="scope">
            {{ timestampToTime(scope.row.add_time) }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="360">
          <!-- <template slot-scope="scope">
            <el-button
              type="warning"
              @click="getUpdateForm(scope.row)"
            >修改</el-button>
            <el-button
              v-if="scope.row.status == 0"
              type="success"
              @click="enable(scope.row.guid)"
            >启用</el-button>
            <el-button
              v-if="scope.row.status == 1"
              type="info"
              @click="disable(scope.row.guid)"
            >禁用</el-button>
          </template> -->
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
import { getList } from '@/api/role'
import { timestampToTime } from '@/utils/time'

export default {
  filters: {
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
      roleList: [],
      // 分页
      tableDataLength: null,
      // 发送数据
      params: {
        page: 1,
        pagesize: 10,
        where: {
          name: '',
          time: []
        }
      }
    }
  },
  created() {
    // this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      getList(this.params).then(response => {
        this.roleList = response.list
        this.tableDataLength = response.count
        this.listLoading = false
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
    }

  }
}
</script>

<style scope>
.dashboard-container {
  margin: 10px 20px 0;
}
.header_font {
  font-size: 14px;
  text-align: left;
  color: #747774;
  margin-left:10px;
  margin-right:10px;
}

</style>
