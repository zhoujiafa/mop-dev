<template>
    <div class="containers">
        <div class="companyCode">
            <el-input v-model="query.companyCode" clearable placeholder="门店编码"  style="width: 200px"></el-input>
        </div>
        <div class="orderNo" >
            <el-input v-model="query.orderNo" clearable placeholder="订单号" style="width: 200px"></el-input>
        </div>
        <div class="commit">
            <el-button type="success" icon="el-icon-thumb" @click="getDeliverGoodsList">一键收货</el-button>
        </div>
    </div>
</template>
<script>
    import * as API from '../../../api';
    export default {
        inject: ['reload'],
        data() {
            return {
                query: {
                    orderNo: '',
                    companyCode: ''
                }
            };
        },
        methods: {
            getDeliverGoodsList:function() {
                debugger;
                console.log(this.query);
                API.getDeliverGoodsList(this.query).then(res => {
                    if(res.resultInt === -1){
                        this.$message({
                            type: 'warning',
                            message: res.resultString
                        });
                    }else{
                        this.$message({
                            type: 'success',
                            message: res.resultString
                        });
                    }
                });
            }

        }
    };

</script>


<style scoped>
    .containers {
        padding: 30px 0 200px 0;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .orderNo {
        margin: 20px auto 0 auto;
        width: 120px;
    }
    .companyCode {
        margin: 20px auto 0 auto;
        width: 120px;
    }
    .commit {
        margin: 20px auto 0 auto;
        width: 30px;
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
