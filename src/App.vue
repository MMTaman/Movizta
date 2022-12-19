<template>
      <router-view :key="$route.fullPath" />
</template>
<script>

export default {
      components: {},
      data() {
            return {
            };
      },
      beforeMount() {
        //Categories
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=027ef6b5c80761ceecd553242c390211&language=en-US`)
            .then(response => response.json())
            .then(response => {
                console.log(response);
            })
            .catch(err => console.log(err));
      },

      methods: {

      },
};
</script>

<style lang="scss">
body {
      background-color: $bgColor;
      color: $secondary;
      font-family: "Ubuntu", sans-serif;
      margin: 0;

      &::-webkit-scrollbar {
            width: 10px;
      }

      /* Handle */
      &::-webkit-scrollbar-thumb {
            background: $primary;
            border-radius: 5px;
      }

      // height: 2000px;
      a {
            text-decoration: none;
            color: $secondary;
      }
}
</style>
