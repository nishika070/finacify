let transactions=[];
async function init() {
    // fetch both from json-server
    const expRes  = await fetch("http://localhost:3000/expenses");
    const incRes  = await fetch("http://localhost:3000/incomes");

    // .json() opens the envelope — gives real array
    const expenses = await expRes.json();
    const incomes  = await incRes.json();

    // all functions get data as parameters
    calc_totalIncome(incomes);
    calc_totalExpense(expenses);
    netSaving(incomes, expenses);
    calc_savingRate(incomes, expenses);
    drawChart(expenses);

    // transactions must be INSIDE init() — expenses/incomes exist only here
     transactions = [
        ...expenses.map(expense => ({ ...expense, type: "expense" })),
        ...incomes.map(income  => ({ ...income,  type: "income"  }))
    ];

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    renderlist(transactions);

    // search also inside init() — needs transactions array
    const searchButton = document.getElementById("transaction-search");
    searchButton.addEventListener("input", function () {
        const inputText = searchButton.value.toLowerCase();
        const newSearch = transactions.filter(transaction =>
            transaction.desc.toLowerCase().includes(inputText)
        );
        renderlist(newSearch);
    });

}

init();


// calc total income
const calc_totalIncome = (incomes) => {
    let total = 0;
    incomes.forEach(income => {
        total += Number(income.amount);
    });
    document.getElementById("total-income").innerHTML = `<p>₹${total.toLocaleString("en-IN")}</p>`;
    return total;
};


// calc total expense
const calc_totalExpense = (expenses) => {
    let total = 0;
    expenses.forEach(expense => {
        total += Number(expense.amount);
    });
    document.getElementById("total-expense").innerHTML = `<p>₹${total.toLocaleString("en-IN")}</p>`;
    return total;
};


// net saving
const netSaving = (incomes, expenses) => {
    const income  = calc_totalIncome(incomes);
    const expense = calc_totalExpense(expenses);
    let saving = income - expense;
    document.getElementById("net-saving").innerHTML = `<p>₹${saving.toLocaleString("en-IN")}</p>`;
    return saving;
};


// saving rate
const calc_savingRate = (incomes, expenses) => {
    const income = calc_totalIncome(incomes);
    const nsave  = netSaving(incomes, expenses);
    let per = (nsave / income) * 100;
    document.getElementById("savings-rate").innerHTML = `<p>${per.toFixed(2)}%</p>`;
    return per;
};
///transaction logic:
let currentPage=1;
const itemsPerPage=5;
//both left and right button
const leftBtn=document.getElementById("left")
leftBtn.addEventListener(
    "click",
    function(){
        currentPage--;
        renderlist(transactions);
    }
)
const rightBtn=document.getElementById("right")
rightBtn.addEventListener(
    "click",
    function(){
        currentPage++;
        renderlist(transactions);
    }
)
const totalPages=()=>{
    let page=Math.ceil(transaction.length/itemsPerPage);
    return page
}


// render transaction list
const renderlist = (transactions) => {
    const tList = document.getElementById("transaction-list");
    tList.innerHTML = "";
    const start=(currentPage-1)*itemsPerPage;
    const end=start+itemsPerPage;
    const visible=transactions.slice(start,end);
    
     visible.forEach(transaction => {
        const li          = document.createElement("li");
        const sign        = transaction.type === "income" ? "+" : "-";
        const amountClass = transaction.type === "income" ? "amount-income" : "amount-expense";
        const date        = new Date(transaction.date).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric"
        });

        li.innerHTML = `
            <div class="t-left">
                <span class="t-desc">${transaction.desc}</span>
                <span class="t-meta">${date} · ${transaction.type}</span>
            </div>
            <span class="${amountClass}">
                ${sign}₹${Number(transaction.amount).toLocaleString("en-IN")}
            </span>
        `;
        leftBtn.disabled=currentPage===1;
        rightBtn.disabled=currentPage===(totalPages-1);
        console.log(currentPage);
        const countBtn=document.getElementById("count");
        countBtn.innerHTML='';
        countBtn.innerHTML=`<span>${currentPage}</span>`;
        tList.appendChild(li);
    });
};

// draw doughnut chart
// CategoryTotals is an object — NOT a function
const drawChart = (expenses) => {
    const CategoryTotals = {};

    expenses.forEach(expense => {
        if (CategoryTotals[expense.category]) {
            CategoryTotals[expense.category] += Number(expense.amount);
        } else {
            CategoryTotals[expense.category] = Number(expense.amount);
        }
    });

    const labels = Object.keys(CategoryTotals);
    const values = Object.values(CategoryTotals);

    const ctx = document.getElementById("spending-chart").getContext("2d");

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                label: "Expenses",
                data: values,
                backgroundColor: [
                    "#4e79a7",
                    "#f28e2b",
                    "#e15759",
                    "#76b7b2",
                    "#59a14f",
                    "#edc948",
                    "#b07aa1"
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "right" }
            }
        }
    });
};