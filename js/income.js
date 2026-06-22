
const resetnull = () => {
    document.getElementById("income-desc").value = "";
    document.getElementById("income-amount").value = "";
    document.getElementById("income-date").value = "";
    document.getElementById("income-category").value = "";
};


// load() — localStorage hataya, ab json-server se fetch karta hai
// async isliye ki fetch() Promise return karta hai, await chahiye
const load = async () => {
    const res = await fetch("http://localhost:3000/incomes");
    const incomes = await res.json();
    return incomes;
};


// init() — top level pe await nahi likh sakte directly
// isliye async function mein wrap kiya, phir call kiya
async function init() {
    const incomes = await load();
    renderlist(incomes);
}

init();


let selectedId=null;
const incomeBtn = document.getElementById("add-income-btn");

// async isliye ki andar await use kar rahe hain (POST request)
incomeBtn.addEventListener("click", async function () {

    const income_desc = document.getElementById("income-desc").value;
    const income_amount = document.getElementById("income-amount").value;
    const income_date = document.getElementById("income-date").value;
    const income_category = document.getElementById("income-category").value;

    if (income_desc === "" || income_amount <= 0 || income_amount >= 10000000 ||income_category===null) {
        alert("No description provided!");
        return;
    }

    const income = {
        desc: income_desc,
        amount: income_amount,
        date: income_date,
        category: income_category
        // id mat dena — json-server khud banata hai
    };


    if(selectedId){
        //yha update 
        await fetch(`http://localhost:3000/incomes/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(income)
    });
        
    }
    else{
    

    // localStorage.setItem hataya — ab POST se json-server ko bhejte hain
    // json-server automatically db.json mein save kar leta hai
    
    await fetch("http://localhost:3000/incomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(income)
    });
}
    alert("Income added!");
    resetnull();

    // fresh data fetch karo aur re-render karo
    const incomes = await load();
    renderlist(incomes);
    incomeUpdate();
    incomeperweek();

});


// Render List — koi change nahi, same logic
const renderlist = (incomes) => {

    const incomeList = document.getElementById("income-list");
    incomeList.innerHTML = "";

    if (incomes.length === 0) {
        incomeList.innerHTML = "<li style='color:#5279b0; padding:20px;'>NO RECORDS FOUND</li>";
        return;
    }

    incomes.forEach(income => {
        const li = document.createElement("li");
        const desc = income.desc;
        const amount = income.amount;
        li.addEventListener("click",
        function(){
            selectedId=income.id;
            document.getElementById("income-desc").value=income.desc;
            document.getElementById("income-amount").value=income.amount;
            document.getElementById("income-date").value=income.date;
            document.getElementById("income-category").value=income.category;
            }
    )
        li.innerHTML = `<div class="itemLi">
    <span>${desc}</span>
    <span>₹${Number(amount).toLocaleString("en-IN")}</span>
    </div>`
        incomeList.appendChild(li);
    });

};


//delete method
const deleteBtn=document.getElementById("income-deletebtn");
deleteBtn.addEventListener("click", async function() {
    await fetch(`http://localhost:3000/incomes/${selectedId}`, {
        method: "DELETE"  // string hona chahiye
    });
    selectedId = null;
    init();
});
    






// async isliye ki load() async hai — await use karna padega
const incomeUpdate = async () => {

    let incomes = await load();
    let total = 0;
    let date = new Date();

    incomes.forEach(income => {
        const incomeDate = new Date(income.date);
        let diffday = (date - incomeDate) / (1000 * 60 * 60 * 24);
        if (diffday <= 30) {
            total += Number(income.amount);
        }
    });

    document.getElementById("total-income").innerHTML =
        "<p>₹" + Number(total).toLocaleString("en-IN") + "</p>";

};

incomeUpdate();


// async isliye ki load() async hai — await use karna padega
const incomeperweek = async () => {

    let incomes = await load();
    let total = 0;
    let date = new Date();

    incomes.forEach(income => {
        const incomeDate = new Date(income.date);
        let diffday = (date - incomeDate) / (1000 * 60 * 60 * 24);
        if (diffday <= 7) {
            total += Number(income.amount);
        }
    });

    total = (total / 7).toFixed(2);

    document.getElementById("weekly-income").innerHTML =
        "<p>₹" + Number(total).toLocaleString("en-IN") + "</p>";

};

incomeperweek();


// async isliye ki load() async hai aur filter se pehle await chahiye
const searchBtn = document.getElementById("income-search");

searchBtn.addEventListener("input", async function () {

    const inputtext = searchBtn.value.toLowerCase();
    let incomes = await load(); // await nahi kiya toh Promise aata, array nahi

    const newincomes = incomes.filter(income =>
        income.desc.toLowerCase().includes(inputtext)
    );

    renderlist(newincomes);

});