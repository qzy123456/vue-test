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
          <el-input placeholder="请输入内容" v-model="queryInfo.query_info" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <!-- stripe: 斑马条纹
        border：边框-->
        <el-table-column width="60%" prop="Id" label="Id"></el-table-column>
        <el-table-column width="80%" prop="Ip" label="ip"></el-table-column>
        <el-table-column width="120%" prop="Path" label="路径"></el-table-column>
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
    this.getUserList()
  },
  methods: {
    async getUserList () {
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
      // console.log(newSize)
      this.queryInfo.page_size = newSize
      this.getUserList()
    },
    // 监听 页码值 改变事件
    handleCurrentChange (newSize) {
      // console.log(newSize)
      this.queryInfo.page_num = newSize
      this.getUserList()
    },
    // 监听 switch开关 状态改变
    async userStateChanged (userInfo) {
      this.userInfo.enabled = userInfo.enabled ? 1 :0
      this.userInfo.userId = userInfo.userId
      console.log( this.userInfo)
      const { data: res } = await this.$http.post('/user/updateStatus', this.userInfo)
      if (res.code !== 200) {
        userInfo.enabled = !userInfo.enabled
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 监听 添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addUserFormRef.resetFields()
    },
    // 添加用户
    addUser () {
      // 提交请求前，表单预验证
      this.$refs.addUserFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return
        const { data: res } = await this.$http.post('/user/saveUser', this.addUserForm)
        if (res.code !== 200) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        // 隐藏添加用户对话框
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 编辑用户信息
    async showEditDialog (userInfo) {
      this.editUserForm = userInfo
      this.editUserForm.userId = userInfo.userId
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editUserFormRef.resetFields()
    },
    // 修改用户信息
    editUser () {
      // 提交请求前，表单预验证
      this.$refs.editUserFormRef.validate(async valid => {
        // 表单预校验失败
        if (!valid) return
        const { data: res } = await this.$http.post(
          '/user/update',
          {
            password: this.editUserForm.password,
            userId  :   this.editUserForm.userId
          }
        )
        if (res.code !== 200) {
          this.$message.error(res.msg)
        }
        // 隐藏添加用户对话框
        this.editDialogVisible = false
        this.$message.success('更新用户信息成功！')
        this.getUserList()
      })
    },
    // 删除用户
    async removeUserById (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 点击确定 返回值为：confirm
      // 点击取消 返回值为： cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.post('/user/deleteById',
              {"userId" :id })
      if (res.code !== 200) return this.$message.error('删除用户失败！')
      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    // 展示分配角色的对话框
    async showSetRole (role) {
      console.log(role)
      // <p>当前用户：{{userInfo.username}}</p>
      //<p>当前角色：{{userInfo.role_name}}</p>
      this.userInfo.username = role.userName
      this.userInfo.role_name = role.Role.role_name
      this.userInfo.user_id = role.userId
      // 展示对话框之前，获取所有角色列表
      const { data: res } = await this.$http.post('/role/all')
      if (res.code !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesLsit = res.data
      this.setRoleDialogVisible = true
    },
    // 分配角色
    async saveRoleInfo () {
      if (!this.selectRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.post('/user/insertRole',{ role_id: this.selectRoleId,
        user_id : this.userInfo.user_id
      })
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success('更新角色成功！')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 分配角色对话框关闭事件
    setRoleDialogClosed () {
      this.selectRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style  scoped>
</style>
