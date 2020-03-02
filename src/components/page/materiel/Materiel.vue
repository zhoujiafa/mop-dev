<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.skuBarcode" clearable placeholder="SKU编码" class="handle-input mr10"
                          style="width: 200px"></el-input>
                <el-input v-model="query.itemCode" clearable placeholder="商品编码" class="handle-input mr10"
                          style="width: 200px"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addMateriel">添加</el-button>
                <el-button type="primary" icon="el-icon-download" @click="exportCompany">导出Excel</el-button>
                <el-upload style="padding-left: 0px;border-radius: 11px"
                           class="upload-demo"
                           action="http://localhost:8888/goodsDict/import"
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
                        v-if="ID">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="skuBarcode"
                        label="SKU编码">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="itemCode"
                        label="商品编码">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="specName"
                        label="规格名称">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="price"
                        label="价格">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="barName"
                        label="条码名称">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="barName"
                        label="条码名称"
                        v-if="barName">
                </el-table-column>
                <el-table-column
                        prop="barCode"
                        align="center"
                        label="条码">
                    <template slot-scope="scope">
                        <el-select
                                v-model="scope.row.barCode" filterable placeholder="请选择"
                                @change="changeGoodsDivision(scope.row)">
                            <el-option
                                    v-for="item in goodsDivisionList"
                                    :key="item.barCode"
                                    :label="item.barCode"
                                    :value="item.barCode">
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
                                           @click="deleteMateriel(scope.row)"></el-button>
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
        <el-dialog title="新增物料信息" :visible.sync="addMaterielVisible" width="45%">
            <el-form label-width="100px" style="height: 200px" slot-scope="props" :model="saveModel" status-icon
                     ref="saveModel">
                <div style="position: relative;left:-2%;top:10px;width:305px">
                    <el-form-item label="商品SKU:" prop="skuBarcode"
                                  :rules="[{ required: true, message: '请输入SKU', trigger: 'blur'}]">
                        <el-input placeholder="请输入SKU" type="skuBarcode" clearable
                                  v-model="saveModel.skuBarcode"></el-input>
                    </el-form-item>
                    <el-form-item label="商品编码:" prop="itemCode"
                                  :rules="[{ required: true, message: '请输入商品编码', trigger: 'blur'}]">
                        <el-input placeholder="请输入商品编码" type="itemCode" clearable
                                  v-model="saveModel.itemCode"></el-input>
                    </el-form-item>
                    <el-form-item label="规格名称:" prop="specName"
                                  :rules="[{ required: true, message: '请输入规格名称', trigger: 'blur'}]">
                        <el-input placeholder="请输入规格名称" type="specName" clearable
                                  v-model="saveModel.specName"></el-input>
                    </el-form-item>
                </div>
                <div style="position: relative;left:48%;top:-143px;width:300px">
                    <el-form-item label="条码:" prop="barCode">
                        <el-select v-model="saveModel.barCode" filterable placeholder="请选择代理商"
                                   @change="changeSaveAsso(saveModel.barCode)">
                            <el-option
                                    v-for="item in goodsDivisionList"
                                    :key="item.barCode"
                                    :label="item.barCode"
                                    :value="item.barCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="条码名称:" prop="barName">
                        <el-input placeholder="条码名称" disabled="true" v-model="saveModel.barName"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格:" prop="price"
                                  :rules="[{ required: true, message: '请输入商品价格', trigger: 'blur'}]">
                        <el-input placeholder="请输入商品价格" type="price" clearable v-model="saveModel.price"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer" style="position: relative;right: 35%;bottom: 35px">
                <el-button @click="saveMateriel('saveModel')" type="primary">保存</el-button>
                <el-button type="primary" @click="resetForm('saveModel')">重置</el-button>
                <el-button type="primary" @click="cancelSave('saveModel')">取 消</el-button>
            </span>
        </el-dialog>


        <!-- 编辑详情弹出框  title="编辑（代理商数据和门店数据没确定）"-->
        <el-dialog :title="updateOrDetail == 0 ? '编辑信息' : '详情信息'" :visible.sync="updateMaterielVisible" width="45%">
            <el-form label-width="100px" style="height: 200px" slot-scope="props" :model="MaterielAO" status-icon
                     ref="MaterielAO">
                <div style="position: relative;left:-2%;top:10px;width:305px">
                    <el-form-item label="商品SKU:" prop="skuBarcode"
                                  :rules="[{ required: true, message: '请输入SKU', trigger: 'blur'}]">
                        <el-input placeholder="请输入SKU" type="skuBarcode" clearable v-model="MaterielAO.skuBarcode"
                                  :disabled="offOrOn == 0 ? false : true"></el-input>
                    </el-form-item>
                    <el-form-item label="商品编码:" prop="itemCode"
                                  :rules="[{ required: true, message: '请输入商品编码', trigger: 'blur'}]">
                        <el-input placeholder="请输入商品编码" type="itemCode" clearable v-model="MaterielAO.itemCode"
                                  :disabled="offOrOn == 0 ? false : true"></el-input>
                    </el-form-item>
                    <el-form-item label="规格名称:" prop="specName"
                                  :rules="[{ required: true, message: '请输入规格名称', trigger: 'blur'}]">
                        <el-input placeholder="请输入规格名称" type="specName" clearable v-model="MaterielAO.specName"
                                  :disabled="offOrOn == 0 ? false : true"></el-input>
                    </el-form-item>
                </div>
                <div style="position: relative;left:48%;top:-143px;width:300px">
                    <el-form-item label="条码:" prop="barCode">
                        <el-select v-model="MaterielAO.barCode" filterable placeholder="请选择代理商"
                                   @change="changeSaveAsso(saveModel.barCode)" :disabled="offOrOn == 0 ? false : true">
                            <el-option
                                    v-for="item in goodsDivisionList"
                                    :key="item.barCode"
                                    :label="item.barCode"
                                    :value="item.barCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="条码名称:" prop="barName">
                        <el-input placeholder="条码名称" disabled="true" v-model="MaterielAO.barName"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格:" prop="price"
                                  :rules="[{ required: true, message: '请输入商品价格', trigger: 'blur'}]">
                        <el-input placeholder="请输入商品价格" type="price" clearable v-model="MaterielAO.price"
                                  :disabled="offOrOn == 0 ? false : true"></el-input>
                    </el-form-item>

                </div>

            </el-form>
            <span slot="footer" class="dialog-footer" style="position: relative;right: 35%;bottom: 35px"
                  :hidden="detailButtom == 0 ? false : true">
                <el-button @click="updateMateriel('MaterielAO')" type="primary">保存</el-button>
                <el-button type="primary" @click="resetForm('MaterielAO')">重置</el-button>
                <el-button type="primary" @click="cancelSave('MaterielAO')">取 消</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import * as API from '../../../api/index';

    export default {
        inject: ['reload'],
        name: 'brand',
        data() {
            return {
                barCodes: '',
                goodsDivisionList: [],
                goodsDictList: [],
                pageTotal: 100,
                page: 1,
                size: 10,
                detailButtom: 0,
                updateOrDetail: 0,
                detailButtom: 0,
                offOrOn: 0,
                query: {
                    skuBarcode: '',
                    itemCode: ''
                },
                addMaterielVisible: false,
                updateMaterielVisible: false,
                saveModel: {
                    iD: null,
                    skuBarcode: '',
                    itemCode: '',
                    specName: '',
                    barCode: '',
                    barName: '',
                    price: null
                },
                MaterielAO: {
                    id: null,
                    skuBarcode: '',
                    itemCode: '',
                    specName: '',
                    barCode: '',
                    barName: '',
                    price: null
                }
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
            updateMateriel: function() {
                API.goodsDict_update(this.MaterielAO).then(res => {
                    debugger;
                    if (res.body) {
                        this.$message({
                            message: '更新物料信息成功！',
                            type: 'success',
                            center: true
                        });
                        this.reload();
                    } else {
                        this.$message.error('该信息已存在，请勿重复录入');
                    }
                });
            },
            addMateriel: function() {
                this.addMaterielVisible = true;
            },
            saveMateriel: function(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        API.goodsDict_save(this.saveModel).then(res => {
                            debugger;
                            if (res.body) {
                                this.$message({
                                    message: '新增物料成功！',
                                    type: 'success',
                                    center: true
                                });
                                this.reload();
                            }
                        });

                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            cancelSave(formName) {
                this.$refs[formName].resetFields();
                this.addMaterielVisible = false;
                this.updateMaterielVisible = false;
            },
            MaterielData(row) {
                debugger;
                this.MaterielAO.id = row.id;
                this.MaterielAO.skuBarcode = row.skuBarcode;
                this.MaterielAO.itemCode = row.itemCode;
                this.MaterielAO.specName = row.specName;
                this.MaterielAO.barCode = row.barCode;
                this.MaterielAO.barName = row.barName;
                this.MaterielAO.price = row.price;
            },
            updateView: function(row) {
                debugger;
                this.offOrOn = 0;
                this.updateOrDetail = 0;
                this.detailButtom = 0;
                this.MaterielData(row);
                this.updateMaterielVisible = true;
            },
            rowDetail: function(row) {
                debugger;
                this.MaterielData(row);
                this.offOrOn = 1;
                this.updateOrDetail = 1;
                this.updateMaterielVisible = true;
                this.detailButtom = 1;
            },
            deleteMateriel: function(row) {
                debugger;
                this.$confirm('是否将物料编码为' + row.itemCode + '的信息彻底删除?，删除后将无法恢复！', '提示', {
                    cancelButtonClass: 'btn-custom-cancel',
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning',
                    center: true
                }).then(() => {
                    debugger;
                    API.Materiel_delete(row).then(res => {
                        if (res.body) {
                            this.$message({
                                type: 'success',
                                message: '物料删除成功!',
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

            changeGoodsDivision(row) {
                this.$confirm('此操作将进行更新, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    debugger;
                    API.Materiel_one(row).then(res => {
                        debugger;
                        let params = {
                            id: row.id,
                            barName: res.barName,
                            barCode: res.barCode,
                            skuBarcode: row.skuBarcode,
                            itemCode: row.itemCode,
                            specName: row.specName,
                            price: res.price
                        };
                        debugger;
                        API.goodsDict_update(params).then(res => {
                            debugger;
                            if (res.body == true) {
                                this.$message({
                                    type: 'success',
                                    message: '更新成功!'
                                });
                                this.reload();
                            } else {
                                this.$message.error('导入失败!，导入文件数据异常!');
                            }
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: 'cancel',
                        message: '已取消操作'
                    });
                });

            },
            uploadSuccess(response, file) {
                debugger;
                if (response.body == true) {
                    debugger;
                    this.$message.success('导入成功!');
                    this.$router.push('/Materiel');
                    this.reload();
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
                this.reload();
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

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
