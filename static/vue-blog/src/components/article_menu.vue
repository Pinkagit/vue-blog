<template>
    <div>
        <p class="menu">
            <span class="menu_li">发表于 {{ create_time }} </span>
            <span class="menu_li author">作者 &nbsp;<span @click="toPerson(author)">{{ author }}</span> </span>
            <span class="menu_li">
                标签 
                <span class="tag" v-for="(tag, index) in tags" :key="index" @click="toTagsList(tag)">
                    {{ tag }}
                </span>
            </span>
        </p>
    </div>
</template>

<script>
export default {
    props: {
        create_time: String,
        author: String,
        tags: Array,
    },
    data(){
        return {

        }
    },
    methods: {
        toTagsList(name) {
            this.$router.push(`/tagslist/${name}`)
        },
        toPerson(author) {
            this.$router.push({
                path: '/person',
                query: { author }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.menu{
    margin: 3px 0 60px;
    font-size: 12px;
    text-align: center;
    color: #999;
    .menu_li:not(:last-child)::after {
        content: '|';
        margin: 0 5px;
    }
    .tag{
        color: #555;
        cursor: pointer;
        border-bottom: 1px solid #999;
        &:not(:last-child) {
            margin-right: 5px;
        }
    }
    .author{
        span{
            border-bottom: 1px solid #999;
            color: #555;
            cursor: pointer;
        }
    }
}
</style>

