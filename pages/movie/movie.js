export default async (movieId) => {
  const content = document.querySelector(".content");

  const moviePageResponse = await fetch("./pages/movie/movie.html");
  const movieHtml = await moviePageResponse.text();
  content.innerHTML = movieHtml;

  const getMovieResponse = await fetch(`${window.apiUrl}/api/movie/${movieId}`);
  const movie = await getMovieResponse.json();
  console.log(movie);
  document.querySelector(".movie-poster img").src = movie.poster;
  document.querySelector("h3.title").innerText = movie.title;
  document.querySelector("p.description").innerHTML = movie.description;
  document.querySelector("p.ageRestriction").innerHTML = movie.ageRestriction;
  document.querySelector("p.rating").innerHTML = movie.rating;
  // document.querySelector("span").innerHTML = getTimeForCustomer(
  //   movie.timeSlots[0].scheduledTime
  // );

  const timeSlotsList = document.querySelector(".dropdown-content");
  timeSlotsList.addEventListener("change", handleTimeSlotChange);

  movie.timeSlots.forEach((timeSlot) => {
    const timeSlotItem = document.createElement("option");

    timeSlotItem.value = timeSlot.scheduledTime;
    timeSlotItem.textContent = getTimeForCustomer(timeSlot.scheduledTime);
    timeSlotsList.appendChild(timeSlotItem);
  });

  function getTimeForCustomer(datetime) {
    const t = datetime.split(/[T]/);
    const h = t[1].split(/[:]/);
    return `${t[0]} ${h[0]}:${h[1]}`;
  }

  ////////////////////////////////////////////////////////////////////////
  //                     Functions related to seats                     //
  ////////////////////////////////////////////////////////////////////////
  async function handleTimeSlotChange(event) {
    const seatsContainer = document.querySelector(
      "div.movie-booking > div.seats-container"
    );

    const url = new URL(`${window.apiUrl}/api/bookings`);
    url.searchParams.append("theaterHall", 1);
    url.searchParams.append("startTime", event.target.value.replace("T", " "));

    const getSeatsResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user")}`,
      },
    });

    const { freeSeats, bookedSeats } = await getSeatsResponse.json();

    populateSeatsContainer(seatsContainer, freeSeats, bookedSeats);
  }

  function populateSeatsContainer(seatsContainer, freeSeats, bookedSeats) {
    const allSeats = sortSeats([...freeSeats, ...bookedSeats]);

    allSeats.forEach((seat) => {
      const seatElement = document.createElement("div");
      seatElement.classList.add("seat");
      const seatContentElement = document.createElement("div");
      seatContentElement.classList.add("seat-content");
      seatContentElement.textContent = seat;

      seatContentElement.appendChild(seatElement);
      seatsContainer.appendChild(seatContentElement);
    });
  }

  function sortSeats(seats) {
    return seats.sort((a, b) => {
      const aN = Number(a.replaceAll("-", ""));
      const bN = Number(b.replaceAll("-", ""));

      return aN - bN;
    });
  }
};
