export default () => {
  const content = document.querySelector(".content");

  return fetch("./pages/main/main.html")
    .then((response) => response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;
      const posterSlide = document.querySelector(".poster-slide");

      const today = new Date();
      const inAWeek = setFutureDayEnd(today, 14);
      const url = buildUrl(today, inAWeek);

      return fetch(url)
        .then((response) => response.json())
        .then((movies) => {
          //console.log(movies);
          movies
            .filter((movie, idx) => idx < 6)
            .forEach((movie) => {
              const posterSlideImg = document.createElement("img");
              posterSlide.appendChild(posterSlideImg);
              posterSlideImg.src = movie.poster;
              posterSlideImg.addEventListener("click", () =>
                window.location.replace(`/#/movie/${movie.movieId}`)
              );
            });

          window.onload = () => {
            const posterSlideImgs =
              document.querySelectorAll(".poster-slide img");

            posterSlideImgs.forEach((img) => {
              img.addEventListener(
                "mouseout",
                () => (posterSlide.className = "poster-slide")
              );
            });
            posterSlideImgs.forEach((img) => {
              img.addEventListener(
                "mouseover",
                () => (posterSlide.className = "poster-slide hovered")
              );
            });
          };
        });
    });

  function buildUrl(fromDate, toDate) {
    const startDate = formatDateForRequest(fromDate);
    const endDate = formatDateForRequest(toDate);
    //console.log(startDate, endDate);
    return `${window.apiUrl}/api/movie?startRange=${startDate}&endRange=${endDate}`;
  }

  function setFutureDayEnd(day, number) {
    const futureDayEnd = new Date(day);
    futureDayEnd.setDate(futureDayEnd.getDate() + number);
    futureDayEnd.setHours(0, 0, 0, 0);
    return futureDayEnd;
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
};
