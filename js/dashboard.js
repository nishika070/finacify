//sp isme ek to renderkro list 
//total income
const response = fetch("db.json");

console.log("Done");
const expenses=JSON.parse(localStorage.getItem("expenses"))|| []
const incomes=JSON.parse(localStorage.getItem("incomes"))|| []

//func
const calc_totalIncome=()=>{
let total=0;
incomes.forEach(income => {
    total+=Number(income.amount)
    
})
document.getElementById(
        "total-income"
    ).innerHTML =
        `<p>₹${total.toLocaleString("en-IN")}</p>`;
    return total;

};
calc_totalIncome();


//total expense
const calc_totalExpense=()=>{
    let total=0;
    expenses.forEach(expense => {
        total+=Number(expense.amount)

        
    });
    document.getElementById("total-expense").innerHTML=`<p>₹${total.toLocaleString("en-IN")}</p>`;
    return total;
};
calc_totalExpense();
const netSaving=()=>{
    const income=calc_totalIncome();
    const expense=calc_totalExpense();
    let saving=income-expense;
    document.getElementById("net-saving").innerHTML=`<p>₹${saving.toLocaleString("en-IN")}</p>`
    return saving;
};
netSaving();

const calc_savingRate=()=>{
    const income=calc_totalIncome();
    const nsave=netSaving();
    let per=(nsave/income)*100;
    document.getElementById("savings-rate").innerHTML= `<p>${per.toFixed(2)}%</p>`

    
return per;
};




calc_savingRate();




const transactions=[

    ...expenses.map(expense=>({
        ...expense,//all fields same copy like name and all:)
        type:"expense"
    })),

    ...incomes.map(income=>({
        ...income,
        type:"income"
    }))
];
transactions.sort((a,b)=>{
    return new Date(b.date)-new Date(a.date)

});


const renderlist=(transactions)=>{
     const tList=document.getElementById("transaction-list");
    tList.innerHTML="";
    transactions.forEach(transaction => {
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
    
        tList.appendChild(li);
});
}
renderlist(transactions);
const searchButton=document.getElementById("transaction-search");
searchButton.addEventListener("input",function(){
    const inputText=searchButton.value.toLowerCase();
    const newSearch=
        transactions.filter(transaction=>
            transaction.desc.toLowerCase().includes(inputText)
        );
    renderlist(newSearch);

});



//abb lets build the chart 
const CategoryTotals={

}
expenses.forEach(expense=>{
    
    if(CategoryTotals[expense.category]){
        CategoryTotals[expense.category]+=expense.amount;
    }
    else{
        CategoryTotals[expense.category]=expense.amount;
    }


});

const drawChart = () => {

    const labels =
    Object.keys(CategoryTotals);

    const values =
    Object.values(CategoryTotals);

    const ctx =
    document
    .getElementById("spending-chart")
    .getContext("2d");

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

                legend: {
                    position: "right"
                }

            }
        }

    });

};

drawChart();