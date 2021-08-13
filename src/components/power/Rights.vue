<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色按钮 -->
    <el-row style="margin-bottom: 10px">
      <el-col>
        <el-button type="primary" @click="AddRoleDialogVisible=true">添加路由</el-button>
      </el-col>
    </el-row>
    <!-- 卡片视图 -->
    <el-card>

      <!--<template slot-scope="scope">-->
        <!--<el-row-->
                <!--:class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"-->
                <!--v-for="(item1, i1) in rightsList"-->
                <!--:key="item1.menu_id"-->
        <!--&gt;-->
          <!--&lt;!&ndash; 一级权限 &ndash;&gt;-->
          <!--<el-col :span="5">-->
            <!--<el-tag-->
                    <!--closable-->
                    <!--@click="onClick(item1)"-->
                    <!--@close="removeMenuById(item1.menu_id)">-->
              <!--{{ item1.menu_name}}</el-tag>-->
            <!--<i class="el-icon-caret-right"></i>-->
          <!--</el-col>-->
          <!--&lt;!&ndash; 二级和三级 &ndash;&gt;-->
          <!--<el-col :span="19">-->
            <!--&lt;!&ndash; 通过for循环 渲染二级权限 &ndash;&gt;-->
            <!--<el-row-->
                    <!--:class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"-->
                    <!--v-for="(item2, i2) in item1.children"-->
                    <!--:key="item2.menu_id"-->
            <!--&gt;-->
              <!--<el-col :span="6 ">-->
                <!--<el-tag-->
                        <!--type="success"-->
                        <!--closable-->
                        <!--@click.native="onClick(item1)"-->
                        <!--@close="removeMenuById(item2.menu_id)"-->
                <!--&gt;{{ item2.menu_name }}</el-tag>-->
                <!--<i class="el-icon-caret-right"></i>-->
              <!--</el-col>-->
              <!--<el-col :span="18">-->
                <!--<el-tag-->
                        <!--type="warning"-->
                        <!--v-for="(item3) in item2.children"-->
                        <!--:key="item3.menu_id"-->
                        <!--closable-->
                        <!--@click.native="onClick(item1)"-->
                        <!--@close="removeMenuById(item3.menu_id)"-->
                <!--&gt;{{ item3.menu_name}}</el-tag>-->
              <!--</el-col>-->
            <!--</el-row>-->
          <!--</el-col>-->
        <!--</el-row>-->
      <!--</template>-->
      <el-tree
              :data="rightsList"
              :props="defaultProps"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button v-if="node.level != 3"
                  type="text"
                  size="mini"
                  @click="() =>handleForm(node, data ,'add')">
            添加子菜单
          </el-button>
           <el-button
                   type="text"
                   size="mini"
                   @click="() =>handleForm(node, data ,'edite')">
            修改菜单
          </el-button>
          <el-button
                  type="text"
                  size="mini"
                  @click="() => removeMenuById(node, data)">
            删除
          </el-button>
        </span>
      </span>
      </el-tree>

    </el-card>

    <!--添加表单界面-->
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
          <el-button type="primary" @click="addMenu">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改表单界面-->
    <el-dialog title="修改路由"
               :visible.sync="editeRoleDialogVisible"
               width="45%"
               top="5vh">
      <el-form :model="editeFormData" :rules="editeRoleFormRules" ref="dataForm">
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
          <el-input type="" v-model="editeFormData.menu_url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="路由名" prop="menu_name">
          <el-input type="" v-model="editeFormData.menu_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow">
          <el-radio-group v-model="editeFormData.isShow">
            <el-radio :label="0" >隐藏</el-radio>
            <el-radio :label="1" >显示</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible">取 消</el-button>
        <el-button type="primary" @click="editMenu">确 定</el-button>
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
        editeFormData:{

        },
      defaultProps: {
        children: 'children',
        label: 'menu_name'
      },
        //   添加用户对话框
        AddRoleDialogVisible: false,
      editeRoleDialogVisible: false,
        //   添加角色表单验证
        addRoleFormRules: {
          menu_name: [
                { required: true, message: '请输入路由名称', trigger: 'blur' }
            ],
        },
        editeRoleFormRules:{
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
          this.editeRoleDialogVisible = false
          this.menu_id = []
          this.formData={}
          this.editeFormData={}
      },
    //获取所有的路由
    async getRightsList () {
      const { data: res } = await this.$http.post('/menu/all')
      if (res.code!== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      this.rightsList = res.data
    },
    //添加路由
    addMenu () {
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
                  this.$message.error('添加路由失败！')
              }
              // 隐藏编辑角色对话框
              this.AddRoleDialogVisible = false
              this.menu_id = []
              this.formData={}
              this.editeFormData={}
              this.$message.success('添加路由成功！')
              this.getRightsList()
          })
      },
    //修改
    editMenu () {
      this.$refs.dataForm.validate(async valid => {
        if(this.menu_id.length == 0){
          this.editeFormData.parent_id = 0
        }else {
          this.editeFormData.parent_id = this.menu_id.pop()
        }
        // 表单预校验失败
        if (!valid) return
        console.log(this.editeFormData)
        const { data: res } = await this.$http.post(
                '/menu/update',
                this.editeFormData
        )
        if (res.code !== 200) {
          this.$message.error('修改路由失败！')
        }
        // 隐藏编辑角色对话框
        this.editeRoleDialogVisible = false
        this.menu_id = []
        this.formData={}
        this.editeFormData={}
        this.$message.success('修改路由成功！')
        this.getRightsList()
      })
    },
    onClick(menu){

      this.editeRoleDialogVisible = true
      //this.getLeafkeys(menu, this.menu_id)
    },
    // 通过递归 获取角色下三级权限的 id, 并保存到defKeys数组
    getLeafkeys (node, arr) {
        //如果是顶级节点
        if (node.data.parent_id ==0){
          return arr.push(node.data.menu_id)
        }
      // 没有children属性，则是三级节点
      if(node.parent.data.parent_id == 0){
        arr.push(node.data.parent_id)
        return  arr.push(node.data.menu_id)
      }else{
        arr.push(node.parent.data.parent_id)
        arr.push(node.data.parent_id)
        return  arr.push(node.data.menu_id)
      }
    },
    // 根据ID删除对应的menu
    async removeMenuById (node, data) {
      // 弹框提示 删除
      const confirmResult = await this.$confirm(
              '此操作将永久删除该路由,以及子路由, 是否继续?',
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
        this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.post(
              '/menu/delete',
              {
                menu_id:data.menu_id
              }
      )
      if (res.code !== 200) {
        return this.$message.error('删除路由失败！')
      }
      this.getRightsList()
    },
    // 显示表单
    handleForm (node, data, formName) {
         this.menu_id = []
        if(formName == "add"){
          this.AddRoleDialogVisible = true
        }else {
          this.editeRoleDialogVisible = true
          this.$set(this.editeFormData, "menu_url", data.menu_url)
          this.$set(this.editeFormData, "menu_name", data.menu_name)
          this.$set(this.editeFormData, "isShow", data.isShow)
          this.$set(this.editeFormData, "menu_id", data.menu_id)
        }
      this.getLeafkeys(node, this.menu_id)
    },
  }
}
</script>

<style lang="less" scoped>
  .tagss {
    margin-bottom: 17px;

    cursor:pointer
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
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
