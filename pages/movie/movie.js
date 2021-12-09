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

  // create default empty option
  const timeSlotDefault = document.createElement("option");
  timeSlotDefault.value = "";
  timeSlotDefault.textContent = "Select Day and Time";
  timeSlotsList.appendChild(timeSlotDefault);

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
    const seatsWrapper = document.querySelector(
      "div.movie-booking > div.seats-wrapper"
    );

    if(event.target.value == "")
      seatsWrapper.style.visibility = "hidden";
    else {

      const seatsContainer = document.querySelector(
        "div.movie-booking > div.seats-wrapper > div.seats-container"
      );
      const button = document.querySelector(".seats-wrapper button");
      button.addEventListener("click", handleContinue);

      const url = new URL(`${window.apiUrl}/api/bookings`);
      url.searchParams.append("theaterHall", 1);
      url.searchParams.append("startTime", event.target.value.replace("T", " "));

      const getSeatsResponse = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user")}`,
        },
      });

      const { freeSeats, bookedSeats } = await getSeatsResponse.json();

      clearSeats(seatsContainer);
      populateSeatsContainer(seatsContainer, freeSeats, bookedSeats);

      const seatsContent = seatsContainer.querySelectorAll(".seat-content");
      highlightFreeSeats(seatsContent, freeSeats);
      highlightBookedSeats(seatsContent, bookedSeats);

      const clearSelected = (selected) => {
        const isFree = freeSeats.includes(selected);

        [...seatsContent]
          .filter((_seat) => _seat.textContent === selected)
          .forEach((_seat) => {
            _seat.classList.remove("selected");
            _seat.classList.add(isFree ? "free" : "booked");
          });

        button.disabled = true;
        button.removeAttribute("data-seat-number");
        button.setAttribute("data-time-slot", event.target.value);
      };

      addSelectSeatHandler(seatsContent, button, clearSelected);

      seatsWrapper.style.visibility = "visible";
    }
  }

  function handleContinue(event) {
    window.router.navigate(`#/movie/${movieId}/booking?&seat=${event.target.getAttribute(
      "data-seat-number"
    )}&timeSlot=${event.target.getAttribute(
      "data-time-slot"
    )}`);
  }

  function addSelectSeatHandler(seatsContent, button, clearSelected) {
    [...seatsContent].forEach((seat) => {
      seat.addEventListener("click", (event) => {
        const { target } = event;
        const selected = button.getAttribute("data-seat-number");
        clearSelected(selected);

        if (target.classList.contains("free")) {
          clearSelected(target.textContent);
          button.disabled = false;
          button.setAttribute("data-seat-number", target.textContent);
          target.classList.remove("free");
          target.classList.add("selected");
          return;
        }
      });
    });
  }

  function populateSeatsContainer(seatsContainer, freeSeats, bookedSeats) {
    const allSeats = sortSeats([...freeSeats, ...bookedSeats]);

    allSeats.forEach((seat) => {
      const seatElement = document.createElement("div");
      seatElement.classList.add("seat");
      const seatContentElement = document.createElement("div");
      seatContentElement.classList.add("seat-content");
      seatContentElement.textContent = seat;

      seatsContainer.appendChild(seatElement);
      seatElement.appendChild(seatContentElement);
    });
  }

  function highlightFreeSeats(seatsContent, freeSeats) {
    [...seatsContent]
      .filter((seat) => freeSeats.includes(seat.textContent))
      .forEach((seat) => seat.classList.add("free"));
  }

  function highlightBookedSeats(seatsContent, bookedSeats) {
    [...seatsContent]
      .filter((seat) => bookedSeats.includes(seat.textContent))
      .forEach((seat) => seat.classList.add("booked"));
  }

  function sortSeats(seats) {
    return seats.sort((a, b) => {
      const aN = Number(a.replaceAll("-", ""));
      const bN = Number(b.replaceAll("-", ""));

      return aN - bN;
    });
  }

  function clearSeats(seatsContainer) {
    seatsContainer.innerHTML = "";
  }
};
