<template>
  <div>
    <el-row>
      <div class="card">
        <el-col :xs="24" :lg="16" :md="16">
          <div class="car-left">
            <el-row>
              <div>
                <el-col :xs="1" :md="1" :lg="1">
                </el-col>
                <el-col :xs="20" :lg="12" :md="12">
                  <div class="text" style="padding-left: 10px;">
                    <h4>{{state}} 管理员, 辛苦啦!</h4>
                    <p class="tips-text">
                      <img :src="messages.icon" />
                      <span>今日 {{messages.weather}}，低温 {{messages.min}}～～高温 {{messages.max}}</span>
                    </p>
                  </div>
                </el-col>
              </div>
            </el-row>
          </div>
        </el-col>
        <el-col :span="24" class="toolbar">
          <el-form :inline="true">
            <el-form-item>
              <el-input placeholder="请输入城市名称" v-model="input2"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="greet">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="24" v-if="show">
          <el-button type="primary">{{city}}</el-button>
          <el-button type="primary">{{country}}</el-button>

        </el-col>
        <el-col :span="24" v-if="show">
          <el-table
                  :data="gridData"
                  stripe
                  fit
                  style="width: 80% ;text-align: center;">
            <el-table-column
                    align="center"
                    prop="dt"
                    label="日期">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="weather.main"
                    label="天气">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="temp.day"
                    label="日间温度">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="temp.night"
                    label="夜间温度">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="pressure"
                    label="气压值">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="weather.icon"
                    label="天气情况">
              <template slot-scope="scope">
                <img :src="scope.row.weather.icon" />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </div>
    </el-row>

  </div>
</template>

<script>
export default {
data(){
return{
  state:'',
  msg: '天气',
  input2:'上海',
  show:false,
  gridData:[],
  city:null,
  country:null,
  result:{},
  messages:{}
}

},
  created(){
    this.getTimeState()
    this.greet()
  },
  methods:{
    getTimeState()
    {
      // 获取当前时间
      let timeNow = new Date();
      // 获取当前小时
      let hours = timeNow.getHours();
      // 设置默认文字
      // 判断当前时间段
      if (hours >= 0 && hours <= 10) {
        this.state = "早上好!";
      } else if (hours > 10 && hours <= 14) {
        this.state = "中午好!";
      } else if (hours > 14 && hours <= 18) {
        this.state = "下午好!";
      } else if (hours > 18 && hours <= 24) {
        this.state = "晚上好!";
      }
    },
    async greet() {
      const { data: res } = await this.$http.post('server/weather',{
            city:this.input2
      })
      console.log(res)
                if (res.code !== 200) {
                  this.$message.error(res.msg)
                  return
                }
                if(res.data.list === null){
                  this.$message.error("没查到天气信息,请试试拼音？")
                  return
                }
                this.result = res
                this.city= this.result.data.city.name;
                this.country= this.result.data.city.country;
                this.gridData= this.result.data.list;
                this.messages.weather = this.gridData[0].weather[0].main
                this.messages.icon =  'http://openweathermap.org/img/w/' + this.gridData[0].weather[0].icon + '.png';
                this.messages.min =  this.gridData[0].temp.min;
                this.messages.max =  this.gridData[0].temp.max;
                for(let i=0;i<this.gridData.length;i++){
                  //  this.gridData[i].img= '<img src="http://openweathermap.org/img/w/'+this.gridData[i].weather[0].icon+'.png">'
                  this.gridData[i].weather.main=this.gridData[i].weather[0].main
                  this.gridData[i].weather.icon= 'http://openweathermap.org/img/w/' + this.gridData[i].weather[0].icon + '.png';
                  var date = new Date(this.gridData[i].dt*1000);
                  this.gridData[i].dt = `${date.getFullYear()}-${date.getMonth() +1}-${date.getDate()}`
                }

                this.show = true

    }
    }

}
</script>
<style lang="less" scoped>
  .big {
    margin: 100px 0 0 0;
    padding-top: 0;
    background-color: rgb(243, 243, 243);
    .top {
      width: 100%;
      height: 360px;
      overflow: hidden;
      .chart-container {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 20px;
        background-color: #fff;
      }
    }
    .mid {
      width: 100%;
      height: 380px;
      .chart-wrapper {
        height: 340px;
        background: #fff;
        padding: 16px 16px 0;
        margin-bottom: 32px;
      }
    }
    .bottom {
      width: 100%;
      height: 300px;
      // margin: 20px 0;
      .el-row {
        margin-right: 4px !important;
      }
      .chart-player {
        width: 100%;
        height: 270px;
        padding: 10px;
        background-color: #fff;
      }
    }
  }
  .bounce-enter-active {
    animation:bounce-in .5s;
  }
  .bounce-leave-active{
    animation:bounce-out .5s;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes bounce-out {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.95);
    }
    100% {
      transform: scale(0);
    }
  }
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .el-table{
    margin:5% 10%;
  }
  .el-row {
    margin-bottom: 20px;

  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>

