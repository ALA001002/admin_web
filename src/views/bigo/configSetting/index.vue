<template>
  <div>
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="22">
          <el-row gutter="15">
            <!--            <el-col :span="22">
                          <el-form-item label-width="150px" label="延迟上分" prop="delayedScoreStatus" >
                            <el-switch v-model="formData.delayedScoreStatus" :active-value='1' :inactive-value='0'>
                            </el-switch>
                          </el-form-item>
                        </el-col>
                        <el-col :span="22">
                          <el-form-item label-width="150px" label="延迟上分(分钟)" prop="delayedTime">
                            <el-input v-model="formData.delayedTime" placeholder="请输入延迟上分(分钟)" clearable
                                      :style="{width: '20%'}"></el-input>
                          </el-form-item>
                        </el-col>-->
            <el-col :span="22">
              <el-form-item label-width="150px" label="实名认证奖励状态" prop="usdtManualRecharge">
                <el-switch v-model="formData.authRewardStatus" :active-value='1' :inactive-value='0'>
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <br/>
              <el-form-item label-width="150px" label="实名认证奖励数量" prop="withdrawCount">
                <el-input v-model="formData.authRewardNum" placeholder="请输入实名认证奖励数量" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <br/>
              <el-form-item label-width="150px" label="注册赠送锁仓数量" prop="registerGiveLockAmount">
                <el-input v-model="formData.registerGiveLockAmount" placeholder="请输入注册赠送锁仓数量" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <br/>
              <el-form-item label-width="150px" label="ip限制注册次数" prop="withdrawCount">
                <el-input v-model="formData.ipRegisterCount" placeholder="请输入ip限制注册次数" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="多地址绑定限制" prop="multiAddressStatus">
                <el-switch v-model="formData.multiAddressStatus" :active-value='1' :inactive-value='0'>
                </el-switch>
              </el-form-item>
            </el-col>

            <el-col :span="22">
              <el-form-item label-width="150px" label="预售中签概率(%)" prop="probabilityRebate">
                <el-input v-model="formData.probabilityRebate" placeholder="请输入预售中签概率" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <br/>
              <el-form-item label-width="150px" label="每日提现次数" prop="withdrawCount">
                <el-input v-model="formData.withdrawCount" placeholder="请输入每日提现次数" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="提现手续费(%)" prop="withdrawFee">
                <el-input v-model="formData.withdrawFee" placeholder="请输入提现手续费" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="USDT最低充值" prop="usdtRechargeMin">
                <el-input v-model="formData.usdtRechargeMin" placeholder="请输入USDT最低充值" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="USDT最低提现" prop="usdtWithdrawMin">
                <el-input v-model="formData.usdtWithdrawMin" placeholder="请输入USDT最低提现" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="USDT充值开关" prop="usdtRecharge">
                <el-switch v-model="formData.usdtRecharge" :active-value='1' :inactive-value='0'>
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="ETH充值开关" prop="usdtRecharge">
                <el-switch v-model="formData.ethRecharge" :active-value='1' :inactive-value='0'>
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="BTC充值开关" prop="usdtRecharge">
                <el-switch v-model="formData.btcRecharge" :active-value='1' :inactive-value='0'>
                </el-switch>
              </el-form-item>
            </el-col>


            <el-col :span="22">
              <el-form-item label-width="150px" label="USDT人工充值开关" prop="usdtManualRecharge">
                <el-switch v-model="formData.usdtManualRecharge" :active-value='1' :inactive-value='0'>
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="ETH人工充值开关" prop="ethManualRecharge">
                <el-switch v-model="formData.ethManualRecharge" :active-value='1' :inactive-value='0'>
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="BTC人工充值开关" prop="btcManualRecharge">
                <el-switch v-model="formData.btcManualRecharge" :active-value='1' :inactive-value='0'>
                </el-switch>
              </el-form-item>
            </el-col>

            <el-col :span="22">
              <el-form-item label-width="150px" label="外部提现" prop="externalWithdrawStatus">
                <el-switch v-model="formData.externalWithdrawStatus" :active-value='1' :inactive-value='0'>
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="邮箱注册" prop="emailRegisterStatus">
                <el-switch v-model="formData.emailRegisterStatus" :active-value='1' :inactive-value='0'></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="短信注册" prop="smsRegisterStatus">
                <el-switch v-model="formData.smsRegisterStatus" :active-value='1' :inactive-value='0'></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="买卖状态" prop="usdtManualRecharge">
                <el-switch v-model="formData.timeContractStatus" :active-value='1' :inactive-value='0'>
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="借币状态" prop="loanStatus">
                <el-switch v-model="formData.loanStatus" :active-value='1' :inactive-value='0'></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="交易手续费(%)" prop="tradeFeeRebate">
                <el-input v-model="formData.tradeFeeRebate" placeholder="请输入交易手续费" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="分销开关" prop="rebateStatus">
                <el-switch v-model="formData.rebateStatus" :active-value='1' :inactive-value='0'></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="最高分销层级" prop="mostRebateLevel">
                <el-input v-model="formData.mostRebateLevel" placeholder="请输入最高分销层级" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="一级分销(%)" prop="firstLevelRebate">
                <el-input v-model="formData.firstLevelRebate" placeholder="请输入一级分销" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="二级分销(%)" prop="twoLevelRebate">
                <el-input v-model="formData.twoLevelRebate" placeholder="请输入二级分销" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="三级分销(%)" prop="threeLevelRebate">
                <el-input v-model="formData.threeLevelRebate" placeholder="请输入三级分销" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="额外层级分销(%)" prop="extraLevelRebate">
                <el-input v-model="formData.extraLevelRebate" placeholder="请输入额外层级分销" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="22">
              <el-form-item label-width="150px" label="首充奖励开关" prop="firstRechargeStatus">
                <el-switch v-model="formData.firstRechargeStatus" :active-value='1' :inactive-value='0'></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="首充奖励达标金额" prop="firstRechargeComplyAmount">
                <el-input v-model="formData.firstRechargeComplyAmount" placeholder="首充奖励达标金额" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="首充奖励金额" prop="firstRechargeRewards">
                <el-input v-model="formData.firstRechargeRewards" placeholder="首充奖励金额" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="首充上级奖励金额" prop="firstRechargeSuperRewards">
                <el-input v-model="formData.firstRechargeSuperRewards" placeholder="首充上级奖励金额" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label-width="150px" label="谷歌验证码" prop="googleCaptcha">
                <el-input v-model="formData.googleCaptcha" placeholder="谷歌验证码" clearable
                          :style="{width: '20%'}"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <!--            <el-button @click="resetForm">重置</el-button>-->
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import {getConfigSetting, updateConfigSetting} from "@/api/bigo/configSetting";

