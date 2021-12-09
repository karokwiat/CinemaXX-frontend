export default async () => {
  const content = document.querySelector(".content");

  const bookingPageResponse = await fetch("./pages/booking/booking.html");
  const bookingHtml = await bookingPageResponse.text();
  content.innerHTML = bookingHtml;
};
