export default () => {
  const content = document.querySelector(".content");

  return fetch("./pages/movies/movies.html")
    .then((response) => response.text())
    .then((moviesHtml) => {
      content.innerHTML = moviesHtml;

      return fetch(
        "http://localhost:8080/api/movie?startRange=2021-10-01&endRange=2021-12-31"
      )
        .then((response) => response.json())
        .then((movies) => {
          const moviesUl = document.querySelector("ul.movies");
          let moviesHtml = "";
          movies.forEach((movie) => {
            moviesHtml += `<li>${movie.title} - <a href="/movie/${movie.movieId}" data-navigo>link to profile</a>`;
          });
          moviesUl.innerHTML = moviesHtml;
        });
    });
};
