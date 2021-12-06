export default () => {
  const content = document.querySelector(".content");

  return fetch("./pages/movies/movies.html")
    .then((response) => response.text())
    .then((moviesHtml) => {
      content.innerHTML = moviesHtml;

      const movieContainer = document.querySelector(".movie-container");
      const noMoviePrompt = document.querySelector("h4.prompt");
      noMoviePrompt.style.display = "none";
      const todayBtn = document.querySelector("#today-btn");
      const tomorrowBtn = document.querySelector("#tomorrow-btn");
      const weekBtn = document.querySelector("#week-btn");

      todayBtn.addEventListener("click", () => {
        const fromDate = new Date();
        const toDate = setDayEnd(fromDate);
        const url = buildUrl(fromDate, toDate);
        fetch(url)
          .then((response) => response.json())
          .then((movies) => {
            const filteredMovies = filterMoviesWithTimeSlotsCheck(
              movies,
              fromDate,
              toDate
            );
            movieContainer.innerHTML = "";
            renderMovies(filteredMovies);
          });
      });

      tomorrowBtn.addEventListener("click", () => {
        const fromDate = setDayEnd(new Date());
        const toDate = setDayEnd(fromDate);
        const url = buildUrl(fromDate, toDate);
        fetch(url)
          .then((response) => response.json())
          .then((movies) => {
            const filteredMovies = filterMoviesWithTimeSlotsCheck(
              movies,
              fromDate,
              toDate
            );
            movieContainer.innerHTML = "";
            renderMovies(filteredMovies);
          });
      });

      weekBtn.addEventListener("click", () => {
        const fromDate = new Date();
        const toDate = setFutureDayEnd(today, 7);
        const url = buildUrl(fromDate, toDate);
        fetch(url)
          .then((response) => response.json())
          .then((movies) => {
            const filteredMovies = filterMoviesWithTimeSlotsCheck(
              movies,
              fromDate,
              toDate
            );
            movieContainer.innerHTML = "";
            renderMovies(filteredMovies);
          });
      });

      const today = new Date();
      const inAWeek = setFutureDayEnd(today, 7);
      const url = buildUrl(today, inAWeek);

      return fetch(url)
        .then((response) => response.json())
        .then((movies) => {
          const filteredMovies = filterMoviesWithTimeSlotsCheck(
            movies,
            today,
            inAWeek
          );
          renderMovies(filteredMovies);
        });

      function filterMoviesWithTimeSlotsCheck(movies, fromDate, toDate) {
        const filteredMovies = movies.filter((movie) => {
          const filteredTimesSlots = movie.timeSlots.filter((timesSlot) => {
            const check = formatDatetimeToJavascriptDate(
              timesSlot.scheduledTime
            );
            const checkResult = checkIfDateIsInside(check, fromDate, toDate);
            return checkResult;
          });
          movie.timeSlots = filteredTimesSlots;
          return filteredTimesSlots.length > 0;
        });
        console.log(filteredMovies);
        return filteredMovies;
      }

      function renderMovies(movies) {
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
              scheduledTime.innerHTML = getTimeForCustomer(
                timesSlot.scheduledTime
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
      }
    });

  function buildUrl(fromDate, toDate) {
    const startDate = formatDateForRequest(fromDate);
    const endDate = formatDateForRequest(toDate);
    console.log(startDate, endDate);
    return `${window.apiUrl}/api/movie?startRange=${startDate}&endRange=${endDate}`;
  }

  function setDayEnd(day) {
    const dayEnd = new Date(day);
    dayEnd.setHours(24, 0, 0, 0);
    return dayEnd;
  }

  function setFutureDayEnd(day, number) {
    const futureDayEnd = new Date(day);
    futureDayEnd.setDate(futureDayEnd.getDate() + number);
    futureDayEnd.setHours(0, 0, 0, 0);
    return futureDayEnd;
  }

  function formatDatetimeToJavascriptDate(datetime) {
    const t = datetime.split(/[- :T]/);
    const d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
    return d;
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

  function getTimeForCustomer(datetime) {
    const t = datetime.split(/[T]/);
    const h = t[1].split(/[:]/);
    return `${t[0]} ${h[0]}:${h[1]}`;
  }

  function checkIfDateIsInside(check, fromDate, toDate) {
    return (
      check.getTime() <= toDate.getTime() &&
      check.getTime() >= fromDate.getTime()
    );
  }
};
