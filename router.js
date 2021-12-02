import renderMain from "./pages/main/main.js";
import renderAbout from "./pages/about/about.js";
import renderMovie from "./pages/movie/movie.js";
import renderLogin from "./pages/login/login.js";
import renderMovies from "./pages/movies/movies.js";

export default function () {
  const router = new Navigo("/", { hash: true });

  router
    .on({
      "/": () => {
        // call updatePageLinks to let navigo handle the links
        // when new links have been inserted into the dom
        renderMain().then(router.updatePageLinks);
      },
      about: () => {
        renderAbout();
      },
      login: () => {
        renderLogin();
      },
      movies: () => {
        renderMovies().then(router.updatePageLinks);
      },
      "/movie/:id/": ({ data, params }) => {
        renderMovie(data.id);
      },
    })
    .resolve();
}
