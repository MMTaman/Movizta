import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Movies from "../views/MoviesView.vue";
import TvShows from "../views/TvShowsView.vue";
import Search from "../views/SearchView.vue";
import MovieName from "../views/MovieName.vue";
import ActorName from "../views/ActorName.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
      {
            path: "/",
            name: "home",
            component: HomeView,
      },
      {
            path: "/MoviesView",
            name: "movies",
            component: Movies,
      },
      {
            path: "/TvShowsView",
            name: "tvshows",
            component: TvShows,
      },
      {
            path: "/SearchView/",
            name: "search",
            component: Search,
      },
      {
            path: "/SearchView/:title/:results/:page",
            name: "search",
            component: Search,
      },
      //movie or show details from home and sidebar api
      {
            path: "/:name/:type/:Id",
            name: "MovieName",
            component: MovieName,
      },
      {
            path: "/:name/:type/:department/:Id",
            name: "ActorName",
            component: ActorName,
      },
      {
            path: "/:catchAll(.*)",
            component: NotFound,
      },
];

const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes,
});

export default router;
