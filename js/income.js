const resetnull = () => {
document.getElementById("income-desc").value = "";
document.getElementById("income-amount").value = "";
document.getElementById("income-date").value = "";
document.getElementById("income-category").value = "";
};

const load = () => {
let incomes;

const stored = localStorage.getItem("incomes");

if (stored) {
    incomes = JSON.parse(stored);
} else {
    incomes = [];
}

return incomes;


};

const incomeBtn = document.getElementById("add-income-btn");

incomeBtn.addEventListener("click", function () {


const income_desc =
    document.getElementById("income-desc").value;

const income_amount =
    document.getElementById("income-amount").value;

const income_date =
    document.getElementById("income-date").value;

const income_category =
    document.getElementById("income-category").value;

if (
    income_desc === "" ||
    income_amount <= 0 ||
    income_amount >= 10000000
) {
    alert("No description provided!");
    return;
}

const income = {
    desc: income_desc,
    amount: income_amount,
    date: income_date,
    category: income_category
};

let incomes = load();

incomes.push(income);

localStorage.setItem(
    "incomes",
    JSON.stringify(incomes)
);

alert("Income added!");

resetnull();

renderlist(incomes);
incomeUpdate();
incomeperweek();

});

const renderlist = (incomes) => {

const incomeList =
    document.getElementById("income-list");

incomeList.innerHTML = "";

if (incomes.length === 0) {
    incomeList.innerHTML =
        "<li style='color:#5279b0; padding:20px;'>NO RECORDS FOUND</li>";
    return;
}

incomes.forEach(income => {

    const li = document.createElement("li");

    const desc = income.desc;
    const amount = income.amount;

    li.innerHTML =
        "<span>" +
        desc +
        "</span><span>₹" +
        Number(amount).toLocaleString("en-IN") +
        "</span>";

    incomeList.appendChild(li);
});

};

let incomes = load();

renderlist(incomes);

const incomeUpdate = () => {


let incomes = load();

let total = 0;

let date = new Date();

incomes.forEach(income => {

    const incomeDate =
        new Date(income.date);

    let diffday =
        (date - incomeDate) /
        (1000 * 60 * 60 * 24);

    if (diffday <= 30) {
        total += Number(income.amount);
    }
});

document.getElementById("total-income").innerHTML =
    "<p>₹" +
    Number(total).toLocaleString("en-IN") +
    "</p>";


};

incomeUpdate();

const incomeperweek = () => {

let incomes = load();

let total = 0;

let date = new Date();

incomes.forEach(income => {

    const incomeDate =
        new Date(income.date);

    let diffday =
        (date - incomeDate) /
        (1000 * 60 * 60 * 24);

    if (diffday <= 7) {
        total += Number(income.amount);
    }
});

total = (total / 7).toFixed(2);

document.getElementById("weekly-income").innerHTML =
    "<p>₹" +
    Number(total).toLocaleString("en-IN") +
    "</p>";


};

incomeperweek();

const searchBtn =
document.getElementById("income-search");

searchBtn.addEventListener("input", function () {


const inputtext =
    searchBtn.value.toLowerCase();

let incomes = load();

const newincomes =
    incomes.filter(income =>
        income.desc
            .toLowerCase()
            .includes(inputtext)
    );

renderlist(newincomes);


});
