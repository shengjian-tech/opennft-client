<template>
  <div class="login">
    <Header />
    <div class="header_list"><img src="../assets/logo.png" alt="" /></div>
    <div class="write" v-if="other_state">
      <el-col :span="24">
        <el-input placeholder="助忆词" v-model="password" show-password>
          <i slot="prefix" class="el-input__icon el-icon-lollipop"></i>
        </el-input>
      </el-col>
    </div>
    <div class="write" v-else>
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-input placeholder="本地私钥路径" v-model="private_key">
              <i slot="prefix" class="el-input__icon el-icon-folder"></i>
            </el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-button
              style="background-color: #008bd7; border: none"
              type="primary"
              @click="clickLoad"
              >选择私钥文件</el-button
            >
            <input
              type="file"
              id="files"
              ref="refFile"
              style="display: none"
              @change="fileLoad"
            />
          </div>
        </el-col>
      </el-row>
      <p
        style="
          color: gray;
          font-size: 14px;
          text-align: left;
          margin-bottom: 5px;
        "
      >
        <i class="el-icon-warning-outline"></i
        >私钥只留存本地，不会上传到任何服务器
      </p>
      <br /><br />
      <el-input
        placeholder="安全码（可选，开放网络必填）"
        v-model="password"
        show-password
      >
        <i slot="prefix" class="el-input__icon el-icon-lollipop"></i>
      </el-input>
    </div>

    <div class="submit">
      <el-button
        @click="getLogin"
        style="width: 80%; background-color: #008bd7; border: none"
        type="primary"
        round
        >登录</el-button
      >
      <a class="other_login" @click="otherLogin()" v-if="other_state"
        >使用私钥登录</a
      >
      <a class="other_login" @click="otherLogin()" v-else>使用助忆词登录</a>
    </div>
  </div>
</template>

<script>
import XuperSDK, { Endorsement } from "@xuperchain/xuper-sdk";
import Header from "../components/Header";
export default {
  name: "Login",
  data() {
    return {
      private_key: "",
      password: "",
      key: "",
      other_state: false,
    };
  },
  components: { Header },
  created() {
    if (localStorage.getItem("acc")) {
      this.$router.push("/Home");
    }
  },
  methods: {
    getLogin() {
      if (this.private_key == "" && this.other_state !== true) {
        this.$message("请选择您的本地key文件以获取私钥路径");
      } else if (this.password == "") {
        this.other_state == true
          ? this.$message("请填写您的助记词")
          : this.$message("请填写您的安全码");
      } else {
        const node = "https://xuper.baidu.com/nodeapi";
        const chain = "xuper";
        const params = {
          server: "https://xuper.baidu.com/nodeapi", // ip, port
          fee: "400", // fee
          endorseServiceCheckAddr: "jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n", // sign address
          endorseServiceFeeAddr: "aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT", // fee address
        };
        const xsdk = new XuperSDK({
          node,
          chain,
          plugins: [
            Endorsement({
              transfer: params,
              makeTransaction: params,
            }),
          ],
        });
        let acc = null;
        if (this.other_state == true) {
          acc = xsdk.retrieve(this.password, "SimplifiedChinese");
        } else {
          acc = xsdk.import(this.password, this.key);
        }
        if (acc) {
          localStorage.setItem("acc", JSON.stringify(acc));
          if (this.$route.query.index) {
            this.$router.push(
              `/Details?${window.location.hash.substring(
                window.location.hash.indexOf("?") + 1
              )}`
            );
          } else {
            this.$router.push("/Home");
          }
        } else {
          this.$$message.warning("请检查私钥和安全码");
        }
      }
    },
    clickLoad() {
      this.$refs.refFile.dispatchEvent(new MouseEvent("click"));
    },
    fileLoad() {
      const that = this;
      //获取读取的文件File对象
      const selectedFile = this.$refs.refFile.files[0];
      that.private_key = selectedFile.name;
      var reader = new FileReader();
      reader.readAsText(selectedFile);
      reader.onload = function () {
        that.key = this.result;
      };
    },
    otherLogin() {
      this.other_state == true
        ? (this.other_state = false)
        : (this.other_state = true);
    },
  },
};
</script>
<style scoped>
.login {
  width: 400px;
  margin: auto;
}
.login .help {
  width: 80%;
  margin: auto;
  text-align: right;
  padding-top: 20px;
}
.login .header_list {
  color: brown;
  text-align: center;
  height: 80px;
  padding-top: 40px;
}
.login .write {
  width: 90%;
  overflow: hidden;
  margin: auto;
}
.login .submit {
  width: 100%;
  margin: auto;
  margin-top: 30px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.other_login {
  color: #409eff;
  font-size: 12px;
  margin-top: 10px;
  cursor: pointer;
}
</style>
