export default () => {
  const content = document.querySelector(".content");

  return fetch("./pages/movies/movies.html")
    .then((response) => response.text())
    .then((moviesHtml) => {
      content.innerHTML = moviesHtml;

      return fetch(
        `${window.apiUrl}/api/movie?startRange=2021-10-01&endRange=2021-12-31`
      )
        .then((response) => response.json())
        .then((movies) => {
          const movieContainer = document.querySelector(".movie-container");
          const noMoviePrompt = document.querySelector("h4.prompt");
          noMoviePrompt.style.display = "none";

          movies.forEach((movie) => {
            const movieArticle = document.createElement("article");
            movieArticle.classList.add("article-card");
            movieContainer.appendChild(movieArticle);
            const imageFigure = document.createElement("figure");
            imageFigure.classList.add("article-image");
            movieArticle.appendChild(imageFigure);
            const image = document.createElement("img");
            imageFigure.appendChild(image);
            image.src = movie.poster;
            image.alt = `Picture of ${movie.title}`;
            const articleContent = document.createElement("div");
            articleContent.classList.add("article-content");
            movieArticle.appendChild(articleContent);
            const category = document.createElement("a");
            articleContent.appendChild(category);
            category.classList.add("card-category");
            category.innerHTML = movie.ageRestriction;
            const movieTitle = document.createElement("h3");
            articleContent.appendChild(movieTitle);
            const movieTitleLink = document.createElement("a");
            movieTitle.appendChild(movieTitleLink);
            movieTitleLink.href = `/#/movie/${movie.movieId}`;
            movieTitleLink.innerHTML = movie.title;
            movie.timeSlots
              .filter((timesSlot, idx) => idx < 2)
              .forEach((timesSlot) => {
                const scheduledTime = document.createElement("p");
                articleContent.appendChild(scheduledTime);
                scheduledTime.innerHTML = timesSlot.scheduledTime;
              });
            if (movie.timeSlots.length > 2) {
              const showMore = document.createElement("a");
              articleContent.appendChild(showMore);
              showMore.innerText = "Show more times";
              showMore.classList.add("more");
              showMore.href = `/#/movie/${movie.movieId}`;
            }
          });
        });
    });
};
