<template>
    <footer>
        <div class="box">
            <p class="copyright">
                &copy;2018
                <i class="iconfont icon-xin icon"></i>
                队友在哪里
            </p>
        </div>
    </footer>
</template>

<script>
export default {
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
footer{
    margin-top: 40px;
    width: 100%;
    height: 150px;
    position: relative;
    .box{
        width: 100%;
        height: 56px;
        position: absolute;
        bottom: 20px;
        left: 0;
        box-sizing: border-box;
        .copyright{
            text-align: center;
            font-size: 14px;
            color: #999;
            .icon{
                font-size: 17px;
            }
        }
    }
}
</style>
