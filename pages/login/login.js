export default () => {
  const content = document.querySelector(".content");

  return fetch("./pages/login/login.html")
    .then((response) => response.text())
    .then((loginHtml) => {
      content.innerHTML = loginHtml;

      const form = document.querySelector("form");
      form.addEventListener("submit", (event) => {
        // Make sure the form is not submitted
        event.preventDefault();
        // endpoint for logging in
        const apiUrl = "http://54.175.181.176:9090/api/authenticate/login";

        fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            username: document.querySelector(".username").value,
            password: document.querySelector(".password").value,
          }),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.token) {
              // Saving the JWT to local storage
              localStorage.setItem("user", JSON.stringify(response.token));
              location.href = "/";
            }
          });
      });
    });
};
