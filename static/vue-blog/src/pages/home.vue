<template>
    <div class="wrap" :class="{ active: isActive }">
        <b-container></b-container>
    </div>
</template>

<script>
import container from "../components/container"

export default {
    components: {
        "b-container" : container
    },
    data() {
        return {

        }
    },
    computed: {
        isActive() {
            return this.$store.state.ASIDE_ISACTIVED;
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap{
    padding-right: 0;
    background: #fff;
    @include aside-offset(padding-right);
}
.active{
    padding-right: 320px;
    @media screen and (max-width: 700px) {
        padding-right: 0px;   
    }
}
</style>

