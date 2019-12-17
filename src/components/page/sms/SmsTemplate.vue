<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="id" class="handle-input mr10"></el-input>
                <el-input v-model="query.name" placeholder="提供商名称" class="handle-input mr10"></el-input>
                <el-input v-model="query.name" placeholder="提供商账号" class="handle-input mr10"></el-input>
                <el-select v-model="query.address" placeholder="状态" class="handle-select mr10">
                    <el-option key="1" label="启用" value="启用"></el-option>
                    <el-option key="2" label="禁用" value="禁用"></el-option>
                </el-select>
                <el-date-picker  class="mr10"
                v-model="value1"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="warning" icon="el-icon-delete" @click="handleSearch">重置</el-button>
                <el-button type="success" icon="el-icon-plus" @click="addMch">新增</el-button>
                <el-button type="info" icon="el-icon-download" @click="delAllSelection" >导出</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="id" label="id" width="180"></el-table-column>
                <el-table-column prop="mchName" label="商户名称" width="120"></el-table-column>
                <el-table-column prop="templateName" label="模板名称" width="150"></el-table-column>
                <el-table-column prop="templateMsg" label="模板内容"></el-table-column>
                <el-table-column prop="dataTime" label="创建时间" width="180"></el-table-column>
                <el-table-column label="状态" align="center" width="120">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.dataStatus =='1' ? 'success' : 'danger'"
                        >{{scope.row.dataStatus == '1' ? '已启用' : '已禁用'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.dataStatus =='0'"
                            type="text"
                            icon="el-icon-check"
                            class="success"
                        >启用</el-button>

                        <el-button v-if="scope.row.dataStatus =='1'"
                            type="text"
                            icon="el-icon-close"
                            class="danger"
                        >禁用</el-button>

                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination" style="width: 100%;text-align: left;margin-top: 10px;">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="编辑" :visible.sync="addMchVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="请选择账号">
                    <el-select v-model="query.address" placeholder="请选择账号">
                        <el-option key="1" label="久发" value="久发"></el-option>
                        <el-option key="2" label="钻石" value="钻石"></el-option>
                        <el-option key="2" label="金钻" value="金钻"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商户名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="secretKey">
                    <el-tag type="info">系统自动生成</el-tag>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editMchVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="账号">
                    <el-tag type="info">久发</el-tag>
                </el-form-item>
                <el-form-item label="商户名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="secretKey">
                    <el-tag type="info">8dbd2e41c14ceb2a6589dc19d60b3660</el-tag>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'SmsTemplate',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [{
                'id': '784729375759235',
                'mchId': '7894913791341',
                'mchName': '久发',
                'templateId':'78675764645',
                'templateName':'登录验证码',
                'templateMsg':'【coffee】您的登录验证码{}，5分钟过期，请注意保存',
                'dataTime': '2019-10-27 10:09:09',
                'dataStatus': 1
            },
            {
                'id': '784729375759235',
                'mchId': '7894913791341',
                'mchName': '钻石',
                'templateId':'78675764645',
                'templateName':'登录验证码',
                'templateMsg':'【coffee】您的登录验证码{}，5分钟过期，请注意保存',
                'dataTime': '2019-10-27 10:09:09',
                'dataStatus': 0
            },
            {
                'id': '784729375759235',
                'mchId': '7894913791341',
                'mchName': '久发',
                'templateId':'78675764645',
                'templateName':'登录验证码',
                'templateMsg':'【coffee】您的登录验证码{}，5分钟过期，请注意保存',
                'dataTime': '2019-10-27 10:09:09',
                'dataStatus': 1
            }],
            multipleSelection: [],
            delList: [],
            addMchVisible: false,
            editMchVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    methods: {
        addMch:function() {
            this.addMchVisible = true;
        },
        handleEdit:function() {
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
</style>
