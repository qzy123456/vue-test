<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="AddRoleDialogVisible=true">添加路由</el-button>
      </el-col>
    </el-row>
    <!-- 卡片视图 -->
    <el-card>

      <template slot-scope="scope">
        <el-row
                :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
                v-for="(item1, i1) in rightsList"
                :key="item1.menu_id"
        >
          <!-- 一级权限 -->
          <el-col :span="5">
            <el-tag closable @close="removeRightById(scope.row, item1.menu_id)">{{ item1.menu_name}}</el-tag>
            <i class="el-icon-caret-right"></i>
          </el-col>
          <!-- 二级和三级 -->
          <el-col :span="19">
            <!-- 通过for循环 渲染二级权限 -->
            <el-row
                    :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                    v-for="(item2, i2) in item1.children"
                    :key="item2.menu_id"
            >
              <el-col :span="6 ">
                <el-tag
                        type="success"
                        closable
                        @close="removeRightById(scope.row, item2.menu_id)"
                >{{ item2.menu_name }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-tag
                        type="warning"
                        v-for="(item3) in item2.children"
                        :key="item3.menu_id"
                        closable
                        @close="removeRightById(scope.row, item3.menu_id)"
                >{{ item3.menu_name}}</el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>

    </el-card>

    <!--表单界面-->
    <el-dialog title="添加路由"
            :visible.sync="AddRoleDialogVisible"
            width="45%"
            top="5vh">
      <el-form :model="formData" :rules="addRoleFormRules" ref="dataForm">
        <el-form-item label="父ID" prop="menu_id">
            <el-cascader
                    v-model="menu_id"
                    :options="rightsList"
                    :props="treeProps"
                    :show-all-levels="false"
                    :placeholder="treeProps.placeholder"
                     style="width:35%"></el-cascader>
        </el-form-item>
        <el-form-item label="路由地址" prop="menu_url">
          <el-input type="" v-model="formData.menu_url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="路由名" prop="menu_name">
          <el-input type="" v-model="formData.menu_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow">
          <el-radio-group v-model="formData.isShow">
            <el-radio :label="0" >隐藏</el-radio>
            <el-radio :label="1" >显示</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="roleDialogVisible">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 权限列表
       rightsList: [],
        menu_id:[],
        // 添加路由表单
        formData: {
          isShow:1
        },
        editRoleDialogVisible:false,
        //   添加用户对话框
        AddRoleDialogVisible: false,
        //   添加角色表单验证
        addRoleFormRules: {
          menu_name: [
                { required: true, message: '请输入路由名称', trigger: 'blur' }
            ],

        },
        treeProps: {
            label: 'menu_name',
            children: 'children',
            value: 'menu_id',
            checkStrictly: true,
            placeholder:"根节点"
        },
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
      roleDialogVisible(){
          this.AddRoleDialogVisible = false
          this.menu_id = []
      },
    async getRightsList () {
      const { data: res } = await this.$http.post('menu/all')
      if (res.code!== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      console.log(res.data)
      this.rightsList = res.data
    },
      editRoles () {
          this.$refs.dataForm.validate(async valid => {
              if(this.menu_id.length == 0){
                this.formData.parent_id = 0
              }else {
                this.formData.parent_id = this.menu_id.pop()
              }
              // 表单预校验失败
              if (!valid) return
              const { data: res } = await this.$http.post(
                  'menu/save',
                  this.formData
              )
              if (res.code !== 200) {
                  this.$message.error('更新角色信息失败！')
              }
              // 隐藏编辑角色对话框
              this.AddRoleDialogVisible = false
              this.menu_id = []
              this.$message.success('添加路由成功！')
              this.getRightsList()
          })
      },
  }
}
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
