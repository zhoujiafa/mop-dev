<template>
    <div>
        <div class="container">
            <div class="handle-box">

                <el-input v-model="query.companyCode" clearable placeholder="门店编码" class="handle-input mr10"></el-input>
                <el-input v-model="query.companyName" clearable placeholder="门店名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="success" icon="el-icon-plus" @click="addCompany">新增</el-button>
                <!--<el-upload
                        class="upload-demo"
                        action="http://localhost:8082/companydict/import"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        multiple
                        :limit="1"
                        :on-exceed="handleExceed"
                        :file-list="fileList">
                    <el-button icon="el-icon-download" size="small" type="success">Excel导入</el-button>
                    &lt;!&ndash;<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>&ndash;&gt;
                </el-upload>-->

            </div>
            <el-table
                    :data="companyList"
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
                        prop="companyCode"
                        label="门店编码"
                        width="100">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="companyName"
                        label="门店名称"
                        width="220">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="mopDeptCode"
                        label="经销商编码"
                        width="100">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="mopDeptName"
                        label="经销商名称"
                        width="200">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="customerName"
                        label="代理商名称"
                        v-if="customerName"
                        width="150">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="xunsoftDeptCode"
                        label="部门编码"
                        width="100">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="xunsoftDeptName"
                        label="部门名称"
                        width="167">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="customerCode"
                        label="代理商编码"
                        width="100">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="代理商名称"
                        width="200">
                    <template slot-scope="scope">
                    <el-select
                            v-model="scope.row.customerCode"  filterable placeholder="请选择"
                            @change="changeAsso(scope.row.id,scope.row.customerCode)">
                        <el-option
                                v-for="item in assList"
                                :key="item.customerCode"
                                :label="item.customerName"
                                :value="item.customerCode">
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

        <!-- 新增弹出框 -->
        <el-dialog title="新增门店信息" :visible.sync="addCompanyVisible" width="60%">
            <el-form label-width="100px">
                <div style="position: relative; left: 10%;top:20px ">
                    <el-form-item label="门店名:">
                        <el-select v-model="companyAO.companyName" filterable  placeholder="请选择公司">
                            <el-option
                                    v-for="item in allCompanyList"
                                    :key="item.companyCode"
                                    :label="item.companyName"
                                    :value="item.companyCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="门店部门:">
                        <el-select v-model="companyAO.mopDeptCode" placeholder="请选择部门">
                            <el-option key="1" label="广东分公司" value="DR00054"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div style="position: relative; left: 50%;top:-80px ">
                    <el-form-item label="代理商:">
                        <el-select v-model="companyAO.customerCode" filterable placeholder="请选择代理商">
                            <el-option key="1" label="北京戴芝蒂代理商" value="DLS11D"></el-option>
                            <el-option key="2" label="广西分公司" value="0325"></el-option>
                            <el-option key="3" label="广宁分公司" value="0326"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="代理商部门:">
                        <el-select v-model="companyAO.xunsoftDeptCode" placeholder="请选择代理商部门">
                            <el-option key="1" label="北京代理/加盟商" value="040211"></el-option>
                        </el-select>
                    </el-form-item>
                </div>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="saveCompany" type="primary">确定保存</el-button>
                <el-button @click="addCompanyVisible = false">取 消</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import * as API from '../../../api/index';
    import Upload from 'element-ui/packages/upload/src/upload';

    export default {
        name: 'brand',
        components: { Upload },
        data() {
            return {
                customerCode:'',
                assList: [],
                companyList: [],
                allCompanyList:[],
                addCompanyVisible:false,
                pageTotal: 100,
                page: 1,
                size: 10,
                query: {
                    companyCode: '',
                    companyName: ''
                },
                companyAO:{
                    companyName:'',
                    companyCode:'',
                    mopDeptCode:'',
                    mopDeptName:'',
                    customerCode:'',
                    customerName:'',
                    xunsoftDeptCode:'',
                    xunsoftDeptName:'',
                },
            };
        },
        created() {
            this.getData();
            this.getAssoListData();
            this.getSelectCompanyListData();
        },
        methods: {
            // 获取数据
            getData: function() {
                debugger
                console.log(this.query);
                API.page_CompanyDict(this.page, this.size, this.query).then(res => {
                    //debugger
                    this.companyList = res.body.records;
                    this.pageTotal = res.body.total;
                });
            },
            getSelectCompanyListData: function() {

                console.log(this.companyAO);
                API.list_CompanyDict(this.companyAO).then(res => {
                    debugger
                    this.allCompanyList=res.body;
                });
            },
            getAssoListData: function() {
                API.asso_list().then(res => {
                     //debugger
                    this.assList = res;
                });
            },
            saveCompany: function(){
                console.log(this.companyAO);
                API.company_localInfo(this.companyAO).then(res => {
                    debugger
                    if(res.body.length>0){
                        this.$message.error('该门店已存在，请勿重复录入');
                    }else{
                        API.dcompany_Save(params).then(res => {
                            this.$message({
                                message: '恭喜你，这是一条成功消息',
                                type: 'success'
                            });
                        });
                    }
                });
            },

            handleEdit: function() {

            },
            handleSearch: function() {
                this.getData();
            },
            addCompany: function() {
                this.addCompanyVisible = true;
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
            changeAsso(id,customerValue) {
                //debugger
                console.log('当前行id的值为：' + id);
                console.log('下拉框选中的值为：' + customerValue);
                this.opens();
                let params = {
                    companyDictID: 0,
                    customerCode: ''
                };
                params.companyDictID = id;
                params.customerCode = customerValue;
                console.log(params);

                API.comp_update(params).then(res => {
                });
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，请勿重复选择！`);
                /*this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);*/
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
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