export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        withdrawCount: 1,
        withdrawFee: 0,
        usdtRechargeMin: 0,
        usdtWithdrawMin: 0,
        externalWithdrawStatus: 0,
        emailRegisterStatus: 0,
        smsRegisterStatus: 0,
        rebateStatus: 0,
        firstLevelRebate: 0,
        twoLevelRebate: 0,
        threeLevelRebate: 0,
        extraLevelRebate: 0,
        mostRebateLevel: 0,
        usdtRecharge: 0,
        usdtManualRecharge: 0,
        ethManualRecharge: 0,
        btcManualRecharge: 0,
        licaiFlag: false,
        xiadanFlag: false,
        shequFlag: false,
        gerenFlag: false,
        googleCaptcha: undefined,
        delayedScoreStatus: 0,
        delayedTime: 0,
        loanStatus: 0,
        timeContractStatus: 0,
        tradeFeeRebate: 0,
        authRewardStatus: 0,
        authRewardNum: 0,
        multiAddressStatus: 0,
        firstRechargeStatus: 0,
        firstRechargeComplyAmount: 0,
        firstRechargeRewards: 0,
        firstRechargeSuperRewards: 0,
        ipRegisterCount: 999,
        registerGiveLockAmount:0
      },
      rules: {
        withdrawCount: [{
          required: true,
          message: '请输入每日提现次数',
          trigger: 'blur'
        }],
        withdrawFee: [{
          required: true,
          message: '请输入提现手续费',
          trigger: 'blur'
        }],
        usdtRechargeMin: [{
          required: true,
          message: '请输入USDT最低充值',
          trigger: 'blur'
        }],
        usdtWithdrawMin: [{
          required: true,
          message: '请输入USDT最低提现',
          trigger: 'blur'
        }],
        firstLevelRebate: [{
          required: true,
          message: '请输入一级分销',
          trigger: 'blur'
        }],
        twoLevelRebate: [{
          required: true,
          message: '请输入二级分销',
          trigger: 'blur'
        }],
        threeLevelRebate: [{
          required: true,
          message: '请输入三级分销',
          trigger: 'blur'
        }],
        extraLevelRebate: [{
          required: true,
          message: '请输入额外层级分销',
          trigger: 'blur'
        }],
        tradeFeeRebate: [{
          required: true,
          message: '请输入交易手续费',
          trigger: 'blur'
        }],
        mostRebateLevel: [{
          required: true,
          message: '请输入最高返利层级',
          trigger: 'blur'
        }],
        googleCaptcha: [{
          required: true,
          message: '请输入谷歌验证码',
          trigger: 'blur'
        }],
        probabilityRebate: [{
          required: true,
          message: '请输入中签概率',
          trigger: 'blur'
        }]
      },
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getConfig();
  },
  mounted() {
  },
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        updateConfigSetting(this.formData).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.formData.googleCaptcha = '';
            this.resetForm();
          }
        });
      })
    },
    getConfig() {
      getConfigSetting().then(
        response => {
          this.formData = response.data;
        }
      );
    },
  }
}

</script>
<style>
</style>
