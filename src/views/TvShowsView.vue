<template>
    <NavBar @slide="showSideBar" @slideBackFromNav="hideSideBar" />
    <div class="BigContainer">
        <Transition>
            <div class="sideContainer" v-if="showSide">
                <SideBar @slideBack="hideSideBar" />
            </div>
        </Transition>
    </div>
    <div class="TvZone" v-if="popularShows" @click="hideSideBar">
        <div class="RowLabel">On Netflix</div>
        <div class="Shows">
            <div class="show" v-for="s in AiringTodayShows" :key="s.id">
                <router-link :to="{ name: 'MovieName', params: { Id: s.id, name: s.name, type: 'tv' } }">
                    <movieCard :imgSrc="imageBase.concat(s.poster_path)" :alt="s.name" :title="s.name"
                        :year="s.first_air_date.slice(0, 4)" :plot="s.overview" :type="s.vote_average" />

                </router-link>
            </div>
        </div>
        <div class="RowLabel">Popular Shows</div>
        <div class="Shows">
            <div class="show" v-for="s in popularShows" :key="s.id">
                <router-link :to="{ name: 'MovieName', params: { Id: s.id, name: s.name, type: 'tv' } }">
                    <movieCard :imgSrc="imageBase.concat(s.poster_path)" :alt="s.name" :title="s.name"
                        :year="s.first_air_date.slice(0, 4)" :plot="s.overview" :type="s.vote_average" />

                </router-link>
            </div>
        </div>
        <div class="RowLabel">Top Rated Shows</div>
        <div class="Shows">
            <div class="show" v-for="s in TopRatedShows" :key="s.id">
                <router-link :to="{ name: 'MovieName', params: { Id: s.id, name: s.name, type: 'tv' } }">
                    <movieCard :imgSrc="imageBase.concat(s.poster_path)" :alt="s.name" :title="s.name"
                        :year="s.first_air_date.slice(0, 4)" :plot="s.overview" :type="s.vote_average" />

                </router-link>
            </div>
        </div>
        <div class="RowLabel">Upcoming Shows in 23</div>
        <div class="Shows">
            <div class="show" v-for="s in UpcomingShows" :key="s.id">
                <router-link :to="{ name: 'MovieName', params: { Id: s.id, name: s.name, type: 'tv' } }">
                    <movieCard :imgSrc="imageBase.concat(s.poster_path)" :alt="s.name" :title="s.name"
                        :year="s.first_air_date.slice(0, 4)" :plot="s.overview" :type="s.vote_average" />
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
            AiringTodayShows: null,
            popularShows: null,
            TopRatedShows: null,
            UpcomingShows:null,
            imageBase: "http://image.tmdb.org/t/p/w500/",
            //side bar data
            showSide: false,
            //genres 
            Categories: null,
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
        //shows on netflix but didnt change the variable name
        fetch(
            "https://api.themoviedb.org/3/discover/tv?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=2022&with_watch_providers=8&watch_region=EG&with_watch_monetization_types=flatrate"
        )
            .then((response) => response.json())
            .then((response) => {
                this.AiringTodayShows = response.results;
                // console.log(response)
            })
            .catch((err) => console.error(err));
        //popular Tv Shows
        fetch(
            "https://api.themoviedb.org/3/tv/popular?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&page=3"
        )
            .then((response) => response.json())
            .then((response) => {
                this.popularShows = response.results;
                // console.log(response.results)
            })
            .catch((err) => console.error(err));
        //top Rated Shows
        fetch(
            "https://api.themoviedb.org/3/tv/top_rated?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&page=1"
        )
            .then((response) => response.json())
            .then((response) => {
                this.TopRatedShows = response.results;
                // console.log(response.results)
            })
            .catch((err) => console.error(err));



        //upcoming
        fetch(`https://api.themoviedb.org/3/discover/tv?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=2&primary_release_year=2023&with_watch_monetization_types=flatrate`)
            .then(response => response.json())
            .then(response => {
                // console.log(response);
                this.UpcomingShows = response.results
            })
            .catch(err => console.log(err));
    }
}
</script>

<style lang="scss" scoped>
.TvZone {
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

    .Shows {
        display: flex;
        flex-direction: row;
        width: 100%;
        overflow-x: scroll;
        overflow-y: hidden;
        position: relative;
        z-index: 10;
        margin: 10px;

        &::-webkit-scrollbar {
            width: 15px;
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

        .show {
            position: relative;
            z-index: 5;
            margin: 0px 10px;
        }
    }
}

@include SideBarEffects;
@include loader;


@media (max-width:768px) {
    .TvZone {
        background: $surfaceV;
        width: calc(100% - 40px);
        min-height: 30rem;
        margin: 20px;
        overflow: hidden;

        .RowLabel {
            color: $primary;
            font-size: 15px;
            font-weight: 200;
            border-bottom: 2px $primary solid;
            padding: 5px;
        }

        .Shows {
            display: flex;
            flex-direction: row;
            width: 100%;
            overflow-x: scroll;
            overflow-y: hidden;
            position: relative;
            z-index: 10;
            margin: 10px;

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

            .show {
                position: relative;
                z-index: 5;
                margin: 5px;
            }
        }
    }
}
</style>