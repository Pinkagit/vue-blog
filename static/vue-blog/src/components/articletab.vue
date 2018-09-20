<template>
    <div>
        <ul class="catalog">
            <li v-for="(item, index) in catalog" :key="index" @click="goTo(index)" :class="[index == h_flag ? 'active': '']">
                <span v-if="item.class == flagClass"><i class="iconfont icon-shuqian1"></i> {{ item.label }}</span>
                <span v-else-if="item.class - flagClass == 1" class="mar10">{{ item.label }}</span>
                <span v-else-if="item.class - flagClass == 2" class="mar20">{{ item.label }}</span>
                <span v-else-if="item.class - flagClass == 3" class="mar30">{{ item.label }}</span>
                <span v-else class="other"><i class="iconfont icon-yuandianxiao"></i>{{ item.label }}</span>
            </li>
        </ul>        
    </div>
</template>

<script>
export default {
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            h_flag: 0,
        }
    },
    methods: {
        handleNodeClick(data) {
            console.log(data);
        },
        goTo(index){
            let h_arr = document.getElementsByClassName('h_title')
            h_arr[index].scrollIntoView({ behavior: "smooth", block: "start"})
        },
        handleScroll () {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;    // 页面的滚动距离
            let clientHeight = document.documentElement.clientHeight;       // 屏幕的高度
            let h_arr = document.getElementsByClassName('h_title');

            
            for(let i = 0, len = h_arr.length; i < len; i++) {
                let offsetTop = h_arr[i].offsetTop;             // 元素距离页面顶部的距离
                let offsetHeight = h_arr[i].offsetHeight;       // 元素自身的高度
                let toClientTop = offsetTop - scrollTop;        // 元素上边 距离屏幕可视区的距离

                // 元素出现在屏幕上方 1/4处
                if (toClientTop < clientHeight/4 && toClientTop > -offsetHeight ) {
                    this.h_flag = i;
                }  
               
            }
        },
    },
    computed: {
        catalog() {
            return this.$store.state.CATALOG;
        },
        flagClass() {
            return this.$store.state.CATALOG[0].class;
        },
    },
     mounted () {
        window.addEventListener('scroll', this.handleScroll)
    },
}
</script>

<style lang="scss" scoped>
.catalog{
    list-style: none;
    margin: 0;
    padding: 0;
    padding: 10px;
    li{
        color: #999;
        font-size: 14px;
        cursor: pointer;
        transition: all .5s;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        &:hover{
            color: #ccc;
            span{
                border-bottom-color: #ccc;
            }
        }
        span{
            border-bottom: 1px solid #555;
        }
    }
    .active{
        color: #87daff;
    }
}

.mar10{
    margin-left: 25px;
}
.mar20{
    margin-left: 35px;
}
.mar30{
    margin-left: 45px;
}
.other{
    margin-left: 55px;
}
.icon-shuqian1{
    font-size: 14px;
}
</style>
