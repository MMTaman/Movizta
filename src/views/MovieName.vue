<template >
    <NavBar @slide="showSideBar" @slideBackFromNav="hideSideBar" v-show="showNav" @openBar="showBar = !showBar" />
    <Transition name="fade">
        <div class="searchBox" @click.self="showBar = !showBar" v-if="showBar">
            <div class="searchBarBox">
                <input type="text" name="finder" class="searchBar" placeholder="Search" @keypress.enter="searchProcess"
                    ref="searchedTitle" v-model="searchTitle">


                <button class="searchIcon" @click="searchProcess">
                    <font-awesome-icon icon="magnifying-glass" />
                </button>
            </div>
        </div>
    </Transition>
    <div class="BigContainer">
        <Transition>
            <div class="sideContainer" v-if="showSide">
                <SideBar @slideBack="hideSideBar" />
            </div>
        </Transition>
    </div>
    <div class="DetailsZone" @click="hideSideBar" v-if="videos.trailer">
        <transition name="fade">
            <div class="modal" v-if="showModal" @click.self="ShowandHideModal">
                <div class="exit" @click="ShowandHideModal">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                </div>
                <div class="main">
                    <img :src="imageSrc" alt="">
                </div>
            </div>
        </transition>

        <div class="WideArea" ref="backdrop">
            <div class="back"><font-awesome-icon icon="fa-arrow-left-long" @click="goBack" /></div>
            <div class="DimmedArea">
                <div class="lhs">
                    <div class="title" ref="title" v-if="!ShowisShown">{{ details.title }}</div>
                    <div class="title" ref="title" v-if="ShowisShown">{{ details.name }}</div>

                    <div class="seasons" v-if="ShowisShown">
                        <span>{{ details.number_of_seasons }} Seasons</span>
                        <span>{{ details.number_of_episodes }} Episodes</span>
                        <span v-if="details.in_production">Up-to-date</span>
                        <span v-else>Ended</span>
                    </div>
                    <div class="info">
                        <span class="runTime" v-if="!ShowisShown & details.runtime">{{ details.runtime }}min</span>
                        <span class="runTime" v-if="ShowisShown & details.episode_run_time">{{
                                details.episode_run_time[0]
                        }}min</span>
                        <span class="type">
                            <div v-for="genre in details.genres" :key="genre">
                                {{ genre.name }}
                            </div>
                        </span>
                        <span class="year" v-if="!ShowisShown">{{ details.release_date }}</span>
                        <span class="year" v-if="ShowisShown">{{ details.first_air_date }}</span>
                    </div>
                    <div class="plot">{{ details.overview }} </div>
                    <div class="rate" v-if="details.vote_average"><span>{{ details.vote_average }}</span>/10</div>
                </div>
                <div class="rhs">
                    <div class="starring">
                        <div class="starringWord" v-if="cast.length">Starring</div>
                        <div class="a" v-for="actor in cast.slice(0, 3)" :key="actor.id">
                            <router-link
                                :to="{ name: 'ActorName', params: { Id: actor.id, name: actor.name, type: 'Person', department: actor.known_for_department } }">
                                {{ actor.name }}
                            </router-link>
                        </div>
                    </div>
                    <div class="starring" v-if="crew.creators.length">
                        <div class="starringWord">Created By</div>
                        <div class="a" v-for="p in crew.creators" :key="p.id">
                            <router-link
                                :to="{ name: 'ActorName', params: { Id: p.id, name: p.name, type: 'Person', department: p.known_for_department } }">
                                {{ p.name }}
                            </router-link>
                        </div>
                    </div>
                    <div class="starring" v-else-if="crew.directors.length">
                        <div class="starringWord">Directed By</div>
                        <div class="a" v-for="p in crew.directors" :key="p.id">
                            <router-link
                                :to="{ name: 'ActorName', params: { Id: p.id, name: p.name, type: 'Person', department: p.known_for_department } }">
                                {{ p.name }}
                            </router-link>
                        </div>
                    </div>
                    <div class="starring" v-else-if="crew.producers.length">
                        <div class="starringWord">Produced By</div>
                        <div class="a" v-for="p in crew.producers.slice(0, 4)" :key="p.id">
                            <router-link
                                :to="{ name: 'ActorName', params: { Id: p.id, name: p.name, type: 'Person', department: p.known_for_department } }">
                                {{ p.name }}
                            </router-link>
                        </div>
                    </div>
                    <div class="watchon" v-if="source1 || source2">
                        <span>Availabe On</span>
                        <div v-if="source1">
                            <img v-for="s in source1.slice(0, 3)" :src="imageBase.concat(s.logo_path)" :key="s.name"
                                :alt="s.name">
                        </div>
                        <div v-else-if="source2">
                            <img v-for="s in source2.slice(0, 3)" :src="imageBase.concat(s.logo_path)" :key="s.name"
                                :alt="s.name">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="MoreDetails">
            <div class="GalleryZone">
                <div class="RowLabel">Gallery</div>
                <div class="Gallery">
                    <div class="landscape" v-for="backdrop in images.backdrops" :key="backdrop">
                        <img :src="imageBase.concat(backdrop.file_path)" alt="" @click="ShowandHideModal">
                    </div>
                </div>
            </div>
            <div class="TrailerZone" v-if="!ShowisShown">
                <ul class="Tabs">
                    <li class="chosen" @click="showClickedTab" ref="tab1">Trailers</li>
                    <li @click="showClickedTab" ref="tab2">Teasers</li>
                    <li @click="showClickedTab" ref="tab3">Others</li>
                </ul>
                <div class="Videos">
                    <div v-if="TabShown.Trailers" class="TabBoxShown">
                        <div class="trailer" v-for="trailer in videos.trailer" :key="trailer">
                            <iframe :src="YtVidBase.concat(trailer.key)" title="YouTube video player" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen></iframe>
                            <div class="vidCap">{{ trailer.name }}</div>
                        </div>
                        <div v-if="!videos.trailer.length" class="noVids">No Trailers</div>

                    </div>
                    <div v-if="TabShown.Teasers" class="TabBoxShown">
                        <div class="teaser" v-for="teaser in videos.teaser" :key="teaser">
                            <iframe :src="YtVidBase.concat(teaser.key)" title="YouTube video player" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen></iframe>
                            <div class="vidCap">{{ teaser.name }}</div>
                        </div>
                        <div v-if="!videos.teaser.length" class="noVids">No Teasers</div>
                    </div>
                    <div v-if="TabShown.Others" class="TabBoxShown">
                        <div class="feat" v-for="feat in videos.feat" :key="feat">
                            <iframe :src="YtVidBase.concat(feat.key)" title="YouTube video player" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen></iframe>
                            <div class="vidCap">{{ feat.name }}</div>
                        </div>
                        <div v-if="!videos.feat.length" class="noVids">No Videos</div>
                    </div>
                </div>

            </div>
            <div class="TrailerZone" v-if="ShowisShown">
                <ul class="Tabs">
                    <li class="chosen" @click="showClickedTab" ref="tab1">Trailers</li>
                </ul>
                <div class="Videos">
                    <div class="TabBoxShown">
                        <div class="trailer" v-for="trailer in videos.combined" :key="trailer">
                            <iframe :src="YtVidBase.concat(trailer.key)" title="YouTube video player" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen></iframe>
                            <div class="vidCap">{{ trailer.name }}</div>
                        </div>
                        <div v-if="!videos.combined.length" class="noVids">No Trailers</div>
                    </div>
                </div>
            </div>
            <div class="CastZone">
                <div class="cast">
                    <div class="RowLabel">Cast</div>
                    <div class="Actor" v-for="actor in cast.slice(0, 10)" :key="actor.id">
                        <div class="profile">
                            <router-link
                                :to="{ name: 'ActorName', params: { Id: actor.id, name: actor.name, type: 'Person', department: actor.known_for_department } }">
                                <img :src="imageBase.concat(actor.profile_path)" alt="">
                            </router-link>
                        </div>
                        <div class="ActorData">
                            <div class="name">
                                <router-link
                                    :to="{ name: 'ActorName', params: { Id: actor.id, name: actor.name, type: 'Person', department: actor.known_for_department } }">
                                    {{ actor.name }}
                                </router-link>
                            </div>
                            <div class="ShowName">{{ actor.character }}</div>
                        </div>
                    </div>
                </div>
                <div class="Directors">
                    <div class="RowLabel" v-if="crew.directors.length"> Directed By</div>
                    <div class="director" v-for="p in crew.directors" :key="p.id">
                        <div class="profile">
                            <router-link
                                :to="{ name: 'ActorName', params: { Id: p.id, name: p.name, type: 'Person', department: p.known_for_department } }">
                                <img :src="imageBase.concat(p.profile_path)" alt="">
                            </router-link>
                        </div>
                        <div class="directorData">
                            <div class="name">
                                <router-link
                                    :to="{ name: 'ActorName', params: { Id: p.id, name: p.name, type: 'Person', department: p.known_for_department } }">
                                    {{ p.name }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div v-if="!crew.directors.length">
                        <div class="RowLabel"> Produced By</div>
                        <div class="director" v-for="p in crew.producers.slice(0, 5)" :key="p.id">
                            <div class="profile">
                                <router-link
                                    :to="{ name: 'ActorName', params: { Id: p.id, name: p.name, type: 'Person', department: p.known_for_department } }">
                                    <img :src="imageBase.concat(p.profile_path)" alt="">
                                </router-link>
                            </div>
                            <div class="directorData">
                                <div class="name">
                                    <router-link
                                        :to="{ name: 'ActorName', params: { Id: p.id, name: p.name, type: 'Person', department: p.known_for_department } }">
                                        {{ p.name }}
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="RowLabel" v-if="crew.composers.length"> SoundTracks By</div>
                    <div class="director" v-for="p in crew.composers" :key="p.id">
                        <div class="profile">
                            <router-link
                                :to="{ name: 'ActorName', params: { Id: p.id, name: p.name, type: 'Person', department: p.known_for_department } }">
                                <img :src="imageBase.concat(p.profile_path)" alt="">
                            </router-link>
                        </div>
                        <div class="directorData">
                            <div class="name">
                                <router-link
                                    :to="{ name: 'ActorName', params: { Id: p.id, name: p.name, type: 'Person', department: p.known_for_department } }">
                                    {{ p.name }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="SimilarTitles" v-if="!ShowisShown">
                <div class="RowLabel" v-if="similar.length"> Similar Movies</div>
                <div class="movies">
                    <div class="movie" v-for="m in similar" :key="m.id">
                        <router-link
                            :to="{ name: 'MovieName', params: { Id: m.id, name: m.title, type: this.$route.params.type } }">
                            <movieCard :imgSrc="imageBase.concat(m.poster_path)" :alt="m.title" :title="m.title"
                                :year="m.release_date.slice(0, 4)" :type="m.vote_average" :plot="m.overview"
                                @click="ReloadingMovie" />
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="similarShowsZone" v-if="ShowisShown">
                <div class="RowLabel" v-if="similar.length">Similar Shows</div>
                <div class="similarShows">
                    <div class="show" v-for="s in similar" :key="s.id">
                        <router-link
                            :to="{ name: 'MovieName', params: { Id: s.id, name: s.name, type: $route.params.type } }">
                            <movieCard :imgSrc="imageBase.concat(s.poster_path)" :alt="s.name" :title="s.name"
                                :year="s.first_air_date.slice(0, 4)" :plot="s.overview" :type="s.vote_average"
                                @click="ReloadingShow" />
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="EpisodesZone" v-if="ShowisShown">
                <div class="RowLabel"> Episodes</div>
                <div class="SetOfSeasons">
                    <div class="caption">Choose a Season</div>
                    <select name="Seasons" id="Seasons" @change="valueChange" v-model="seasonValue">
                        <option v-for="s in details.number_of_seasons" :key="s" :value="s"> Season {{ s }}</option>
                    </select>
                </div>
                <div class="Episode" v-for="e in Episodes" :key="e">
                    <img :src="imageBase.concat(e.still_path)" alt="">
                    <div class="details">
                        <div class="Enumber">
                            {{ e.episode_number }} - {{ e.name }}
                        </div>
                        <div class="overview">
                            {{ e.overview }}
                        </div>
                        <div class="rate">
                            <span>{{ e.vote_average }}</span>
                            <span>{{ e.runtime }} min</span>
                            <span>{{ e.air_date }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="loader-5 center">
        <span></span>
    </div>
</template>

<script>
import movieCard from '@/components/movieCard.vue';
import NavBar from '@/components/NavBar.vue';
import SideBar from "@/components/SideBar.vue";


export default {
    components: { movieCard, NavBar, SideBar },
    data() {
        return {
            //navBar
            showNav: false,
            watchmodeKEY: "vziVrlqwwjXNx2LBEFsk1P6jB2UhZdWOGqENeu2V",
            //for moviedb
            ShowisShown: false,
            details: null,
            cast: null,
            crew: { directors: null, creators: null, composers: null, producers: null },
            source1: null,
            source2: null,
            similar: null,
            images: { backdrops: null, logos: null, posters: null },
            videos: { trailer: null, teaser: null, feat: null, combined: null },
            seasonValue: 1,
            Episodes: null,
            SeasonData: null,
            YtVidBase: 'https://www.youtube.com/embed/',
            imageBase: "http://image.tmdb.org/t/p/original/",
            //modal
            showModal: false,
            imageSrc: null,
            //TabBar
            TabShown: { Trailers: true, Teasers: false, Others: false },
            //side bar data
            showSide: false,
            //colorthief
            //searchBar
            searchTitle: "",
            searchedData: null,
            showBar: false

        };
    },
    beforeMount() {
        window.addEventListener('scroll', this.navBgAlteration);
        if (this.$route.params.type == 'movie') {
            this.ShowisShown = false
            //getting movie data from moviedb
            fetch(`https://api.themoviedb.org/3/movie/${this.$route.params.Id}?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
                .then(response => response.json())
                .then(response => {
                    // console.log(response);
                    this.details = response;
                })
                .catch(err => console.log(err));
            //getting cast data
            fetch(`https://api.themoviedb.org/3/movie/${this.$route.params.Id}/credits?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    this.cast = res.cast
                    this.crew.creators = res.crew.filter((el) => el.known_for_department == 'Creator')
                    this.crew.directors = res.crew.filter((el) => el.job == 'Director')
                    this.crew.composers = res.crew.filter((el) => el.job == 'Original Music Composer')
                    this.crew.producers = res.crew.filter((el) => el.job == 'Executive Producer')

                })
                .catch(err => console.log(err))
            //getting watch source
            fetch(`https://api.themoviedb.org/3/movie/${this.$route.params.Id}/watch/providers?api_key=027ef6b5c80761ceecd553242c390211`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res.results)
                    this.source2 = res.results.EG.buy
                    this.source1 = res.results.EG.flatrate
                })
                .catch(err => console.log(err))
            //get similar movies
            fetch(`https://api.themoviedb.org/3/movie/${this.$route.params.Id}/recommendations?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&page=1`)
                .then(res => res.json())
                .then(res => {
                    // console.log(this.similar)
                    this.similar = res.results
                })
                .catch(err => console.log(err))
            //getting images of movie
            fetch(`https://api.themoviedb.org/3/movie/${this.$route.params.Id}/images?api_key=027ef6b5c80761ceecd553242c390211`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    this.images.backdrops = res.backdrops
                    this.images.logos = res.logos
                    this.images.posters = res.posters
                })
                .catch(err => console.log(err))
            //getting videos of movie
            fetch(`https://api.themoviedb.org/3/movie/${this.$route.params.Id}/videos?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res.results)
                    this.videos.trailer = res.results.filter((el) => el.type == 'Trailer')
                    this.videos.teaser = res.results.filter((el) => el.type == 'Teaser')
                    this.videos.feat = res.results.filter((el) => el.type == 'Featurette')

                })
                .catch(err => console.log(err))

        }
        else if (this.$route.params.type == 'tv') {
            this.ShowisShown = true
            //shows
            fetch(`https://api.themoviedb.org/3/tv/${this.$route.params.Id}?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
                .then(response => response.json())
                .then(response => {
                    // console.log(response);
                    this.details = response;
                })
                .catch(err => console.log(err));

            //getting cast data
            fetch(`https://api.themoviedb.org/3/tv/${this.$route.params.Id}/credits?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res.cast)
                    this.cast = res.cast
                    this.crew.creators = res.crew.filter((el) => el.known_for_department == 'Creator')
                    this.crew.directors = res.crew.filter((el) => el.known_for_department == 'Directing')
                    this.crew.composers = res.crew.filter((el) => el.job == 'Original Music Composer')
                    this.crew.producers = res.crew.filter((el) => el.job == 'Executive Producer')

                })
                .catch(err => console.log(err))
            //getting watch source
            fetch(`https://api.themoviedb.org/3/tv/${this.$route.params.Id}/watch/providers?api_key=027ef6b5c80761ceecd553242c390211`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res.results)
                    this.source2 = res.results.EG.buy
                    this.source1 = res.results.EG.flatrate
                })
                .catch(err => console.log(err))
            //get similar shows
            fetch(`https://api.themoviedb.org/3/tv/${this.$route.params.Id}/recommendations?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&page=1`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res.results)
                    this.similar = res.results
                })
                .catch(err => console.log(err))
            //getting images of show
            fetch(`https://api.themoviedb.org/3/tv/${this.$route.params.Id}/images?api_key=027ef6b5c80761ceecd553242c390211`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    this.images.backdrops = res.backdrops
                    this.images.logos = res.logos
                    this.images.posters = res.posters

                })
                .catch(err => console.log(err))
            //getting videos of show
            fetch(`https://api.themoviedb.org/3/tv/${this.$route.params.Id}/videos?api_key=027ef6b5c80761ceecd553242c390211`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res.results)
                    this.videos.trailer = res.results.filter((el) => el.type == 'Trailer')
                    this.videos.teaser = res.results.filter((el) => el.type == 'Teaser')
                    this.videos.feat = res.results.filter((el) => el.type == 'Featurette')
                    this.videos.combined = res.results

                })
                .catch(err => console.log(err))

            //getting Seasons of show
            fetch(`https://api.themoviedb.org/3/tv/${this.$route.params.Id}/season/${this.seasonValue}?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    this.SeasonData = res
                    this.Episodes = res.episodes
                })
                .catch(err => console.log(err))
            //getting Episodes of show
            // fetch(`https://api.themoviedb.org/3/tv/1668/season/1/episode/1?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
            //     .then(res => res.json())
            //     .then(res => {
            //         // console.log(res)

            //     })
            //     .catch(err => console.log(err))

        }


    },
    updated() {
        this.$refs.backdrop.style.backgroundImage = `url(${this.imageBase.concat(this.details.backdrop_path)})`
    },
    methods: {
        navBgAlteration() {
            // console.log(window.scrollY)
            if (window.scrollY >= this.$refs.backdrop.offsetHeight) {
                this.showNav = true
            }
            else {
                this.showNav = false
            }
        },
        //sideBar Data
        showSideBar() {
            this.showSide = !this.showSide;

        },
        hideSideBar() {
            if (this.showSide === true) {
                this.showSide = !this.showSide;
            } else return;
        },
        //arrow btn in wideArea
        goBack() {
            this.$router.go(-1)
        },
        //tab bar on click
        showClickedTab(e) {
            let TabsArr = []
            TabsArr.push(this.$refs.tab1, this.$refs.tab2, this.$refs.tab3)
            TabsArr.forEach(el => {
                if (e.target.innerHTML == el.innerHTML) {
                    el.classList.add('chosen')
                    if (e.target.innerHTML == 'Trailers') {
                        this.TabShown.Trailers = true
                        this.TabShown.Teasers = false
                        this.TabShown.Others = false
                    }
                    else if (e.target.innerHTML == 'Teasers') {
                        this.TabShown.Trailers = false
                        this.TabShown.Teasers = true
                        this.TabShown.Others = false
                    }
                    else if (e.target.innerHTML == 'Others') {
                        this.TabShown.Trailers = false
                        this.TabShown.Teasers = false
                        this.TabShown.Others = true
                    }
                }
                else {
                    el.classList.remove('chosen')
                }
            });

        },
        ShowandHideModal(e) {
            this.imageSrc = e.target.src
            this.showModal = !this.showModal
        },
        valueChange() {
            //getting Seasons of show
            fetch(`https://api.themoviedb.org/3/tv/${this.$route.params.Id}/season/${this.seasonValue}?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    this.SeasonData = res
                    this.Episodes = res.episodes
                })
                .catch(err => console.log(err))

        },
        //SearchBar 
        searchProcess() {
            // getting searched title data
            if (this.$refs.searchedTitle) {
                fetch(`https://api.themoviedb.org/3/search/multi?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&query=${this.searchTitle}&page=${1}`)
                    .then(res => res.json())
                    .then(res => {
                        console.log(res.total_pages)
                        this.searchedData = res
                        this.$router.push({ name: `search`, params: { title: `${this.searchTitle}`, results: `${this.searchedData.total_pages}`, page: '1' } })

                    })
                    .catch(err => console.log(err))

            }

        },
        ReloadingMovie() {

            //getting movie data from moviedb
            fetch(`https://api.themoviedb.org/3/movie/${this.$route.params.Id}?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
                .then(response => response.json())
                .then(response => {
                    // console.log(response);
                    this.details = response;
                })
                .catch(err => console.log(err));

            //getting cast data
            fetch(`https://api.themoviedb.org/3/movie/${this.$route.params.Id}/credits?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    this.cast = res.cast
                    this.crew.creators = res.crew.filter((el) => el.known_for_department == 'Creator')
                    this.crew.directors = res.crew.filter((el) => el.job == 'Director')
                    this.crew.composers = res.crew.filter((el) => el.job == 'Original Music Composer')
                    this.crew.producers = res.crew.filter((el) => el.job == 'Executive Producer')

                })
                .catch(err => console.log(err))
            //getting watch source
            fetch(`https://api.themoviedb.org/3/movie/${this.$route.params.Id}/watch/providers?api_key=027ef6b5c80761ceecd553242c390211`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res.results)
                    this.source2 = res.results.EG.buy
                    this.source1 = res.results.EG.flatrate
                })
                .catch(err => console.log(err))
            //get similar movies
            fetch(`https://api.themoviedb.org/3/movie/${this.$route.params.Id}/similar?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&page=1`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    this.similar = res.results
                })
                .catch(err => console.log(err))
            //getting images of movie
            fetch(`https://api.themoviedb.org/3/movie/${this.$route.params.Id}/images?api_key=027ef6b5c80761ceecd553242c390211`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    this.images.backdrops = res.backdrops
                    this.images.logos = res.logos
                    this.images.posters = res.posters
                    this.$refs.backdrop.style.backgroundImage = `url(${this.imageBase.concat(this.details.backdrop_path)})`

                })
                .catch(err => console.log(err))
            //getting videos of movie
            fetch(`https://api.themoviedb.org/3/movie/${this.$route.params.Id}/videos?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    this.videos.trailer = res.results.filter((el) => el.type == 'Trailer')
                    this.videos.teaser = res.results.filter((el) => el.type == 'Teaser')
                    this.videos.feat = res.results.filter((el) => el.type == 'Featurette')
                    window.location.reload();

                })
                .catch(err => console.log(err))

        },
        ReloadingShow() {
            //shows
            fetch(`https://api.themoviedb.org/3/tv/${this.$route.params.Id}?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
                .then(response => response.json())
                .then(response => {
                    // console.log(response);
                    this.details = response;
                })
                .catch(err => console.log(err));

            //getting cast data
            fetch(`https://api.themoviedb.org/3/tv/${this.$route.params.Id}/credits?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    this.cast = res.cast
                    this.crew.creators = res.crew.filter((el) => el.known_for_department == 'Creator')
                    this.crew.directors = res.crew.filter((el) => el.known_for_department == 'Directing')
                    this.crew.composers = res.crew.filter((el) => el.job == 'Original Music Composer')
                    this.crew.producers = res.crew.filter((el) => el.job == 'Executive Producer')
                })
                .catch(err => console.log(err))
            //getting watch source
            fetch(`https://api.themoviedb.org/3/tv/${this.$route.params.Id}/watch/providers?api_key=027ef6b5c80761ceecd553242c390211`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res.results)
                    this.source2 = res.results.EG.buy
                    this.source1 = res.results.EG.flatrate
                })
                .catch(err => console.log(err))
            //get similar shows
            fetch(`https://api.themoviedb.org/3/tv/${this.$route.params.Id}/similar?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&page=1`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    this.similar = res.results
                })
                .catch(err => console.log(err))
            //getting images of show
            fetch(`https://api.themoviedb.org/3/tv/${this.$route.params.Id}/images?api_key=027ef6b5c80761ceecd553242c390211`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    this.images.backdrops = res.backdrops
                    this.images.logos = res.logos
                    this.images.posters = res.posters

                })
                .catch(err => console.log(err))
            //getting videos of show
            fetch(`https://api.themoviedb.org/3/tv/${this.$route.params.Id}/videos?api_key=027ef6b5c80761ceecd553242c390211`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res.results)
                    this.videos.trailer = res.results.filter((el) => el.type == 'Trailer')
                    this.videos.teaser = res.results.filter((el) => el.type == 'Teaser')
                    this.videos.feat = res.results.filter((el) => el.type == 'Featurette')
                    this.videos.combined = res.results
                    window.location.reload();

                })
                .catch(err => console.log(err))
        }

    }

}
</script>

