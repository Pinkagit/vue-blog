<template>
    <div class="container">
        <b-header></b-header>
        <transition
        mode="out-in"
        enter-active-class="animated fadeInUp"
        leave-active-class="animated fadeOutDown"
        >
            <router-view class="containerView"></router-view>
        </transition>
        <b-aside></b-aside>
        <b-tools></b-tools>
    </div>
</template>

<script>
import aside from "./aside";
import header from "./header";
import tools from "./tools";

export default {
    components: {
        "b-aside": aside,
        "b-header": header,
        "b-tools": tools
    },
    data() {
        return {
            
        }
    },
}
</script>

<style lang="scss" scoped>
.container{
    width: 700px;
    height: auto;
    margin: 0 auto;
}
.containerView{
    overflow: hidden;
}
</style>
