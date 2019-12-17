<template>
    <div class="container">
        <div class="handle-box">
            <el-input v-model="query.companyName" clearable placeholder="门店名称" class="handle-input mr10"></el-input>
            <el-input v-model="query.orderNo" clearable placeholder="订货单号" class="handle-input mr10"></el-input>
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
            <el-button type="success" icon="el-icon-plus" @click="addMOPIndent">新增</el-button>
            <!--<el-button type="info" icon="el-icon-download" @click="delAllSelection">导出</el-button>-->
        </div>
        <div>
            <el-table
                    :data="indentData"
                    style="width: 100%;margin-bottom: 20px;"
                    row-key="id"
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
                            <el-form-item label="订单号码:">
                                <span>{{ props.row.docNum}}</span>
                            </el-form-item>
                            <el-form-item label="门店编码:">
                                <span>{{props.row.companyCode}}</span>
                            </el-form-item>
                            <el-form-item label="订单状态:">
                                <span>{{props.row.orderStatus}}</span>
                            </el-form-item>
                            <el-form-item label="创建日期:">
                                <span>{{ props.row.createDate}}</span>
                            </el-form-item>
                            <el-form-item label="创建人:">
                                <span>{{ props.row.createName}}</span>
                            </el-form-item>
                            <el-form-item label="下载标识:">
                                <span>{{ props.row.downLoadMark}}</span>
                            </el-form-item>
                            <el-form-item label="上传标识:">
                                <span>{{ props.row.upLoadMark }}</span>
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
                            <el-form-item label="备注:">
                                <span>{{ props.row.remark }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="companyName"
                        label="门店名称"
                        sortable
                        align="center"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="docNum"
                        label="订货单号"
                        sortable
                        align="center"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="cardName"
                        label="代理商"
                        align="center"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="orderStatusName"
                        label="订单状态"
                        align="center"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="orderStatus"
                        label="订单状态"
                        align="center"
                        v-if="orderStatus"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建日期"
                        align="center"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="createName"
                        label="创建人"
                        align="center"
                        width="160">
                </el-table-column>

                <el-table-column
                        prop="deliveryDate"
                        label="到货日期"
                        sortable
                        align="center"
                        width="187">
                </el-table-column>
                <!--<el-table-column
                        prop="orderNo"
                        label="单据状态名称"
                        align="center"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="orderNo"
                        label="单据创建时间"
                        align="center"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="orderNo"
                        label="单据创建人"
                        align="center"
                        width="100">
                </el-table-column>-->

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
                    <el-select v-model="saveParam.orderNo" v-model.trim="indentValidateForm.companyCode" placeholder="请选择公司">
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
                    <el-input v-model="saveParam.orderNo"  clearable v-model.trim="indentValidateForm.orderNo" autocomplete="off" type="orderNo"></el-input>
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
                <el-table
                        :data="MOPIndentData"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                >
                    <el-table-column
                            align="center"
                            prop="companyCode"
                            label="公司编码"
                            width="105">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="companyName"
                            label="公司名称"
                            width="220">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="orderNo"
                            label="订货单号"
                            width="230">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="orderType"
                            label="单据类型编码"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="orderTypeName"
                            label="单据类型名称"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="payStatusName"
                            label="付款名称"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="orderStatus"
                            label="付款状态"
                            v-if="orderStatus"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="createDate"
                            label="创建日期"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="createName"
                            label="单据创建人"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="到货日期"
                            prop="deliveryDate"
                            width="180">
                    </el-table-column>
                </el-table>
            </div>
            <span>单据子项</span>
            <div>
                <el-table
                        :data="MOPIndentDtData"
                        border
                        header-cell-class-name="table-header"
                        class="table">
                    <el-table-column
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
                            label="商品当前单位数量"
                            prop="itemQuantity">
                    </el-table-column>
                    <!--<el-table-column
                            align="center"
                            label="商品当前单位"
                            prop="itemUnit">
                    </el-table-column>-->
                    <el-table-column
                            align="center"
                            label="商品规格名称"
                            prop="specName">
                    </el-table-column>
                    <el-table-column
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
                            label="商品规格名称"
                            prop="specName">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="商品基本单位"
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
        inject:["reload"],
        data() {
            return {
                indentData: [],
                indentDtData: [],
                MOPIndentData: [],
                MOPIndentDtData: [],
                companyList: [],
                pageTotal: 0,
                addMOPIndentVisible: false,
                previewVisible: false,
                page: 1,
                size: 10,
                indentValidateForm:{
                    orderNo:'',
                    companyCode:''
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
                    return row.id;
                },
            };
        },
        created() {
            this.getIndentData();
            this.getindentDtData();
            this.getMOPIndentData();
            this.getMOPIndentDtData();
            this.getSelectCompanyListData();
        },


        methods: {
            getIndentData: function() {
                debugger
                console.log(this.query);
                API.page_Indent(this.page, this.size, this.query).then(res => {
                    this.indentData = res.body.records;
                    this.pageTotal = res.body.total;
                });
            },
            getindentDtData: function() {

            },
            getMOPIndentData: function() {

            },
            getMOPIndentDtData: function() {

            },
            handleSearch: function() {
                this.getIndentData();
            },
            handlePageChange: function(val) {
                this.page = val;

                this.getIndentData();
            }, handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size = val;
                this.indentData();
            },
            addMOPIndent: function() {
                this.addMOPIndentVisible = true;
            },
            /*获取预览订货单信息*/
            preview: function(formName) {
                debugger
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //alert('submit!');
                        debugger
                        this.saveParam.orderNo=this.indentValidateForm.orderNo;
                        this.saveParam.companyCode=this.indentValidateForm.companyCode;
                        API.getMOPIndent(this.saveParam).then(res => {
                            debugger
                            this.MOPIndentData = res.body;
                            if(res.body!=null){
                                this.MOPIndentDtData = res.body[0].lines;
                            }else{
                                this.MOPIndentDtData = null;
                            }

                        });

                        this.previewVisible = true;
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
                console.log(this.companyAO);
                API.list_CompanyDict(this.companyAO).then(res => {

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
                debugger;
                let username = localStorage.getItem('ms_username');
                params.companyCode = this.indentValidateForm.companyCode;
                params.companyName = this.MOPIndentData[0].companyName;
                params.orderNo = this.MOPIndentData[0].orderNo;
                params.deliveryDate = this.MOPIndentData[0].deliveryDate;
                params.orderType = this.MOPIndentData[0].orderType;
                params.orderTypeName = this.MOPIndentData[0].orderTypeName;
                params.payStatusName = this.MOPIndentData[0].payStatusName;
                params.orderStatus = this.MOPIndentData[0].orderStatus;
                params.orderStatusName = this.MOPIndentData[0].orderStatusName;
                params.createDate = this.MOPIndentData[0].createDate;
                params.createName = this.MOPIndentData[0].createName;
                params.newCreateName = username;
                params.lines = this.MOPIndentData[0].lines;
                params.isRetransmit=false;
                params.isCompulsorySubmission= false;
                debugger;
                API.indent_localInfo(params).then(res => {
                    debugger;
                    if (res.body.length > 0) {
                        this.opens(params);
                    } else {
                        API.moIndent_Save(params).then(res => {
                            debugger;
                            if (res.body !=null) {
                                this.$message({
                                    message: '录入成功！',
                                    type: 'success'
                                });
                            }
                            debugger;
                            this.reload();
                            this.addMOPIndentVisible = false;
                            this.previewVisible = false;
                        });
                    }
                });
            },
            opens: function(params) {
                this.$confirm('该订单已存在，是否重复提交？', '确认信息', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确认保存',
                    cancelButtonText: '放弃修改',
                    type: 'warning'
                }).then(() => {
                        debugger
                        params.isRetransmit=true;
                        API.moIndent_Save(params).then(res => {
                            debugger
                            if(res.resultInt==0){
                                this.$message({
                                    type: 'success',
                                    message: '保存成功'
                                });
                            }else if(res.resultInt==1){
                                this.$confirm(res.resultInt+', 是否强制提交信息?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    params.isRetransmit=true;
                                    /*params.isCompulsorySubmission=true;*/
                                    API.moIndent_Save(params).then(res => {
                                        if(res.resultInt==2){
                                            this.$message({
                                                type: 'success',
                                                message: '提交成功!,'+res.resultString
                                            });
                                        }
                                    });
                                }).catch(() => {
                                    this.$message({
                                        type: 'info',
                                        message: '已取消提交'
                                    });
                                });
                            }else if(res.resultInt==2){
                                this.$message({
                                    type: 'success',
                                    message: res.resultString
                                });
                            }else if(res.resultInt==3){
                                this.$message.error(res.resultString);
                            }else if(res.resultInt==4){
                                this.$message.error(res.resultString);
                            }
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
            toggleRowExpansion(row){
                this.expands = [];
                this.expands.push(row.id);
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
