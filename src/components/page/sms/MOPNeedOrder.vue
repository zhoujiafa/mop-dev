<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.companyCode" placeholder="公司编码" class="handle-input mr10" style="width: 200px"></el-input>
                <el-input v-model="query.needOrderNo" placeholder="要货单号" class="handle-input mr10" style="width: 200px"></el-input>
                <!--<el-date-picker class="mr10"
                                v-model="value1"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>-->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="warning" icon="el-icon-delete" @click="handleSearch">重置</el-button>
                <el-button type="success" icon="el-icon-plus" @click="addMOPNeedOrder">新增要货单</el-button>
                <!--<el-button type="info" icon="el-icon-download" @click="delAllSelection">导出</el-button>-->
            </div>

            <el-table
                    :data="dataLineList"
                    style="width: 100%;margin-bottom: 20px;"
                    row-key="docNum"
                    border
                    :row-key="getRowKeys"
                    :expand-row-keys="expands"
                    @current-change="toggleRowExpansion"
            >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="门店名称:">
                                <span>{{props.row.companyName}}</span>
                            </el-form-item>
                            <el-form-item label="门店编码:">
                                <span>{{props.row.companyCode}}</span>
                            </el-form-item>
                            <el-form-item label="订单号码:">
                                <span>{{ props.row.docNum}}</span>
                            </el-form-item>
                            <el-form-item label="下载单号:">
                                <span>{{ props.row.needNo}}</span>
                            </el-form-item>
                            <el-form-item label="订单状态:">
                                <span>{{props.row.needStatus}}</span>
                            </el-form-item>
                            <el-form-item label="下载标识:">
                                <span>{{ props.row.downLoadMark}}</span>
                            </el-form-item>
                            <el-form-item label="创建人:">
                                <span>{{ props.row.createName}}</span>
                            </el-form-item>
                            <el-form-item label="创建日期:">
                                <span>{{ props.row.createDate}}</span>
                            </el-form-item>
                            <el-form-item label="数量总计:">
                                <span>{{ props.row.docQtyTotal }}</span>
                            </el-form-item>
                            <el-form-item label="金额总计:">
                                <span>{{ props.row.docTotal }}</span>
                            </el-form-item>
                            <el-form-item label="品牌编号:">
                                <span>{{ props.row.cardCode }}</span>
                            </el-form-item>
                            <el-form-item label="品牌名称:">
                                <span>{{ props.row.cardName }}</span>
                            </el-form-item>
                            <el-form-item label="部门编号:">
                                <span>{{ props.row.department }}</span>
                            </el-form-item>
                            <el-form-item label="销售编号:">
                                <span>{{ props.row.saleCode }}</span>
                            </el-form-item>
                            <el-form-item label="基代码:">
                                <span>{{ props.row.baseDocNum }}</span>
                            </el-form-item>
                            <el-form-item label="备注:">
                                <span>{{ props.row.remark }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <!--<el-table-column
                        align="center"
                        prop="docNum"
                        label="ID"
                        width="50"
                        v-if="ID">
                </el-table-column>-->
                <el-table-column
                        align="center"
                        prop="companyCode"
                        label="公司编码"
                        v-if="companyCode">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="companyName"
                        label="公司名称">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="docNum"
                        label="要货单号">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="ntypeCode"
                        label="单据类型编码"
                        v-if="ntypeCode">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="ntypeName"
                        label="单据类型名称">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="createName"
                        label="单据创建人">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="needStatus"
                        label="单据状态">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="createDate"
                        sortable
                        label="创建日期">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="到货日期"
                        sortable
                        prop="needDate">
                </el-table-column>
            </el-table>
            <div class="pagination" style="width: 100%;text-align: left;margin-top: 10px;">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handlePageChange"
                        :current-page="page"
                        :page-sizes="[10,20,30,50,100]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pageTotal">
                </el-pagination>
            </div>
        </div>


        <!-- 新增弹出框 -->
        <el-dialog title="新增要货单信息" :visible.sync="addMOPNeedOrderVisible" width="30%">
            <el-form label-width="100px" ref="needOrderValidateForm" :model="needOrderValidateForm">
                <el-form-item label="门店信息:" prop="companyCode" :rules="[
                    { required: true, message: '门店信息不能为空'}]">
                    <el-select v-model="needOrderValidateForm.companyCode" filterable
                               v-model.trim="needOrderValidateForm.companyCode"
                               placeholder="请选择门店">
                        <el-option
                                autocomplete="off" type="companyCode"
                                v-for="item in companyList"
                                :key="item.companyCode"
                                :label="item.companyName"
                                :value="item.companyCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订货单号:" prop="needOrderNo" :rules="[
                    { required: true, message: '要货单号不能为空'},
                    { message: '要货单号不能存在特殊字符'}]">
                    <el-input v-model="needOrderValidateForm.needOrderNo" clearable
                              v-model.trim="needOrderValidateForm.needOrderNo" placeholder="请输入单号"
                              autocomplete="off" type="needOrderNo"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="preview('needOrderValidateForm')" type="primary">查询预览</el-button>
                 <el-button @click="resetForm('needOrderValidateForm')">重置</el-button>
                <el-button @click="addMOPNeedOrderVisible = false">取 消</el-button>
            </span>
        </el-dialog>


        <!-- 预览弹出框 -->
        <el-dialog title="预览信息" :visible.sync="previewVisible" width="98%">
            <div>
                <div>
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item label="门店编码:" style="width: 30%;position: relative;left: 10%">
                            <el-input v-model="this.MOPNeedOrderData.companyCode" placeholder="暂无数据" style="width: 100%"
                                      disabled="false"></el-input>
                        </el-form-item>
                        <el-form-item label="门店名称:" style="width: 30%;position: relative;left: 5%">
                            <el-input v-model="this.MOPNeedOrderData.companyName" placeholder="暂无数据" style="width: 110%"
                                      disabled="false"></el-input>
                        </el-form-item>
                        <el-form-item label="要货单号:" style="width: 30%;position: relative;left: 0%">
                            <el-input v-model="this.MOPNeedOrderData.needNo" placeholder="暂无数据" style="width: 100%"
                                      disabled="false"></el-input>
                        </el-form-item>
                        <el-form-item label="单据编码:" style="width: 30%;position: relative;left: 10%">
                            <el-input v-model="this.MOPNeedOrderData.ntypeCode" placeholder="暂无数据" style="width: 100%"
                                      disabled="false"></el-input>
                        </el-form-item>
                        <el-form-item label="单据类型:" style="width: 30%;position: relative;left: 5%">
                            <el-input v-model="this.MOPNeedOrderData.ntypeName" placeholder="暂无数据" style="width: 100%"
                                      disabled="false"></el-input>
                        </el-form-item>
                        <el-form-item label="原创建人:" style="width: 30%;position: relative;left: 0%">
                            <el-input v-model="this.MOPNeedOrderData.createName" placeholder="暂无数据" style="width: 100%"
                                      disabled="false"></el-input>
                        </el-form-item>
                        <el-form-item label="创建日期:" style="width: 30%;position: relative;left: 10%">
                            <el-input v-model="this.MOPNeedOrderData.createDate" placeholder="暂无数据" style="width: 100%"
                                      disabled="false"></el-input>
                        </el-form-item>
                        <el-form-item label="到货日期:" style="width: 30%;position: relative;left: 5%">
                            <el-input v-model="this.MOPNeedOrderData.needDate" placeholder="暂无数据" style="width: 100%"
                                      disabled="false"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <span style="font-weight: bold">单据明细信息</span>
            <div>
                <el-table
                        :data="MOPNeedOrderDtData"
                        border
                        header-cell-class-name="table-header"
                        class="table">
                    <el-table-column
                            width="320"
                            align="center"
                            label="商品名称"
                            prop="itemName">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="商品编码"
                            prop="itemCode">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="数量"
                            prop="itemQuantity">
                    </el-table-column>
                    <el-table-column
                            width="200"
                            align="center"
                            label="规格名称"
                            prop="specName">
                    </el-table-column>
                    <el-table-column
                            width="150"
                            align="center"
                            label="SKU编码"
                            prop="skuBarcode">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="订货价"
                            prop="listPrice">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="商品总额"
                            prop="lineTotal">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="实付单价"
                            prop="realPrice">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="实付总额"
                            prop="realPriceLineTotal">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="优惠金额"
                            prop="promotionMoney">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="运费"
                            prop="totalExpressFee">
                    </el-table-column>
                    <el-table-column

                            align="center"
                            label="单位"
                            prop="unit">
                    </el-table-column>
                </el-table>

                <span slot="footer" class="dialog-footer">
                <el-button @click=" previewVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveMOPNeedOrder()">确定保存</el-button>
            </span>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import * as API from '../../../api';

    export default {
        inject: ['reload'],
        name: 'SmsProvider',
        data() {
            return {
                companyList: [],
                MOPNeedOrderPage: [],
                MOPNeedOrderDtData: [],
                MOPNeedOrderData: {},
                addMOPNeedOrderVisible: false,
                previewVisible: false,
                pageTotal: 0,
                page: 1,
                size: 10,
                needOrderValidateForm: {
                    needOrderNo: '',
                    companyCode: ''
                },
                query: {
                    needOrderNo: '',
                    companyCode: ''
                },
                expands: [],
                getRowKeys(row) {
                    return row.docNum;
                }
            };
        },
        created() {
            this.getData();
            this.getSelectCompanyListData();
            //this.preview();
        },
        methods: {
            getData: function() {
                console.log(this.query);
                API.page_MOPNeedOrder(this.page, this.size, this.query).then(res => {
                    debugger;
                    this.dataLineList = res.body.records;
                    this.pageTotal = res.body.total;
                });
            },
            addMOPNeedOrder: function() {
                this.addMOPNeedOrderVisible = true;
            },
            preview: function(formName) {
                debugger;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        debugger;
                        API.downloadMOPNeedOrder(this.needOrderValidateForm).then(res => {
                            debugger;
                            this.MOPNeedOrderData = res.body;
                            if (res.body.code != -1) {
                                this.MOPNeedOrderDtData = res.body.lines;
                                this.previewVisible = true;
                            } else {
                                debugger;
                                this.$message({
                                    type: 'info',
                                    message: res.body.message
                                });
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleSearch: function() {
                this.getData();
            },
            handlePageChange: function(val) {
                this.page = val;

                this.getData();
            }, handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size = val;
                this.getData();
            },
            cancels: function() {

            },
            getSelectCompanyListData: function() {
                console.log(this.companyAO);
                API.list_CompanyDict(this.companyAO).then(res => {

                    this.companyList = res.body;
                });
            },

            saveMOPNeedOrder() {
                let params = {
                    companyCode: '',
                    companyName: '',
                    needNo: '',
                    createDate: '',
                    createName: '',
                    needDate: '',
                    needStatus: '',
                    needStatusName: '',
                    ntypeCode: '',
                    ntypeName: '',
                    lines: [],
                    isRetransmit: false,
                    isCompulsorySubmission: false
                };
                let username = localStorage.getItem('ms_username');
                params.companyCode = this.MOPNeedOrderData.companyCode;
                params.companyName = this.MOPNeedOrderData.companyName;
                params.needNo = this.MOPNeedOrderData.needNo;
                params.createDate = this.MOPNeedOrderData.createDate;
                params.createName = this.MOPNeedOrderData.createName;
                params.needDate = this.MOPNeedOrderData.needDate;
                params.needStatus = this.MOPNeedOrderData.needStatus;
                params.needStatusName = this.MOPNeedOrderData.needStatusName;
                params.ntypeCode = this.MOPNeedOrderData.ntypeCode;
                params.ntypeName = this.MOPNeedOrderData.ntypeName;
                params.newCreateName = username;
                params.lines = this.MOPNeedOrderData.lines;
                params.isRetransmit = false;
                params.isCompulsorySubmission = false;
                /*查询订单下载表信息是否存在*/
                debugger;
                API.getNeedOrderByNeedNo(params).then(res => {
                    debugger;
                    if (res.body.docNum != null) {
                        debugger;
                        /*本地存在已下载订单信息*/
                        this.opens(params);
                    } else {
                        API.MOPNeedOrder_Save(params).then(res => {
                            debugger;
                            if (res.body.body.resultInt == 0) {
                                debugger;
                                this.$message({
                                    message: res.body.body.resultString + '!',
                                    type: 'success'
                                });
                            } else {
                                this.$message({
                                    message: res.body.body.resultString + '!',
                                    type: 'error'
                                });
                            }
                            this.reload();
                            this.addMOPNeedOrderVisible = false;
                            this.previewVisible = false;
                        });
                    }
                });
            },
            opens: function(params) {
                debugger;
                this.$confirm('该订单已存在，是否重复提交？', '确认信息', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确认保存',
                    cancelButtonText: '放弃修改',
                    type: 'warning'
                }).then(() => {
                    params.isRetransmit = true;
                    debugger;
                    API.MOPNeedOrder_Save(params).then(res => {
                        debugger;
                        if (res.body.body.resultInt == 2 || res.body.body.resultInt == 0) {
                            debugger;
                            this.$message({
                                type: 'success',
                                message: res.body.body.resultString
                            });

                        } else {
                            this.$message({
                                type: 'error',
                                message: res.body.body.resultString
                            });
                        }
                        this.reload();
                        this.addMOPNeedOrderVisible = false;
                        this.previewVisible = false;
                    });
                }).catch(action => {
                    this.$message({
                        type: 'info',
                        message: action === 'cancel'
                            ? '放弃保存并离开页面'
                            : '停留在当前页面'
                    });
                });
            },
            toggleRowExpansion(row) {
                this.expands = [];
                this.expands.push(row.docNum);
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 120px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .success {
        color: #67C23A;
    }

    .danger {
        color: #F56C6C;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }

    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>
