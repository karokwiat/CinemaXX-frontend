export default () => {
  const content = document.querySelector(".content");

  fetch("./pages/booking/booking.html")
    .then((response) => response.text())
    .then((aboutHtml) => {
      content.innerHTML = bookingHtml;
    });
};
