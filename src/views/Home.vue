<template>
  <div class="home">
    <div class="header">
      <img src="../assets/avatar.png" alt="">
      <h3>开放网络</h3>
    </div>
    <div class="balance">
      <el-row>
        <el-col :span='6'>
          <div class="grid-content bg-purple">
            <h4 style='text-align:right;'>Address：</h4>
          </div>
        </el-col>
        <el-col :span='18'>
          <div class="grid-content bg-purple">
            <p style='padding:0 20px 0 20px;word-wrap:break-word;'>{{address}}</p>
          </div>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :span='6'>
          <div class="grid-content bg-purple">
            <h4 style='text-align:right;'>余额：</h4>
          </div>
        </el-col>
        <el-col :span='18'>
          <div class="grid-content bg-purple">
            <p style='padding:0 20px 0 20px;word-wrap:break-word;'>￥{{balanceMoney}}&nbsp;
              <i @click="balance" style='font-weight:700;color:#008BD7;cursor: pointer;' class="el-icon-refresh-left" ></i>
              <a 
                href="https://xuper.baidu.com/n/console#/finance/wallet/recharge"
                target="_blank"
                style='text-decoration: none;color:#008BD7;float:right'
              >
                去充值
              </a>
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
    <p style='color:red;font-size:14px' v-if="balanceMoney===0">建议在百度超级链充值0.1元，体验插件功能</p>
    <div class="tab">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple" style='cursor:pointer' @click="getDetails(1)">
            <p><i class="el-icon-coin"></i></p>
            <p style='font-size:14px'>转移资产</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light" style='cursor:pointer' @click="getDetails(2)">
            <p><i class="el-icon-view"></i></p>
            <p style='font-size:14px'>查询NFT余额</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple" style='cursor:pointer' @click="getDetails(3)">
            <p><i class="el-icon-soccer"></i></p>
            <p style='font-size:14px'>查询交易</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import XuperSDK,{ Endorsement } from '@xuperchain/xuper-sdk';
export default {
  name:'Home',
  data() {
    return {
      address:JSON.parse(localStorage.getItem("acc")).address,
      balanceMoney:0,
    }
  },
  components: {
    
  },
  created(){
    this.balance()
  },
   methods:{
    getDetails(index){
      if(this.balanceMoney === 0 ){
        this.$message.warning('请您至少充值0.1元即可正常体验插件功能')
      }else{
        this.$router.push({path:'/Details',query:{index:index}})
      }
    },
    async balance(){
      const node = 'https://xuper.baidu.com/nodeapi';
      const chain = 'xuper';
      const params = {
      server: "https://xuper.baidu.com/nodeapi", // ip, port
      fee: "400", // fee
      endorseServiceCheckAddr: "jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n", // sign address
      endorseServiceFeeAddr: "aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT" // fee address
      }
      var xsdk = XuperSDK.getInstance({
          node,
          chain,
          env:{
            node:{
                disableGRPC: true
            }
          },
          plugins: [
              Endorsement({
                  transfer: params,
                  makeTransaction: params
              })
          ],         
      });
      const getBalance = async(address) => {
        // eslint-disable-next-line no-useless-catch
        try {
          const result = await xsdk.getBalance(address)
          this.balanceMoney = (result.bcs[0].balance / 100000).toFixed(3)
        } catch (err) {
          throw err
        }
      }
      getBalance(this.address)
    },
  }
}
</script>
<style scoped>
.home{
  width: 300px;
  margin: auto;
}
.home .header{
  width: 80%;
  height: 100px;
  margin: auto;
  padding-top: 50px;
}
.home .header h3{
  color: #008BD7;
}
.home .balance{
  width:90%;
  margin: auto;
  background-color: #F2F2F2;
  border-radius: 20px;
  padding:15px 10px 15px 10px;
}
.home .balance p{
  text-align: left;
}
.home .tab{
  margin-top: 30px;
  margin-bottom: 30px;
}
.home .tab i{
  color: #008BD7;
  font-size: 24px;
}
</style>