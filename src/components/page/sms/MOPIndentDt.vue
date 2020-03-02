<template>
    <div>
        <div style="padding-bottom: 20px">
            <span style="font-weight: bold;font-size: 150%;position: relative;left: 45%">订单详情</span>
            <el-form :inline="true" class="demo-form-inline" style="padding-top: 20px">
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
        <span style="font-weight: bold;position: relative;top: -15px;left: 45%">单据明细信息</span>

        <div class="container">
            <div class="handle-box">
                <el-input v-model="MOPIndentDtQuery.itemName" placeholder="商品名称" class="handle-input mr10"
                          style="width: 200px"></el-input>
                <el-input v-model="MOPIndentDtQuery.skuBarcode" placeholder="SUK码" class="handle-input mr10"
                          style="width: 200px"></el-input>
                <el-date-picker class="mr10"
                                v-model="value1"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="SearchMopIndentDt">搜索</el-button>
                <el-button type="warning" icon="el-icon-delete" @click="handleSearch">重置</el-button>
                <el-button type="success" icon="el-icon-plus" @click="addMch">新增</el-button>
                <el-button type="info" icon="el-icon-download" @click="delAllSelection">导出</el-button>
            </div>
            <el-table
                    :data="MOPIndentDtData"
                    border
                    stripe
                    header-cell-class-name="table-header"
                    class="table"

                    row-key="docNum"
                    :row-key="getRowKeys"
                    :expand-row-keys="expands"
                    @current-change="toggleRowExpansion"
            >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="商品名称:">
                                <span>{{props.row.itemName}}</span>
                            </el-form-item>
                            <el-form-item label="商品编码:">
                                <span>{{props.row.itemCode}}</span>
                            </el-form-item>
                            <el-form-item label="SKU编码:">
                                <span>{{ props.row.skuBarcode}}</span>
                            </el-form-item>
                            <el-form-item label="规格名称:">
                                <span>{{props.row.specName}}</span>
                            </el-form-item>
                            <el-form-item label="数量:">
                                <span>{{props.row.itemQuantity}}</span>
                            </el-form-item>

                            <el-form-item label="订货价:">
                                <span>{{ props.row.listPrice}}</span>
                            </el-form-item>
                            <el-form-item label="商品总额:">
                                <span>{{props.row.lineTotal}}</span>
                            </el-form-item>
                            <el-form-item label="实付单价:">
                                <span>{{props.row.realPrice}}</span>
                            </el-form-item>
                            <el-form-item label="实付总额:">
                                <span>{{props.row.realPriceLineTotal}}</span>
                            </el-form-item>
                            <el-form-item label="优惠金额:">
                                <span>{{ props.row.promotionMoney}}</span>
                            </el-form-item>
                            <el-form-item label="运费:">
                                <span>{{ props.row.totalExpressFee}}</span>
                            </el-form-item>
                            <el-form-item label="单位:">
                                <span>{{ props.row.unit }}</span>
                            </el-form-item>
                        </el-form>
                        <el-button-group style="position: relative;left: 95%">
                            <el-tooltip content="编辑" placement="top">
                                <el-button type="primary" icon="el-icon-edit" circle></el-button>
                            </el-tooltip>
                            <el-tooltip content="详情" placement="top">
                                <el-button type="primary" icon="el-icon-s-data" circle
                                           @click="MopIndentDtView(props.row.companyCode,props.row.docNum)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top">
                                <el-button type="primary" icon="el-icon-delete" circle></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
                <el-table-column
                        width="350%"
                        align="center"
                        label="商品名称"
                        prop="itemName">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="商品编码"
                        prop="itemCode"
                        v-if="itemCode">
                </el-table-column>

                <el-table-column
                        align="center"
                        label="规格名称"
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
                        label="实付单价"
                        prop="realPrice">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="商品总额"
                        prop="lineTotal">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="实付总额"
                        prop="realPriceLineTotal">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="数量"
                        prop="itemQuantity">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="优惠金额"
                        prop="promotionMoney"
                        v-if="promotionMoney">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="运费"
                        prop="totalExpressFee"
                        v-if="totalExpressFee">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="单位"
                        prop="unit"
                        v-if="unit">
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
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import * as API from '../../../api';

    export default {
        name: 'MOPIndentDt',
        data() {
            return {
                MOPIndentData: {},
                MOPIndentDtData: [],
                query: {
                    name: ''
                },
                MOPIndentDtQuery: {
                    itemName: '',
                    skuBarcode: ''
                },
                multipleSelection: [],
                delList: [],
                addMchVisible: false,
                editMchVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                expands: [],
                getRowKeys(row) {
                    return row.docNum;
                }
            };

        },
        created() {
            this.getMOPIndentData();
        },
        methods: {
            getMOPIndentData: function() {
                debugger;
                /* query和params区别
                query类似 get, 跳转之后页面 url后面会拼接参数,类似?id=1, 非重要性的可以这样传, 密码之类还是用params刷新页面id还在
                params类似 post, 跳转之后页面 url后面不会拼接参数 , 但是刷新页面id 会消失 */
                API.getMOPIndentByDocNum(this.$route.query.MOPIndentParams).then(res => {
                    debugger;
                    this.MOPIndentData = res.body;
                    if (res.body.code != -1) {
                        this.MOPIndentDtData = res.body.lines;
                        this.pageTotal = res.body.total;
                    } else {
                        debugger;
                        this.$message({
                            type: 'info',
                            message: res.body.message
                        });
                    }
                });
            },
            SearchMopIndentDt: function() {
                API.page_MOPIndentDt(MOPIndentDtQuery).then(res => {
                    if (res.body.code != -1) {
                        this.MOPIndentDtData = res.body;
                    } else {
                        this.$message({
                            type: 'info',
                            message: res.body.message
                        });
                    }
                });
            },
            addMch: function() {
                this.addMchVisible = true;
            },
            handleEdit: function() {
                this.editMchVisible = true;
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
