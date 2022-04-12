<template>
  <div class="header">
    <el-row>
      <el-col :span="12" v-if="routeState">
         <el-popover
          placement="bottom"
          title="版本更新內容"
          width="200"
          trigger="click"
          content="1.增加黑名单限制。">
          <el-button  slot="reference" type="text" style="float: left; font-size: 14px; color: #409eff">版本号：0.0.8</el-button>
        </el-popover>
        
      </el-col>
      <el-col :span="12" v-else>
        <div @click="getSetting" class="return">
          <i class="el-icon-arrow-left"></i>
        </div>
      </el-col>
      <!-- <el-col :span="6">
        <el-button
          type="text"
          @click="(visible = true), (addForm.formValue = [])"
          >新增操作</el-button
        >
      </el-col> -->
      <el-col :span="12" :class="get_out_state ? 'help_out_more' : 'help_out'">
        <el-button type="text" @click="goMakerOne">MakerONE</el-button>
        <el-popover placement="bottom" trigger="click">
          <img width="100%" src="../assets/makerOneChat.png" alt="" />
          <el-button type="text" slot="reference">帮助</el-button>
        </el-popover>
        <el-button v-if="get_out_state == false" type="text" @click="getOut()"
          >退出</el-button
        >
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="visible"
      width="90%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        style="text-align: left"
        label-position="top"
        :model="addForm"
        :rules="rules1"
        ref="addForm"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="操作名称" prop="name">
              <el-input
                v-model="addForm.name"
                placeholder="请输入您要添加的操作名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作类型" prop="type">
              <el-radio-group v-model="addForm.type">
                <el-radio label="transaction">交易</el-radio>
                <el-radio label="query">查询</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="合约名" prop="contractName">
          <el-input
            v-model="addForm.contractName"
            placeholder="请输入合约名"
          ></el-input>
        </el-form-item>
        <el-form-item label="方法名" prop="methodName">
          <el-input
            v-model="addForm.methodName"
            placeholder="请输入方法名"
          ></el-input>
        </el-form-item>
        <div>
          <el-button size="small" type="primary" @click="addParams"
            >添加操作参数</el-button
          >
          <el-row
            :gutter="20"
            v-for="(item, index) in addForm.formValue"
            :key="index"
          >
            <el-col :span="10">
              <el-form-item label="参数名称">
                <el-input
                  v-model="item.label"
                  placeholder="请输入您要添加的参数名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="参数">
                <el-input
                  v-model="item.value"
                  placeholder="请输入您要添加的参数"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <i
                @click.prevent="removeDomain(item)"
                style="font-size: 24px; margin-top: 35%; cursor: pointer"
                class="el-icon-remove-outline"
              ></i>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submit('addForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      addForm: {
        name: "",
        contractName: "",
        methodName: "",
        formValue: [],
      },
      rules1: {
        name: [
          { required: true, message: "操作名称不能为空", trigger: "blur" },
        ],
        contractName: [
          { required: true, message: "合约名不能为空", trigger: "blur" },
        ],
        methodName: [
          { required: true, message: "方法名不能为空", trigger: "blur" },
        ],
        type: [
          { required: true, message: "选择您的操作类型", trigger: "change" },
        ],
      },
      routeState: false,
      get_out_state: false,
    };
  },
  mounted() {
    this.$route.name == "Details"
      ? (this.routeState = false)
      : (this.routeState = true);
    this.$route.name == "Login"
      ? (this.get_out_state = true)
      : (this.get_out_state = false);
  },
  methods: {
    //添加参数
    addParams() {
      this.addForm.formValue.push({ value: "", label: "" });
    },
    getSetting() {
      this.$router.push("/Home");
    },
    //新增操作
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var localArr = {
            addList: [],
          };
          if (localStorage.getItem("addForm")) {
            localArr.addList = JSON.parse(
              localStorage.getItem("addForm")
            ).addList;
            localArr.addList.push(this.addForm);
            localStorage.setItem("addForm", JSON.stringify(localArr));
          } else {
            localArr.addList.push(this.addForm);
            localStorage.setItem("addForm", JSON.stringify(localArr));
          }
          this.visible = false;
          window.location.reload();
        } else {
          return false;
        }
      });
    },
    //退出
    getOut() {
      localStorage.clear();
      this.$router.replace("/Login");
    },
    goMakerOne() {
      window.location.href =
        "https://makerone.shengjian.net/front_nft_mobileN/nft_mobileN_home";
    },
  },
};
</script>

<style>
.header {
  width: 90%;
  margin: auto;
  margin-top: 10px;
}
.header .return {
  width: 35px;
  height: 35px;
  line-height: 35px;
  border-radius: 50%;
  cursor: pointer;
  background-color: rgb(245, 245, 245);
}
.help_out {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.help_out_more {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>