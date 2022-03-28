<template>
  <div class="home">
    <Header />
    <div class="header_list">
      <img src="../assets/avatar.png" alt="" />
      <br /><br />
      <el-row>
        <el-col :span="24">
          <el-select @change="getSelect" style="width: 100%" v-model="value">
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.netName"
              :value="item.netName"
            >
            </el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span="6">
          <el-button
            style="float: right"
            type="text"
            @click="dialogVisible = true"
            >添加网络</el-button
          >
        </el-col> -->
      </el-row>
    </div>
    <br />
    <div class="balance">
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <h4 style="text-align: right">Address：</h4>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple">
            <p style="padding: 0 20px 0 20px; word-wrap: break-word">
              {{ address }}
            </p>
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <h4 style="text-align: right">余额：</h4>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple">
            <p style="padding: 0 20px 0 20px; word-wrap: break-word">
              ￥{{ balanceMoney }}&nbsp;
              <i
                @click="balance"
                style="font-weight: 700; color: #008bd7; cursor: pointer"
                class="el-icon-refresh-left"
              ></i>
              <a
                href="https://xuper.baidu.com/n/console#/finance/wallet/recharge"
                target="_blank"
                style="text-decoration: none; color: #008bd7; float: right"
              >
                去充值
              </a>
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
    <p style="color: red; font-size: 14px" v-if="balanceMoney === 0">
      建议在百度超级链充值0.1元，体验插件功能
    </p>
    <div class="tab">
      <el-row>
        <el-col :span="8">
          <div
            class="grid-content bg-purple"
            style="cursor: pointer"
            @click="getDetails('转移藏品')"
          >
            <p><i class="el-icon-coin"></i></p>
            <p style="font-size: 14px">转移藏品</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div
            class="grid-content bg-purple-light"
            style="cursor: pointer"
            @click="getDetails('查询藏品数量')"
          >
            <p><i class="el-icon-view"></i></p>
            <p style="font-size: 14px">查询藏品数量</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div
            class="grid-content bg-purple"
            style="cursor: pointer"
            @click="getDetails('查询交易')"
          >
            <p><i class="el-icon-soccer"></i></p>
            <p style="font-size: 14px">查询交易</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="90%">
      <el-form
        style="text-align: left"
        label-position="top"
        :rules="rules"
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="网络名称" prop="netName">
          <el-input
            v-model="ruleForm.netName"
            placeholder="请输入网络名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="网络节点" prop="node">
          <el-input
            v-model="ruleForm.node"
            placeholder="请输入网络节点"
          ></el-input>
        </el-form-item>
        <el-form-item label="链名" prop="chain">
          <el-input
            v-model="ruleForm.chain"
            placeholder="请输入链名"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import XuperSDK, { Endorsement } from "@xuperchain/xuper-sdk";
import Header from "../components/Header";
export default {
  name: "Home",
  data() {
    return {
      address: JSON.parse(localStorage.getItem("acc")).address,
      balanceMoney: 0,
      dialogVisible: false,
      ruleForm: {
        netName: "",
        node: "",
        chain: "",
      },
      node: "",
      chain: "",
      value: "开放网络",
      rules: {
        netName: [
          { required: true, message: "网络名称不能为空", trigger: "blur" },
        ],
        node: [
          { required: true, message: "网络节点不能为空", trigger: "blur" },
        ],
        chain: [{ required: true, message: "链名不能为空", trigger: "blur" }],
      },
      options: [
        {
          netName: "开放网络",
          node: "https://xuper.baidu.com/nodeapi",
          chain: "xuper",
        },
      ],
    };
  },
  components: { Header },
  created() {
    if (localStorage.getItem("netList")) {
      var arr = JSON.parse(localStorage.getItem("netList")).netList;
      this.options = this.options.concat(arr);
      this.options.forEach((item) => {
        if (this.value == item.netName) {
          this.node = item.node;
          this.chain = item.chain;
          this.balance();
        }
      });
    } else {
      this.options.forEach((item) => {
        if (this.value == item.netName) {
          this.node = item.node;
          this.chain = item.chain;
          this.balance();
        }
      });
    }
  },
  methods: {
    //判断数据
    getSelect(value) {
      this.options.forEach((item) => {
        if (value == item.netName) {
          this.node = item.node;
          this.chain = item.chain;
          this.balance();
        }
      });
    },
    //添加网络
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var netArr = {
            netList: [],
          };
          if (localStorage.getItem("netList")) {
            netArr.netList = JSON.parse(
              localStorage.getItem("netList")
            ).netList;
            netArr.netList.push(this.ruleForm);
            localStorage.setItem("netList", JSON.stringify(netArr));
          } else {
            netArr.netList.push(this.ruleForm);
            localStorage.setItem("netList", JSON.stringify(netArr));
          }
          this.dialogVisible = false;
          window.location.reload();
        } else {
          return false;
        }
      });
    },

    //查询余额
    getDetails(index) {
      if (this.balanceMoney === 0) {
        this.$message.warning("请您至少充值0.1元即可正常体验插件功能");
      } else {
        this.$router.push({ path: "/Details", query: { index: index } });
      }
    },
    async balance() {
      const node = this.node;
      const chain = this.chain;
      const params = {
        server: "https://xuper.baidu.com/nodeapi", // ip, port
        fee: "400", // fee
        endorseServiceCheckAddr: "jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n", // sign address
        endorseServiceFeeAddr: "aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT", // fee address
      };
      let nodeStatus = null;
      if (node === "https://xuper.baidu.com/nodeapi") {
        nodeStatus = [
          Endorsement({
            transfer: params,
            makeTransaction: params,
          }),
        ];
      } else {
        nodeStatus = null;
      }
      const xsdk = new XuperSDK({
        node,
        chain,
        plugins: nodeStatus,
      });
      const getBalance = async (address) => {
        // eslint-disable-next-line no-useless-catch
        try {
          const result = await xsdk.getBalance(address);
          this.balanceMoney = (result.bcs[0].balance / 100000).toFixed(3);
        } catch (err) {
          throw err;
        }
      };
      getBalance(this.address);
    },
  },
};
</script>
<style scoped>
.home {
  width: 400px;
  margin: auto;
}
.home .help {
  width: 80%;
  margin: auto;
  text-align: right;
  padding-top: 20px;
}
.home .header_list {
  width: 90%;
  height: 100px;
  margin: auto;
  padding-top: 30px;
}
.home .balance {
  width: 90%;
  margin: auto;
  background-color: #f2f2f2;
  border-radius: 20px;
  padding: 15px 10px 15px 10px;
}
.home .balance p {
  text-align: left;
}
.home .tab {
  margin-top: 30px;
  margin-bottom: 30px;
}
.home .tab i {
  color: #008bd7;
  font-size: 24px;
}
</style>
<style>
.el-dialog__header {
  padding: 0;
}
</style>