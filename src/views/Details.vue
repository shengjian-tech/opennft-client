<template>
  <div class="details" v-loading.fullscreen.lock="fullscreenLoading">
    <Header />
    <div class="write">
      <el-select @change="getSelect" style="width: 100%" v-model="value">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <br /><br />
      <el-form
        style="text-align: left"
        label-position="top"
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          v-for="(item, index) in formData"
          :label="item.label"
          :key="index"
        >
          <el-input
            v-model="ruleForm[item.value]"
            :placeholder="'请输入' + item.label"
          ></el-input>
        </el-form-item>
        <!-- 表单提交方法判断 -->
        <el-form-item>
          <div style="text-align: center">
            <el-button
              v-if="value == '转移藏品'"
              :disabled="show_btn_state"
              style="width: 80%; border: none"
              type="primary"
              :class="show_btn_state ? 'show_btn_stateClass' : ''"
              round
              @click="TransferNFTEvm('ruleForm')"
              >{{
                show_btn_state ? "转移成功!请勿重复转移" : "执行"
              }}</el-button
            >
            <el-button
              v-else-if="value == '查询藏品数量'"
              style="width: 80%; background-color: #008bd7; border: none"
              type="primary"
              round
              @click="findAssets('ruleForm')"
              >执行</el-button
            >
            <el-button
              v-else-if="value == '查询交易'"
              style="width: 80%; background-color: #008bd7; border: none"
              type="primary"
              round
              @click="findOrder('ruleForm')"
              >执行</el-button
            >
            <el-button
              v-else
              style="width: 80%; background-color: #008bd7; border: none"
              type="primary"
              round
              @click="publicMethod('ruleForm')"
              >执行</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <el-dialog
        title="转移成功!"
        :visible.sync="dialogVisible"
        width="80%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-row :gutter="20">
          <el-col :span="18">
            <div>建议截图保存交易哈希:</div>
            <div
              class="grid-content bg-purple"
              style="text-align: left; word-wrap: break-word"
            >
              {{ txId }}
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-button
                type="primary"
                size="small"
                class="tag-read"
                :data-clipboard-text="txId"
                @click="copy"
                >复制</el-button
              >
            </div>
          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog
        :visible.sync="ordersVisible"
        width="95%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div class="order">
          <h3>交易信息</h3>
          <br />
          <el-row :gutter="10">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>藏品ID：</b>
              </div></el-col
            >
            <el-col :span="18"
              ><div class="grid-content bg-purple" style="text-align: left">
                {{ txDetail.id }}
              </div></el-col
            >
          </el-row>
          <el-row :gutter="10" style="margin-top: 5px">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>交易哈希：</b>
              </div></el-col
            >
            <el-col :span="18"
              ><div class="grid-content bg-purple" style="text-align: left">
                {{ txDetail.txID }}
              </div></el-col
            >
          </el-row>
          <el-row :gutter="10" style="margin-top: 5px">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>from：</b>
              </div></el-col
            >
            <el-col :span="18"
              ><div class="grid-content bg-purple" style="text-align: left">
                {{ txDetail.from }}
              </div></el-col
            >
          </el-row>
          <el-row :gutter="10" style="margin-top: 5px">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>to：</b>
              </div></el-col
            >
            <el-col :span="18"
              ><div class="grid-content bg-purple" style="text-align: left">
                {{ txDetail.to }}
              </div></el-col
            >
          </el-row>
          <el-row :gutter="10" style="margin-top: 5px">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>交易时间：</b>
              </div></el-col
            >
            <el-col :span="18"
              ><div class="grid-content bg-purple" style="text-align: left">
                {{ txDetail.timestamp }}
              </div></el-col
            >
          </el-row>
          <el-row :gutter="10" style="margin-top: 5px">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>数量：</b>
              </div></el-col
            >
            <el-col :span="18"
              ><div class="grid-content bg-purple" style="text-align: left">
                {{ txDetail.amount }}
              </div></el-col
            >
          </el-row>
        </div>
        <br />
        <div class="order">
          <h3>藏品信息</h3>
          <br />
          <el-row :gutter="10" style="margin-top: 5px">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>藏品名：</b>
              </div></el-col
            >
            <el-col :span="18"
              ><div class="grid-content bg-purple" style="text-align: left">
                {{ nftDetail.name }}
              </div></el-col
            >
          </el-row>
          <el-row :gutter="10" style="margin-top: 5px">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>藏品预览：</b>
              </div></el-col
            >
            <el-col :span="18">
              <div class="grid-content bg-purple" style="text-align: left">
                <el-image
                  style="width: 30px; height: 30px"
                  :src="nftDetail.link"
                  :preview-src-list="srcList"
                ></el-image>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-top: 5px">
            <el-col :span="6"
              ><div class="grid-content bg-purple" style="text-align: right">
                <b>藏品哈希：</b>
              </div></el-col
            >
            <el-col :span="18"
              ><div class="grid-content bg-purple" style="text-align: left">
                {{ nftDetail.hash }}
              </div></el-col
            >
          </el-row>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import XuperSDK, { Endorsement } from "@xuperchain/xuper-sdk";
