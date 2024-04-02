"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
let currentAccount;
let data;
let accounts;

async function getData() {
    const response = await fetch("https://bancofamiliarapi.vercel.app/");
    data = await response.json();

    console.log(data);

    accounts = data.map((acc) => acc);
    console.log(accounts);

    init();
}

function init() {
    // Elements
    const labelWelcome = document.querySelector(".welcome");
    const labelDate = document.querySelector(".date");
    const labelBalance = document.querySelector(".balance__value");
    const labelSumIn = document.querySelector(".summary__value--in");
    const labelSumOut = document.querySelector(".summary__value--out");
    const labelSumInterest = document.querySelector(
        ".summary__value--interest"
    );
    const labelTimer = document.querySelector(".timer");

    const containerApp = document.querySelector(".app");
    const containerMovements = document.querySelector(".movements");

    const btnLogin = document.querySelector(".login__btn");
    const btnTransfer = document.querySelector(".form__btn--transfer");
    const btnLoan = document.querySelector(".form__btn--loan");
    const btnClose = document.querySelector(".form__btn--close");
    const btnSort = document.querySelector(".btn--sort");
    const btnfecharConta = document.querySelector(".fechar-conta");

    const inputLoginUsername = document.querySelector(".login__input--user");
    const inputLoginPin = document.querySelector(".login__input--pin");
    const inputTransferTo = document.querySelector(".form__input--to");
    const inputTransferAmount = document.querySelector(".form__input--amount");
    const inputLoanAmount = document.querySelector(".form__input--loan-amount");
    const inputCloseUsername = document.querySelector(".form__input--user");
    const inputClosePin = document.querySelector(".form__input--pin");
    const inputFecharContaPin = document.querySelector(".fecharcontaPin");
    const inputFecharContaUsername = document.querySelector(
        ".fecharcontaUsername"
    );

    const displayMovements = function (acc) {
        containerMovements.innerHTML = "";

        if (acc.movements) {
            acc.movements.forEach((movement, i) => {
                const type = movement > 0 ? "deposit" : "withdrawal";

                const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${
                    movement > 0 ? "Entrada" : "Saída"
                }</div>
        <div class="movements__date">${acc.datamovement[i]}</div>
        <div class="movements__value">R$ ${movement}</div>
      </div>`;

                containerMovements.insertAdjacentHTML("afterbegin", html);
            });
        } else {
            labelBalance.textContent = "R$ 0";
            labelSumIn.textContent = "R$ 0";
            labelSumOut.textContent = "R$ 0";
        }
    };

    const calcDisplaySummary = (acc) => {
        if (acc.movements) {
            const incomes = acc.movements
                .filter((mov) => mov > 0)
                .reduce((acc, cur) => acc + cur, 0);

            labelSumIn.textContent = `R$ ${incomes}`;

            const out = acc.movements
                .filter((mov) => mov < 0)
                .reduce((acc, mov) => acc + mov, 0);
            labelSumOut.textContent = `$R$ ${Math.abs(out)}`;
        }
    };

    const calcDisplayBalance = (acc) => {
        if (acc.movements) {
            acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

            labelBalance.textContent = `R$ ${acc.balance}`;
        }
    };

    function updateUI(account) {
        displayMovements(account);
        calcDisplaySummary(account);
        calcDisplayBalance(account);
    }

    //Event Handler

    btnLogin.addEventListener("click", (e) => {
        e.preventDefault();

        currentAccount = accounts.find(
            (acc) => acc.username === inputLoginUsername.value
        );

        if (Number(currentAccount?.password) === Number(inputLoginPin.value)) {
            console.log("Login");
            labelWelcome.textContent = `Bem-vindo de volta, ${
                currentAccount.owner.split(" ")[0]
            }!`;

            containerApp.style.opacity = 100;
            updateUI(currentAccount);
        } else {
            window.location.href = "./index.html";
        }
        inputLoginUsername.value = "";
        inputLoginPin.value = "";
        inputLoginPin.blur();
    });

    btnTransfer.addEventListener("click", async (e) => {
        e.preventDefault();
        let dia = `${new Date().getDate()}`;
        let mes = `${new Date().getMonth() + 1}`;
        let ano = `${new Date().getFullYear()}`;

        dia = dia.length == 1 ? `0${dia}` : dia;
        mes = mes.length == 1 ? `0${mes}` : mes;

        const dataAtual = `${dia}/${mes}/${ano}`;

        if (inputTransferAmount.value) {
            const response = await fetch(
                `https://bancofamiliarapi.vercel.app/movement?id=${currentAccount.id}&mov=${inputTransferAmount.value}&dataatual=${dataAtual}`
            );
            const data = await response.json();

            updateUI(data[0]);
            inputTransferAmount.value = "";

            inputTransferAmount.blur();
        }
    });

    //Gasto
    btnClose.addEventListener("click", async (e) => {
        e.preventDefault();
        let dia = `${new Date().getDate()}`;
        let mes = `${new Date().getMonth() + 1}`;
        let ano = `${new Date().getFullYear()}`;

        dia = dia.length == 1 ? `0${dia}` : dia;
        mes = mes.length == 1 ? `0${mes}` : mes;

        const dataAtual = `${dia}/${mes}/${ano}`;

        if (inputClosePin.value) {
            const response = await fetch(
                `https://bancofamiliarapi.vercel.app/movement?id=${currentAccount.id}&mov=-${inputClosePin.value}&dataatual=${dataAtual}`
            );
            const data = await response.json();
            console.log(data);

            updateUI(data[0]);
            inputClosePin.value = "";

            inputTransferAmount.blur();
        }
    });

    //Deletar conta
    btnfecharConta.addEventListener("click", async (e) => {
        e.preventDefault();

        if (
            currentAccount.username === inputFecharContaUsername.value &&
            currentAccount.password === inputFecharContaPin.value
        ) {
            const response = await fetch(
                `https://bancofamiliarapi.vercel.app/deletar?id=${currentAccount.id}`
            );
            const data = await response.json();

            console.log(data);

            location.reload();
        }
    });
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    // LECTURES

    const currencies = new Map([
        ["USD", "United States dollar"],
        ["EUR", "Euro"],
        ["GBP", "Pound sterling"],
    ]);

    const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
}

getData();
