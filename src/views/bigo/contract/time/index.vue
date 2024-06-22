<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="订单ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入订单ID"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="用户ID" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入用户ID"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="用户账号" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户账号"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
<!--      <el-form-item label="昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户昵称"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>-->
      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单号"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="交易对" prop="symbol">
        <el-select
          v-model="queryParams.symbol"
          placeholder="订单交易对"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in symbolOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="币种" prop="currency">
        <el-select
          v-model="queryParams.currency"
          placeholder="购买币种"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in coinOptions"
            :key="dict.dictValue"
            :label="dict.dictValue"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="订单状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="建仓时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-top"
          size="mini"
          :disabled="multiple"
          @click="handleBatchSurplus"
          v-hasPermi="['luck:lotteryCode:edit']"
        >一键盈
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-bottom"
          size="mini"
          :disabled="multiple"
          @click="handleBatchLoss"
          v-hasPermi="['luck:lotteryCode:edit']"
        >一键亏
        </el-button>
        <el-button
          type="danger"
          icon="el-icon-bottom"
          size="mini"
          @click="handlePointStop"
          v-hasPermi="['luck:lotteryCode:edit']"
        >点停
        </el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
      <!--<el-button-->
      <!--type="warning"-->
      <!--icon="el-icon-download"-->
      <!--size="mini"-->
      <!--@click="handleExport"-->
      <!--v-hasPermi="['luck:lotteryCode:export']"-->
      <!--&gt;导出</el-button>-->
      <!--</el-col>-->
    </el-row>

    <el-table ref="contractTable" v-loading="loading" :data="contractList" style="width: 100%"
              :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="订单ID" prop="id" width="80"/>
      <el-table-column label="用户ID" prop="uid" width="80"/>
      <el-table-column label="用户账号" prop="username" min-width="180"/>
<!--      <el-table-column label="用户昵称" prop="nickName" width="120"/>-->
      <el-table-column label="账号类型" prop="userStatus" width="120">
        <template slot-scope="scope">
          <span v-html="userStatusFormat(scope.row)"></span>
        </template>
      </el-table-column>
<!--      <el-table-column label="用户备注" prop="remark" min-width="150"/>-->
      <el-table-column label="订单号" prop="orderNo" min-width="200"/>
      <el-table-column label="交易对" prop="symbol" width="120" :formatter="symbolFormat"/>
      <el-table-column label="购买币种" prop="currency" width="80"/>
      <el-table-column label="场景" prop="tradeType" width="80" :formatter="typeFormat"/>
      <el-table-column label="结算类型" prop="settlementType" width="120" :formatter="settlementTypeFormat"/>
      <el-table-column label="周期(秒)" prop="period" width="100" :formatter="periodFormat"/>
      <el-table-column label="金额" prop="money" width="120"/>
      <!--<el-table-column label="手续费" prop="fee" width="120"/>-->
      <el-table-column label="收益" prop="profit" width="120" :formatter="profitFormat"/>
      <el-table-column label="状态" align="center" prop="status" min-width="100">
        <template slot-scope="scope">
          <span v-html="statusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="建仓价" prop="buyPrice" width="120"/>
      <el-table-column label="建仓时间" align="center" prop="buyTime" min-width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.buyTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算价" prop="settlementPrice" width="120"/>
      <el-table-column label="计算时间" align="center" prop="settlementTime" min-width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.settlementTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源IP" prop="ipAddress"  min-width="120"/>
      <el-table-column label="来源地址" prop="position"  min-width="180"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            :disabled="scope.row.status != 0"
            icon="el-icon-warning-outline"
            @click="handleSurplus(scope.row)"
            v-hasPermi="['bigo:timecontract:edit']"
          >一键盈
          </el-button>
          <el-button
            size="mini"
            type="text"
            :disabled="scope.row.status != 0"
            icon="el-icon-warning-outline"
            @click="handleLoss(scope.row)"
            v-hasPermi="['bigo:timecontract:edit']"
          >一键亏
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 修改用户信息对话框 -->
    <el-dialog :title="pointStopTitle" :visible.sync="pointStopOpen" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="auto">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="" maxlength="11" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPointStop">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

<script>
import { listTimeContract, oneKeyClose, batchOneKeyClose } from '@/api/bigo/contract'
import { getToken } from '@/utils/auth'

