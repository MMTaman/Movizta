<template >
      <!-- @scroll="navBgAlteration" -->
      <div class="nav" ref="Nav" @click.self="closeSideFromNav">
            <div class="menu" @click="openSideBar"><font-awesome-icon icon="fa-solid fa-bars" /></div>
            <div class="whereUr">
                  <div v-if="$route.params.name">{{ $route.params.name }}</div>
                  <div v-else>{{ $route.name }}</div>
            </div>
            <div class="searchNav" @click="openSearchBar">
                  <font-awesome-icon icon="fa-magnifying-glass" />
            </div>
      </div>

</template>

<script>

export default {
      data() {
            return {
            }
      },
      methods: {
            openSideBar() {
                  this.$emit('slide')
            },
            closeSideFromNav() {
                  this.$emit('slideBackFromNav')
            },
            openSearchBar() {
                  this.$emit('openBar')
            },

      }
      ,
      mounted() {
            // window.addEventListener('scroll', this.navBgAlteration)
      }
};
</script>

<style lang="scss" scoped>
.nav {
      position: fixed;
      top: 0;
      display: flex;
      justify-content: space-between;
      padding: 5px 10px 5px 10px;
      height: 2.5rem;
      width: calc(100% - 10px);
      background-color: transparent;
      backdrop-filter: brightness(.3);
      z-index: 20;

      .menu {
            padding: 5px;
            width: fit-content;
            height: fit-content;

            & * {
                  font-size: 25px;
                  cursor: pointer;
            }
      }

      .whereUr {
            padding: 5;
            width: fit-content;
            height: fit-content;
            font-size: 25px;
            cursor: default;
            text-transform: uppercase;
            pointer-events: none;
      }

      .searchNav {
            padding: 5px;
            width: fit-content;
            height: fit-content;

            & * {
                  font-size: 25px;
                  cursor: pointer;
            }
      }

      a {
            color: inherit;
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


@media (max-width:576px) {
      .nav {
            position: fixed;
            top: 0;
            display: flex;
            justify-content: space-between;
            padding: 5px;
            height: 2rem;
            width: calc(100% - 10px);
            background-color: transparent;
            backdrop-filter: brightness(.3);
            z-index: 20;

            .menu {
                  padding: 5px;
                  width: fit-content;
                  height: fit-content;

                  & * {
                        font-size: 18px;
                        cursor: pointer;
                  }
            }

            .whereUr {
                  padding: 5;
                  width: fit-content;
                  height: fit-content;
                  font-size: 18px;
                  cursor: default;
                  text-transform: uppercase;
                  pointer-events: none;
            }

            .search {
                  padding: 5px;
                  width: fit-content;
                  height: fit-content;

                  & * {
                        font-size: 18px;
                        cursor: pointer;
                  }
            }

            a {
                  color: inherit;
            }
      }


}
</style>
