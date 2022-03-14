<template>
  <div class="details">
    <div class="header">
      <div @click="getSetting">
        <i class="el-icon-arrow-left"></i>
      </div>
    </div>
    <div class="write">
      <el-form style='text-align:left' label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="操作" prop="value">
          <el-select style='width:100%' v-model="ruleForm.value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 交易ID判断 -->
        <el-form-item v-if="ruleForm.value == 1" style='display:none'></el-form-item>
        <el-form-item v-else-if="ruleForm.value == 2" style='display:none'></el-form-item>
        <el-form-item v-else-if="ruleForm.value == 3" label="交易ID" prop="txId">
          <el-input v-model="ruleForm.txId" placeholder="请输入交易ID"></el-input>
        </el-form-item>

        <!-- 接受者账户判断 -->
        <el-form-item v-if="ruleForm.value == 1" label="接收者账户" prop="address">
          <el-input v-model="ruleForm.address" placeholder="请输入接收者账户"></el-input>
        </el-form-item>
        <el-form-item v-else-if="ruleForm.value == 2" style='display:none'></el-form-item>
        <el-form-item v-else-if="ruleForm.value == 3" style='display:none'></el-form-item>

        <!-- 资产ID判断 -->
        <el-form-item v-if="ruleForm.value == 1 || ruleForm.value == 2" label="资产ID" prop="token_id">
          <el-input v-model="ruleForm.token_id" placeholder="请输入资产ID"></el-input>
        </el-form-item>
        <el-form-item v-else-if="ruleForm.value == 3" style='display:none'></el-form-item>

        <!-- 数量判断 -->
        <el-form-item v-if="ruleForm.value == 1" label="数量" prop="num">
          <el-input v-model="ruleForm.num" placeholder="请输入数量"></el-input>
        </el-form-item>
        <el-form-item v-else-if="ruleForm.value == 2" style='display:none'></el-form-item>
        <el-form-item v-else-if="ruleForm.value == 3" style='display:none'></el-form-item>

        <!-- 表单提交方法判断 -->
        <el-form-item>
          <div style='text-align:center'>
            <el-button v-if="ruleForm.value == 1" style='width:80%;background-color:#008BD7;border:none' type="primary" round @click="TransferNFTEvm('ruleForm')">执行</el-button>
            <el-button v-else-if="ruleForm.value == 2" style='width:80%;background-color:#008BD7;border:none' type="primary" round @click="findAssets('ruleForm')">执行</el-button>
            <el-button v-else-if="ruleForm.value == 3" style='width:80%;background-color:#008BD7;border:none' type="primary" round @click="findOrder('ruleForm')">执行</el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-dialog
        title="交易ID"
        :visible.sync="dialogVisible" width="80%">
        <el-row :gutter="20">
          <el-col :span="18">
            <div class="grid-content bg-purple" style='text-align:left;word-wrap:break-word;'>
              {{txId}}
            </div>
            </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-button type='primary' size="small" class="tag-read" :data-clipboard-text='txId' @click="copy">复制</el-button>
            </div>
            </el-col>
        </el-row>
      </el-dialog>
      <el-dialog
        :visible.sync="ordersVisible" width="95%">
        <div class="order">
          <h3>交易信息</h3>
          <br>
          <el-row :gutter="10">
            <el-col :span="6"><div class="grid-content bg-purple" style='text-align:right'><b>藏品ID：</b></div></el-col>
            <el-col :span="18"><div class="grid-content bg-purple" style='text-align:left'>{{txDetail.id}}</div></el-col>
          </el-row>
          <el-row :gutter="10" style="margin-top:5px">
            <el-col :span="6"><div class="grid-content bg-purple" style='text-align:right'><b>交易ID：</b></div></el-col>
            <el-col :span="18"><div class="grid-content bg-purple" style='text-align:left'>{{txDetail.txID}}</div></el-col>
          </el-row>
          <el-row :gutter="10" style="margin-top:5px">
            <el-col :span="6"><div class="grid-content bg-purple" style='text-align:right'><b>from(evm)：</b></div></el-col>
            <el-col :span="18"><div class="grid-content bg-purple" style='text-align:left'>{{txDetail.from}}</div></el-col>
          </el-row>
          <el-row :gutter="10" style="margin-top:5px">
            <el-col :span="6"><div class="grid-content bg-purple" style='text-align:right'><b>to(evm)：</b></div></el-col>
            <el-col :span="18"><div class="grid-content bg-purple" style='text-align:left'>{{txDetail.to}}</div></el-col>
          </el-row>
          <el-row :gutter="10" style="margin-top:5px">
            <el-col :span="6"><div class="grid-content bg-purple" style='text-align:right'><b>交易时间：</b></div></el-col>
            <el-col :span="18"><div class="grid-content bg-purple" style='text-align:left'>{{txDetail.timestamp/1000 | formatDate}}</div></el-col>
          </el-row>
          <el-row :gutter="10" style="margin-top:5px">
            <el-col :span="6"><div class="grid-content bg-purple"  style='text-align:right'><b>数量：</b></div></el-col>
            <el-col :span="18"><div class="grid-content bg-purple" style='text-align:left'>{{txDetail.amount}}</div></el-col>
          </el-row>
        </div>
        <br>
        <div class="order">
          <h3>藏品信息</h3>
          <br>
          <el-row :gutter="10" style="margin-top:5px">
            <el-col :span="6"><div class="grid-content bg-purple"  style='text-align:right'><b>藏品名：</b></div></el-col>
            <el-col :span="18"><div class="grid-content bg-purple" style='text-align:left'>{{nftDetail.name}}</div></el-col>
          </el-row>
          <el-row :gutter="10" style="margin-top:5px">
            <el-col :span="6"><div class="grid-content bg-purple"  style='text-align:right'><b>藏品预览：</b></div></el-col>
            <el-col :span="18">
              <div class="grid-content bg-purple" style='text-align:left'>
                <el-image style='width:30px;height:30px' :src='nftDetail.link' :preview-src-list="srcList"></el-image>
              </div>
              </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-top:5px">
            <el-col :span="6"><div class="grid-content bg-purple"  style='text-align:right'><b>藏品哈希：</b></div></el-col>
            <el-col :span="18"><div class="grid-content bg-purple" style='text-align:left'>{{nftDetail.hash}}</div></el-col>
          </el-row>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import XuperSDK,{ Endorsement } from '@xuperchain/xuper-sdk';
