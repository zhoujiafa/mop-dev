<template>
    <div class="container">
        <div class="handle-box">
            <el-input v-model="query.orderNo" clearable placeholder="订单号" class="handle-input mr10"
                      style="width: 200px"></el-input>
            <el-input v-model="query.companyCode" clearable placeholder="门店编号" class="handle-input mr10"
                      style="width: 200px"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            <!--<el-button type="primary" icon="el-icon-download" @click="exportRecords">导出</el-button>-->


            <download-excel
                    class="export-excel-wrapper"
                    :data="json_data"
                    :fields="json_fields"
                    name="出货单明细记录.xls">
                <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
                <el-button type="primary" size="small" style="position: absolute;left: 550px;top: 71px">导出EXCEL
                </el-button>
            </download-excel>
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
                <el-table-column
                        prop="designNumber"
                        label="商品编码"
                        sortable
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="skuBarcode"
                        label="SKU码"
                        sortable
                        align="center">
                </el-table-column>

                <el-table-column
                        prop="docNum"
                        label="唯一码"
                        sortable
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

        <span slot="footer" class="dialog-footer">
                <el-button @click=" previewVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveMOPIndent()">确定保存</el-button>
            </span>
    </div>


</template>

<script>
    import * as API from '../../../api/index';
    import Eject from '../../../components/page/eject/ecjevt';

    export default {
        name: 'demo',
        components: {
            Eject
        },
        inject: ['reload'],
        data() {
            return {

                MOPIndentPage: [],
                addMOPIndentVisible: false,
                previewVisible: false,
                pageTotal: 10,
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
                    companyCode: ''
                },
                expands: [],
                getRowKeys(row) {
                    return row.docNum;
                },
                json_fields: {
                    '商品编码': 'designNumber',    //常规字段
                    'SKU码': 'skuBarcode', //支持嵌套属性
                    '唯一码': 'docNum' //支持嵌套属性
                },
                json_data: [],
                json_meta: [
                    [
                        {
                            ' key ': ' charset ',
                            ' value ': ' utf- 8 '
                        }
                    ]
                ],
                showa:false,
                showc:false,
                msg:""
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

                if (this.query.companyCode == null || this.query.orderNo == null) {
                    console.log(this.query.companyCode);
                }

                API.newRetail_searchOrder(this.query).then(res => {
                    debugger
                    this.MOPIndentPage = res;
                    this.json_data = res;
                    this.pageTotal = res.length;
                });
            },
            getMOPIndentDtData: function() {

            },
            /*顶部搜索查询*/
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

            MopIndentDtView(companyCode, docNum) {
                debugger
                let MOPIndentParams = {
                    companyCode: companyCode,
                    docNum: docNum
                };
                this.$router.push({ path: 'MopIndentDt', query: { MOPIndentParams: MOPIndentParams } });
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

                        } else {
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
            },

            alerts(){
                this.showa=true;
            },
            confirms(){
                this.showc=true;
                this.msg="这是一个对话的弹窗";
            },
            okfall(){
                this.showa=false;
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
