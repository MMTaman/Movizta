<template>
    <div class="back"><font-awesome-icon icon="fa-arrow-left-long" @click="goBack" /></div>
    <div class="searchBarBox">
        <input type="text" name="finder" class="searchBar" placeholder="Search" @keypress.enter="searchProcess"
            ref="searchedTitle" v-model="searchTitle">

        <button class="searchIcon" v-if="showSearchIcon" @click="searchProcess">
            <font-awesome-icon icon="magnifying-glass" />
        </button>
    </div>
    <div class="searchZone" v-if="this.searchedData">
        <div class="MovieZone" v-for="s in searchedData" :key="s.id">
            <div class="movie">
                <router-link :to="{ name: 'MovieName', params: { Id: s.id, name: s.title, type: s.media_type } }"
                    v-if="s.media_type == 'movie'">
                    <movieCard :title="s.title" :alt="s.title" :imgSrc="imageBase.concat(s.poster_path)"
                        :type="s.media_type.toUpperCase()" :year="s.release_date.slice(0, 4)" />
                </router-link>
                <router-link :to="{ name: 'MovieName', params: { Id: s.id, name: s.name, type: s.media_type } }"
                    v-else-if="s.media_type == 'tv'">
                    <movieCard :title="s.name" :alt="s.name" :imgSrc="imageBase.concat(s.poster_path)"
                        :type="s.media_type.toUpperCase()" :year="s.first_air_date.slice(0, 4)" />
                </router-link>
                <router-link
                    :to="{ name: 'ActorName', params: { Id: s.id, name: s.name, type: s.media_type, department: s.known_for_department } }"
                    v-else-if="s.media_type == 'person'">
                    <movieCard :title="s.name" :alt="s.name" :imgSrc="imageBase.concat(s.profile_path)"
                        :type="s.media_type.toUpperCase()" :year="s.known_for_department" />
                </router-link>
            </div>
        </div>
    </div>
    <div v-else class="loader-5 center">
        <span></span>
    </div>
    <div class="NothingFound" v-if="$route.params.results==0">
        <div class="title"> Nothing Found!</div>
        <div class="lightText">try searching for a movie or a celebrity</div>
    </div>
    <div class="pages" v-if="showPagination">
        <ul class="NumList">
            <li @click="Pagination" ref="pageN" v-for="n in pagesArray.slice(0, 5)" :key="n" :data-index="n">{{ n }}
            </li>
        </ul>
    </div>
</template>

<script>
import movieCard from '@/components/movieCard.vue';
export default {
    components: { movieCard },
    data() {
        return {
            showSearchIcon: true,
            searchedData: null,
            movies: null,
            shows: null,
            people: null,
            searchTitle: "",
            imageBase: "http://image.tmdb.org/t/p/w500/",
            //pagination
            showPagination: false,
            pagesArray: [...Array(parseInt(this.$route.params.results)).keys()].map((el) => el += 1),
        }
    },
    beforeMount() {
        fetch(`https://api.themoviedb.org/3/search/multi?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&query=${this.$route.params.title}&page=${this.$route.params.page}`)
            .then(res => res.json())
            .then(res => {
                // console.log(res.total_pages)
                this.searchedData = res.results.filter((el) => el.poster_path || el.profile_path)
                if (res.total_pages > 1) { this.showPagination = true }
            })
            .catch(err => console.log(err))
    }
    ,
    updated() {
        if (this.$refs.pageN) {
            this.$refs.pageN[(parseInt(this.$route.params.page - 1))].classList.add('active')
        }
        else return
    },
    methods: {
        startSearch() {
            this.showSearchIcon = !this.showSearchIcon
        },
        searchProcess() {
            if (this.searchTitle) {
                fetch(`https://api.themoviedb.org/3/search/multi?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&query=${this.searchTitle}&page=${1}`)
                    .then(res => res.json())
                    .then(res => {
                        console.log(res)
                        this.searchedData = res.results.filter((el) => el.poster_path)
                        //setting pagination data
                        if (res.total_pages > 1) { this.showPagination = true }

                        this.$router.push({ name: `search`, params: { title: `${this.searchTitle}`, results: `${res.total_pages}`, page: '1' } })
                    });

            }
            else (console.log('enter a title'))
        },
        //Pagination Click
        Pagination(e) {
            let AllPagesArr = []
            AllPagesArr = [this.$refs.pageN]
            // console.log(AllPagesArr)
            AllPagesArr.flat(1).forEach((el, i) => {
                if (e.target.innerHTML == el.innerHTML) {
                    // console.log()
                    el.classList.add('active')
                    fetch(`https://api.themoviedb.org/3/search/multi?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&query=${this.$route.params.title}&page=${i + 1}`)
                        .then(res => res.json())
                        .then(res => {
                            // console.log(res.total_pages)
                            this.searchedData = res.results.filter((el) => el.poster_path || el.profile_path)
                            this.$router.push({ name: `search`, params: { title: `${this.$route.params.title}`, results: `${this.$route.params.results}`, page: `${i + 1}` } })

                        })
                        .catch(err => console.log(err))


                }
                else {
                    el.classList.remove('active')

                }
            });

        },
        //arrow btn in wideArea
        goBack() {
            this.$router.push({ name: `home` })
        }
    }

}
</script>

