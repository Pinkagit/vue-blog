<template>
    <div>
        <div :class="{ active: isActive }" class="menu" @click="toggle"></div>
        <transition
        enter-active-class="animated fadeInUp"
        leave-active-class="animated fadeOutDown" 
        >
            <div class="toTop" 
            v-if="toTop_isShow" 
            @click="backTop">
                <i class="iconfont icon-jiantou-copy"></i>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    data() {
        return {
            toTop_isShow: 0,
            scrollTop: 0,
        }
    },
    mounted () {
        window.addEventListener('scroll', this.handleScroll)
    },
    methods: {
        toggle() {
            this.$store.commit("TOGGLE_ASIDE_ACTIVE")
        },
        handleScroll () {
            this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            if (this.scrollTop >= 500) {
                this.toTop_isShow = 1;
            } else {
                this.toTop_isShow = 0;
            }
        },
        backTop() {
            var oTop = document.getElementById('top');
            oTop.scrollIntoView({ behavior: "smooth", block: "end"})
        }
    },
    computed: {
        isActive() {
            return this.$store.state.ASIDE_ISACTIVED
        },
    },
    
}
</script>


<style lang="scss" scoped>
.tools{
    width: 30px;
    height: 30px;
    background: #222;
    position: fixed;
    right: 50px;
    cursor: pointer;
}

.menu{
    @extend .tools;
    position: fixed;
    bottom: 55px;
    z-index: 999;
    &::before, &::after{
        content: '';
        display: block;
        width: 20px;
        height: 2px;
        background: #fff;
        position: absolute;
        left: 5px;
        @include aside-offset();
    }
    &::before{
        top: 8px;
        box-shadow: 0 6px #fff;
    }
    &::after{
        bottom: 8px;
    }
}
.active{
    &::before{
        box-shadow: none;
        top: 14px;
        transform: rotate(225deg);
    }
    &::after{
        bottom: 14px;
        transform: rotate(135deg);
    }
}

.toTop{
    @extend .tools;
    bottom: 15px;
    text-align: center;
    line-height: 30px;
}
.iconfont{
    color: #fff;
    font-size: 20px;
}
</style>
