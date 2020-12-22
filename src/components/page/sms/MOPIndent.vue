<template>
    <div class="container">
        <div class="handle-box">
            <el-input v-model="query.companyName" clearable placeholder="门店名称" class="handle-input mr10" style="width: 200px"></el-input>
            <el-input v-model="query.orderNo" clearable placeholder="订货单号" class="handle-input mr10" style="width: 200px"></el-input>
            <!--<span style="color: #97a8be">
                到货日期 :
                <el-date-picker class="mr10"
                                v-model="value1"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
            </span>-->

            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            <el-button type="warning" icon="el-icon-delete" @click="handleSearch">重置</el-button>
            <el-button type="success" icon="el-icon-plus" @click="addMOPIndent">新增订货单</el-button>
            <!--<el-button type="info" icon="el-icon-download" @click="delAllSelection">导出</el-button>-->
        </div>
        <div>
            <el-table
                    :data="MOPIndentPage"
                    style="width: 100%;margin-bottom: 20px;"
                    row-key="docNum"
                    border
                    stripe
                    class="table"
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
                            <el-form-item label="原订单号码:">
                                <span>{{ props.row.orderNo}}</span>
                            </el-form-item>
                            <el-form-item label="新订单号码:">
                                <span>{{ props.row.docNum}}</span>
                            </el-form-item>
                            <el-form-item label="订单类型:">
                                <span>{{props.row.orderTypeName}}</span>
                            </el-form-item>
                            <el-form-item label="订单状态:">
                                <span>{{props.row.orderStatusName}}</span>
                            </el-form-item>
                            <el-form-item label="付款状态:">
                                <span>{{props.row.payStatusName}}</span>
                            </el-form-item>
                            <el-form-item label="创建日期:">
                                <span>{{ props.row.createDate}}</span>
                            </el-form-item>
                            <el-form-item label="创建人:">
                                <span>{{ props.row.createName}}</span>
                            </el-form-item>
                            <el-form-item label="备注:">
                                <span>{{ props.row.remark }}</span>
                            </el-form-item>
                        </el-form>
                        <el-button-group style="position: relative;left: 95%">
                            <el-tooltip content="编辑" placement="top">
                                <el-button type="primary" icon="el-icon-edit" circle></el-button>
                            </el-tooltip>
                            <el-tooltip content="详情" placement="top">
                                <el-button type="primary" icon="el-icon-s-data" circle @click="MopIndentDtView(props.row.companyCode,props.row.docNum)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top">
                                <el-button type="primary" icon="el-icon-delete" circle></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="companyName"
                        label="门店名称"
                        sortable
                        align="center"
                        width="220%">
                </el-table-column>
                <el-table-column
                        prop="docNum"
                        label="订货单号"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="orderNo"
                        label="原订单号"
                        align="center"
                        v-if="orderNo">
                </el-table-column>
                <el-table-column
                        prop="orderTypeName"
                        label="订单类型"
                        align="center"
                        v-if="orderTypeName">
                </el-table-column>
                <el-table-column
                        prop="payStatusName"
                        label="付款状态"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="orderStatusName"
                        label="订单状态"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建日期"
                        sortable
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="createName"
                        label="创建人"
                        align="center">
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
        <el-dialog title="新增订货单信息" :visible.sync="addMOPIndentVisible" width="30%">
            <el-form label-width="100px" ref="indentValidateForm" :model="indentValidateForm">
                <el-form-item label="门店信息:" prop="companyCode" :rules="[
                    { required: true, message: '门店信息不能为空'}]">
                    <el-select v-model="saveParam.orderNo" filterable v-model.trim="indentValidateForm.companyCode"
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
                <el-form-item label="订货单号:" prop="orderNo" :rules="[
                    { required: true, message: '订货单号不能为空'},
                    { message: '订货单号不能存在特殊字符'}]">
                    <el-input v-model="saveParam.orderNo" clearable v-model.trim="indentValidateForm.orderNo" placeholder="请输入单号"
                              autocomplete="off" type="orderNo"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="preview('indentValidateForm')" type="primary">查询预览</el-button>
                 <el-button @click="resetForm('indentValidateForm')">重置</el-button>
                <el-button @click="addMOPIndentVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 预览弹出框 -->
        <el-dialog title="预览信息" :visible.sync="previewVisible" width="98%">
            <div>
                <div>
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item label="公司编码:" style="width: 30%;position: relative;left: 10%">
                            <el-input v-model="this.MOPIndentData.companyCode" placeholder="暂无数据" style="width: 100%"
                                      disabled="false"></el-input>
                        </el-form-item>
                        <el-form-item label="公司名称:" style="width: 30%;position: relative;left: 5%">
                            <el-input v-model="this.MOPIndentData.companyName" placeholder="暂无数据" style="width: 110%"
                                      disabled="false"></el-input>
                        </el-form-item>
                        <el-form-item label="订货单号:" style="width: 30%;position: relative;left: 0%">
                            <el-input v-model="this.MOPIndentData.orderNo" placeholder="暂无数据" style="width: 100%"
                                      disabled="false"></el-input>
                        </el-form-item>
                        <el-form-item label="单据编码:" style="width: 30%;position: relative;left: 10%">
                            <el-input v-model="this.MOPIndentData.orderType" placeholder="暂无数据" style="width: 100%"
                                      disabled="false"></el-input>
                        </el-form-item>
                        <el-form-item label="单据名称:" style="width: 30%;position: relative;left: 5%">
                            <el-input v-model="this.MOPIndentData.orderTypeName" placeholder="暂无数据" style="width: 100%"
                                      disabled="false"></el-input>
                        </el-form-item>
                        <el-form-item label="付款状态:" style="width: 30%;position: relative;left: 0%">
                            <el-input v-model="this.MOPIndentData.payStatusName" placeholder="暂无数据" style="width: 100%"
                                      disabled="false"></el-input>
                        </el-form-item>
                        <el-form-item label="创建日期:" style="width: 30%;position: relative;left: 10%">
                            <el-input v-model="this.MOPIndentData.createDate" placeholder="暂无数据" style="width: 100%"
                                      disabled="false"></el-input>
                        </el-form-item>
                        <el-form-item label="单创建人:" style="width: 30%;position: relative;left: 5%">
                            <el-input v-model="this.MOPIndentData.createName" placeholder="暂无数据" style="width: 100%"
                                      disabled="false"></el-input>
                        </el-form-item>
                        <el-form-item label="到货日期:" style="width: 30%;position: relative;left: 0%">
                            <el-input v-model="this.MOPIndentData.deliveryDate" placeholder="暂无数据" style="width: 100%"
                                      disabled="false"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <span style="font-weight: bold">单据明细信息</span>
            <div>
                <el-table
                        :data="MOPIndentDtData"
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
                <el-button type="primary" @click="saveMOPIndent()">确定保存</el-button>
            </span>
            </div>
        </el-dialog>


    </div>
