<template>
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
    <div class="PersonZone" @click="hideSideBar" v-if="Images.length">
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
            <div class="BlurredArea">
                <div class="back"><font-awesome-icon icon="fa-arrow-left-long" @click="goBack" /></div>

                <div class="profile">
                    <img :src="imageBase.concat(personDetails.profile_path)" alt="">
                    <div class="name">{{ personDetails.name }}</div>
                    <div class="job">
                        <span v-if="Act">Actor</span>
                        <span v-if="JobTitles.departments.includes('Directing')">Director</span>
                        <span v-if="JobTitles.departments.includes('Production')">Producer</span>
                        <span v-if="JobTitles.departments.includes('Writing')">Writer</span>
                        <span v-if="JobTitles.departments.includes('Sound')">Composer</span>


                    </div>
                </div>
                <div class="bio">{{ personDetails.biography }}</div>

            </div>
        </div>
        <div class="MoreDetails">
            <div class="GalleryZone">
                <div class="RowLabel">Photos</div>
                <div class="Gallery">
                    <div class="landscape" v-for="i in Images" :key="i">
                        <img :src="imageBase.concat(i.file_path)" alt="" @click="ShowandHideModal">
                    </div>
                </div>
            </div>
            <div class="JobsZone">
                <ul class="Tabs">
                    <li @click="showClickedTab" ref="tab" v-for="j in JobTitles.departments" :key="j">
                        {{ j }}</li>
                </ul>
                <div class="jobs">
                    <div class="TabBoxShown" v-if="cast">
                        <div class="card" v-for="c in Act" :key="c.id">
                            <router-link
                                :to="{ name: 'MovieName', params: { Id: c.id, name: c.title, type: c.media_type } }"
                                v-if="c.media_type == 'movie'">
                                <movieCard :imgSrc="imageBase.concat(c.poster_path)" :alt="c.title" :title="c.title"
                                    :year="c.release_date.slice(0, 4)" :type="c.media_type"
                                    :plot="`played the role of ${c.character}`" />
                            </router-link>

                            <router-link
                                :to="{ name: 'MovieName', params: { Id: c.id, name: c.name, type: c.media_type } }"
                                v-if="c.media_type == 'tv'">
                                <movieCard :imgSrc="imageBase.concat(c.poster_path)" :alt="c.name" :title="c.name"
                                    :year="c.first_air_date.slice(0, 4)" :type="c.media_type"
                                    :plot="`played the role of ${c.character}`" />
                            </router-link>
                        </div>
                    </div>
                    <div class="TabBoxShown" v-else>
                        <div class="card" v-for="c in Crew" :key="c.id">
                            <router-link
                                :to="{ name: 'MovieName', params: { Id: c.id, name: c.title, type: c.media_type } }"
                                v-if="c.media_type == 'movie'">
                                <movieCard :imgSrc="imageBase.concat(c.poster_path)" :alt="c.title" :title="c.title"
                                    :year="c.release_date.slice(0, 4)" :type="c.media_type" :plot="c.job" />
                            </router-link>
                            <router-link
                                :to="{ name: 'MovieName', params: { Id: c.id, name: c.name, type: c.media_type } }"
                                v-if="c.media_type == 'tv'">
                                <movieCard :imgSrc="imageBase.concat(c.poster_path)" :alt="c.name" :title="c.name"
                                    :year="c.first_air_date.slice(0, 4)" :type="c.media_type" :plot="c.job" />
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="loader-5 center" v-else>
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
            //sideBar
            showSide: false,
            //modal
            showModal: false,
            imageSrc: null,
            //from moviedb
            YtVidBase: 'https://www.youtube.com/embed/',
            imageBaseOriginal: "http://image.tmdb.org/t/p/original/",
            imageBase: "http://image.tmdb.org/t/p/w500/",
            personDetails: null,
            Images: null,
            Act: null,
            Crew: null,
            JobTitles: { departments: null, jobs: null },
            cast: true,
            //searchBar
            searchTitle: "",
            searchedData: null,
            showBar: false
        }
    },
    beforeMount() {
        window.addEventListener('scroll', this.navBgAlteration);

        //person details
        fetch(` https://api.themoviedb.org/3/person/${this.$route.params.Id}?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
            .then(res => res.json())
            .then(res => {
                // console.log(res)
                this.personDetails = res
            })
            .catch((err) => console.log(err))
        //person profile images
        fetch(` https://api.themoviedb.org/3/person/${this.$route.params.Id}/images?api_key=027ef6b5c80761ceecd553242c390211`)
            .then(res => res.json())
            .then(res => {
                // console.log(res)
                this.Images = res.profiles
            })
            .catch((err) => console.log(err))

        //person shows and movies

        fetch(` https://api.themoviedb.org/3/person/${this.$route.params.Id}/combined_credits?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
            .then(res => res.json())
            .then(res => {
                // console.log(res.crew)
                this.Act = res.cast.filter((el) => el.poster_path)
                this.Crew = res.crew.filter((el) => el.poster_path)


                //getting jobs titles for tabBar and job title in bio
                if (this.Act) {
                    this.JobTitles.departments = this.Crew.map((el) => el.department).filter((item, index, arr) => arr.indexOf(item) === index).flat(3);
                    this.JobTitles.jobs = this.Crew.map((el) => el.job).filter((item, index, arr) => arr.indexOf(item) === index).flat(3);
                    this.JobTitles.departments.unshift('Acting')
                    this.JobTitles.jobs.unshift('Actor')
                }
                else {
                    this.JobTitles.departments = this.Crew.map((el) => el.department).filter((item, index, arr) => arr.indexOf(item) === index).flat(3);
                    this.JobTitles.jobs = this.Crew.map((el) => el.job).filter((item, index, arr) => arr.indexOf(item) === index).flat(3);
                }


            })
            .catch((err) => console.log(err))
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
            TabsArr = [this.$refs.tab]
            TabsArr.flat(1).forEach((el, i) => {
                if (e.target.innerHTML == el.innerHTML) {
                    console.log(i)
                    el.classList.add('chosen')
                    if (i == 0) {
                        this.cast = true
                    }
                    else {
                        this.cast = false
                        fetch(` https://api.themoviedb.org/3/person/${this.$route.params.Id}/combined_credits?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
                            .then(res => res.json())
                            .then(res => {
                                this.Crew = res.crew.filter((ele) => ele.poster_path).filter((ele) => ele.department == el.innerHTML)
                            })
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
    },
    mounted() {
        this.$refs.tab[0].classList.add('chosen')

    },

};
</script>

<style lang="scss" scoped>
.PersonZone {
    height: 2000px;

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
            width: 380px;
            height: 560px;
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
        height: 36rem;
        width: 100%;
        background-image: linear-gradient(to bottom, transparent, $surface);

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

        .BlurredArea {
            height: 100%;
            width: calc(100% - 20px);
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: transparent;
            backdrop-filter: blur(10px);
            padding: 10px;

            // pointer-events: none;
            .profile {
                width: 50%;
                height: fit-content;
                display: flex;
                flex-direction: column;
                align-items: center;

                img {
                    // border-radius: 50%;
                    width: 18rem;
                    height: 24rem;
                    object-fit: cover;
                    object-position: top;
                }

                .name {
                    font-size: 26px;
                    font-weight: 400;
                    padding: 5px;
                }

                .job {
                    font-size: 20px;
                    color: $secondary;
                    text-align: center;
                    padding: 10px;

                    span {
                        border-right: 1px $secondary solid;
                        padding: 0 10px 0 10px;

                        &:nth-last-child(1) {
                            border: none;
                        }

                    }
                }
            }

            .bio {
                font-size: 18px;
                font-weight: 300;
                text-align: center;
                padding: 10px;
                max-height: 30rem;
                overflow: auto;

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
                        width: 220px;
                        height: 380px;
                        border-radius: 10px;
                        object-fit: cover;
                        cursor: pointer;
                    }
                }
            }
        }

        .JobsZone {
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

            .jobs {
                width: 100%;
                height: fit-content;

                .TabBoxShown {
                    height: fit-content;
                    padding: 10px;
                    width: calc(100% - 20px);
                    background-color: $surface;
                    display: grid;
                    grid-template-columns: repeat(5, .6fr);
                    grid-template-rows: 1fr;
                    grid-row-gap: 20px;
                    // grid-column-gap: 120px;

                    .card {
                        position: relative;
                        z-index: 10;
                        justify-self: center;
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

@media (max-width:1000px) {
    .PersonZone {

        .MoreDetails {
            .JobsZone {
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
                    // height: 2rem;
                    margin: 0;

                    li {
                        background-color: $surfaceV;
                        padding: 6px;
                        // font-size: 16px;
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

                .jobs {
                    width: 100%;
                    height: fit-content;

                    .TabBoxShown {
                        height: fit-content;
                        padding: 10px;
                        width: calc(100% - 20px);
                        background-color: $surface;
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        grid-template-rows: 1fr;
                        grid-row-gap: 20px;

                        .card {
                            position: relative;
                            z-index: 10;
                            justify-self: center;
                        }


                    }
                }
            }
        }
    }
}

@media (max-width:768px) {
    .PersonZone {
        height: fit-content;

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
                width: calc(380px / 1.2);
                height: calc(560px / 1.2);
                // background-color: red;

                img {
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
            background-attachment: fixed;
            height: 26.5rem;
            width: 100%;
            background-image: linear-gradient(to bottom, transparent, $surface);

            .back {
                position: absolute;
                top: 10px;
                left: 20px;
                font-size: 25px;
                cursor: pointer;

                font-awesome {
                    cursor: pointer;
                }
            }

            .BlurredArea {
                height: 100%;
                width: calc(100% - 20px);
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: transparent;
                backdrop-filter: blur(10px);
                padding: 10px;

                // pointer-events: none;
                .profile {
                    width: 100%;
                    height: fit-content;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    // background-color: red;

                    img {
                        // border-radius: 50%;
                        width: calc(18rem / 1.2);
                        height: calc(24rem / 1.2);
                        object-fit: cover;
                        object-position: top;
                    }

                    .name {
                        font-size: 20px;
                        font-weight: 400;
                        padding: 5px;
                    }

                    .job {
                        font-size: 12px;
                        color: $secondary;
                        text-align: center;
                        padding: 10px;

                        span {
                            border-right: 1px $secondary solid;
                            padding: 0 10px 0 10px;

                            &:nth-last-child(1) {
                                border: none;
                            }

                        }
                    }
                }

                .bio {
                    font-size: 18px;
                    font-weight: 300;
                    text-align: center;
                    padding: 10px;
                    max-height: 30rem;
                    overflow: auto;
                    display: none;

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
            }
        }

        .MoreDetails {
            .GalleryZone {
                margin: 5px 0 5px 0;
                background-color: $surface;

                .RowLabel {
                    color: $primary;
                    font-size: 18.5px;
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
                        height: 2.5px;
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
                            width: calc(220px / 2);
                            height: calc(380px / 2);
                            border-radius: 10px;
                            object-fit: cover;
                            cursor: pointer;
                        }
                    }
                }
            }

            .JobsZone {
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
                    height: 2rem;
                    margin: 0;

                    li {
                        background-color: $surfaceV;
                        padding: 6px;
                        font-size: 16px;
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

                .jobs {
                    width: 100%;
                    height: fit-content;

                    .TabBoxShown {
                        height: fit-content;
                        padding: 10px;
                        width: calc(100% - 20px);
                        background-color: $surface;
                        display: grid;
                        grid-template-columns: repeat(6, 1fr);

                        @media (max-width:650px) {
                            grid-template-columns: repeat(5, 1fr);
                        }

                        grid-template-rows: 1fr;
                        grid-row-gap: 20px;

                        .card {
                            position: relative;
                            z-index: 10;
                            justify-self: center;
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

;

@media (max-width:576px) {
    .PersonZone {
        height: fit-content;

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
                width: calc(380px / 1.2);
                height: calc(560px / 1.2);
                // background-color: red;

                img {
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
            background-attachment: fixed;
            height: 24rem;
            width: 100%;
            background-image: linear-gradient(to bottom, transparent, $surface);

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

            .BlurredArea {
                height: 100%;
                width: calc(100% - 20px);
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: transparent;
                backdrop-filter: blur(10px);
                padding: 10px;

                // pointer-events: none;
                .profile {
                    width: 100%;
                    height: fit-content;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    // background-color: red;

                    img {
                        // border-radius: 50%;
                        width: calc(18rem / 1.5);
                        height: calc(24rem / 1.5);
                        object-fit: cover;
                        object-position: top;
                    }

                    .name {
                        font-size: 18px;
                        font-weight: 400;
                        padding: 5px;
                    }

                    .job {
                        font-size: 12px;
                        color: $secondary;
                        text-align: center;
                        padding: 10px;

                        span {
                            border-right: 1px $secondary solid;
                            padding: 0 10px 0 10px;

                            &:nth-last-child(1) {
                                border: none;
                            }

                        }
                    }
                }

                .bio {
                    font-size: 18px;
                    font-weight: 300;
                    text-align: center;
                    padding: 10px;
                    max-height: 30rem;
                    overflow: auto;
                    display: none;

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
            }
        }

        .MoreDetails {
            .GalleryZone {
                margin: 5px 0 5px 0;
                background-color: $surface;

                .RowLabel {
                    color: $primary;
                    font-size: 16px;
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
                        height: 2.5px;
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
                            width: calc(220px / 3);
                            height: calc(380px / 3);
                            border-radius: 10px;
                            object-fit: cover;
                            cursor: pointer;
                        }
                    }
                }
            }

            .JobsZone {
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
                    height: 1.6rem;
                    margin: 0;

                    li {
                        background-color: $surfaceV;
                        padding: 4px;
                        font-size: 12px;
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

                .jobs {
                    width: 100%;
                    height: fit-content;

                    .TabBoxShown {
                        height: fit-content;
                        padding: 10px;
                        width: calc(100% - 20px);
                        background-color: $surface;
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);

                        @media (max-width:425px) {
                            grid-template-columns: repeat(3, 1fr);

                        }

                        grid-template-rows: 1fr;
                        grid-row-gap: 20px;
                        // grid-column-gap: 120px;

                        .card {
                            position: relative;
                            z-index: 10;
                            justify-self: center;
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