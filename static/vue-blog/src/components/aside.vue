<template>
    <aside :class="{ active: isActive }">
        <div class="sidebar">
            <ul class="nav">
                <li v-for="(item, index) in asideNav" :class="[index == asideNavIndex ? 'nav_active': '']" :key="index" @click="toggle_li(index)">
                    {{ item }}
                </li>
            </ul>
            <section>
                <keep-alive>
                    <component :is="currentTabComponent"></component>
                </keep-alive>
            </section>
        </div>
    </aside>
</template>

<script>
import articletab from "./articletab";
import site_overview from "./site_overview";

export default {
    components: {
        "articletab": articletab,
        "site-overview": site_overview,
    },
    data() {
        return {
            componentList: ["articletab", "site-overview"]
        }
    },
    computed: {
        isActive() {
            return this.$store.state.ASIDE_ISACTIVED;
        },
        currentTabComponent() {
            return this.componentList[this.asideNavIndex];
        },
        asideNav() {
            return this.$store.state.ASIDE_NAV;
        },
        asideNavIndex() {
            return this.$store.state.ASIDE_NAV_INDEX;
        }
    },
    methods: {
        toggle_li(index) {
            this.$store.commit("SET_ASIDE_NAV_INDEX", index)
        },
    }
}
</script>

<style lang="scss" scoped>
ul{
    margin: 0;
    padding: 0;
    list-style: none;
}
aside{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    width: 0;
    background: #222;
    box-shadow: inset 0 2px 6px #000;
    @include aside-offset();
    overflow: hidden;
}
.active{
    width: 320px;
}
.sidebar{
    width: 100%;
    box-sizing: border-box;
    padding: 20px 10px;
}
.nav{
    width: 100%;
    height: 32px;
    overflow: hidden;
    text-align: center;
    margin-bottom: 20px;
    li{
        display: inline-block;
        color: #555;
        font-size: 14px;
        cursor: pointer;
        border-bottom: 1px solid transparent;
        &:hover{
            color: #f5f5f5;
        }
        &:not(:last-child){
            margin-right: 10px;
        }
    }
    li.nav_active{
        color: #87daff;
        border-bottom-color:#87daff;
    }
}

</style>
