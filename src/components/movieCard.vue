<template>
    <div class="poster">
        <div class="glass" @mouseover="DataHover" @mouseleave="DataHover"></div>
        <img :src='imgSrc' :alt="alt" class="backG">
        <Transition name="showData">
            <div class="data" v-if="showData">
                <div class="name">{{ title }}</div>
                <div class="info"><span class="type" v-if="type">{{ type }}</span> <span class="year">{{ year }}</span></div>
                <div class="plot">{{ plot }}</div>
            </div>
        </Transition>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showData: false
        }
    },
    props: ['imgSrc', 'alt', 'type', 'title', 'year', 'plot'],
    methods: {
        DataHover() {
            // if(this.$route.name =='search'){
            this.showData = !this.showData
            // }
            // else return
        }
    }
}
</script>

<style lang="scss" scoped>
.poster {
    height: 18rem;
    width: 12rem;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow: hidden;

    .glass {
        width: inherit;
        height: inherit;
        background-color: transparent;
        border-radius: 10px;
        position: absolute;
        z-index: 1100;
        cursor: pointer;
    }

    .backG {
        position: absolute;
        object-fit: cover;
        object-position: center;
        width: inherit;
        height: inherit;
        border-radius: 10px;
        z-index: 1080;
    }

    .data {
        background-image: linear-gradient(to top, $surfaceV 80%, transparent);
        border-radius: 10px;
        height: fit-content;
        padding: 5px;
        z-index: 1090;

        .name {
            font-size: 20px;
            font-weight: 500;
            padding: 5px;

        }

        .info {
            font-size: 15px;
            font-weight: 300;
            padding: 5px;
            display: flex;
            margin-left: -10px;

            span {
                border-right: 1px grey solid;
                padding: 0 10px 0 10px;

            }

            &>span:nth-last-child(1) {
                border: none;
            }
        }

        .plot {
            font-size: 12px;
            font-weight: 300;
            padding: 5px;
            display: flex;
        }
    }

    .showData-enter-active,
    .showData-leave-active {
        transition: transform 0.75s ease;
    }

    .showData-enter-from,
    .showData-leave-to {
        transform: translateY(15rem);
    }
}




@media (max-width:768px) {
    .poster {
        height: 9rem;
        width: 6rem;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        overflow: hidden;

        .data {
            display: none;
        }
    }
}
</style>