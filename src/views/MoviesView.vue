<template >
    <NavBar @slide="showSideBar" @slideBackFromNav="hideSideBar" />
    <div class="BigContainer">
        <Transition>
            <div class="sideContainer" v-if="showSide">
                <SideBar @slideBack="hideSideBar" />
            </div>
        </Transition>
    </div>
    <div class="MoviesZone" v-if="popularMovies" @click="hideSideBar">
        <div class="RowLabel">On Netflix</div>
        <div class="Movies">
            <div class="movie" v-for="m in inTheatres" :key="m.id">
                <router-link :to="{ name: 'MovieName', params: { Id: m.id, name: m.title, type: 'movie' } }">
                    <movieCard :imgSrc="imageBase.concat(m.poster_path)" :alt="m.title" :title="m.title"
                        :year="m.release_date.slice(0, 4)" :type="m.vote_average" :plot="m.overview" />
                </router-link>
            </div>
        </div>
        <div class="RowLabel">Popular Movies</div>
        <div class="Movies">
            <div class="movie" v-for="m in popularMovies" :key="m.id">
                <router-link :to="{ name: 'MovieName', params: { Id: m.id, name: m.title, type: 'movie' } }">
                    <movieCard :imgSrc="imageBase.concat(m.poster_path)" :alt="m.title" :title="m.title"
                        :year="m.release_date.slice(0, 4)" :type="m.vote_average" :plot="m.overview" />
                </router-link>
            </div>
        </div>
        <div class="RowLabel">Top Rated Movies</div>
        <div class="Movies">
            <div class="movie" v-for="m in TopRatedMovies" :key="m.id">
                <router-link :to="{ name: 'MovieName', params: { Id: m.id, name: m.title, type: 'movie' } }">
                    <movieCard :imgSrc="imageBase.concat(m.poster_path)" :alt="m.title" :title="m.title"
                        :year="m.release_date.slice(0, 4)" :type="m.vote_average" :plot="m.overview" />
                </router-link>
            </div>
        </div>
        <div class="RowLabel">Upcoming Movies in 23</div>
        <div class="Movies">
            <div class="movie" v-for="m in UpcomingMovies" :key="m.id">
                <router-link :to="{ name: 'MovieName', params: { Id: m.id, name: m.title, type: 'movie' } }">
                    <movieCard :imgSrc="imageBase.concat(m.poster_path)" :alt="m.title" :title="m.title"
                        :year="m.release_date" :type="m.vote_average" :plot="m.overview" />
                </router-link>
            </div>
        </div>
    </div>
    <div v-else class="loader-5 center">
        <span></span>
    </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import SideBar from "@/components/SideBar.vue";
import movieCard from "@/components/movieCard.vue";
export default {
    components: { movieCard, NavBar, SideBar },
    data() {
        return {
            inTheatres: null,
            popularMovies: null,
            TopRatedMovies: null,
            UpcomingMovies: null,
            imageBase: "http://image.tmdb.org/t/p/w500/",
            //side bar data
            showSide: false,

        }
    },
    methods: {
        //sideBar Data
        showSideBar() {
            this.showSide = !this.showSide;
        },
        hideSideBar() {
            if (this.showSide === true) {
                this.showSide = !this.showSide;
            } else return;
        },
    },
    mounted() {
        //new on netflix
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=2022&with_watch_providers=8&watch_region=EG&with_watch_monetization_types=flatrate`)
            .then((response) => response.json())
            .then((response) => {
                this.inTheatres = response.results;
                // console.log(response)
            })
            .catch((err) => console.error(err));
        //popular movies
        fetch(
            "https://api.themoviedb.org/3/movie/popular?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&page=1"
        )
            .then((response) => response.json())
            .then((response) => {
                this.popularMovies = response.results;
                // console.log(response.results)
            })
            .catch((err) => console.error(err));
        //top Rated movies
        fetch(
            "https://api.themoviedb.org/3/movie/top_rated?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&page=1"
        )
            .then((response) => response.json())
            .then((response) => {
                this.TopRatedMovies = response.results;
                // console.log(response.results)
            })
            .catch((err) => console.error(err));
        //upcoming
        fetch(`
        https://api.themoviedb.org/3/discover/movie?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=2&primary_release_year=2023&with_watch_monetization_types=flatrate`)
            .then(response => response.json())
            .then(response => {
                // console.log(response);
                this.UpcomingMovies = response.results;
            })
            .catch(err => console.log(err));
        //genres

        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                // this.UpcomingMovies2023 = response.results;
            })
            .catch(err => console.log(err));
        //testing discover movie using criteria
        // fetch(`
        // https://api.themoviedb.org/3/discover/movie?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=2022&with_watch_providers=8&with_watch_monetization_types=flatrate`)
        //     .then(response => response.json())
        //     .then(response => {
        //         console.log(response);
        //         // this.details = response;
        //     })
        //     .catch(err => console.log(err));
    }
}

</script>

<style lang="scss" scoped>
.MoviesZone {
    background: $surfaceV;
    width: calc(100% - 40px);
    min-height: 30rem;
    margin: 20px;
    overflow: hidden;

    .RowLabel {
        color: $primary;
        font-size: 20px;
        font-weight: 300;
        border-bottom: 2px $primary solid;
        padding: 30px 20px 20px 20px;
    }

    .Movies {
        display: flex;
        flex-direction: row;
        width: 100%;
        overflow-x: scroll;
        overflow-y: hidden;
        position: relative;
        z-index: 10;
        margin: 10px;

        &::-webkit-scrollbar {
            height: 10px;
            display: none;
        }

        /* Track */
        &::-webkit-scrollbar-track {
            border-radius: 15px;
        }

        /* Handle */
        &::-webkit-scrollbar-thumb {
            background: $primary;
            border-radius: 20px;
        }

        .movie {
            position: relative;
            z-index: 5;
            margin: 10px;
        }
    }
}

@include SideBarEffects;
@include loader;


@media (max-width:768px) {
    .MoviesZone {
        background: $surfaceV;
        width: calc(100% - 20px);
        min-height: 30rem;
        margin: 10px;
        overflow: hidden;

        .RowLabel {
            color: $primary;
            font-size: 15px;
            font-weight: 200;
            border-bottom: 2px $primary solid;
            padding: 20px 10px 10px 10px;
        }

        .Movies {
            display: flex;
            flex-direction: row;
            width: 100%;
            overflow-x: scroll;
            overflow-y: hidden;
            position: relative;
            z-index: 10;
            margin: 5px;

            &::-webkit-scrollbar {
                height: 4px;
                display: inline-block;
            }

            /* Track */
            &::-webkit-scrollbar-track {
                border-radius: 15px;
            }

            /* Handle */
            &::-webkit-scrollbar-thumb {
                background: $primary;
                border-radius: 20px;
            }

            .movie {
                position: relative;
                z-index: 5;
                margin: 5px;
            }
        }
    }
}
</style>