export default async (booking) => {
  const content = document.querySelector(".content");

  const bookingPageResponse = await fetch("./pages/booking/booking.html");
  const bookingHtml = await bookingPageResponse.text();
  content.innerHTML = bookingHtml;

  const url = new URL(`${window.apiUrl}/api/bookings`);

  const bodyData = {
    seatId: booking.params.seatId,
    timeSlotId: booking.params.timeSlotId,
    movieId: booking.data.id,
    theaterHallId: booking.params.theaterHallId
  };

  const getSeatsResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem("user")}`,
    },
    body: JSON.stringify(bodyData)
  });

  const createBookingResponse = await getSeatsResponse.json();
  const resultElement = document.querySelector(".bookingResult");
  if(createBookingResponse.status===400)
    resultElement.innerHTML = "<h4>Something went wrong, please try again later</h4>"
  else
    resultElement.innerHTML = `<h4>Seat ${createBookingResponse.seatNumber} booked succesfully for time ${createBookingResponse.scheduledTime}<h4>`
};
