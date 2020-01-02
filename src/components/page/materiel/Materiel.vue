<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.skuBarcode" placeholder="SKU编码" class="handle-input mr10" style="width: 200px"></el-input>
                <el-input v-model="query.itemCode" placeholder="商品编码" class="handle-input mr10" style="width: 200px"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <!--<el-button type="primary" icon="el-icon-circle-check" @click="saveData" class="handle-input mr10">保存
                </el-button>-->
            </div>
            <el-table
                    :data="goodsDictList"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <!--<el-table-column prop="companyCode" label="code"></el-table-column>
                <el-table-column prop="companyName" label="Name"></el-table-column>-->
                <el-table-column
                        align="center"
                        prop="id"
                        label="ID"
                        width="50"
                        v-if="ID">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="skuBarcode"
                        label="SKU编码"
                        width="200">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="itemCode"
                        label="商品编码"
                        width="200">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="specName"
                        label="规格名称"
                        width="200">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="price"
                        label="价格"
                        width="187">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="barName"
                        label="条码名称"
                        width="200">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="barName"
                        label="条码名称"
                        v-if="barName"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="barCode"
                        align="center"
                        label="条码"
                        width="200">
                    <template slot-scope="scope">
                        <el-select
                                v-model="scope.row.barCode"  filterable placeholder="请选择"
                                @change="changeGoodsDivision(scope.row.id,scope.row.barCode)">
                            <el-option
                                    v-for="item in goodsDivisionList"
                                    :key="item.barCode"
                                    :label="item.barCode"
                                    :value="item.barCode">
                            </el-option>
                        </el-select>

                    </template>
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

    </div>
</template>

<script>
    import * as API from '../../../api/index';

    export default {
        inject: ['reload'],
        name: 'brand',
        data() {
            return {
                barCodes:'',
                goodsDivisionList: [],
                goodsDictList: [],
                pageTotal: 100,
                page: 1,
                size: 10,
                query: {
                    skuBarcode: '',
                    itemCode: ''
                },
            };
        },
        created() {
            this.getData();
            this.getGoodsListData();
        },
        methods: {
            // 获取数据
            getData: function() {
                console.log(this.query);
                API.page_GoodsDict(this.page, this.size, this.query).then(res => {
                    //debugger
                    this.goodsDictList = res.body.records;
                    this.pageTotal = res.body.total;
                });
            },
            getGoodsListData: function() {
                API.goodsDivision_list().then(res => {
                    //debugger
                    this.goodsDivisionList = res;
                });
            },

            handleEdit: function() {

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
            handleSelectionChange(val) {
                // this.multipleSelection = val;
                // console.log(val);
            },

            changeGoodsDivision(id,barCode) {
                debugger
                console.log('当前行id的值为：' + id);
                console.log('下拉框选中的值为：' + barCode);
                this.$confirm('此操作将进行更新, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    debugger
                    let params = {
                        goodsDictID: 0,
                        barCode: ''
                    };
                    params.goodsDictID = id;
                    params.barCode = barCode;
                    console.log(params);
                    debugger
                    API.goodsDict_update(params).then(res => {
                        if(res.body != null){
                            this.$message({
                                type: 'success',
                                message: '更新成功!'
                            });
                            this.reload();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'cancel',
                        message: '已取消操作'
                    });
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
        width: 300px;
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
</style>
