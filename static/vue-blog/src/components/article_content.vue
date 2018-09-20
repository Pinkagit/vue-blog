<template>
    <div v-html="childContent" class="child-content">
    </div>
</template>

<script>
export default {
    props: ['childContent'],
    data() {
        return {
        }
    },
    created() {
    }
}
</script>

<style lang="scss" scoped>
.child-content{
    min-height: 310px;
}
</style>
