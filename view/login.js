const form = document.getElementById('login-form');

const login = async (e) => {
    const {userName, password} = form;
    const data ={
        userName: userName?.value,
        password: password?.value
    }
    console.log(data)

   await fetch("http://localhost:3005/api/v1/user/login", {
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
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    login()
})