const submit = document.getElementById("login-btn");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordRepeat = document.getElementById("password-repeat");

submit.onclick = register;

function register() {
    if (password.value == passwordRepeat.value) {
        fetch("https://127.0.0.1:8080/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: email.value,
                    password: password.value
                })
            })
        console.log(fetched);
    }
    else {
        console.log("mismatched passwords");
    }
}


