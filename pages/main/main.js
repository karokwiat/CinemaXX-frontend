export default () => {
  const content = document.querySelector(".content");

  return fetch("./pages/main/main.html")
    .then((response) => response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;

      fetch(
        "http://localhost:8080/api/movie?startRange=2021-10-01&endRange=2021-12-31"
      )
        .then((Response) => Response.json())
        .then((movies) => console.log(movies));
    });
};