export default {
  name: 'contract',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 交易对数据字典
      symbolOptions: [],
      // 币种数据字典
      coinOptions: [],
      // 角色表格数据
      contractList: [],
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [
        { dictValue: 0, dictLabel: '持仓' },
        { dictValue: 1, dictLabel: '已结算' }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        uid: undefined,
        orderNo: undefined,
        symbol: undefined,
        currency: undefined,
        username: undefined,
        status: undefined,
        nickName: undefined
      },
      websock: null,
      // 表单参数
      form: {},
      pointStopOpen: false,
      pointStopTitle: '点停功能'
    }
  },

  created() {
    this.getList()
    this.getDicts('bigo_coin_type').then(response => {
      this.coinOptions = response.data
    })
    this.getDicts('bigo_symbol_type').then(response => {
      this.symbolOptions = response.data
    })
    this.initWebSocket();
  },
  destroyed() {
    this.websock.close() //离开路由之后断开websocket连接
  },
  methods: {
    initWebSocket(){ //初始化weosocket
      const wsuri = `ws://127.0.0.1:8081/ws`;
      // const wsuri = "wss://ws.bitstamppor.cloud/ws";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
      console.log("连接聊天服务器成功！");
    },
    websocketonopen(){
      //连接建立之后登录
      this.websocketsend(JSON.stringify(this.formatMsg("LOGIN",getToken())));
    },
    websocketonerror(){//连接建立失败重连
      this.initWebSocket();
    },
    websocketsend(data){//数据发送
      this.websock.send(data);
    },
    websocketclose(e){  //关闭
      console.log('断开连接',e);
      this.initWebSocket();
    },
    /** 格式化消息 */
    formatMsg(type,msg){
      let data = {
        "type": type,
        "data": msg
      }
      return data;
    },

    submitPointStop() {
      let receiver = this.form.uid;
      let message = {
        "type": 0,
        "receiver": receiver
      };
      this.websocketsend(JSON.stringify(this.formatMsg("POINTS_STOP",message)));
      this.msgSuccess("点停成功");
      this.pointStopOpen = false;
      this.getList();
    },
    /** 查询合约列表 */
    getList() {
      this.loading = true
      listTimeContract(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.contractList = response.rows
          this.total = response.total
          this.loading = false
        }
      )
    },

    symbolFormat(row, column) {
      var str = row.symbol;
      var s1 = str.substring(0,str.length - 4);
      return s1.toUpperCase();
    },
    // 合约类型格式化
    typeFormat(row, column) {
      if (row.tradeType == 1) {
        return '做多'
      } else {
        return '做空'
      }
    },
    settlementTypeFormat(row, column) {
      if (row.settlementType == 1) {
        return '盈'
      } else if (row.settlementType == 2) {
        return '亏'
      } else {
        return '随行情'
      }
    },
    periodFormat(row,column) {
      return row.period+'s'
    },
    // 收益金额格式化
    profitFormat(row, column) {
      if (row.profitType == 1) {
        return '+' + row.profit
      } else if (row.profitType == 2) {
        return '-' + row.profit
      } else {
        return row.profit
      }
    },
    // 账号状态显示
    userStatusFormat(row, column) {
      if (row.userStatus == 0 || row.userStatus == 1) {
        return '<font color="green">' + '普通玩家' + '</font>'
      } else if (row.userStatus == 2) {
        return '<font color="red">' + '内部账号' + '</font>'
      }
      return '-'
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 订单状态显示
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.profitType == 2) {
        return 'warning-row'
      } else if (row.profitType == 1) {
        return 'success-row'
      }
      return ''
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },

    /** 一键亏操作 */
    handleLoss(row) {
      const id = row.id
      console.log(id)
      this.$confirm('一键亏，ID为"' + id + '"订单? 该操作无法撤销，请慎重操作！', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return oneKeyClose(2, id)
      }).then(() => {
        this.getList()
        this.msgSuccess('一键亏成功')
      }).catch(function() {
      })
    },
    /** 一键盈操作 */
    handleSurplus(row) {
      const id = row.id
      this.$confirm('一键盈，ID为"' + id + '"订单? 该操作无法撤销，请慎重操作！', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return oneKeyClose(1, id)
      }).then(() => {
        this.getList()
        this.msgSuccess('一键盈成功')
      }).catch(function() {
      })
    },
    /** 一键亏批量操作 */
    handleBatchLoss(row) {
      const id = this.ids
      console.log(id)
      this.$confirm('批量一键亏，ID为"' + id + '"订单? 该操作无法撤销，请慎重操作！', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return batchOneKeyClose(2, id)
      }).then(() => {
        this.getList()
        this.msgSuccess('一键亏成功')
      }).catch(function() {
      })
    },
    /** 一键盈批量操作 */
    handleBatchSurplus(row) {
      const id = this.ids
      this.$confirm('批量一键盈，ID为"' + id + '"订单? 该操作无法撤销，请慎重操作！', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return batchOneKeyClose(1, id)
      }).then(() => {
        this.getList()
        this.msgSuccess('一键盈成功')
      }).catch(function() {
      })
    },
    // 取消按钮
    cancel() {
      this.pointStopOpen = false;
      this.reset();
    },
    handlePointStop(){
      this.pointStopOpen = true;
    }
  }

}
</script>