<style lang="scss" scoped>
.pages {
    text-overflow: ellipsis;
    max-width: fit-content;
    height: fit-content;
    display: flex;
    justify-content: center;
    border: 1px $primary solid;
    border-radius: 5px;
    background-color: $bgColor;
    color: $primary;
    position: relative;
    margin: 10px 0 10px calc(50% - 5rem);

    .active {
        border-bottom: $primaryV 1.5px solid;
    }

    .NumList {
        list-style: none;
        display: flex;
        justify-content: center;
        // background-color: green;
        margin: 0;
        padding: 0;

        li {
            margin: 0px 5px 0 5px;
            font-size: 20px;
            padding: 10px;
            cursor: pointer;
            // background-color: red;

        }
    }

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

a {
    text-decoration: none;
    color: $secondary;
}

.searchBarBox {
    justify-self: center;
    height: fit-content;
    width: fit-content;
    margin: 25px 0 0 calc(50% - 10rem);

    .searchBar {
        background-color: $bgColor;
        // height: 2.2rem;
        width: 20rem;
        color: $secondary;
        font-weight: 400;
        font-size: 18px;
        padding: 5px;
        border: $surfaceVV 1.5px solid;

        &::placeholder {
            color: $surfaceVV;
            font-size: 14px;
        }

        &:focus {
            outline: $surfaceVV 1px solid;

        }
    }

    .searchIcon {
        height: 2.2rem;
        width: 2.2rem;
        background-color: $bgColor;
        border-radius: 50%;
        margin-left: 5px;
        border: $surfaceVV 1.5px solid;
        cursor: pointer;
        color: $surfaceVV;

    }
}

.searchZone {
    width: calc(100% - 40px);
    min-height: fit-content;
    background-color: transparent;
    margin: 10px;
    padding: 10px;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: repeat(6, 1fr);
    grid-row-gap: 1rem;
    border-radius: 3px;


    .MovieZone {
        position: relative;
        z-index: 10;
        justify-self: center;
        // background-color: red;
    }
}
.NothingFound{
    text-align: center;
    text-transform: capitalize;
    .title{
        font-size: 18px
    }
    .lightText{
        font-size: 14px;
        color: $surfaceVV
    }
}

@include loader;

@media (max-width:1200px) {
    .searchBarBox {
        justify-self: center;
        height: fit-content;
        width: fit-content;
        margin: 10px 0 0 calc(50% - (10rem/1.25));

        .searchBar {
            background-color: $bgColor;
            height: fit-content;
            width: (20rem/1.25);
            color: $secondary;
            font-weight: 300;
            font-size: (18px / 1.5);
            // padding: 5px;
            border: $surfaceVV 1.5px solid;

            &::placeholder {
                color: $surfaceVV;
                font-size: (14px/1.5);
            }

            &:focus {
                outline: $surfaceVV 1.5px solid;

            }
        }

        .searchIcon {
            height: 2rem;
            width: 2rem;
            background-color: $bgColor;
            border-radius: 50%;
            // margin-left: 5px;
            border: $surfaceVV 1.5px solid;
            cursor: pointer;
            color: $surfaceVV;
            transform: scale(.85);

        }
    }

    .searchZone {
        width: calc(100% - 40px);
        min-height: fit-content;
        background-color: transparent;
        margin: 10px;
        padding: 10px;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: repeat(4, 1fr);
        grid-row-gap: 1rem;
        border-radius: 3px;

        .MovieZone {
            position: relative;
            z-index: 10;
            justify-self: center;
        }
    }
}

@media (max-width:768px) {
    .pages {
        text-overflow: ellipsis;
        max-width: fit-content;
        height: fit-content;
        display: flex;
        justify-content: center;
        border: 1px $primary solid;
        border-radius: 5px;
        background-color: $bgColor;
        color: $primary;
        position: relative;
        margin: 10px 0 10px calc(50% - 4rem);

        .active {
            border-bottom: $primaryV 1px solid;
        }

        .NumList {
            list-style: none;
            display: flex;
            justify-content: center;
            // background-color: green;
            margin: 0;
            padding: 0;

            li {
                margin: 0px 5px 0 5px;
                font-size: (20px/1.5);
                padding: 5px;
                cursor: pointer;
                // background-color: red;

            }
        }

    }

    .back {
        position: absolute;
        top: 10px;
        left: 20px;
        font-size: 20px;
        cursor: pointer;

        font-awesome {
            cursor: pointer;
        }
    }

    .searchBarBox {
        justify-self: center;
        height: fit-content;
        width: fit-content;
        margin: 10px 0 0 calc(50% - (10rem/2));

        .searchBar {
            background-color: $bgColor;
            height: fit-content;
            width: (20rem/2);
            color: $secondary;
            font-weight: 300;
            font-size: (18px / 2);
            // padding: 5px;
            border: $surfaceVV 1px solid;

            &::placeholder {
                color: $surfaceVV;
                font-size: (14px/2);
            }

            &:focus {
                outline: $surfaceVV 1px solid;

            }
        }

        .searchIcon {
            height: 2rem;
            width: 2rem;
            background-color: $bgColor;
            border-radius: 50%;
            // margin-left: 5px;
            border: $surfaceVV 1px solid;
            cursor: pointer;
            color: $surfaceVV;
            transform: scale(.75);

        }
    }

    .searchZone {
        width: calc(100% - 40px);
        min-height: fit-content;
        background-color: transparent;
        margin: 10px;
        padding: 10px;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: repeat(5, 1fr);

        @media (max-width:665px) {
            grid-template-columns: repeat(4, 1fr);
        }

        grid-row-gap: 1rem;
        border-radius: 3px;

        .MovieZone {
            position: relative;
            z-index: 10;
            justify-self: center;
        }
    }
}

@media (max-width:576px) {
    .pages {
        text-overflow: ellipsis;
        max-width: fit-content;
        height: fit-content;
        display: flex;
        justify-content: center;
        border: 1px $primary solid;
        border-radius: 5px;
        background-color: $bgColor;
        color: $primary;
        position: relative;
        margin: 10px 0 10px calc(50% - 3.5rem);

        .active {
            border-bottom: $primaryV 1.5px solid;
        }

        .NumList {
            list-style: none;
            display: flex;
            justify-content: center;
            // background-color: green;
            margin: 0;
            padding: 0;

            li {
                margin: 0px 5px 0 5px;
                font-size: 20px/2;
                padding: 2.5px;
                cursor: pointer;
                // background-color: red;

            }
        }

    }

    .back {
        position: absolute;
        top: 10px;
        left: 20px;
        font-size: 15px;
        cursor: pointer;

        font-awesome {
            cursor: pointer;
        }
    }

    .searchBarBox {
        justify-self: center;
        height: fit-content;
        width: fit-content;
        margin: 10px 0 0 calc(50% - (10rem/2.5));

        .searchBar {
            background-color: $bgColor;
            height: fit-content;
            width: (20rem/2.5);
            color: $secondary;
            font-weight: 300;
            font-size: (18px / 2.5);
            // padding: 5px;
            border: $surfaceVV .5px solid;

            &::placeholder {
                color: $surfaceVV;
                font-size: (14px/2.5);
            }

            &:focus {
                outline: $surfaceVV 1px solid;

            }
        }

        .searchIcon {
            height: 2rem;
            width: 2rem;
            background-color: $bgColor;
            border-radius: 50%;
            // margin-left: 5px;
            border: $surfaceVV .5px solid;
            cursor: pointer;
            color: $surfaceVV;
            transform: scale(.65);

        }
    }

    .searchZone {
        width: calc(100% - 40px);
        min-height: fit-content;
        background-color: transparent;
        margin: 10px;
        padding: 10px;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: repeat(3, 1fr);
        grid-row-gap: 1rem;
        border-radius: 3px;


        .MovieZone {
            position: relative;
            z-index: 10;
            justify-self: center;
        }
    }
}
</style>