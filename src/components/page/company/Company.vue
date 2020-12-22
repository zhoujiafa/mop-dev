<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.companyCode" clearable placeholder="门店编码" class="handle-input mr10"
                          style="width: 200px"></el-input>
                <el-input v-model="query.companyName" clearable placeholder="门店名称" class="handle-input mr10"
                          style="width: 200px"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addCompany">添加</el-button>
                <el-button type="primary" icon="el-icon-download" @click="exportCompany">导出Excel</el-button>
                <!--<el-button type="success" icon="el-icon-upload2" @click="importCompany">上传门店(Excel)</el-button>
                <el-button type="success" icon="el-icon-download" @click="exportCompany">下载门店(Excel)</el-button>-->
                <el-upload style="padding-left: 0px;border-radius: 11px"
                           class="upload-demo"
                           action="http://localhost:8888/companyDict/import"
                           name="files"
                           :headers="headers"
                           :on-preview="handlePreview"
                           :on-remove="handleRemove"
                           :before-remove="beforeRemove"
                           multiple
                           :limit="1"
                           :file-list="fileList"
                           :ref="upload"
                           :on-success="uploadSuccess"
                           :before-upload="beforeAvatarUpload"
                >
                    <el-button icon="el-icon-upload2" size="small" type="primary">导入Excel</el-button>
                </el-upload>
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
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="id"
                        label="ID"
                        v-if="ID">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="companyCode"
                        sortable
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
                        prop="customerCode"
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
                                <el-button type="primary" icon="el-icon-edit" circle
                                           @click="updateView(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="详情" placement="top">
                                <el-button type="primary" icon="el-icon-s-data" circle
                                           @click="rowDetail(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top">
                                <el-button type="primary" icon="el-icon-delete" circle
                                           @click="deleteCompany(scope.row)"></el-button>
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
            <el-form label-width="100px" style="height: 250px" slot-scope="props" :model="saveModel" status-icon
                     ref="saveModel">
                <div style="position: relative;left:-2%;top:10px;width:305px">
                    <el-form-item label="门店名称:" prop="companyName" :rules="[{ required: true, message: '请输入门店名称', trigger: 'blur'}]">
                        <el-input placeholder="请输入门店名称" type="companyName" clearable v-model="saveModel.companyName"></el-input>
                    </el-form-item>
                    <el-form-item label="门店编码:" prop="companyCode" :rules="[{ required: true, message: '请输入门店编码', trigger: 'blur'}]">
                        <el-input placeholder="请输入门店编码" type="companyCode" clearable v-model="saveModel.companyCode"></el-input>
                    </el-form-item>
                    <el-form-item label="门店部门:" prop="mopDeptName" :rules="[{ required: true, message: '请输入门店部门', trigger: 'blur'}]">
                        <el-input placeholder="请输入门店部门" type="mopDeptName" clearable v-model="saveModel.mopDeptName"></el-input>
                    </el-form-item>
                    <el-form-item label="部门编码:" prop="mopDeptCode" :rules="[{ required: true, message: '请输入门店部门编码', trigger: 'blur'}]">
                        <el-input placeholder="请输入门店部门编码" type="mopDeptCode" clearable v-model="saveModel.mopDeptCode"></el-input>
                    </el-form-item>
                </div>
                <div style="position: relative;left:48%;top:-194px;width:300px">
                    <el-form-item label="代理商名称:" prop="customerName">
                        <el-select v-model="saveModel.customerCode" filterable placeholder="请选择代理商"
                                   @change="changeSaveAsso(saveModel)">
                            <el-option
                                    v-for="item in assList"
                                    :key="item.customerCode"
                                    :label="item.customerName"
                                    :value="item.customerCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="代理商编码:" prop="customerCode">
                        <el-input placeholder="暂无数据" disabled="true" v-model="saveModel.customerCode"></el-input>
                    </el-form-item>
                    <el-form-item label="代理商部门:" prop="xunsoftDeptName">
                        <el-input placeholder="暂无数据" clearable disabled="true"
                                  v-model="saveModel.xunsoftDeptName"></el-input>
                    </el-form-item>
                    <el-form-item label="部门编码:" prop="xunsoftDeptCode">
                        <el-input placeholder="暂无数据" disabled="true" v-model="saveModel.xunsoftDeptCode"></el-input>
                    </el-form-item>
                </div>

            </el-form>
            <span slot="footer" class="dialog-footer" style="position: relative;right: 35%;bottom: 35px">
                <el-button @click="saveCompany('saveModel')" type="primary">保存</el-button>
                <el-button type="primary" @click="resetForm('saveModel')">重置</el-button>
                <el-button type="primary" @click="cancelSave('saveModel')">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 编辑详情弹出框  title="编辑（代理商数据和门店数据没确定）"-->
        <el-dialog :title="updateOrDetail == 0 ? '编辑信息' : '详情信息'" :visible.sync="updateCompanyVisible" width="45%">
            <el-form label-width="100px" style="height: 250px" slot-scope="props" :model="companyAO" status-icon
                     ref="companyAO">
                <div style="position: relative;left:-2%;top:10px;width:305px">
                    <el-form-item label="门店名称:" prop="companyName">
                        <el-input placeholder="请输入门店名称" v-model="companyAO.companyName" clearable
                                  :disabled="offOrOn == 0 ? false : true"></el-input>
                    </el-form-item>
                    <el-form-item label="门店编码:" prop="companyCode">
                        <el-input placeholder="暂无数据" disabled="true" v-model="companyAO.companyCode"></el-input>
                    </el-form-item>
                    <el-form-item label="门店部门:" prop="mopDeptName">
                        <el-input placeholder="请输入门店部门" v-model="companyAO.mopDeptName" clearable
                                  :disabled="offOrOn == 0 ? false : true"></el-input>
                    </el-form-item>
                    <el-form-item label="部门编码:" prop="mopDeptCode">
                        <el-input placeholder="暂无数据" disabled="true" v-model="companyAO.mopDeptCode"></el-input>
                    </el-form-item>
                </div>
                <div style="position: relative;left:48%;top:-194px;width:300px">
                    <el-form-item label="代理商名称:" prop="customerName">
                        <el-select   v-model="companyAO.customerCode" filterable placeholder="暂未绑定"
                                   :disabled="offOrOn == 0 ? false : true">
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
                        <el-input placeholder="暂未提供数据" type="xunsoftDeptName"
                                  clearable :disabled="offOrOn == 0 ? false : true"></el-input>
                    </el-form-item>
                    <el-form-item label="部门编码:" prop="xunsoftDeptCode">
                        <el-input placeholder="暂未绑定" disabled="true" v-model="companyAO.xunsoftDeptCode"></el-input>
                    </el-form-item>
                </div>

            </el-form>
            <span slot="footer" class="dialog-footer" style="position: relative;right: 35%;bottom: 35px"
                  :hidden="detailButtom == 0 ? false : true">
                <el-button @click="updateCompany('companyAO')" type="primary">保存</el-button>
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
                detailButtom: 0,
                updateOrDetail: 0,
                query: {
                    companyCode: '',
                    companyName: ''
                },
                companyAO: {
                    companyDictID:'',
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
                    xunsoftDeptName: ''
                },
                saveModel: {
                    companyName: '',
                    companyCode: '',
                    mopDeptCode: '',
                    mopDeptName: '',
                    customerName: '',
                    customerCode: '',
                    xunsoftDeptCode: '',
                    xunsoftDeptName: ''
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
                debugger;
                API.asso_list().then(res => {
                    //debugger
                    this.assList = res;
                });
            },

            saveCompany: function(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        debugger;
                        console.log(this.saveModel);
                        API.checkExistCompany(this.saveModel).then(res => {
                            debugger;
                            if (res.body.length > 0) {
                                this.$message.error('该门店已存在，请勿重复录入');
                            } else {
                                API.company_save(this.saveModel).then(res => {
                                    debugger;
                                    if (res.body) {
                                        this.$message({
                                            message: '新增门店成功！',
                                            type: 'success',
                                            center: true
                                        });
                                        this.reload();
                                    }
                                });
                            }
                        });
                    }
                })

            },

            handleEdit: function() {

            },
            handleSearch: function() {
                this.getData();
            },
            addCompany: function() {
                this.addCompanyVisible = true;
            },
            updateView: function(row) {
                debugger;
                this.offOrOn = 0;
                this.updateOrDetail = 0;
                this.detailButtom = 0;
                this.companyData(row);
                this.updateCompanyVisible = true;
                this.companyAO.companyDictID = row.id;
            },
            updateCompany:function(){
                debugger
                API.list_CompanyDict(this.companyAO).then(res => {
                    debugger;
                    if (res.body.length > 0 && res.body[0].companyCode != this.companyAO.companyCode) {
                        this.$message.error('该门店已存在，请勿重复录入');
                    } else {
                        API.company_update(this.companyAO).then(res => {
                            debugger;
                            if (res.body) {
                                this.$message({
                                    message: '更新门店成功！',
                                    type: 'success',
                                    center: true
                                });
                                this.reload();
                            }else{
                                this.$message.error('该门店已存在，请勿重复录入');
                            }

                        });
                    }
                });
            },
            deleteCompany: function(row) {
                this.$confirm('是否将' + row.companyName + '门店信息彻底删除?，删除后将无法恢复！', '提示', {
                    cancelButtonClass: 'btn-custom-cancel',
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning',
                    center: true
                }).then(() => {
                    debugger;
                    API.company_delete(row).then(res => {
                        if (res.body) {
                            this.$message({
                                type: 'success',
                                message: '门店删除成功!',
                                center: true
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: '数据异常,删除失败!',
                                center: true
                            });
                        }
                        this.reload();
                    });
                }).catch(() => {
                    this.$message({
                        type: 'cancel',
                        message: '已取消操作'
                    });
                    this.reload();
                });
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
                this.offOrOn = 1;
                this.updateOrDetail = 1;
                this.updateCompanyVisible = true;
                this.detailButtom = 1;
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
            changeAsso(id, customerCode, companyName) {
                debugger;
                console.log('当前行id的值为：' + id);
                console.log('下拉框选中的值为：' + customerCode);
                let obj = {
                    customerName: '',
                    customerCode: '',
                    xunsoftDeptCode: '',
                    xunsoftDeptName: ''
                };
                obj = this.assList.find((item) => {
                    debugger;
                    obj.customerName = item.customerName;
                    obj.customerCode = item.customerCode;
                    obj.xunsoftDeptCode = item.xunsoftDeptCode;
                    obj.xunsoftDeptName = item.xunsoftDeptName;
                    return item.customerCode === customerCode;
                });
                let getName = '';
                getName = obj.customerName;
                debugger;
                this.$confirm('是否将' + companyName + '的代理商更新为' + getName + '?', '提示', {
                    cancelButtonClass:'cancelButtom',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    debugger;
                    let params = {
                        companyDivision: {
                            customerName: obj.customerName,
                            customerCode: obj.customerCode,
                            xunsoftDeptCode: obj.xunsoftDeptCode,
                            xunsoftDeptName: obj.xunsoftDeptName
                        },
                        companyDictID: 0,
                        customerCode: ''
                    };
                    params.companyDictID = id;
                    params.customerCode = customerCode;
                    debugger;
                    API.company_update(params).then(res => {
                        if (res.body != null) {
                            this.$message({
                                type: 'success',
                                message: '更新成功!',
                                center: true
                            });
                            this.reload();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'cancel',
                        message: '已取消操作',
                        center: true
                    });
                    this.reload();
                });
            },
            changeSaveAsso(saveModel) {
                debugger;
                this.saveModel.companyCode = saveModel.companyCode;
                this.saveModel.companyName = saveModel.companyName;
                this.saveModel.mopDeptCode = saveModel.mopDeptCode;
                this.saveModel.mopDeptName = saveModel.mopDeptName;
                this.saveModel = this.assList.find((item) => {
                    this.saveModel.customerName = item.customerCode;
                    this.saveModel.customerCode = item.customerCode;
                    this.saveModel.xunsoftDeptCode = item.xunsoftDeptCode;
                    this.saveModel.xunsoftDeptName = item.xunsoftDeptName;
                    return item.customerCode === customerCode;
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            cancelSave(formName) {
                this.$refs[formName].resetFields();
                this.addCompanyVisible = false;
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            uploadSuccess(response, file) {
                debugger;
                if (response.body == true) {
                    debugger;
                    this.$message.success('导入成功!');
                    this.$router.push('/');
                } else {
                    this.$message.error('导入失败!，导入文件数据异常!');
                }

            },
            handlePreview(file) {
                if (file.response.status) {
                    this.$message.success('文件导入成功!');
                } else {
                    this.$message.error('此文件导入失败!');
                }
            },
            uploadFalse(response, file, fileList) {
                debugger;
                this.$message.error('文件上传失败！');
            },
            // 上传前对文件的大小的判断
            beforeAvatarUpload(file) {
                const extension = file.name.split('.')[1] === 'xls';
                const extension2 = file.name.split('.')[1] === 'xlsx';
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!extension && !extension2) {
                    this.$message.error('上传模板只能是 xls、xlsx格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传模板大小不能超过 10MB!');
                }
                return extension || extension2;
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

    .upload-demo {
        height: 0px;
    }
    .cancelButtom {
        float: right;
        margin-left: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>




