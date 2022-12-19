<template >
      <NavBar @slide="showSideBar" @slideBackFromNav="hideSideBar" @openBar="showBar = !showBar" />
      <Transition name="fade">
            <div class="searchBox" @click.self="showBar = !showBar" v-if="showBar">
                  <div class="searchBarBox">
                        <input type="text" name="finder" class="searchBar" placeholder="Search"
                              @keypress.enter="searchProcess" ref="searchedTitle" v-model="searchTitle">


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
      <div v-if="TrendingTvShows" class="HomeZone" @click="hideSideBar">
            <div class="WideArea" ref="backdrop">
                  <router-link
                        :to="{ name: 'MovieName', params: { Id: movieChosen.id, name: movieChosen.title, type: 'movie' } }"
                        class="DimmedArea">
                        <div class="lhs">
                              <div class="title" ref="title" v-if="!ShowisShown">{{ movieChosen.title }}</div>
                              <div class="title" ref="title" v-if="ShowisShown">{{ movieChosen.name }}</div>
                              <div class="plot">{{ movieChosen.overview }} </div>

                              <div class="seasons" v-if="ShowisShown">
                                    <span>{{ movieChosen.number_of_seasons }} Seasons</span>
                                    <span>{{ movieChosen.number_of_episodes }} Episodes</span>
                                    <span v-if="movieChosen.in_production">Up-to-date</span>
                                    <span v-else>Ended</span>
                              </div>
                              <div class="info">
                                    <span class="year" v-if="!ShowisShown">{{ movieChosen.release_date.slice(0, 4)
                                    }}</span>
                                    <span class="year" v-if="ShowisShown">{{ movieChosen.first_air_date.slice(0, 4)
                                    }}</span>
                              </div>
                        </div>
                  </router-link>
            </div>
            <div class="RowLabel">Trending Movies This Week</div>
            <div class="TrendingMovies">
                  <div class="movie" v-for="m in TrendingMovies" :key="m.id">
                        <router-link
                              :to="{ name: 'MovieName', params: { Id: m.id, name: m.title, type: m.media_type } }">
                              <movieCard :imgSrc="imageBase.concat(m.poster_path)" :alt="m.title" :title="m.title"
                                    :year="m.release_date.slice(0, 4)" :type="m.media_type.toUpperCase()"
                                    :plot="m.overview" />
                        </router-link>
                  </div>
            </div>
            <div class="RowLabel">Trending Tv Shows This Week</div>
            <div class="TrendingTvShows">
                  <div class="show" v-for="s in TrendingTvShows" :key="s.id">
                        <router-link
                              :to="{ name: 'MovieName', params: { Id: s.id, name: s.name, type: s.media_type } }">
                              <movieCard :imgSrc="imageBase.concat(s.poster_path)" :alt="s.name" :title="s.name"
                                    :year="s.first_air_date.slice(0, 4)" :type="s.media_type.toUpperCase()"
                                    :plot="s.overview" />
                        </router-link>
                  </div>
            </div>
            <div class="RowLabel">Trending Movies Today</div>
            <div class="TrendingToday">
                  <div class="movie" v-for="m in TrendingMoviesToday" :key="m.id">
                        <router-link
                              :to="{ name: 'MovieName', params: { Id: m.id, name: m.title, type: m.media_type } }">
                              <movieCard :imgSrc="imageBase.concat(m.poster_path)" :alt="m.title" :title="m.title"
                                    :year="m.release_date.slice(0, 4)" :type="m.media_type.toUpperCase()"
                                    :plot="m.overview" />
                        </router-link>
                  </div>
            </div>
            <div class="RowLabel">Trending Shows Today</div>
            <div class="TrendingToday">
                  <div class="show" v-for="s in TrendingShowsToday" :key="s.id">
                        <router-link
                              :to="{ name: 'MovieName', params: { Id: s.id, name: s.name, type: s.media_type } }">
                              <movieCard :imgSrc="imageBase.concat(s.poster_path)" :alt="s.name" :title="s.name"
                                    :year="s.first_air_date.slice(0, 4)" :type="s.media_type.toUpperCase()"
                                    :plot="s.overview" />
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
      name: "HomeView",
      components: { movieCard, NavBar, SideBar },
      data() {
            return {
                  TrendingMovies: null,
                  TrendingTvShows: null,
                  TrendingMoviesToday: null,
                  TrendingShowsToday: null,
                  popularMovies: null,
                  imageBase: "http://image.tmdb.org/t/p/w500/",
                  wideImageBase: "http://image.tmdb.org/t/p/original/",
                  //side bar data
                  showSide: false,
                  //widearea
                  ShowisShown: false,
                  movieChosen: null,
                  //searchBar
                  searchTitle: "",
                  searchedData: null,
                  showBar: false


            };
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
            //showSearch BAr
            showSearchBar() {
                  this.showBar = !this.showBar
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
      updated() {
            this.$refs.backdrop.style.backgroundImage = `url(${this.wideImageBase.concat(this.movieChosen.backdrop_path)})`

      },
      mounted() {
            //popular movies for wide Area
            fetch(
                  "https://api.themoviedb.org/3/movie/top_rated?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&page=2"
            )
                  .then((response) => response.json())
                  .then((response) => {
                        this.popularMovies = response.results.slice(10, 11);
                        // console.log(this.popularMovies)
                  })
                  .catch((err) => console.error(err));

            //trending movies

            fetch(
                  "https://api.themoviedb.org/3/trending/movie/week?api_key=027ef6b5c80761ceecd553242c390211"
            )
                  .then((response) => response.json())
                  .then((response) => {
                        this.TrendingMovies = response.results;
                        // console.log(response.results)
                  })
                  .catch((err) => console.error(err));

            //Tv shows api
            //popular shows api

            fetch(
                  "https://api.themoviedb.org/3/trending/tv/week?api_key=027ef6b5c80761ceecd553242c390211"
            )
                  .then((response) => response.json())
                  .then((response) => {
                        this.TrendingTvShows = response.results;
                        // console.log(response.results)
                  })
                  .catch((err) => console.error(err));
            //trending movies today
            fetch(
                  "https://api.themoviedb.org/3/trending/movie/day?api_key=027ef6b5c80761ceecd553242c390211"
            )
                  .then((response) => response.json())
                  .then((response) => {
                        this.TrendingMoviesToday = response.results;
                        // console.log(response.results)
                  })
                  .catch((err) => console.error(err));
            //trending shows today

            fetch(
                  "https://api.themoviedb.org/3/trending/tv/day?api_key=027ef6b5c80761ceecd553242c390211"
            )
                  .then((response) => response.json())
                  .then((response) => {
                        this.TrendingShowsToday = response.results;
                        // console.log(response.results)
                  })
                  .catch((err) => console.error(err));

            //bullet train movie for wide area
            fetch(`https://api.themoviedb.org/3/movie/718930?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
                  .then(response => response.json())
                  .then(response => {
                        // console.log(response);
                        this.movieChosen = response;
                  })
                  .catch(err => console.log(err));

            //testing discover movie using critiria
            // fetch(`
            // https://api.themoviedb.org/3/discover/movie?api_key=027ef6b5c80761ceecd553242c390211&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=2024&with_watch_providers=Netflix&with_watch_monetization_types=flatrate`)
            //       .then(response => response.json())
            //       .then(response => {
            //             console.log(response);
            //             // this.details = response;
            //       })
            //       .catch(err => console.log(err));
      },
};
</script>
<style lang="scss" scoped>
.HomeZone {
      background: transparent;
      width: calc(100% - 20px);
      min-height: 30rem;
      margin: 0px 10px 0 10px;
      overflow: hidden;

      .WideArea {
            background-position: center top;
            background-size: cover;
            // background-attachment: fixed;
            height: 26rem;
            width: 100%;

            .DimmedArea {
                  height: 100%;
                  width: 100%;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  background-image: linear-gradient(to bottom, transparent, $bgColor);
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
                        display: flex;
                        flex-direction: column;
                        justify-content: end;

                        .title {
                              font-size: 5rem;
                              text-transform: capitalize;
                              font-weight: 300;
                        }

                        .seasons {
                              font-size: 20px;
                              font-weight: 200;
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

                        .year {
                              font-size: 18px;

                        }

                        .plot {
                              font-size: 16px;
                              padding: 10px;
                              line-height: 20px;
                        }


                  }
            }
      }

      .RowLabel {
            color: $primary;
            font-size: 20px;
            font-weight: 300;
            border-bottom: 2px $primary solid;
            padding: 20px;
      }

      .TrendingMovies,
      .TrendingTvShows,
      .TrendingToday {
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

            .movie,
            .show {
                  position: relative;
                  z-index: 5;
                  margin: 0px 10px;
            }


      }
}

@include SideBarEffects;
@include loader;


//responsive for less than 768px

@media(max-width : 768px) {
      .HomeZone {
            background: transparent;
            width: calc(100% - 20px);
            min-height: fit-content;
            margin: 0px 10px 0 10px;
            overflow: hidden;

            .WideArea {
                  background-position: center top;
                  background-size: cover;
                  // background-attachment: fixed;
                  height: 16rem;
                  width: 100%;

                  .DimmedArea {
                        height: 100%;
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: end;
                        background-image: linear-gradient(to bottom, transparent, $surface);
                        backdrop-filter: brightness(0.8);
                        // pointer-events: none;

                        .lhs {
                              position: relative;
                              z-index: 10;
                              // background-color: blue;
                              width: 100%;
                              height: 4rem;
                              padding: 25px;
                              pointer-events: none;

                              .title {
                                    font-size: 2.5rem;
                                    text-transform: capitalize;
                                    font-weight: 300;
                              }

                              .seasons {
                                    font-size: 20px;
                                    font-weight: 200;
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
                                    font-size: 1rem;
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

                              .year {
                                    font-size: 1.2rem;

                              }

                              .plot {
                                    font-size: 6px;
                                    // padding: 10px;
                                    // line-height: 20px;
                                    font-weight: 100;
                                    display: none;
                              }


                        }
                  }
            }


            .RowLabel {
                  color: $primary;
                  font-size: 15px;
                  font-weight: 300;
                  border-bottom: 1px $primary solid;
                  padding: 5px;
            }

            .TrendingMovies,
            .TrendingTvShows,
            .TrendingToday {
                  display: flex;
                  flex-direction: row;
                  // width: fit-content;
                  height: 9.5rem;
                  overflow-x: scroll;
                  overflow-y: hidden;
                  position: relative;
                  z-index: 10;
                  margin: 5px;

                  &::-webkit-scrollbar {
                        height: 5px;
                        display: inline-block;
                  }

                  /* Track */
                  &::-webkit-scrollbar-track {
                        border-radius: 3px;
                  }

                  /* Handle */
                  &::-webkit-scrollbar-thumb {
                        background: $primary;
                        border-radius: 20px;
                  }

                  .movie,
                  .show {
                        position: relative;
                        z-index: 5;
                        margin: 5px;
                  }


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
