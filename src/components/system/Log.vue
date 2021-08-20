<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>请求日志</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 添加 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query_info" clearable @clear="getLogList">
            <el-button slot="append" icon="el-icon-search" @click="getLogList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <!-- stripe: 斑马条纹
        border：边框-->
        <el-table-column width="60%" prop="Id" label="Id"></el-table-column>
        <el-table-column width="60%" prop="User" label="管理员"></el-table-column>
        <el-table-column width="80%" prop="Ip" label="ip"></el-table-column>
        <el-table-column width="130%" prop="Path" label="路径"></el-table-column>
        <el-table-column prop="Body" label="请求参数"></el-table-column>
        <el-table-column prop="Response" label="响应"></el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page_num"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryInfo.totle"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取用户列表查询参数对象
      queryInfo: {
        query_info: '',
        // 当前页数
        page_num: 1,
        // 每页显示多少数据
        page_size: 5
      },
      userlist: [],
      totle: 0,
    }
  },
  created () {
    this.getLogList()
  },
  methods: {
    async getLogList () {
      const { data: res } = await this.$http.post('/log/all', this.queryInfo)
      if (res.code !== 200) {
        return this.$message.error('获取请求日志列表失败！')
      }
      this.userlist = res.data
      this.totle = res.count
      console.log(res)
    },
    // 监听 pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.page_size = newSize
      this.getLogList()
    },
    // 监听 页码值 改变事件
    handleCurrentChange (newSize) {
      this.queryInfo.page_num = newSize
      this.getLogList()
    }
  }
}
</script>

<style  scoped>
</style>
