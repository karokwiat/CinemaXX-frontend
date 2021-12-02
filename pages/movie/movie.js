export default (movieId) => {
  const content = document.querySelector(".content");

  fetch("./pages/movie/movie.html")
    .then((response) => response.text())
    .then((movieHtml) => {
      content.innerHTML = movieHtml;

      return fetch(`${window.apiUrl}/api/movie/${movieId}`)
        .then((response) => response.json())
        .then((movie) => {
          document.querySelector("h3").innerText = movie.title;
          document.querySelector("li.ageRestriction").innerHTML =
            movie.ageRestriction;
          document.querySelector("li.rating").innerHTML = movie.rating;
        });
    });
};
