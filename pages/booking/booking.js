export default async (booking) => {
  const content = document.querySelector(".content");

  const bookingPageResponse = await fetch("./pages/booking/booking.html");
  const bookingHtml = await bookingPageResponse.text();
  content.innerHTML = bookingHtml;

  const url = new URL(`${window.apiUrl}/api/bookings`);

  const bodyData = {
    seatId: booking.params.seat,
    timeSlotId: booking.params.timeSlot,
    movieId: booking.data.id,
    theaterHallId: 1
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
  console.log(createBookingResponse);
};
