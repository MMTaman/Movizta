<template>
      <div class="side">
            <ul class="main">
                  <div class="name">MoviZta</div>
                  <router-link to="/" @click="hideSideBar">
                        <li>
                              Home
                        </li>
                  </router-link>
                  <router-link to="/MoviesView" @click="hideSideBar">
                        <li>
                              Movies
                        </li>
                  </router-link>
                  <router-link to="/TvShowsView" @click="hideSideBar">
                        <li>
                              TV Shows

                        </li>
                  </router-link>
            </ul>
            <div class="close" v-if="showClose" @click="hideSideBar"><font-awesome-icon icon="fa-circle-xmark" /></div>
      </div>
</template>

<script>
export default {
      data() {
            return {
                  showClose: true
            };
      },
      methods: {
            hideSideBar() {
                  this.$emit("slideBack");
            },
      },
      mounted() {
            // if (window.innerWidth <= '768') {
            //       this.showClose = true
            // }
            // else (this.showClose = false)
      }
};
</script>

<style lang="scss">
.side {
      background-color: $surface;
      min-height: 100%;
      width: fit-content;

      .name {
            color: $primary;
            font-size: 14px;
            margin: 10px 0 30px 10px;
            cursor: default;
      }

      .main {
            z-index: 1000;
            padding: 0;
            height: 95%;
            display: flex;
            flex-direction: column;
            list-style: none;

            &>a {
                  text-decoration: none;
                  color: $secondary;
                  margin-right: 2.5px;
                  font-size: 15rem;
                  overflow: hidden;
                  margin-bottom: 10px;
                  width: 12rem;
                  text-align: center;

                  li {
                        cursor: pointer;
                        padding: 15px;
                        font-size: 26px;
                        list-style: none;
                        cursor: pointer;
                  }

            }

      }

      .close {
            font-size: 4rem;
            font-weight: 200;
            position: absolute;
            bottom: 10px;
            left: calc(50% - 2rem);
      }
}

@media (max-width:768px) {
      .side {
            position: relative;
            background-color: transparent;
            backdrop-filter: blur(10px);
            min-height: 100%;
            min-width: 100%;

            .name {
                  color: $primary;
                  font-size: 14px;
                  margin: 30px 50%-7 30px 50%-7;
                  cursor: default;
            }

            .main {
                  // background: red;
                  z-index: 1000;
                  padding: 0;
                  min-height: 100%;
                  min-width: 100%;
                  display: flex;
                  flex-direction: column;
                  list-style: none;
                  align-items: center;

                  &>a {
                        text-decoration: none;
                        color: $secondary;
                        margin-right: 2.5px;
                        font-size: 15rem;
                        overflow: hidden;
                        margin-bottom: 20px;
                        width: 100%;
                        text-align: center;

                        li {
                              cursor: pointer;
                              padding: 5px;
                              font-size: 26px;
                              list-style: none;
                              cursor: pointer;
                        }

                  }

            }

            .slide-enter-active,
            .slide-leave-active {
                  transition: transform 0.25s ease;
            }

            .slide-enter-from,
            .slide-leave-to {
                  transform: translateY(15rem);
            }
      }
}
</style>
