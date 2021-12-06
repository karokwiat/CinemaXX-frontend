export default (movieId) => {
  const content = document.querySelector(".content");

  fetch("./pages/movie/movie.html")
    .then((response) => response.text())
    .then((movieHtml) => {
      content.innerHTML = movieHtml;

      return fetch(`${window.apiUrl}/api/movie/${movieId}`)
        .then((response) => response.json())
        .then((movie) => {
          console.log(movie);
          document.querySelector(".movie-poster img").src = movie.poster;
          document.querySelector("h3.title").innerText = movie.title;
          document.querySelector("p.description").innerHTML = movie.description;
          document.querySelector("p.ageRestriction").innerHTML =
            movie.ageRestriction;
          document.querySelector("p.rating").innerHTML = movie.rating;
          document.querySelector("span").innerHTML = getTimeForCustomer(
            movie.timeSlots[0].scheduledTime
          );
          movie.timeSlots.forEach((timeSlot) => {
            const timeSlotsList = document.querySelector(".dropdown-content");
            const timeSlotElement = document.createElement("p");
            timeSlotsList.appendChild(timeSlotElement);
            timeSlotElement.innerHTML = getTimeForCustomer(
              timeSlot.scheduledTime
            );
            const timeSlotLink = document.createElement("a");
            timeSlotElement.appendChild(timeSlotLink);
          });
        });
    });

  function getTimeForCustomer(datetime) {
    const t = datetime.split(/[T]/);
    const h = t[1].split(/[:]/);
    return `${t[0]} ${h[0]}:${h[1]}`;
  }
};
