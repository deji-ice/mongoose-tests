const form = document.getElementById("signUpForm");

console.log(form, typeof form);

const formData = () => {
  const { firstName, lastName, email, password, userName, confirmPassword } =
    form;

  const data = {
    firstName: firstName.value,
    lastName: lastName.value,
    userName: userName.value,
    email: email.value,
    password: password.value,
  };

  fetch("http://localhost:3005/api/v1/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    formData();
})
