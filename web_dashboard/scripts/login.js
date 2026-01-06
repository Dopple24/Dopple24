const submit = document.getElementById("login-btn");
const email = document.getElementById("email");
const password = document.getElementById("password");

submit.onclick = (event) => {
    event.preventDefault();
    login();
};

async function login() {
    try {
        const response = await fetch("https://192.168.50.179:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: email.value,
                password: password.value
            }),
            credentials: "include" // important for cookies
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Login failed:", text);
            alert("Login failed: " + text);
            return;
        }
        else {
            window.location.replace("../");
        }

        console.log("Login successful!");
        // Cookie is automatically stored by the browser
        // You can now call protected endpoints, cookies will be sent automatically
    } catch (err) {
        console.error("Fetch error:", err);
    }
}


async function testCookie() {
    const response = await fetch("https://192.168.50.179:8080/protected", {
        credentials: "include" // send stored cookies
    });

    const text = await response.text();
    console.log(text); // will say either "Cookie is present and valid!" or "No session cookie found"
}