<style lang="scss" scoped>
.DetailsZone {
    min-height: 2000px;

    .modal {
        height: 100%;
        width: 100%;
        background-color: transparent;
        backdrop-filter: blur(10px);
        position: fixed;
        z-index: 1200;
        display: flex;
        justify-content: center;
        align-items: center;

        .main {
            width: 560px;
            height: 380px;
            // background-color: red;

            img {
                width: inherit;
                height: inherit;
                object-fit: cover;
            }

            iframe {
                width: inherit;
                height: inherit;
                object-fit: cover;
            }
        }

        .exit {
            position: absolute;
            top: 3rem;
            right: 3rem;
            font-size: 2.5rem;
            cursor: pointer;
        }
    }

    .WideArea {
        background-position: center;
        background-size: cover;
        background-attachment: fixed;
        min-height: 36rem;
        width: 100%;

        .back {
            position: absolute;
            top: 10px;
            left: 20px;
            font-size: 30px;
            cursor: pointer;
            z-index: 29;

            font-awesome {
                cursor: pointer;
            }
        }

        .DimmedArea {
            min-height: 36rem;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            background-color: transparent;
            backdrop-filter: brightness(0.8);
            // pointer-events: none;

            .lhs {
                position: relative;
                z-index: 10;
                // background-color: blue;
                width: 45%;
                height: calc(100% - 50px);
                padding: 25px;
                pointer-events: none;

                .title {
                    font-size: 6rem;
                    text-transform: capitalize;
                }

                .seasons {
                    font-size: 20px;
                    font-weight: 300;
                    padding: 10px;
                    display: flex;

                    span {
                        border-right: 1px $secondary solid;
                        padding: 0 10px 0 10px;

                        &:nth-last-child(1) {
                            border: none;
                        }

                    }


                }

                .info {
                    font-size: 18px;
                    font-weight: 300;
                    padding: 5px;
                    display: flex;

                    span {
                        border-right: 1px $secondary solid;
                        padding: 0 10px 0 10px;

                        &:nth-last-child(1) {
                            border: none;
                        }
                    }

                }

                .type {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;

                    div {
                        border-right: none;
                        padding: 0 5px 0 5px;
                        font-size: 16px;
                        font-weight: 500;
                    }
                }

                .year {
                    font-size: 18px;

                }

                .plot {
                    font-size: 16px;
                    padding: 10px;
                    line-height: 20px;
                }

                .rate {
                    font-size: 26px;
                    padding: 10px;
                    position: relative;

                    span {
                        color: $primary
                    }
                }
            }

            .rhs {
                position: relative;
                z-index: 10;
                // background-color: red;
                width: 30%;
                min-height: 100%;
                display: flex;
                flex-direction: column;

                .starring {
                    height: 80%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    // background-color: violet;
                    padding: 5px;

                    .starringWord {
                        font-size: 18px;
                        font-weight: 300;
                        margin: 5px;
                        font-variant: small-caps;
                    }

                    .a {
                        margin: 5px 0 5px 0;
                        font-size: 20px;
                        text-transform: uppercase;
                    }
                }

                .watchon {
                    // background-color: red;
                    font-weight: 600;
                    color: $secondary;
                    margin: 5px;

                    span {
                        padding: 10px;
                        font-size: 18px;
                        font-weight: 300;
                        font-variant: small-caps;
                    }

                    img {
                        width: 4rem;
                        padding: 10px;

                    }

                    .third {
                        margin: 10px
                    }

                    ;
                }
            }
        }
    }

    .MoreDetails {
        .GalleryZone {
            margin: 20px 0 100px 0;
            background-color: $surface;

            .RowLabel {
                color: $primary;
                font-size: 20px;
                font-weight: 300;
                border-bottom: 2px $primary solid;
                padding: 20px;
            }

            .Gallery {
                display: flex;
                flex-direction: row;
                width: calc(100% - 10px);
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

                .landscape {
                    position: relative;
                    z-index: 5;
                    margin: 0px 10px;

                    img {
                        width: 380px;
                        height: 220px;
                        border-radius: 10px;
                        object-fit: cover;
                        cursor: pointer;
                    }
                }
            }
        }

        .TrailerZone {
            height: 30rem;
            width: 100%;
            display: flex;
            flex-direction: column;
            background-color: $surface;

            .Tabs {
                background-color: transparent;
                list-style: none;
                display: flex;
                justify-content: center;
                height: 3rem;
                margin: 0;

                li {
                    background-color: $surfaceV;
                    padding: 10px;
                    font-size: 30px;
                    font-variant: small-caps;
                    // margin: 0 5px 0 5px;
                    cursor: pointer;

                    &:hover {
                        background-color: $surfaceVV;
                    }
                }

                .chosen {
                    border-bottom: $primary 2.5px solid;
                }
            }

            .Videos {
                width: 100%;
                height: calc(100% - 3rem);


                .TabBoxShown {
                    height: calc(100%);
                    padding: 10px;
                    width: calc(100% - 20px);
                    background-color: $surface;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: 1fr;
                    grid-row-gap: 10px;
                    grid-column-gap: 10px;
                    overflow-y: scroll;
                    grid-template-areas: "c c c";

                    &::-webkit-scrollbar {
                        width: 15px;
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

                    .noVids {
                        justify-self: center;
                        align-self: center;
                        grid-area: c;
                        font-size: 50px;
                    }

                    .trailer,
                    .teaser,
                    .feat {
                        background-color: transparent;
                        width: 380px;
                        height: 220px;
                        border-radius: 10px;
                        justify-self: center;

                        iframe {
                            width: inherit;
                            height: calc(100% - 20px);
                            border-radius: 10px;
                        }

                        .vidCap {
                            text-align: center;
                            font-size: 16px;
                            font-weight: 300;
                        }
                    }
                }
            }
        }


        .CastZone {
            display: flex;
            width: 100%;
            min-height: fit-content;
            margin: 50px 0 0 0;
            background-color: $surfaceV;


            .cast {
                width: 65%;
                height: 100%;
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: .1fr auto;
                grid-template-areas: "title title";

                .RowLabel {
                    grid-area: title;
                    color: $primary;
                    font-size: 20px;
                    font-weight: 300;
                    // border-bottom: 2px $primary solid;
                    padding: 20px;

                    &::after {
                        content: '';
                        position: absolute;
                        margin: 10px 0 0 10px;
                        width: calc(100% - 70px - 35%);
                        height: 0;
                        border-bottom: 1px $primary solid;
                    }
                }

                .Actor {
                    padding: 10px;
                    height: fit-content;
                    display: flex;

                    .ActorData {
                        padding: 10px;
                        color: $secondary;

                        .name {
                            font-size: 18px;
                            font-weight: 500;
                            text-transform: uppercase;
                        }

                        .ShowName {
                            text-align: center;
                        }

                        .ShowName {
                            font-size: 15px;
                            font-weight: 300;
                            font-variant: small-caps;
                        }
                    }

                    img {
                        border-radius: 50%;
                        width: 6rem;
                        height: 6rem;
                        object-fit: cover;
                        object-position: top;
                    }

                }
            }

            .Directors {
                width: 35%;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                position: relative;
                z-index: 10;

                &::-webkit-scrollbar {
                    width: 15px;
                    display: none;
                }

                .RowLabel {
                    color: $primary;
                    font-size: 20px;
                    font-weight: 300;
                    padding: 20px;

                    &::after {
                        content: '';
                        position: absolute;
                        margin: 10px 0 0 10px;
                        width: calc(100% - 140px);
                        height: 0;
                        border-bottom: 1px $primary solid;
                    }
                }

                .director {
                    padding: 10px;
                    height: fit-content;
                    display: flex;

                    .directorData {
                        padding: 10px;
                        color: $secondary;

                        .name {
                            font-size: 18px;
                            font-weight: 500;
                            text-transform: uppercase;
                        }
                    }
                }

                .profile {
                    img {
                        border-radius: 50%;
                        width: 6rem;
                        height: 6rem;
                        object-fit: cover;
                        object-position: top;
                    }
                }

            }
        }

        .SimilarTitles {

            .RowLabel {
                grid-area: title;
                color: $primary;
                font-size: 20px;
                font-weight: 300;
                padding: 20px;

                &::after {
                    content: '';
                    position: absolute;
                    margin: 10px 0 0 10px;
                    width: calc(100% - 13%);
                    height: 0;
                    border-bottom: 1px $primary solid;
                }
            }

            .movies {
                display: flex;
                flex-direction: row;
                width: calc(100% - 20px);
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

                .movie {
                    position: relative;
                    z-index: 5;
                    margin: 0px 10px;
                }
            }
        }

        .similarShowsZone {
            .similarShows {
                display: flex;
                flex-direction: row;
                width: calc(100% - 20px);
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
            }






            .RowLabel {
                color: $primary;
                font-size: 20px;
                font-weight: 300;
                padding: 20px;

                &::after {
                    content: '';
                    position: absolute;
                    margin: 10px 0 0 10px;
                    width: calc(100% - 14%);
                    height: 0;
                    border-bottom: .5px $primary solid;
                }
            }

            .show {
                position: relative;
                z-index: 5;
                margin: 0px 10px;
            }
        }

        .EpisodesZone {
            .RowLabel {
                color: $primary;
                font-size: 20px;
                font-weight: 300;
                padding: 20px;

                &::after {
                    content: '';
                    position: absolute;
                    margin: 10px 0 0 10px;
                    width: calc(100% - 140px);
                    height: 0;
                    border-bottom: 1px $primary solid;

                }
            }

            .SetOfSeasons {
                margin: 5px;
                width: calc(100% -10px);
                display: flex;
                justify-content: center;

                .caption {
                    padding: 10px;
                }

                select {
                    background-color: $surface;
                    color: $secondary;
                    width: 250px;
                    border-radius: 10px;
                    padding: 10px;
                    font-size: 22px;

                    option {
                        font-size: 20px;
                        font-weight: 300;
                        background-color: $surfaceV;
                    }
                }
            }

            .Episode {
                margin: 20px;
                box-shadow: rgba(255, 255, 255, 0.9) 0px 4px 6px -1px, rgba(255, 255, 255, 0.94) 0px 2px 4px -1px;
                display: flex;

                img {
                    height: 220px;
                    width: 380px;
                }

                .details {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 10px;

                    .Enumber {
                        font-size: 24px;
                        font-weight: 300;
                        padding: 10px;
                        display: flex;


                    }

                    .overview {
                        font-size: 22px;
                        font-weight: 300
                    }

                    ;

                    .rate {
                        font-size: 18px;

                        span {
                            border-right: 1px $secondary solid;
                            padding: 0 10px 0 10px;

                            &:nth-last-child(1) {
                                border: none;
                            }

                        }
                    }
                }
            }
        }
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
}



@include SideBarEffects;
@include loader;

@media (max-width:768px) {
    .DetailsZone {
        min-height: fit-content;

        .modal {
            height: 100%;
            width: 100%;
            background-color: transparent;
            backdrop-filter: blur(10px);
            position: fixed;
            z-index: 1200;
            display: flex;
            justify-content: center;
            align-items: center;

            .main {
                width: calc(560px / 1.1);
                height: calc(380px / 1.1);
                // background-color: red;

                img {
                    width: inherit;
                    height: inherit;
                    object-fit: cover;
                }

                iframe {
                    width: inherit;
                    height: inherit;
                    object-fit: cover;
                }
            }

            .exit {
                position: absolute;
                top: 3rem;
                right: 3rem;
                font-size: 2.5rem;
                cursor: pointer;
            }
        }

        .WideArea {
            background-position: center;
            background-size: cover;
            background-attachment: scroll;
            min-height: calc(36rem / 1.5);
            width: 100%;

            .back {
                position: absolute;
                top: 10px;
                left: 20px;
                font-size: 25px;
                cursor: pointer;
                z-index: 29;

                font-awesome {
                    cursor: pointer;
                }
            }

            .DimmedArea {
                min-height: calc(36rem / 1.5);
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: end;
                background-color: transparent;
                backdrop-filter: brightness(0.8);
                // pointer-events: none;

                .lhs {
                    position: relative;
                    z-index: 10;
                    // background-color: blue;
                    width: 45%;
                    height: calc(100%);
                    padding: 7.5px;
                    pointer-events: none;


                    .title {
                        font-size: calc(5rem /2);
                        text-transform: capitalize;
                        padding: 15px;
                    }

                    .seasons {
                        font-size: calc(20px / 1.5);
                        font-weight: 300;
                        padding: 7.5px;
                        display: flex;
                        // background-color: red;

                        span {
                            border-right: 1px $secondary solid;
                            padding: 0 10px 0 10px;

                            &:nth-last-child(1) {
                                border: none;
                            }

                        }


                    }

                    .info {
                        font-size: calc(18px / 1.5);
                        font-weight: 300;
                        padding: 7.5px;
                        display: flex;
                        min-width: fit-content;
                        // background-color: black;

                        span {
                            border-right: 1px $secondary solid;
                            padding: 0 7.5px 0 7.5px;

                            &:nth-last-child(1) {
                                border: none;
                            }
                        }

                    }

                    .type {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;

                        div {
                            border-right: none;
                            padding: 0 7.5px 0 7.5px;
                            font-size: calc(16px / 1.5);
                            font-weight: 300;
                        }
                    }

                    .year {
                        font-size: calc(18px / 1.5);
                        // background-color: red;
                    }

                    .plot {
                        font-size: calc(16px / 1.5);
                        padding: 10px 0 0 20px;
                        line-height: 13px;
                    }

                    .rate {
                        font-size: calc(26px / 1.5);
                        padding: 20px;
                        position: relative;

                        span {
                            color: $primary
                        }
                    }

                }

                .rhs {
                    position: relative;
                    z-index: 10;
                    // background-color: blue;
                    width: 30%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;

                    .starring {
                        height: 80%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        // background-color: violet;
                        padding: 5px;

                        .starringWord {
                            font-size: calc(18px / 1.5);
                            font-weight: 200;
                            margin: 5px;
                            font-variant: small-caps;
                        }

                        .a {
                            margin: 7.5px 0 7.5px 0;
                            font-size: calc(20px / 1.5);
                            text-transform: uppercase;
                        }
                    }

                    .watchon {
                        // background-color: red;
                        font-weight: 600;
                        color: $primary;
                        margin: 7.5px;

                        span {
                            padding: 7.5px;
                            font-size: calc(18px / 1.5);
                            font-weight: 300;
                            font-variant: small-caps;
                        }

                        img {
                            width: calc(4rem / 2);
                            padding: 7.5px;

                        }

                        ;
                    }
                }
            }
        }

        .MoreDetails {
            .GalleryZone {
                margin: 10px 0 10px 0;
                background-color: $surface;

                .RowLabel {
                    color: $primary;
                    font-size: calc(20px / 1.5);
                    font-weight: 300;
                    border-bottom: 1px $primary solid;
                    padding: 10px;
                }

                .Gallery {
                    display: flex;
                    flex-direction: row;
                    width: calc(100% - 10px);
                    overflow-x: scroll;
                    overflow-y: hidden;
                    position: relative;
                    z-index: 10;
                    margin: 10px;

                    &::-webkit-scrollbar {
                        height: 5px;
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

                    .landscape {
                        position: relative;
                        z-index: 5;
                        margin: 0px 7.5px;

                        img {
                            width: calc(380px / 2);
                            height: calc(220px / 2);
                            border-radius: 10px;
                            object-fit: cover;
                            cursor: pointer;
                        }
                    }
                }
            }

            .TrailerZone {
                height: fit-content;
                width: 100%;
                display: flex;
                flex-direction: column;
                background-color: $surface;

                .Tabs {
                    background-color: transparent;
                    list-style: none;
                    display: flex;
                    justify-content: center;
                    height: calc(3rem / 1.5);
                    margin: 0;

                    li {
                        background-color: $surfaceV;
                        padding: 10px;
                        font-size: calc(30px / 1.75);
                        font-variant: small-caps;
                        // margin: 0 5px 0 5px;
                        cursor: pointer;

                        &:hover {
                            background-color: $surfaceVV;
                        }
                    }

                    .chosen {
                        border-bottom: $primary 1.5px solid;
                    }
                }

                .Videos {
                    width: 100%;
                    height: calc(100% - 3rem);


                    .TabBoxShown {
                        height: calc(100%);
                        padding: 10px;
                        width: calc(100% - 20px);
                        background-color: $surface;
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        grid-template-rows: 1fr;
                        grid-row-gap: 10px;
                        grid-column-gap: 10px;
                        overflow-y: scroll;
                        grid-template-areas: "c c";

                        &::-webkit-scrollbar {
                            height: 5px;
                            width: 5px;
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

                        .noVids {
                            justify-self: center;
                            align-self: center;
                            grid-area: c;
                            font-size: calc(50px / 2);
                        }

                        .trailer,
                        .teaser,
                        .feat {
                            background-color: transparent;
                            width: calc(380px / 2);
                            height: calc(220px / 2);
                            border-radius: 10px;
                            justify-self: center;

                            iframe {
                                width: inherit;
                                height: calc(100% - 20px);
                                border-radius: 10px;
                            }

                            .vidCap {
                                text-align: center;
                                font-size: calc(16px / 3);
                                font-weight: 100;
                            }
                        }
                    }
                }
            }


            .CastZone {
                display: flex;
                flex-direction: column;
                width: 100%;
                min-height: fit-content;
                margin: 35px 0 0 0;
                background-color: $surfaceV;


                .cast {
                    width: 100%;
                    height: 65%;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: .1fr auto;
                    grid-template-areas: "title title";
                    // background-color: red;

                    .RowLabel {
                        grid-area: title;
                        color: $primary;
                        font-size: calc(20px / 1.25);
                        font-weight: 200;
                        // border-bottom: 2px $primary solid;
                        padding: 10px;

                        &::after {
                            content: '';
                            position: absolute;
                            margin: 10px 0 0 10px;
                            width: calc(100% - 70px);
                            height: 0;
                            border-bottom: 1px $primary solid;
                        }
                    }

                    .Actor {
                        padding: 10px;
                        height: fit-content;
                        display: flex;

                        .ActorData {
                            padding: 7.5px;
                            color: $secondary;

                            .name {
                                font-size: calc(18px / 1.5);
                                font-weight: 300;
                                text-transform: uppercase;
                            }

                            .ShowName {
                                text-align: center;
                            }

                            .ShowName {
                                font-size: calc(15px / 1.5);
                                font-weight: 200;
                                font-variant: small-caps;
                            }
                        }

                        img {
                            border-radius: 50%;
                            width: calc(6rem / 1.5);
                            height: calc(6rem / 1.5);
                            object-fit: cover;
                            object-position: top;
                        }

                    }
                }

                .Directors {
                    width: 100%;
                    height: 35%;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    position: relative;
                    z-index: 10;
                    // background-color: blue;

                    &::-webkit-scrollbar {
                        width: 15px;
                        display: none;
                    }

                    .RowLabel {
                        color: $primary;
                        font-size: calc(20px / 1.5);
                        font-weight: 300;
                        padding: 10px;

                        &:nth-child(1)::after {
                            content: '';
                            position: absolute;
                            margin: 10px 0 0 10px;
                            width: calc(100% - 120px);
                            height: 0;
                            border-bottom: 1px $primary solid;
                        }

                        &:nth-child(2)::after {
                            content: '';
                            position: absolute;
                            margin: 10px 0 0 10px;
                            width: calc(100% - 140px);
                            height: 0;
                            border-bottom: 1px $primary solid;
                        }
                    }

                    .director {
                        padding: 10px;
                        height: fit-content;
                        display: flex;

                        .directorData {
                            padding: 7.5px;
                            color: $secondary;

                            .name {
                                font-size: calc(18px / 1.5);
                                font-weight: 300;
                                text-transform: uppercase;
                            }
                        }
                    }

                    .profile {
                        img {
                            border-radius: 50%;
                            width: (6rem / 1.5);
                            height: (6rem / 1.5);
                            object-fit: cover;
                            object-position: top;
                        }
                    }

                }
            }

            .SimilarTitles {

                .RowLabel {
                    grid-area: title;
                    color: $primary;
                    font-size: calc(20px / 1.5);
                    font-weight: 300;
                    padding: 10px;

                    &::after {
                        content: '';
                        position: absolute;
                        margin: 10px 0 0 10px;
                        width: calc(100% - 120px);
                        height: 0;
                        border-bottom: .5px $primary solid;
                    }
                }

                .movies {
                    display: flex;
                    flex-direction: row;
                    width: calc(100% - 20px);
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

                    .movie {
                        position: relative;
                        z-index: 5;
                        margin: 0px 5px;
                    }
                }
            }

            .similarShowsZone {

                .RowLabel {
                    grid-area: title;
                    color: $primary;
                    font-size: calc(20px / 1.5);
                    font-weight: 200;
                    padding: 20px 10px 10px 10px;


                    &::after {
                        content: '';
                        position: absolute;
                        margin: 7.5px 0 0 7.5px;
                        width: calc(100% - 120px);
                        height: 0;
                        border-bottom: 1px $primary solid;
                    }
                }

                .similarShows {
                    display: flex;
                    flex-direction: row;
                    width: calc(100% - 20px);
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
                }


                .show {
                    position: relative;
                    z-index: 5;
                    margin: 0px 5px;
                }
            }

            .EpisodesZone {
                .RowLabel {
                    color: $primary;
                    font-size: calc(20px / 1.5);
                    font-weight: 300;
                    padding: 20px 10px 10px 10px;

                    &::after {
                        content: '';
                        position: absolute;
                        margin: 10px 0 0 10px;
                        width: calc(100% - 100px);
                        height: 0;
                        border-bottom: 1px $primary solid;

                    }
                }

                .SetOfSeasons {
                    margin: 10px;
                    width: calc(100% -10px);
                    display: flex;
                    justify-content: center;
                    // background-color: red;

                    .caption {
                        padding: 10px;
                    }

                    select {
                        background-color: $surface;
                        color: $secondary;
                        width: (250px / 1.5);
                        height: min-content;
                        border-radius: 10px;
                        padding: 10px;
                        font-size: calc(22px / 1.5);

                        option {
                            font-size: calc(20px / 1.5);
                            font-weight: 300;
                            background-color: $surfaceV;
                            width: 60px;

                        }
                    }
                }

                .Episode {
                    margin: 10px;
                    box-shadow: rgba(255, 255, 255, 0.9) 0px 1px 2px -1px, rgba(255, 255, 255, 0.94) 0px 1px 2px -1px;
                    display: flex;
                    // background-color: red;

                    img {
                        height: calc(220px / 1.5);
                        width: calc(380px / 1.5);
                        object-fit: cover;
                    }

                    .details {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        padding: 7.5px;

                        .Enumber {
                            font-size: calc(24px / 1.5);
                            font-weight: 200;
                            padding: 5px;
                            display: flex;


                        }

                        .overview {
                            font-size: calc(22px / 1.5);
                            font-weight: 300;
                        }

                        ;

                        .rate {
                            font-size: calc(18px / 1.5);

                            span {
                                border-right: 1px $secondary solid;
                                padding: 0 7.5px 0 7.5px;

                                &:nth-last-child(1) {
                                    border: none;
                                }

                            }
                        }
                    }
                }
            }
        }

        .fade-enter-active,
        .fade-leave-active {
            transition: opacity 0.5s ease;
        }

        .fade-enter-from,
        .fade-leave-to {
            opacity: 0;
        }
    }
}



@media (max-width:576px) {
    .DetailsZone {
        min-height: fit-content;

        .modal {
            height: 100%;
            width: 100%;
            background-color: transparent;
            backdrop-filter: blur(10px);
            position: fixed;
            z-index: 1200;
            display: flex;
            justify-content: center;
            align-items: center;

            .main {
                width: calc(560px / 1.5);
                height: calc(380px / 1.5);
                // background-color: red;

                img {
                    width: inherit;
                    height: inherit;
                    object-fit: cover;
                }

                iframe {
                    width: inherit;
                    height: inherit;
                    object-fit: cover;
                }
            }

            .exit {
                position: absolute;
                top: 3rem;
                right: 3rem;
                font-size: 1.5rem;
                cursor: pointer;
            }
        }

        .WideArea {
            background-position: center;
            background-size: cover;
            background-attachment: scroll;
            min-height: calc(36rem / 2);
            width: 100%;

            .back {
                position: absolute;
                top: 10px;
                left: 20px;
                font-size: 15px;
                cursor: pointer;
                z-index: 29;

                font-awesome {
                    cursor: pointer;
                }
            }

            .DimmedArea {
                min-height: calc(36rem / 2);
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: end;
                background-color: transparent;
                backdrop-filter: brightness(0.8);
                // pointer-events: none;

                .lhs {
                    position: relative;
                    z-index: 10;
                    // background-color: blue;
                    width: 45%;
                    height: calc(100% - 50px);
                    padding: 10px;
                    pointer-events: none;


                    .title {
                        font-size: calc(5rem /3);
                        text-transform: capitalize;
                        padding: 15px;
                    }

                    .seasons {
                        width: 115%;
                        font-size: calc(20px / 2);
                        font-weight: 200;
                        padding: 5px;
                        display: flex;
                        // background-color: red;

                        span {
                            border-right: 1px $secondary solid;
                            padding: 0 10px 0 10px;

                            &:nth-last-child(1) {
                                border: none;
                            }

                        }


                    }

                    .info {
                        font-size: calc(18px / 2);
                        font-weight: 300;
                        padding: 4px;
                        display: flex;
                        min-width: fit-content;
                        // background-color: aqua;

                        span {
                            border-right: 1px $secondary solid;
                            padding: 0 2px 0 2px;

                            &:nth-last-child(1) {
                                border: none;
                            }
                        }

                    }

                    .type {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;

                        div {
                            border-right: none;
                            padding: 0 5px 0 5px;
                            font-size: calc(16px / 2);
                            font-weight: 300;
                        }
                    }

                    .year {
                        font-size: calc(18px / 2);
                        width: 3.32rem;
                        // background-color: red;
                    }

                    .plot {
                        font-size: calc(16px / 2);
                        padding: 5px;
                        line-height: 10px;
                        display: none;

                    }

                    .rate {
                        font-size: calc(26px / 2);
                        padding: 20px;
                        position: relative;

                        span {
                            color: $primary
                        }
                    }

                    .runTime {
                        display: none;
                    }
                }

                .rhs {
                    position: relative;
                    z-index: 10;
                    // background-color: blue;
                    width: 30%;
                    min-height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: end;

                    .starring {
                        height: 80%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        // background-color: violet;
                        padding: 5px;

                        .starringWord {
                            font-size: calc(18px / 2);
                            font-weight: 200;
                            margin: 5px;
                            font-variant: small-caps;
                        }

                        .a {
                            margin: 5px 0 5px 0;
                            font-size: calc(20px / 2);
                            text-transform: uppercase;
                        }
                    }

                    .watchon {
                        // background-color: red;
                        font-weight: 600;
                        color: $primary;
                        margin: 5px;

                        span {
                            padding: 5px;
                            font-size: calc(18px / 2);
                            font-weight: 300;
                            font-variant: small-caps;
                        }

                        img {
                            width: calc(4rem / 3.5);
                            padding: 10px;

                        }

                        ;
                    }
                }
            }
        }

        .MoreDetails {
            .GalleryZone {
                margin: 10px;
                background-color: $surface;

                .RowLabel {
                    color: $primary;
                    font-size: calc(20px / 2);
                    font-weight: 300;
                    border-bottom: .5px $primary solid;
                    padding: 10px;
                }

                .Gallery {
                    display: flex;
                    flex-direction: row;
                    width: calc(100% - 10px);
                    overflow-x: scroll;
                    overflow-y: hidden;
                    position: relative;
                    z-index: 10;
                    margin: 10px;

                    &::-webkit-scrollbar {
                        height: 5px;
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

                    .landscape {
                        position: relative;
                        z-index: 5;
                        margin: 0px 5px;

                        img {
                            width: calc(380px / 3);
                            height: calc(220px / 3);
                            border-radius: 10px;
                            object-fit: cover;
                            cursor: pointer;
                        }
                    }
                }
            }

            .TrailerZone {
                height: fit-content;
                width: 100%;
                display: flex;
                flex-direction: column;
                background-color: $surface;

                .Tabs {
                    background-color: transparent;
                    list-style: none;
                    display: flex;
                    justify-content: center;
                    height: calc(3rem / 2);
                    margin: 0;

                    li {
                        background-color: $surfaceV;
                        padding: 10px;
                        font-size: calc(30px / 3);
                        font-variant: small-caps;
                        // margin: 0 5px 0 5px;
                        cursor: pointer;

                        &:hover {
                            background-color: $surfaceVV;
                        }
                    }

                    .chosen {
                        border-bottom: $primary 1px solid;
                    }
                }

                .Videos {
                    width: 100%;
                    height: calc(100% - 3rem);


                    .TabBoxShown {
                        height: calc(100%);
                        padding: 10px;
                        width: calc(100% - 20px);
                        background-color: $surface;
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        grid-template-rows: 1fr;
                        grid-row-gap: 10px;
                        grid-column-gap: 10px;
                        overflow-y: scroll;
                        grid-template-areas: "c c";

                        &::-webkit-scrollbar {
                            height: 5px;
                            width: 5px;
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

                        .noVids {
                            justify-self: center;
                            align-self: center;
                            grid-area: c;
                            font-size: calc(50px / 2.5);
                        }

                        .trailer,
                        .teaser,
                        .feat {
                            background-color: transparent;
                            width: calc(380px / 2.5);
                            height: calc(220px / 2.5);
                            border-radius: 10px;
                            justify-self: center;

                            iframe {
                                width: inherit;
                                height: calc(100% - 20px);
                                border-radius: 10px;
                            }

                            .vidCap {
                                text-align: center;
                                font-size: calc(16px / 3);
                                font-weight: 100;
                            }
                        }
                    }
                }
            }


            .CastZone {
                display: flex;
                flex-direction: column;
                width: 100%;
                min-height: fit-content;
                margin: 25px 0 0 0;
                background-color: $surfaceV;


                .cast {
                    width: 100%;
                    height: 65%;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: .1fr auto;
                    grid-template-areas: "title title";
                    // background-color: red;

                    .RowLabel {
                        grid-area: title;
                        color: $primary;
                        font-size: calc(20px / 2);
                        font-weight: 100;
                        // border-bottom: 2px $primary solid;
                        padding: 10px;

                        &::after {
                            content: '';
                            position: absolute;
                            margin: 10px 0 0 10px;
                            width: calc(100% - 70px);
                            height: 0;
                            border-bottom: 1px $primary solid;
                        }
                    }

                    .Actor {
                        padding: 10px;
                        height: fit-content;
                        display: flex;

                        .ActorData {
                            padding: 5px;
                            color: $secondary;

                            .name {
                                font-size: calc(18px / 2);
                                font-weight: 300;
                                text-transform: uppercase;
                            }

                            .ShowName {
                                text-align: center;
                            }

                            .ShowName {
                                font-size: calc(15px / 2);
                                font-weight: 100;
                                font-variant: small-caps;
                            }
                        }

                        img {
                            border-radius: 50%;
                            width: calc(6rem / 2);
                            height: calc(6rem / 2);
                            object-fit: cover;
                            object-position: top;
                        }

                    }
                }

                .Directors {
                    width: 100%;
                    height: 35%;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    position: relative;
                    z-index: 10;
                    // background-color: blue;

                    &::-webkit-scrollbar {
                        width: 15px;
                        display: none;
                    }

                    .RowLabel {
                        color: $primary;
                        font-size: calc(20px / 2);
                        font-weight: 300;
                        padding: 20px;

                        &:nth-child(1)::after {
                            content: '';
                            position: absolute;
                            margin: 10px 0 0 10px;
                            width: calc(100% - 120px);
                            height: 0;
                            border-bottom: 1px $primary solid;
                        }

                        &:nth-child(2)::after {
                            content: '';
                            position: absolute;
                            margin: 10px 0 0 10px;
                            width: calc(100% - 140px);
                            height: 0;
                            border-bottom: 1px $primary solid;
                        }
                    }

                    .director {
                        padding: 10px;
                        height: fit-content;
                        display: flex;

                        .directorData {
                            padding: 5px;
                            color: $secondary;

                            .name {
                                font-size: calc(18px / 2);
                                font-weight: 300;
                                text-transform: uppercase;
                            }
                        }
                    }

                    .profile {
                        img {
                            border-radius: 50%;
                            width: (6rem / 2);
                            height: (6rem / 2);
                            object-fit: cover;
                            object-position: top;
                        }
                    }

                }
            }

            .SimilarTitles {

                .RowLabel {
                    grid-area: title;
                    color: $primary;
                    font-size: calc(20px / 2);
                    font-weight: 200;
                    padding: 10px;

                    &::after {
                        content: '';
                        position: absolute;
                        margin: 5px 0 0 5px;
                        width: calc(100% - 120px);
                        height: 0;
                        border-bottom: .5px $primary solid;
                    }
                }

                .movies {
                    display: flex;
                    flex-direction: row;
                    width: calc(100% - 20px);
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

                    .movie {
                        position: relative;
                        z-index: 5;
                        margin: 0px 5px;
                    }
                }
            }

            .similarShowsZone {

                .RowLabel {
                    grid-area: title;
                    color: $primary;
                    font-size: calc(20px / 2);
                    font-weight: 200;
                    padding: 20px 10px 10px 10px;


                    &::after {
                        content: '';
                        position: absolute;
                        margin: 5px 0 0 5px;
                        width: calc(100% - 120px);
                        height: 0;
                        border-bottom: .5px $primary solid;
                    }
                }

                .similarShows {
                    display: flex;
                    flex-direction: row;
                    width: calc(100% - 20px);
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
                }


                .show {
                    position: relative;
                    z-index: 5;
                    margin: 0px 5px;
                }
            }

            .EpisodesZone {
                .RowLabel {
                    color: $primary;
                    font-size: calc(20px / 2);
                    font-weight: 300;
                    padding: 20px 10px 10px 10px;

                    &::after {
                        content: '';
                        position: absolute;
                        margin: 10px 0 0 10px;
                        width: calc(100% - 100px);
                        height: 0;
                        border-bottom: 1px $primary solid;

                    }
                }

                .SetOfSeasons {
                    margin: 5px;
                    width: calc(100% -10px);
                    display: flex;
                    justify-content: center;
                    // background-color: red;

                    .caption {
                        padding: 10px;
                    }

                    select {
                        background-color: $surface;
                        color: $secondary;
                        width: (250px / 2);
                        height: min-content;
                        border-radius: 10px;
                        padding: 10px;
                        font-size: calc(22px / 2);

                        option {
                            font-size: calc(20px / 2);
                            font-weight: 200;
                            background-color: $surfaceV;
                            width: 60px;

                        }
                    }
                }

                .Episode {
                    margin: 10px;
                    box-shadow: rgba(255, 255, 255, 0.9) 0px 1px 2px -1px, rgba(255, 255, 255, 0.94) 0px 1px 2px -1px;
                    display: flex;
                    // background-color: red;

                    img {
                        height: calc(220px / 3);
                        width: calc(380px / 3);
                        object-fit: cover;
                    }

                    .details {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        padding: 2px;

                        .Enumber {
                            font-size: calc(24px / 3);
                            font-weight: 200;
                            padding: 5px;
                            display: flex;


                        }

                        .overview {
                            font-size: calc(22px / 3);
                            font-weight: 300;


                        }

                        ;

                        .rate {
                            font-size: calc(18px / 3);

                            span {
                                border-right: 1px $secondary solid;
                                padding: 0 2px 0 2px;

                                &:nth-last-child(1) {
                                    border: none;
                                }

                            }
                        }
                    }
                }
            }
        }

        .fade-enter-active,
        .fade-leave-active {
            transition: opacity 0.5s ease;
        }

        .fade-enter-from,
        .fade-leave-to {
            opacity: 0;
        }
    }
}

.searchBox {
    position: fixed;
    z-index: 1200;
    width: 100%;
    height: 100%;
    background-color: transparent;
    backdrop-filter: brightness(0.3);

    .searchBarBox {
        justify-self: center;
        height: fit-content;
        width: fit-content;
        margin: 10px 0 0 calc(50% - 10rem);

        .searchBar {
            background-color: $bgColor;
            width: 20rem;
            border: none;
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

}




@media (max-width:576px) {
    .searchBox {
        position: fixed;
        z-index: 1200;
        width: 100%;
        height: 100%;
        background-color: transparent;
        backdrop-filter: brightness(0.3);

        .searchBarBox {
            justify-self: center;
            height: fit-content;
            width: fit-content;
            margin: 5px 0 0 calc(50% - 5rem);

            .searchBar {
                background-color: $bgColor;
                width: (20rem/2);
                border: none;
                color: $secondary;
                font-weight: 400;
                font-size: (18px / 1.5);
                padding: 5px;
                border: $surfaceVV .5px solid;

                &::placeholder {
                    color: $surfaceVV;
                    font-size: (14px / 1.5);
                }

                &:focus {
                    outline: $surfaceVV .5px solid;

                }
            }

            .searchIcon {
                height: 2rem;
                width: 2rem;
                background-color: $bgColor;
                border-radius: 50%;
                margin-left: 5px;
                border: $surfaceVV 1.5px solid;
                cursor: pointer;
                color: $surfaceVV;
                transform: scale(.75);

            }
        }

    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>