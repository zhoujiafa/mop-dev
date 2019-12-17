<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.companyCode" placeholder="公司编码" class="handle-input mr10"></el-input>
                <el-input v-model="query.needOrderNo" placeholder="要货单号" class="handle-input mr10"></el-input>
                <!--<el-date-picker class="mr10"
                                v-model="value1"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>-->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="warning" icon="el-icon-delete" @click="handleSearch">重置</el-button>
                <el-button type="success" icon="el-icon-plus" @click="addMOPNeedOrder">新增</el-button>
                <!--<el-button type="info" icon="el-icon-download" @click="delAllSelection">导出</el-button>-->
            </div>

            <el-table
                    :data="dataLineList"
                    border
                    class="table"
                    header-cell-class-name="table-header">
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
                        width="100">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="companyName"
                        label="公司名称"
                        width="220">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="docNum"
                        label="要货单号"
                        width="137">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="ntypeCode"
                        label="单据类型编码"
                        width="150">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="ntypeName"
                        label="单据类型名称"
                        width="150">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="createName"
                        label="单据创建人"
                        width="100">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="needStatus"
                        label="单据状态"
                        width="120">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="createDate"
                        label="创建日期"
                        width="180">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="到货日期"
                        prop="needDate"
                        width="180">
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
        <el-dialog title="新增信息" :visible.sync="addMOPNeedOrderVisible" width="30%">
            <el-form label-width="100px">
                <el-form-item label="门店名称:">
                    <el-select v-model="dataLineQuery.companyCode" placeholder="请选择公司">
                        <el-option key="1" label="广东分公司" value="0324"></el-option>
                        <el-option key="2" label="广西分公司" value="0325"></el-option>
                        <el-option key="3" label="广宁分公司" value="0326"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="要货单号:">
                    <el-input v-model="dataLineQuery.needOrderNo"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="preview()" type="primary">查询预览</el-button>
                <el-button @click="addMOPNeedOrderVisible = false">取 消</el-button>
            </span>
        </el-dialog>


        <!-- 预览弹出框 -->
        <el-dialog title="预览信息" :visible.sync="previewVisible" width="90%">
            <div>
                <el-table
                        :data="dataLine"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                >
                    <el-table-column
                            align="center"
                            prop="companyCode"
                            label="门店编码"
                            width="105">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="companyName"
                            label="门店名称"
                            width="220">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="needNo"
                            label="要货单号"
                            width="137">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="ntypeCode"
                            label="单据类型编码"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="ntypeName"
                            label="单据类型名称"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="createName"
                            label="单据创建人"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="needStatus"
                            label="单据状态"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="createDate"
                            label="创建日期"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="到货日期"
                            prop="needDate"
                            width="180">
                    </el-table-column>
                </el-table>
            </div>
            <span>单据子项</span>
            <div>
                <el-table
                        :data="dataLineItem"
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
                            label="商品当前单位数量"
                            prop="itemQuantity">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="规格说明"
                            prop="specCode">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="SKU编码"
                            prop="skuBarcode">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="调拔数量"
                            prop="allocationQuantity">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="商品规格名称"
                            prop="specName">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="商品基本单位"
                            prop="">
                    </el-table-column>
                </el-table>

                <span slot="footer" class="dialog-footer">
                <el-button @click=" previewVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDataLine()">确定保存</el-button>
            </span>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import * as API from '../../../api';

    export default {

        name: 'SmsProvider',
        data() {
            return {
                companyList: [],
                dataLine: [],
                dataLineItem: [],
                dataLineList: [],
                addMOPNeedOrderVisible: false,
                previewVisible: false,
                pageTotal: 0,
                page: 1,
                size: 10,
                query: {
                    needOrderNo: '',
                    companyCode: ''
                },
                dataLineQuery: {
                    needOrderNo: '',
                    companyCode: ''
                }
            };
        },
        created() {
            this.getData();
            //this.preview();
        },
        methods: {
            getData: function() {
                console.log(this.query);
                API.page_DataLine(this.page, this.size, this.query).then(res => {
                    debugger;
                    this.dataLineList = res.body.records;
                    this.pageTotal = res.body.total;
                });
            },
            addMOPNeedOrder: function() {
                this.addMOPNeedOrderVisible = true;
            },
            preview: function() {
                API.dataLine_Info(this.dataLineQuery).then(res => {
                    debugger;
                    this.dataLine = res.body;
                    this.dataLineItem =res.body[0].lines;

                });
                this.previewVisible = true;
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
            opens: function() {
                let params = {
                    needStatusName:'',
                    needNo:'',
                    needDate:'',
                    ntypeCode:'',
                    ntypeName:'',
                    companyName:'',
                    companyCode:'',
                    remark:'',
                    createName:'',
                    needStatus:'',
                    createDate:'',
                    lines:null,
                };
                params.needStatusName = this.dataLine[0].needStatusName;
                params.needNo = this.dataLine[0].needNo;
                params.needDate = this.dataLine[0].needDate;
                params.ntypeCode = this.dataLine[0].ntypeCode;
                params.ntypeName = this.dataLine[0].ntypeName;
                params.companyName = this.dataLine[0].companyName;
                params.companyCode = this.dataLine[0].companyCode;
                params.remark = this.dataLine[0].remark;
                params.createName = this.dataLine[0].createName;
                params.needStatus = this.dataLine[0].needStatus;
                params.createDate = this.dataLine[0].createDate;
                params.lines = this.dataLine[0].lines;
                this.$confirm('检测到已存在的单据信息，是否强制保存修改？', '确认信息', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确认保存',
                    cancelButtonText: '放弃修改'
                })
                    .then(() => {
                        API.dataLine_Save(params).then(res => {
                        });
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });
                    })
                    .catch(action => {
                        this.$message({
                            type: 'info',
                            message: action === 'cancel'
                                ? '放弃保存并离开页面'
                                : '停留在当前页面'
                        })
                    });
            },

            saveDataLine() {
                let params = {
                    needStatusName:'',
                    needNo:'',
                    needDate:'',
                    ntypeCode:'',
                    ntypeName:'',
                    companyName:'',
                    companyCode:'',
                    remark:'',
                    createName:'',
                    needStatus:'',
                    createDate:'',
                    lines:null,
                };
                params.needStatusName = this.dataLine[0].needStatusName;
                params.needNo = this.dataLine[0].needNo;
                params.needDate = this.dataLine[0].needDate;
                params.ntypeCode = this.dataLine[0].ntypeCode;
                params.ntypeName = this.dataLine[0].ntypeName;
                params.companyName = this.dataLine[0].companyName;
                params.companyCode = this.dataLine[0].companyCode;
                params.remark = this.dataLine[0].remark;
                params.createName = this.dataLine[0].createName;
                params.needStatus = this.dataLine[0].needStatus;
                params.createDate = this.dataLine[0].createDate;
                params.lines = this.dataLine[0].lines;
                API.needOrder_localInfo(this.dataLineQuery).then(res => {
                    debugger
                    if(res.body.length>0){
                        /*this.dataLine = res.body;
                        if(res.body[0].lines.length>0){
                            this.dataLineItem =res.body[0].lines;
                        }*/
                        this.opens();
                    }else{
                        API.dataLine_Save(params).then(res => {
                            this.$message({
                                message: '恭喜你，这是一条成功消息',
                                type: 'success'
                            });
                        });
                    }
                });

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