import { XchainAddrToEvm,EvmToXchainAddr } from '../assets/js/index'
import Clipboard from 'clipboard'
export default {
  name: 'Details',
  data() {
    return {
      txId:'',
      txDetail:'',
      nftDetail:'',
      srcList:[],
      dialogVisible: false,
      ordersVisible:false,
      ruleForm:{
        token_id:'',
        address:'',
        num:'',
        txId:'',
        value:this.$route.query.index,
      },
      rules: {
        value: [
          { required: true, message: '操作不能为空', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '接收者账户不能为空', trigger: 'blur' },
        ],
        token_id: [
          { required: true, message: '资产ID不能为空', trigger: 'blur' },
        ],
        num: [
          { required: true, message: '数量不能为空', trigger: 'blur' },
        ],
        txId: [
          { required: true, message: '交易ID不能为空', trigger: 'blur' },
        ],
      },
      options: [
        {
        value: '1',
        label: '转移资产'
        }, 
        {
          value: '2',
          label: '查询NFT余额'
        }, 
        {
          value: '3',
          label: '查询交易'
        }
      ],
    }
  },
  filters: {
    formatDate: function (value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();
      s = s < 10 ? ('0' + s) : s;
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
    }
  },
  components: {
    
  },
  methods:{
    getSetting(){
      this.$router.push('/Home')
    },
    // 转移NFT
    TransferNFTEvm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const node = 'https://xuper.baidu.com/nodeapi';
          const chain = 'xuper';
          const params = {
            server: "https://xuper.baidu.com/nodeapi", // ip, port
            fee: "400", // fee
            endorseServiceCheckAddr: "jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n", // sign address
            endorseServiceFeeAddr: "aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT", // fee address
          }
          const xsdk = new XuperSDK({
            node,
            chain,
            plugins: [
                Endorsement({
                    transfer: params,
                    makeTransaction: params
                })
          ]
        });
        const moveAssets = async (toAddr,TokenID,Amount) => {
          try {
            const contractName = 'opennft';
            const methodName = 'safeTransferFrom';
            const from = XchainAddrToEvm(JSON.parse(localStorage.getItem("acc")).address);
            const acc = JSON.parse(localStorage.getItem("acc"))
            const demo = await xsdk.invokeSolidityContarct(
                contractName, 
                methodName, 
                'evm', 
                {
                    "from": from,
                    "to": toAddr,
                    "id": TokenID,
                    "amount": Amount,
                    data: ''
                },
                '0', 
                acc);
            // 352cd3f829dded7ad1da7ab3a0c3a8776cd3ec545c617ad499abb2d29459c6ee  // 交易ID 返回给用户
            if(xsdk.transactionIdToHex(demo.transaction.txid)){
              this.txId = xsdk.transactionIdToHex(demo.transaction.txid)
              this.dialogVisible = true
            }
            const result = xsdk.postTransaction(demo.transaction, acc);
            console.log(result)
          } catch (err) {
            // err 是空 证明转移成功，不是 就是执行失败。
            if(err){
              this.$message.error('转移失败')
            }else{
              this.$message.success('转移成功')
            }
          }
        }
        moveAssets(XchainAddrToEvm(this.ruleForm.address),this.ruleForm.token_id,this.ruleForm.num)
        } else {
          return false;
        }
      });
    },
    //查询NFT余额
    findAssets(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const node = 'https://xuper.baidu.com/nodeapi';
          const chain = 'xuper';
          const params = {
            server: "https://xuper.baidu.com/nodeapi", // ip, port
            fee: "400", // fee
            endorseServiceCheckAddr: "jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n", // sign address
            endorseServiceFeeAddr: "aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT", // fee address
          }
          const xsdk = new XuperSDK({
            node,
            chain,
            plugins: [
                Endorsement({
                    transfer: params,
                    makeTransaction: params
                })
          ]
        });
        const acc = JSON.parse(localStorage.getItem("acc"))
        const queryNFTBalance = async (tokenID) => {
          try {
              const contractName = 'opennft';
              const methodName = 'balanceOf';
              const args = {
                  account: XchainAddrToEvm(acc.address),
                  id: tokenID
              };
              const demo = await xsdk.invokeSolidityContarct(contractName, methodName, 'evm', args,'0', acc);
              // 判断  demo.preExecutionTransaction.response.responses的长度是否大于0， 大于0 取demo.preExecutionTransaction.response.responses[length - 1]
              const len =  demo.preExecutionTransaction.response.responses.length
              if (len > 0) {
                  const str = demo.preExecutionTransaction.response.responses[len -1].body
                  const result = Buffer.from(str, 'base64').toString('ascii')
                  // [{\"0\":\"10\"}]  result 即为 [{\"0\":\"10\"}]  10即为想要的结果，即对应nft 的余额
                  this.$notify({
                    title: '查询成功',
                    dangerouslyUseHTMLString: true,
                    message: `当前您的资产数量为<b style='padding-left:5px'>${JSON.parse(result)[0]['0']}</b>`,
                    type: 'success',
                    duration: 0
                  });
              }
          } catch (err) {
              console.log(err)
          }
          }
          queryNFTBalance(this.ruleForm.token_id)
        } else {
          return false;
        }
      });
    },
    //查询交易
    findOrder(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const node = 'https://xuper.baidu.com/nodeapi';
          const chain = 'xuper';
          const params = {
            server: "https://xuper.baidu.com/nodeapi", // ip, port
            fee: "400", // fee
            endorseServiceCheckAddr: "jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n", // sign address
            endorseServiceFeeAddr: "aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT", // fee address
          }
          const xsdk = new XuperSDK({
            node,
            chain,
            plugins: [
                Endorsement({
                    transfer: params,
                    makeTransaction: params
                })
          ]
        });
        const acc = JSON.parse(localStorage.getItem("acc"))
        const GetTxDetail = async (txId) => {
          try {
              const demo = await xsdk.queryTransaction(Buffer.from(txId, 'hex').toString('base64'))
              if (demo.tx == undefined) {
                  // 证明此交易链上没有 直接报错
                  throw new Error('this tx undefined')
              }
              // 交易ID
              var txID = Buffer.from(demo.tx.txid, "base64").toString('hex');
              var txReqJson = JSON.parse(Buffer.from(demo.tx.contract_requests[1].args.input, 'base64').toString());
              
              var from = ''
              var to = ''
              var tokenID = ''
              var amount = ''
              if (demo.tx.contract_requests[1].method_name == 'safeTransferFrom') {
                  from = EvmToXchainAddr(txReqJson.from)
                  to = EvmToXchainAddr(txReqJson.to)
                  tokenID = txReqJson.id
                  amount = txReqJson.amount
              } else {
                  from = demo.tx.initiator
                  tokenID = txReqJson._id
                  amount = txReqJson._initialSupply
              }

              // 根据 tokenID 查询token id的图片路径 供浏览器跳转
              const contractName = 'opennft';
              const methodName = 'getTokenBytes';
              const args = {
                  //上线替换为上方tokenID
                  '_id': tokenID
              };
              const res = await xsdk.invokeSolidityContarct(contractName, methodName, 'evm', args,'0', acc);
              const len =  res.preExecutionTransaction.response.responses.length
              if (len > 0) {
                  var result = res.preExecutionTransaction.response.responses[len - 1].body
                  var response = JSON.parse(Buffer.from(result,"base64").toString())
                  var base64Addr = response[0]._response
                  var data = Buffer.from(base64Addr, "base64").toString()
                  var dataJson = JSON.parse(data)
              }
              var timestamp = parseInt(demo.tx.timestamp/1000)
              // 用户查看交易详情，前端显示下述txDetail信息。
              var txDetail = {
                  "txID": txID,
                  "from": from,
                  "to": to,
                  "id": tokenID,
                  "amount": amount,
                  "timestamp": timestamp
              }
              var nftDetail = {
                  "link" : dataJson.link,
                  "name":dataJson.name,
                  "hash":dataJson.hash,
              }
              // 前端展示数据
              if(txDetail && nftDetail){
                this.txDetail = txDetail
                this.srcList = []
                this.nftDetail = nftDetail
                this.srcList.push(nftDetail.link)
                this.ordersVisible = true
              }
              return txDetail, nftDetail;
            } catch (err) {
                console.log(err)
            }
          }
          GetTxDetail(this.ruleForm.txId)
        } else {
          return false;
        }
      });
    },
    copy () {
      var clipboard = new Clipboard('.tag-read')
      clipboard.on('success', e => {
        this.$message.success("复制成功！")
        console.log(e)
          //  释放内存
        clipboard.destroy()
      })
        clipboard.on('error', e =>{
          this.$message.success("当前浏览器不支持复制！")
          console.log(e)
        // 不支持复制
        // 释放内存
        clipboard.destroy()
      })
    }
  }
}
</script>
<style scoped>
.details{
  width: 400px;
  min-height: 500px;
  margin: auto;
}
.details .header{
  width: 100%;
  margin-top: 10px;
  margin-left: 10px;
}
.details .header>div{
  width: 35px;
  height: 35px;
  line-height: 35px;
  border-radius: 50%;
  cursor: pointer;
  background-color: rgb(245,245,245);
}
.details .write{
  width: 90%;
  margin: auto;
  margin-top: 30px;
}

</style>
<style>
  .details .write .el-form--label-top .el-form-item__label{
    padding: 0;
  }
  .el-dialog__header{
    padding: 0;
  }
  .el-dialog{
    margin: 0 auto 0;
    margin-top: 10vh !important;
  }
</style>