import { XchainAddrToEvm, EvmToXchainAddr } from "../assets/js/index";
import Clipboard from "clipboard";
import Header from "../components/Header";
import dayjs from "dayjs";
export default {
  name: "Details",
  data() {
    return {
      fullscreenLoading: false,
      txId: "",
      txDetail: "",
      nftDetail: "",
      srcList: [],
      dialogVisible: false,
      visible: false,
      ordersVisible: false,
      contractName: "",
      methodName: "",
      type: "",
      formData: [],
      addForm: {
        name: "",
        contractName: "",
        methodName: "",
        formValue: [],
      },
      ruleForm: { num: "1" },
      value: this.$route.query.index,
      options: [
        {
          value: "转移藏品",
          label: "转移藏品",
        },
        {
          value: "查询藏品数量",
          label: "查询藏品数量",
        },
        {
          value: "查询交易",
          label: "查询交易",
        },
      ],
      params: [
        {
          name: "转移藏品",
          contractName: "opennft",
          type: "transaction",
          methodName: "safeTransferFrom",
          formValue: [
            { value: "address", label: "接收方address" },
            { value: "address_on", label: "确认接收方address" },
            { value: "token_id", label: "藏品ID" },
            { value: "num", label: "数量" },
          ],
        },
        {
          name: "查询藏品数量",
          contractName: "opennft",
          type: "query",
          methodName: "balanceOf",
          formValue: [
            { value: "token_address", label: "查询address" },
            { value: "token_id", label: "藏品ID" },
          ],
        },
        {
          name: "查询交易",
          contractName: "opennft",
          type: "query",
          methodName: "getTokenBytes",
          formValue: [{ value: "txId", label: "交易哈希" }],
        },
      ],
      show_btn_state: false,
    };
  },
  components: { Header },
  mounted() {
    if (localStorage.getItem("acc") == null) {
      this.$router.replace(
        `/Login?${window.location.hash.substring(
          window.location.hash.indexOf("?") + 1
        )}`
      );
    }
    if (localStorage.getItem("acc")) {
      this.ruleForm = {
        token_address: JSON.parse(localStorage.getItem("acc")).address,
        num: "1",
      };
    }
    if (this.$route.query.token_id) {
      this.ruleForm = {
        token_address: JSON.parse(localStorage.getItem("acc")).address,
        token_id: this.$route.query.token_id,
        num: "1",
      };
    }
    if (this.$route.query.tx_id) {
      this.ruleForm = {
        txId: this.$route.query.tx_id,
      };
    }
  },
  created() {
    if (localStorage.getItem("addForm")) {
      var arr = JSON.parse(localStorage.getItem("addForm")).addList;
      this.params = this.params.concat(arr);
      arr.forEach((element) => {
        this.options.push({ label: element.name, value: element.name });
      });
      this.params.forEach((item) => {
        if (this.value == item.name) {
          this.formData = item.formValue;
          this.contractName = item.contractName;
          this.methodName = item.methodName;
          this.type = item.type;
        }
      });
    } else {
      this.params.forEach((item) => {
        if (this.value == item.name) {
          this.formData = item.formValue;
          this.contractName = item.contractName;
          this.methodName = item.methodName;
          this.type = item.type;
        }
      });
    }
  },
  methods: {
    //删除新增参数
    removeDomain(item) {
      var index = this.addForm.formValue.indexOf(item);
      if (index !== -1) {
        this.addForm.formValue.splice(index, 1);
      }
    },
    //判断数据
    getSelect(value) {
      this.params.forEach((item) => {
        if (value == item.name) {
          this.formData = item.formValue;
          this.contractName = item.contractName;
          this.methodName = item.methodName;
        }
      });
    },
    // 转移NFT
    TransferNFTEvm(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.ruleForm.address !== this.ruleForm.address_on) {
          this.$notify({
            title: "转移失败",
            dangerouslyUseHTMLString: true,
            message: `请再次核对接收方address!`,
            type: "error",
            duration: 0,
          });
          return false;
        }
        this.fullscreenLoading = true;
        if (valid) {
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
          const moveAssets = async (toAddr, TokenID, Amount) => {
            try {
              const contractName = this.contractName;
              const methodName = this.methodName;
              const from = XchainAddrToEvm(
                JSON.parse(localStorage.getItem("acc")).address
              );
              const acc = JSON.parse(localStorage.getItem("acc"));
              const demo = await xsdk.invokeSolidityContarct(
                contractName,
                methodName,
                "evm",
                {
                  from: from,
                  to: toAddr,
                  id: TokenID,
                  amount: Amount,
                  data: "",
                },
                "0",
                acc
              );
              // 352cd3f829dded7ad1da7ab3a0c3a8776cd3ec545c617ad499abb2d29459c6ee  // 交易ID 返回给用户
              if (xsdk.transactionIdToHex(demo.transaction.txid)) {
                this.txId = xsdk.transactionIdToHex(demo.transaction.txid);
                this.dialogVisible = true;
                this.show_btn_state = true;
                this.$axios({
                  method: "get",
                  url: `https://makerone.shengjian.net/nft/api/nft/userassets/synchronizedTransaction?txId=${xsdk.transactionIdToHex(
                    demo.transaction.txid
                  )}`,
                }).then((response) => {
                  console.log(response); //请求成功返回的数据
                });
                this.fullscreenLoading = false;
              }
              const result = xsdk.postTransaction(demo.transaction, acc);
            } catch (err) {
              // err 是空 证明转移成功，不是 就是执行失败。
              if (err) {
                this.errorMessage(err);
              } else {
                this.fullscreenLoading = false;
                this.$message.success("转移成功");
              }
            }
          };
          moveAssets(
            XchainAddrToEvm(this.ruleForm.address),
            this.ruleForm.token_id,
            this.ruleForm.num
          );
        } else {
          return false;
        }
      });
    },
    //查询藏品数量
    findAssets(formName) {
      this.fullscreenLoading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
          const acc = JSON.parse(localStorage.getItem("acc"));
          const queryNFTBalance = async (tokenID) => {
            try {
              const contractName = this.contractName;
              const methodName = this.methodName;
              const args = {
                account: XchainAddrToEvm(this.ruleForm.token_address),
                id: tokenID,
              };
              const demo = await xsdk.invokeSolidityContarct(
                contractName,
                methodName,
                "evm",
                args,
                "0",
                acc
              );
              // 判断  demo.preExecutionTransaction.response.responses的长度是否大于0， 大于0 取demo.preExecutionTransaction.response.responses[length - 1]
              const len =
                demo.preExecutionTransaction.response.responses.length;
              if (len > 0) {
                const str =
                  demo.preExecutionTransaction.response.responses[len - 1].body;
                const result = Buffer.from(str, "base64").toString("ascii");
                const tokenExpireTime = await this.inquireExpireTime(
                  contractName,
                  this.ruleForm.token_id
                );
                // [{\"0\":\"10\"}]  result 即为 [{\"0\":\"10\"}]  10即为想要的结果，即对应nft 的余额
                this.fullscreenLoading = false; //关闭loading
                this.$notify({
                  title: "查询成功",
                  dangerouslyUseHTMLString: true,
                  message: `当前藏品数量为<b style='padding-left:5px'>${
                    JSON.parse(result)[0]["0"]
                  }</b> ${
                    JSON.parse(result)[0]["0"] == 0 ||
                    this.ruleForm.token_address !== acc.address
                      ? ""
                      : `<br/> 冷却期剩余<b style='padding-left:5px'>${tokenExpireTime}</b>`
                  }`,
                  type: "success",
                  duration: 0,
                });
              }
            } catch (err) {
              this.errorMessage(err);
            }
          };
          queryNFTBalance(this.ruleForm.token_id);
        } else {
          return false;
        }
      });
    },
    //查询交易
    findOrder(formName) {
      this.fullscreenLoading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
          const acc = JSON.parse(localStorage.getItem("acc"));
          const GetTxDetail = async (txId) => {
            try {
              const demo = await xsdk.queryTransaction(
                Buffer.from(txId, "hex").toString("base64")
              );
              if (demo.tx == undefined) {
                // 证明此交易链上没有 直接报错
                throw new Error("this tx undefined");
              }
              // 交易ID
              var txID = Buffer.from(demo.tx.txid, "base64").toString("hex");
              var txReqJson = JSON.parse(
                Buffer.from(
                  demo.tx.contract_requests[1].args.input,
                  "base64"
                ).toString()
              );

              var from = "";
              var to = "";
              var tokenID = "";
              var amount = "";
              if (
                demo.tx.contract_requests[1].method_name == "safeTransferFrom"
              ) {
                from = EvmToXchainAddr(txReqJson.from);
                to = EvmToXchainAddr(txReqJson.to);
                tokenID = txReqJson.id;
                amount = txReqJson.amount;
              } else {
                from = demo.tx.initiator;
                tokenID = txReqJson._id;
                amount = txReqJson._initialSupply;
              }

              // 根据 tokenID 查询token id的图片路径 供浏览器跳转
              const contractName = this.contractName;
              const methodName = this.methodName;
              const args = {
                //上线替换为上方tokenID
                _id: tokenID,
              };
              const res = await xsdk.invokeSolidityContarct(
                contractName,
                methodName,
                "evm",
                args,
                "0",
                acc
              );
              const len = res.preExecutionTransaction.response.responses.length;
              if (len > 0) {
                var result =
                  res.preExecutionTransaction.response.responses[len - 1].body;
                var response = JSON.parse(
                  Buffer.from(result, "base64").toString()
                );
                var base64Addr = response[0]._response;
                var data = Buffer.from(base64Addr, "base64").toString();
                var dataJson = JSON.parse(data);
              }
              var timestamp = String(parseInt(demo.tx.timestamp)).substring(
                0,
                13
              );
              console.log(timestamp);
              // 用户查看交易详情，前端显示下述txDetail信息。
              var txDetail = {
                txID: txID,
                from: from,
                to: to,
                id: tokenID,
                amount: amount,
                timestamp: dayjs(parseInt(timestamp)).format(
                  "YYYY-MM-DD HH:mm:ss"
                ),
              };
              var nftDetail = {
                link: dataJson.link,
                name: dataJson.name,
                hash: dataJson.hash,
              };

              // 前端展示数据
              if (txDetail && nftDetail) {
                //判断是否是3D
                if (nftDetail.link.match(/^(.*)(\.)(.{1,8})$/)[3].toUpperCase() =="ZIP") {
                    nftDetail.link = `${nftDetail.link.substring(0,nftDetail.link.lastIndexOf("."))}_3D.gif`;
                  }
                this.txDetail = txDetail;
                this.srcList = [];
                this.nftDetail = nftDetail;
                this.srcList.push(nftDetail.link);
                this.fullscreenLoading = false; //关闭loading
                this.ordersVisible = true;
              }
              return txDetail, nftDetail;
            } catch (err) {
              this.errorMessage(err);
            }
          };
          GetTxDetail(this.ruleForm.txId);
        } else {
          return false;
        }
      });
    },
    copy() {
      var clipboard = new Clipboard(".tag-read");
      clipboard.on("success", (e) => {
        this.$message.success("复制成功！");
        //  释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$message.success("当前浏览器不支持复制！");
        // 不支持复制
        // 释放内存
        clipboard.destroy();
      });
    },
    //通用方法
    publicMethod(formName) {
      this.fullscreenLoading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
          const commonFunc = async (type, contractName, methodName, args) => {
            try {
              const acc = JSON.parse(localStorage.getItem("acc"));
              const demo = await xsdk.invokeSolidityContarct(
                contractName,
                methodName,
                "evm",
                args,
                "0",
                acc
              );
              if (type == "query") {
                this.fullscreenLoading = false;
                this.$notify({
                  title: "查询成功",
                  dangerouslyUseHTMLString: true,
                  message: `<p style='word-wrap:break-word;word-break:break-all'>${JSON.stringify(
                    demo.preExecutionTransaction.response.responses
                  )}</p>`,
                  type: "success",
                });
              } else {
                this.fullscreenLoading = false;
                this.$notify({
                  title: "查询成功",
                  dangerouslyUseHTMLString: true,
                  message: `<p style='word-wrap:break-word'>${JSON.stringify(
                    xsdk.postTransaction(demo.transaction, acc)
                  )}</p>`,
                  type: "success",
                  duration: 0,
                });
              }
            } catch (err) {
              if (err) {
                this.errorMessage(err);
              } else {
                this.fullscreenLoading = false;
                this.$message.success("执行成功");
              }
            }
          };
          if (JSON.stringify(this.ruleForm) == "{}") {
            this.ruleForm = { "": "1" };
          }
          commonFunc(
            this.type,
            this.contractName,
            this.methodName,
            this.ruleForm
          );
        } else {
          return false;
        }
      });
    },
    //查询藏品冷却期
    /*
     @param{
        contractName,
        tokenID
      }
     */
    async inquireExpireTime(contractName, tokenID) {
      try {
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
        const acc = JSON.parse(localStorage.getItem("acc"));
        const args = { _id: tokenID };
        const res = await xsdk.invokeSolidityContarct(
          contractName,
          "getExpireTime",
          "evm",
          args,
          "0",
          acc
        );
        const len = res.preExecutionTransaction.response.responses.length;
        if (len > 0) {
          var result =
            res.preExecutionTransaction.response.responses[len - 1].body;
          var response = JSON.parse(Buffer.from(result, "base64").toString());
          var tokenExpireTiem = response[0]["0"];
          // console.log(response);
          // let tokenOwnerExpireTiem =
          //   response[0]["0"] -
          //   (Date.parse(new Date()) / 1000 - response[0]["0"]);
          // console.log(tokenOwnerExpireTiem);
          // return Math.ceil(tokenOwnerExpireTiem / 3600 / 24);
        }
        const res1 = await xsdk.invokeSolidityContarct(
          contractName,
          "getTokenExpireTime",
          "evm",
          args,
          "0",
          acc
        );
        const len1 = res1.preExecutionTransaction.response.responses.length;
        if (len1 > 0) {
          var result1 =
            res1.preExecutionTransaction.response.responses[len1 - 1].body;
          var response1 = JSON.parse(Buffer.from(result1, "base64").toString());
          // 该ID藏品的交易保护时间
          var tokenOwnerExpireTiem = response1[0]["0"];
        }
        var time =
          tokenExpireTiem -
          (Date.parse(new Date()) / 1000 - tokenOwnerExpireTiem);
        var finelTime =
          Math.ceil(time / 3600 / 24) <= 0
            ? "可转移"
            : `${Math.ceil(time / 3600 / 24)}天`;
        return finelTime;
      } catch (err) {
        this.$notify({
          title: "查询失败",
          dangerouslyUseHTMLString: true,
          message: `${err.error.message}`,
          type: "error",
          duration: 0,
        });
      }
    },
    errorMessage(err) {
      console.log(err);
      switch (err.error.message) {
        case "identity check failed":
          this.$notify({
            title: "请求失败",
            dangerouslyUseHTMLString: true,
            message: `用户在开放网络未实名认证，请认证后重试`,
            type: "error",
            duration: 0,
          });
          this.fullscreenLoading = false;
          break;
        case "error 17 - Error 17: execution reverted: with reason 'ERC1155: insufficient balance for transfer'":
          this.$notify({
            title: "请求失败",
            dangerouslyUseHTMLString: true,
            message: `用户address下的指定藏品Id的资产余额不足`,
            type: "error",
            duration: 0,
          });
          this.fullscreenLoading = false;
          break;
        case "error 17 - Error 17: execution reverted: with reason 'ERC1155: token protect time is unexpired'":
          this.$notify({
            title: "请求失败",
            dangerouslyUseHTMLString: true,
            message: `服务端显示错误，实际链上交易保护期未到期!`,
            type: "error",
            duration: 0,
          });
          this.fullscreenLoading = false;
        case "NOT_ENOUGH_UTXO_ERROR":
          this.$notify({
            title: "请求失败",
            dangerouslyUseHTMLString: true,
            message: `账户余额不足!`,
            type: "error",
            duration: 0,
          });
          this.fullscreenLoading = false;
        default:
          this.$notify({
            title: "请求失败",
            dangerouslyUseHTMLString: true,
            message: `${err.error.message}`,
            type: "error",
            duration: 0,
          });
          this.fullscreenLoading = false;
      }
    },
  },
};
</script>
<style scoped>
.details {
  width: 400px;
  min-height: 585px;
  margin: auto;
}
.details .header {
  width: 90%;
  margin: auto;
  margin-top: 10px;
  margin-left: 10px;
}
.details .header .return {
  width: 35px;
  height: 35px;
  line-height: 35px;
  border-radius: 50%;
  cursor: pointer;
  background-color: rgb(245, 245, 245);
}
.details .write {
  width: 90%;
  margin: auto;
  margin-top: 30px;
}
</style>
<style>
.details .write .el-form--label-top .el-form-item__label {
  padding: 0;
}
.el-dialog__header {
  padding: 0;
}
.el-dialog {
  margin: 0 auto 0;
  margin-top: 10vh !important;
}
.el-notification__content {
  word-break: break-all;
}
.show_btn_stateClass {
  background-color: #ddd !important;
}
</style>
