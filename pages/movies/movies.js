export default () => {
  const content = document.querySelector(".content");

  return fetch("./pages/movies/movies.html")
    .then((response) => response.text())
    .then((moviesHtml) => {
      content.innerHTML = moviesHtml;

      const today = new Date();
      const tomorrow = setNextDay(today);

      function setNextDay(day) {
        const nextDay = new Date(day);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(24, 0, 0, 0);
        return nextDay;
      }

      function formatDateForRequest(date) {
        let d = new Date(date),
          month = "" + (d.getMonth() + 1),
          day = "" + d.getDate(),
          year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
      }

      function getMovieScheduledTime(date) {
        let d = new Date(date),
          hours = "" + d.getHours(),
          minutes = "" + d.getMinutes();

        if (minutes.length < 2) minutes = "0" + minutes;

        return [hours, minutes].join(":");
      }

      function checkIfDateIsInside(check, from, to) {
        return (
          check.getTime() <= to.getTime() && check.getTime() >= from.getTime()
        );
      }

      const startDate = formatDateForRequest(today);
      const endDate = formatDateForRequest(tomorrow);

      return fetch(
        `${window.apiUrl}/api/movie?startRange=${startDate}&endRange=${startDate}`
      )
        .then((response) => response.json())
        .then((movies) => {
          const movieContainer = document.querySelector(".movie-container");
          const noMoviePrompt = document.querySelector("h4.prompt");
          noMoviePrompt.style.display = "none";

          const filteredMovies = movies.filter((movie) => {
            const filteredTimesSlots = movie.timeSlots.filter((timesSlot) => {
              const check = formatDatetimeToJavascriptDate(
                timesSlot.scheduledTime
              );
              const checkResult = checkIfDateIsInside(check, today, tomorrow);
              return checkResult;
            });
            return filteredTimesSlots.length > 0;
          });

          filteredMovies.forEach((movie) => {
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
                scheduledTime.innerHTML = getMovieScheduledTime(
                  formatDatetimeToJavascriptDate(timesSlot.scheduledTime)
                );
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

  function formatDatetimeToJavascriptDate(datetime) {
    const t = datetime.split(/[- :T]/);
    const d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
    return d;
  }
};
