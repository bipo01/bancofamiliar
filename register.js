async function register(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/");
    const data = await response.json();

    const nome = inputRegisterNome.value
        .trim()
        .split(" ")
        .map((el) => el[0].toUpperCase() + el.slice(1))
        .join(" ");

    const username = inputRegisterUsername.value.trim();

    const pin = inputRegisterPin.value.trim();
    const pinConfirm = inputRegisterConfirmPin.value.trim();
    console.log(nome);
    console.log(username);
    console.log(pin);

    const userExistente = data.find((conta) => conta.username === username);

    if (pin === pinConfirm && !userExistente) {
        inputRegisterNome.value = "";
        inputRegisterUsername.value = "";
        inputRegisterPin.value = "";
        inputRegisterConfirmPin.value = "";

        const response = await fetch(
            `http://localhost:3000/add?owner=${nome}&username=${username}&password=${pin}`
        );

        const data = await response.json();
        console.log(data);

        window.location.href = "./login.html";
    } else {
        if (userExistente) {
            inputRegisterUsername.value = "";
            inputRegisterUsername.classList.add("registrando");
            inputRegisterUsername.placeholder = "User Inválido";
        } else {
            inputRegisterConfirmPin.value = "";
            inputRegisterConfirmPin.placeholder = "PIN incorreto";
        }
    }
}

const btnRegister = document.querySelector(".register__btn");

const inputRegisterNome = document.querySelector(".register__input--nome");
const inputRegisterUsername = document.querySelector(".register__input--user");
const inputRegisterPin = document.querySelector(".register__input--pin");
const inputRegisterConfirmPin = document.querySelector(
    ".register__input--confirm--pin"
);

btnRegister.addEventListener("click", register);
