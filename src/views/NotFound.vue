<template>
    <div class="box">
        <div class="back"><font-awesome-icon icon="fa-arrow-left-long" @click="goBack" /></div>
        <div class="title">Oops Page Not Found</div>
        <font-awesome-icon icon="fa-solid fa-circle-exclamation" />
    </div>
</template>

<script>
export default {
    methods: {
        //arrow btn in wideArea
        goBack() {
            this.$router.go(-1)
        },
    }
}
</script>

<style lang="scss" scoped>
.box {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 10rem;

    @media (max-width:768px) {
        font-size: 5rem;
    }





    .back {
        position: absolute;
        top: 10px;
        left: 20px;
        font-size: 30px;
        cursor: pointer;

        font-awesome {
            cursor: pointer;
        }
    }

    .title {
        font-size: 7.5rem;
        margin: 2rem;

        @media (max-width: 1300px) {
            font-size: 4.5rem;
        }

        @media (max-width:768px) {
            font-size: 3rem;
        }

        @media (max-width: 576px) {
            font-size: 1.5rem;
        }
    }

}
</style>