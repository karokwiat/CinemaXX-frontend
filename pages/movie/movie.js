export default async (movieId) => {
  const content = document.querySelector(".content");

  const moviePageResponse = await fetch("./pages/movie/movie.html");
  const movieHtml = await moviePageResponse.text();
  content.innerHTML = movieHtml;

  const getMovieResponse = await fetch(`${window.apiUrl}/api/movie/${movieId}`);
  const movie = await response.json();
  console.log(movie);
  document.querySelector(".movie-poster img").src = movie.poster;
  document.querySelector("h3.title").innerText = movie.title;
  document.querySelector("p.description").innerHTML = movie.description;
  document.querySelector("p.ageRestriction").innerHTML = movie.ageRestriction;
  document.querySelector("p.rating").innerHTML = movie.rating;
  document.querySelector("span").innerHTML = getTimeForCustomer(
    movie.timeSlots[0].scheduledTime
  );
  const timeSlotsList = document.querySelector(".dropdown-content");
  movie.timeSlots.forEach((timeSlot) => {
    const timeSlotItem = document.createElement("a");

    timeSlotItem.textContent = getTimeForCustomer(timeSlot.scheduledTime);
    timeSlotsList.appendChild(timeSlotItem);
  });

  function getTimeForCustomer(datetime) {
    const t = datetime.split(/[T]/);
    const h = t[1].split(/[:]/);
    return `${t[0]} ${h[0]}:${h[1]}`;
  }
};