</template>

<script>
    import * as API from '../../../api/index';

    export default {
        inject: ['reload'],
        data() {
            return {
                MOPIndentPage: [],
                MOPIndentData: {
                    companyCode: ''
                },
                MOPIndentDtData: [],
                companyList: [],
                pageTotal: 0,
                addMOPIndentVisible: false,
                previewVisible: false,
                page: 1,
                size: 10,
                indentValidateForm: {
                    orderNo: '',
                    companyCode: ''
                },
                company: {
                    companyName: '',
                    companyCode: '',
                    mopDeptCode: '',
                    mopDeptName: '',
                    customerCode: '',
                    customerName: '',
                    xunsoftDeptCode: '',
                    xunsoftDeptName: ''
                },
                query: {
                    orderNo: '',
                    companyName: '',
                    companyCode: ''
                },
                saveParam: {
                    orderNo: '',
                    companyCode: ''
                },
                expands: [],
                getRowKeys(row) {
                    return row.docNum;
                }
            };
        },
        created() {
            this.getMOPIndentPage();
            this.getMOPIndentDtData();
            this.getSelectCompanyListData();
        },


        methods: {
            getMOPIndentPage: function() {
                debugger;
                console.log(this.query);
                API.page_MOPIndent(this.page, this.size, this.query).then(res => {
                    this.MOPIndentPage = res.body.records;
                    this.pageTotal = res.body.total;
                });
            },
            getMOPIndentDtData: function() {

            },
            handleSearch: function() {
                this.getMOPIndentPage();
            },
            handlePageChange: function(val) {
                this.page = val;

                this.getMOPIndentPage();
            }, handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size = val;
                this.MOPIndentPage();
            },
            addMOPIndent: function() {
                this.addMOPIndentVisible = true;
            },
            /*获取预览订货单信息*/
            preview: function(formName) {
                debugger;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        debugger;
                        this.saveParam.orderNo = this.indentValidateForm.orderNo;
                        this.saveParam.companyCode = this.indentValidateForm.companyCode;
                        API.downloadMOPIndent(this.saveParam).then(res => {
                            debugger;
                            this.MOPIndentData = res.body;
                            if (res.body.code != -1) {
                                this.MOPIndentDtData = res.body.lines;
                                this.previewVisible = true;
                            } else {
                                debugger
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
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            getSelectCompanyListData: function() {
                debugger
                console.log(this.companyAO);
                API.list_CompanyDict(this.companyAO).then(res => {
                    debugger
                    this.companyList = res.body;
                });
            },
            saveMOPIndent() {
                let params = {
                    companyCode: '',
                    companyName: '',
                    orderNo: '',
                    deliveryDate: '',
                    orderType: '',
                    orderTypeName: '',
                    payStatusName: '',
                    orderStatus: '',
                    orderStatusName: '',
                    createDate: '',
                    createName: '',
                    lines: [],
                    isRetransmit: false,
                    isCompulsorySubmission: false
                };
                let username = localStorage.getItem('ms_username');
                params.companyCode = this.indentValidateForm.companyCode;
                params.companyName = this.MOPIndentData.companyName;
                params.orderNo = this.MOPIndentData.orderNo;
                params.deliveryDate = this.MOPIndentData.deliveryDate;
                params.orderType = this.MOPIndentData.orderType;
                params.orderTypeName = this.MOPIndentData.orderTypeName;
                params.payStatusName = this.MOPIndentData.payStatusName;
                params.orderStatus = this.MOPIndentData.orderStatus;
                params.orderStatusName = this.MOPIndentData.orderStatusName;
                params.createDate = this.MOPIndentData.createDate;
                params.createName = this.MOPIndentData.createName;
                params.newCreateName = username;
                params.lines = this.MOPIndentData.lines;
                params.isRetransmit = false;
                params.isCompulsorySubmission = false;
                /*查询订单下载表信息是否存在*/
                debugger;
                API.getMOPIndentByOrder(params).then(res => {
                    debugger;
                    if (res.body.length > 0) {
                        /*本地存在已下载订单信息*/
                        this.opens(params);
                    } else {
                        API.MOPIndent_Save(params).then(res => {
                            debugger;
                            if (res.body.body.resultInt == 0) {
                                debugger
                                this.$message({
                                    message: res.body.body.resultString+"!",
                                    type: 'success'
                                });
                            }
                            this.reload();
                            this.addMOPIndentVisible = false;
                            this.previewVisible = false;
                        });
                    }
                });
            },
            MopIndentDtView(companyCode,docNum){
                debugger
                let MOPIndentParams={
                    companyCode: companyCode,
                    docNum: docNum
                }
                this.$router.push({path:'MopIndentDt',query:{MOPIndentParams:MOPIndentParams}});
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
                    API.MOPIndent_Save(params).then(res => {
                        debugger;
                        if (res.body.body.resultInt == 2 || res.body.body.resultInt == 0) {
                            debugger;
                            this.$message({
                                type: 'success',
                                message: res.body.body.resultString
                            });

                        }else{
                            this.$message({
                                type: 'error',
                                message: res.body.body.resultString
                            });
                        }
                        this.reload();
                        this.addMOPIndentVisible = false;
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
        font-size: 13px;
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

    /*行详情*/
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
