const resetnull = () => {
    document.getElementById("expense-desc").value = "";
    document.getElementById("expense-amount").value = "";
    document.getElementById("expense-date").value = "";
    document.getElementById("expense-category").value = "";
};

const load = async () => {
    const res = await fetch("http://localhost:3000/expenses");
    const expenses = await res.json();
    return expenses;
};
let selectedId=null;
const expenseBtn = document.getElementById("add-expense-btn");

expenseBtn.addEventListener("click", async function () {

    const expense_desc = document.getElementById("expense-desc").value;
    const expense_amount = document.getElementById("expense-amount").value;
    const expense_date = document.getElementById("expense-date").value;
    const expense_category = document.getElementById("expense-category").value;

    if (expense_desc === "" || expense_amount <= 0 || expense_amount >= 10000000) {
        alert("No desc provided!!");
        return;
    }

    document.getElementById("expense-amount").min = 1;
    document.getElementById("expense-amount").max = 100000000;

    const expense = {
        desc: expense_desc,
        amount: expense_amount,
        date: expense_date,
        category: expense_category
    };
    if(selectedId){
        await fetch(`http://localhost:3000/expenses/${selectedId}`,{
            method:"PUT",
            headers:{"Content-Type" :"application/json"},
            body:JSON.stringify(expense)
       });

    }
    else{
            await fetch("http://localhost:3000/expenses", {
        method: "POST",
        headers: { "Content-Type": "files/json" },
        body: JSON.stringify(expense)
    });
    }
    alert("Expense added!!");
    resetnull();

    const expenses = await load();
    renderlist(expenses);
    expenseUpdate();
    expenseperweek();

});


// Render Transaction List

const renderlist = (expenses) => {

    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";

    if (expenses.length === 0) {
        expenseList.innerHTML = "<li style='color:#5279b0; padding:20px;'>NO RECORDS FOUND</li>";
        return;
    }
    
    
    expenses.forEach(expense => {
        const li = document.createElement("li");
        const desc = expense.desc;
        const amount = expense.amount;
        li.addEventListener(
        "click",
        function(){
            selectedId=expense.id;
            document.getElementById("expense-desc").value=expense.desc;
            document.getElementById("expense-amount").value=expense.amount;
            document.getElementById("expense-date").value=expense.date;
            document.getElementById("expense-category").value=expense.category;

        })
        
        li.innerHTML = `<span>${desc}</span> <span>₹${Number(amount).toLocaleString("en-IN")}</span>`;
        expenseList.appendChild(li);
    });

};
const deleteBtn=document.getElementById("expense-deletebtn")
deleteBtn.addEventListener(
    "click",
    async function(){
        await fetch(`http://localhost:3000/expenses/${selectedId}`,{
            method:"DELETE"
        });
        selectedId=null;
        init();
        alert("deleted !")
        resetnull();
    }

)

// Initial Load

async function init() {
    const expenses = await load();
    renderlist(expenses);
}

init();


// Total Expenses

const expenseUpdate = async () => {

    let expenses = await load();
    let total = 0;
    let date = new Date();

    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        let diffday = (date - expenseDate) / (1000 * 60 * 60 * 24);
        if (diffday <= 30) {
            total += Number(expense.amount);
        }
    });

    document.getElementById("total-expenses").innerHTML = `<p>₹${total.toLocaleString("en-IN")}</p>`;

};

expenseUpdate();


// Weekly Average

const expenseperweek = async () => {

    let expenses = await load();
    let total = 0;
    let date = new Date();

    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        let diffday = (date - expenseDate) / (1000 * 60 * 60 * 24);
        if (diffday <= 7) {
            total += Number(expense.amount);
        }
    });

    total = (total / 7).toFixed(2);
    document.getElementById("weekly-average").innerHTML = `<p>₹${Number(total).toLocaleString("en-IN")}</p>`;

};

expenseperweek();


// Search

const searchBtn = document.getElementById("expense-search");

searchBtn.addEventListener("input", async function () {

    const inputtext = searchBtn.value.toLowerCase();
    let expenses = await load();

    const newexpenses = expenses.filter(expense =>
        expense.desc.toLowerCase().includes(inputtext)
    );

    renderlist(newexpenses);

});