<template>
    <div>


    <h1>this is home</h1>
    <router-link id="FirstPart" to="/Home">FirstPart </router-link>
    <router-link id="SecondPart" to="/Home/SecondPart">SecondPart </router-link>
        <router-view> </router-view>
        name：<input type="text" v-model="name">
        email：<input type="text" v-model="email" >
        <el-button type="success" @click="sendJsonP()">成功按钮</el-button>
        <li v-for="cate in categoryList" >{{cate.name}}</li>
    </div>

</template>



<script>
    export default {
        name: "Home",
        created(){
            this.getCategory();
            this.storeName =  localStorage.getItem('token')
        },
        data(){
            return{
                categoryList:[],
                name:'',
                email:'',
                storeName:''

            }
        },
        methods:{
            getCategory:function(){
                this.$axios.get(this.GLOBAL.host+"/users").then(res => {
                    var result=res.data;
                    this.categoryList=result.data;
                    console.log(localStorage.getItem('token'))
                });
            },
            sendJsonP() {
                var data = {name:this.name,email:this.email};  //定义一个data储存需要带的参数
                console.log(data)
                this.$axios.post(this.GLOBAL.host+"/users",data
            ).then(res =>{
                    //获取你需要的数据
                    var result=res.data;
                    console.log(result)
                    this.categoryList.push(result);
                    localStorage.setItem("token",result.name)
                    // this.$router.push('/me')	//登录验证成功路由实现跳转
                    console.log(localStorage.getItem('token'))
                });
            }
        },
        mounted() {
            this.$axios({
                method: 'get',
                url: this.GLOBAL.host+'/api/v1/user',
                headers: {
                    'Content-Type': "application/json;charset=UTF-8",
                    //把token放到请求头才能请求，这里的'Bearer '表示是后台希望更加的安全，依据后台给的信息看到底是加还是不加
                    'Authorization': 'Bearer ' + this.token,
                }
            })
                .then(res=>{                    //请求成功后执行函数
                    if(res.data.code === 0){
                        //请求成功之后给用户名赋值
                        this.name=res.data.data.username
                        console.log("登录成功")
                    }else{
                        console.log("登录失败")
                    }
                })
                .catch(err=>{                   //请求错误后执行函
                    console.log("请求错误")
                })
        }
    }
</script>

<style scoped>

</style>