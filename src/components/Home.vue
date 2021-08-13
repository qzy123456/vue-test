<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>后台管理系统</span>
        <!-- 修改用户的对话框 -->
        <el-dialog
                title="修改用户信息"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogClosed"
        >
          <!-- 内容主体 -->
          <el-form
                  :model="editUserForm"
                  ref="editUserFormRef"
                  :rules="editUserFormRules"
                  label-width="80px"
          >
            <el-form-item label="旧密码" prop="old_password">
              <el-input v-model="editUserForm.old_password"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="editUserForm.password"></el-input>
            </el-form-item>
            <el-form-item label="重复密码" prop="new_password">
              <el-input v-model="editUserForm.new_password"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
        </el-dialog>
      </div>
      <!--<el-button type="info" @click="logout">{{userName}} 退出</el-button>-->
      <el-col :xs="12" :lg="12" :md="9" :sm="14" :xl="9" style="display: flex;justify-content: flex-end;">
        <div class="fl-right right-box">
          <el-dropdown>
                      <span class="header-avatar" style="cursor: pointer;color: #999999;">
                        <span style="margin-left: 5px">{{ userName }}</span>
                        <i class="el-icon-arrow-down" />
                      </span>
            <el-dropdown-menu slot="dropdown" class="dropdown-group">
              <el-dropdown-item>
                          <span style="font-weight: 600;">
                            当前角色：{{ userName }}
                          </span>
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-s-custom" @click.native="toPerson">修改密码</el-dropdown-item>
              <el-dropdown-item icon="el-icon-table-lamp" @click.native="logout">登 出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="togleCollapse">|||</div>
        <el-menu unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath" background-color="#333744" text-color="#fff" active-text-color="#409FFF">
           <!-- :unique-opened="true"->只允许展开一个菜单 -->
           <!-- :collapse-transition="false" -> 关闭动画 -->
           <!-- router -> 导航开启路由模式 -->
          <!-- 一级菜单  -->
          <el-submenu :index="item.menu_id+''" v-for="item in menuList" :key="item.menu_id" >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i :class="iconObj[item.menu_id]"></i>
              <span>{{ item.menu_name}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="subItem.menu_url" v-for="subItem in item.children" :key="subItem.menu_id" @click="saveNavState(subItem.menu_url)">
              <!-- 导航开启路由模式：
                将index值作为导航路由 -->
              <!-- 二级菜单的模板区域 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.menu_name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {

  data () {
    var repasswordValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.editUserForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else if (value === this.editUserForm.old_password) {
        callback(new Error('新密码不能和旧密码一致!'))
      } else {
        callback()
      }
    }
    return {
      // 左侧菜单数据
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 默认不折叠
      isCollapse: false,
      // 被激活导航地址
      activePath: '',
      userName:'',
      // 修改用户
      editDialogVisible: false,
      editUserForm: {},
      // 编辑用户表单验证
      editUserFormRules: {
        old_password: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          {
            min: 3,
            max: 18,
            message: '用户密码的长度在3～18',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            min: 3,
            max: 18,
            message: '用户密码的长度在3～18',
            trigger: 'blur'
          }
        ],
        new_password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: repasswordValidator, trigger: 'blur' }
        ]
      },
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
    this.userName = window.sessionStorage.getItem('userName')
  },
  methods: {
    logout () {
      // 清空token
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取请求菜单
    async getMenuList () {
      const { data: res } = await this.$http.post('/user/getMenuById')
      if (res.code !== 200) return this.$message.error(res.msg)
      this.menuList = res.data
    },
    // 菜单的折叠与展开
    togleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存连接的激活地址
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    },
// 修改用户信息
    editUser () {
      // 提交请求前，表单预验证
      this.$refs.editUserFormRef.validate(async valid => {
        // 表单预校验失败
        if (!valid) return
        const { data: res } = await this.$http.post(
                '/user/updatePass',
                {
                  password: this.editUserForm.password,
                  userName  :   this.userName,
                  new_password: this.editUserForm.new_password
                }
        )
        if (res.code !== 200) {
          this.$message.error(res.msg)
          return
        }
        // 隐藏添加用户对话框
        this.editDialogVisible = false
        this.$message.success('修改密码成功！')
      })
    },
    editDialogClosed(){
      this.$refs.editUserFormRef.resetFields()
    },
    toPerson(){
      this.editDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373f41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      height: 40px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;

  .el-menu {
    border: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标放上去变成小手
  cursor: pointer;
}
</style>
