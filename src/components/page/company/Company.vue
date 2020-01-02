<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.companyCode" clearable placeholder="门店编码" class="handle-input mr10"
                          style="width: 200px"></el-input>
                <el-input v-model="query.companyName" clearable placeholder="门店名称" class="handle-input mr10"
                          style="width: 200px"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="success" icon="el-icon-plus" @click="addCompany">新增门店</el-button>
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
                        v-if="ID">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="companyCode"
                        label="门店编码">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="companyName"
                        label="门店名称"
                        width="300">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="mopDeptCode"
                        v-if="mopDeptCode"
                        label="经销商编码">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="mopDeptName"
                        label="经销商名称">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="customerName"
                        label="代理商名称"
                        v-if="customerName">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="xunsoftDeptCode"
                        v-if="xunsoftDeptCode"
                        label="部门编码">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="xunsoftDeptName"
                        label="部门名称">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="customerCode"
                        v-if="customerCode"
                        label="代理商编码">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="代理商名称">
                    <template slot-scope="scope">
                        <el-select
                                v-model="scope.row.customerCode" filterable placeholder="请选择"
                                :model="indentValidateForm"
                                @change="changeAsso(scope.row.id,scope.row.customerCode,scope.row.companyName)">
                            <el-option
                                    v-for="item in assList"
                                    :key="item.customerCode"
                                    :label="item.customerName"
                                    :value="item.customerCode">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-tooltip content="编辑" placement="top">
                                <el-button type="warning" icon="el-icon-edit" circle
                                           @click="updateCompany(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="详情" placement="top">
                                <el-button type="primary" icon="el-icon-s-data" circle @click="rowDetail(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top">
                                <el-button type="danger" icon="el-icon-delete" circle></el-button>
                            </el-tooltip>
                        </el-button-group>
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
        <el-dialog title="新增门店信息" :visible.sync="addCompanyVisible" width="45%">
            <el-form  label-width="100px" style="height: 250px" slot-scope="props" :model="ruleForm" status-icon  ref="ruleForm">
                <div style="position: relative;left:-2%;top:10px;width:305px">
                    <el-form-item label="门店名称:" prop="companyName">
                        <el-input placeholder="请输入门店名称" clearable v-model="ruleForm.companyName"></el-input>
                    </el-form-item>
                    <el-form-item label="门店编码:" prop="companyCode">
                        <el-input placeholder="请输入门店编码" clearable v-model="ruleForm.companyCode"></el-input>
                    </el-form-item>
                    <el-form-item label="门店部门:" prop="mopDeptName">
                        <el-input placeholder="请输入门店部门" clearable v-model="ruleForm.mopDeptName"></el-input>
                    </el-form-item>
                    <el-form-item label="部门编码:" prop="mopDeptCode">
                        <el-input placeholder="请输入部门编码" clearable v-model="ruleForm.mopDeptCode"></el-input>
                    </el-form-item>
                </div>
                <div style="position: relative;left:48%;top:-194px;width:300px">
                    <el-form-item label="代理商名称:" prop="customerName">
                        <el-select v-model="ruleForm.customerName" filterable placeholder="请选择代理商">
                            <el-option
                                    v-for="item in assList"
                                    :key="item.customerCode"
                                    :label="item.customerName"
                                    :value="item.customerCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="代理商编码:" prop="customerCode">
                        <el-input placeholder="暂无数据"></el-input>
                    </el-form-item>
                    <el-form-item label="代理商部门:" prop="xunsoftDeptName">
                        <el-input placeholder="暂无数据" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="部门编码:" prop="xunsoftDeptCode">
                        <el-input placeholder="暂无数据"></el-input>
                    </el-form-item>
                </div>

            </el-form>
            <span slot="footer" class="dialog-footer" style="position: relative;right: 35%;bottom: 35px">
                <el-button @click="saveCompany" type="primary">保存</el-button>
                <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
                <el-button type="primary" @click="addCompanyVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 编辑详情弹出框  title="编辑（代理商数据和门店数据没确定）"-->
        <el-dialog  :title="updateOrDetail == 0 ? '编辑信息' : '详情信息'" :visible.sync="updateCompanyVisible" width="45%">
            <el-form label-width="100px" style="height: 250px" slot-scope="props">
                <div style="position: relative;left:-2%;top:10px;width:305px">
                    <el-form-item label="门店名称:" prop="companyName">
                        <el-input placeholder="请输入门店名称" v-model="companyAO.companyName" clearable :disabled="offOrOn == 0 ? false : true"></el-input>
                    </el-form-item>
                    <el-form-item label="门店编码:" prop="companyCode">
                        <el-input placeholder="暂无数据" disabled="true" v-model="companyAO.companyCode"></el-input>
                    </el-form-item>
                    <el-form-item label="门店部门:" prop="mopDeptName">
                        <el-input placeholder="请输入门店部门" v-model="companyAO.mopDeptName" clearable :disabled="offOrOn == 0 ? false : true"></el-input>
                    </el-form-item>
                    <el-form-item label="部门编码:" prop="mopDeptCode">
                        <el-input placeholder="暂无数据" disabled="true" v-model="companyAO.mopDeptCode"></el-input>
                    </el-form-item>
                </div>
                <div style="position: relative;left:48%;top:-194px;width:300px">
                    <el-form-item label="代理商名称:" prop="customerName">
                        <el-select v-model="companyAO.customerName" filterable placeholder="暂未绑定" :disabled="offOrOn == 0 ? false : true">
                            <el-option
                                    v-for="item in assList"
                                    :key="item.customerCode"
                                    :label="item.customerName"
                                    :value="item.customerCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="代理商编码:" prop="customerCode">
                        <el-input placeholder="暂未绑定" disabled="true" v-model="companyAO.customerCode"></el-input>
                    </el-form-item>
                    <el-form-item label="代理商部门:" prop="xunsoftDeptName">
                        <el-input placeholder="暂未绑定" type="xunsoftDeptName" v-model="companyAO.xunsoftDeptName"clearable :disabled="offOrOn == 0 ? false : true"></el-input>
                    </el-form-item>
                    <el-form-item label="部门编码:" prop="xunsoftDeptCode">
                        <el-input placeholder="暂未绑定" disabled="true" v-model="companyAO.xunsoftDeptCode"></el-input>
                    </el-form-item>
                </div>

            </el-form>
            <span slot="footer" class="dialog-footer" style="position: relative;right: 35%;bottom: 35px">
                <el-button @click="saveCompany" type="primary">保存</el-button>
                <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
                <el-button type="primary" @click="updateCompanyVisible = false">取 消</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import * as API from '../../../api/index';
    import Upload from 'element-ui/packages/upload/src/upload';

    export default {
        inject: ['reload'],
        name: 'brand',
        components: { Upload },
        data() {
            return {
                customerCode: '',
                assList: [],
                companyList: [],
                allCompanyList: [],
                addCompanyVisible: false,
                updateCompanyVisible: false,
                pageTotal: 100,
                page: 1,
                size: 10,
                offOrOn: 0,
                updateOrDetail:0,
                query: {
                    companyCode: '',
                    companyName: ''
                },
                companyAO: {
                    companyName: '',
                    companyCode: '',
                    mopDeptCode: '',
                    mopDeptName: '',
                    customerCode: '',
                    customerName: '',
                    xunsoftDeptCode: '',
                    xunsoftDeptName: ''
                },
                ruleForm: {
                    companyName: '',
                    companyCode: '',
                    mopDeptCode: '',
                    mopDeptName: '',
                    customerCode: '',
                    customerName: '',
                    xunsoftDeptCode: '',
                    xunsoftDeptName: '',
                    customerCode: '',
                    customerName: ''
                }
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
                debugger;
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
                    debugger;
                    this.allCompanyList = res.body;
                });
            },
            getAssoListData: function() {
                debugger
                API.asso_list().then(res => {
                    //debugger
                    this.assList = res;
                });
            },
            saveCompany: function() {
                console.log(this.ruleForm);
                API.list_CompanyDict(this.ruleForm).then(res => {
                    debugger;
                    if (res.body.length > 0) {
                        this.$message.error('该门店已存在，请勿重复录入');
                    } else {
                        API.company_save(params).then(res => {
                            this.$message({
                                message: '新增门店成功！',
                                type: 'success'
                            });
                            this.reload();
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
            updateCompany: function(row) {
                debugger;
                this.offOrOn=0;
                this.updateOrDetail=0;
                this.companyData(row);
                this.updateCompanyVisible = true;
            },
            companyData(row) {
                this.companyAO.companyCode = row.companyCode;
                this.companyAO.companyName = row.companyName;
                this.companyAO.mopDeptCode = row.mopDeptCode;
                this.companyAO.mopDeptName = row.mopDeptName;
                this.companyAO.customerName = row.customerName;
                this.companyAO.customerCode = row.customerCode;
                this.companyAO.xunsoftDeptCode = row.xunsoftDeptCode;
                this.companyAO.xunsoftDeptName = row.xunsoftDeptName;
            },
            rowDetail: function(row) {
                this.companyData(row);
                this.offOrOn=1;
                this.updateOrDetail=1;
                this.updateCompanyVisible = true;
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
            changeAsso(id, customerValue, companyName) {
                debugger;
                console.log('当前行id的值为：' + id);
                console.log('下拉框选中的值为：' + customerValue);
                let obj = {};
                obj = this.assList.find((item) => {
                    debugger;
                    return item.customerCode === customerValue;
                });
                let getName = '';
                getName = obj.customerName;
                this.$confirm('是否将' + companyName + '的代理商更新为' + getName + '?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    debugger;
                    let params = {
                        companyDictID: 0,
                        customerCode: ''
                    };
                    params.companyDictID = id;
                    params.customerCode = customerValue;
                    debugger;
                    API.comp_update(params).then(res => {
                        if (res.body != null) {
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
                    this.reload();
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
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


