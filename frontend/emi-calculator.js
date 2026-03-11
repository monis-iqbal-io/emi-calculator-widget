let loanChart;


//CSS styling
const style = document.createElement("style");

style.innerHTML = `
.emi-widget{
    font-family:"Segoe UI",sans-serif;
    max-width:760px;
    margin:40px auto;
    padding:30px;
    border-radius:14px;
    background:white;
    box-shadow:0 12px 30px rgba(0,0,0,0.08);
}

.emi-widget h2{
    text-align:center;
    margin-bottom:25px;
    color:#333;
}

.emi-widget h3{
    margin-top:25px;
    margin-bottom:10px;
    color:#444;
}

.emi-widget label{
    margin-top:14px;
    display:block;
    font-weight:500;
}

/* Currency Inputs */

.currency-input{
    position:relative;
    width:100%;
}

.currency-input input{
    width:100%;
    padding:10px 10px 10px 10px;
    border:1px solid #ddd;
    border-radius:6px;
}

.symbol{
    position:absolute;
    right:12px;
    top:50%;
    transform:translateY(-50%);
    color:#777;
    font-weight:500;
}

/* Tenure Input + Select */

.tenure-wrapper{
    display:flex;
    gap:10px;
    align-items:center;
}

.tenure-wrapper input{
    flex:1;
    padding:10px;
    border:1px solid #ddd;
    border-radius:6px;
}

.tenure-wrapper select{
    padding:10px;
    border:1px solid #ddd;
    border-radius:6px;
    background:white;
    cursor:pointer;
}

/* Button */

.emi-widget button{
    width:100%;
    padding:12px;
    border:none;
    border-radius:8px;
    background:linear-gradient(135deg,#1976D2,#0D47A1);
    color:white;
    font-weight:600;
    cursor:pointer;
    margin-top:15px;
}

.emi-widget button:hover{
    background:linear-gradient(135deg,#1565C0,#0B3C91);
}

/* Loan Summary Cards */

.summary-cards{
    display:grid;
    grid-template-columns: repeat(auto-fit, minmax(150px,1fr));
    gap:15px;
}

.summary-card{
    flex:1;
    background:#f7f9fc;
    padding:16px;
    border-radius:10px;
    text-align:center;
    border:1px solid #eee;
}

.card-title{
    font-size:14px;
    color:#666;
}

.card-value{
    font-size:20px;
    font-weight:600;
    margin-top:5px;
    color:#1976D2;
}

/* Chart */

#loanChart{
    max-width:340px;
    margin:20px auto;
    display:block;
}

#scheduleTable{
    width:100%;
    border-collapse:collapse;
    font-size:14px;
}

/* Header */

#scheduleTable thead{
    position:sticky;
    top:0;
    background:#1976D2;
}

#scheduleTable th{
    color:white;
    padding:10px;
    text-align:center;
}

/* Cells */

#scheduleTable td{
    padding:8px;
    text-align:center;
    border-bottom:1px solid #eee;
}

/* Zebra Rows */

#scheduleTable tbody tr:nth-child(even){
    background:#f8f9fb;
}

/* Hover */

#scheduleTable tbody tr:hover{
    background:#eef4ff;
}
    
/* Table Container */

.table-container{
    margin-top:15px;
    max-height:320px;
    overflow-y:auto;
    border:1px solid #eee;
    border-radius:8px;
}

@media (max-width:768px){

.summary-cards{
    flex-direction:column;
}

.tenure-wrapper{
    flex-direction:column;
}

.emi-widget{
    padding:20px;
}

}
`;

document.head.appendChild(style);


const container = document.getElementById("emi-calculator");

if (!container) {
    console.error("EMI Calculator container not found.");
    
}


container.innerHTML = `
<div class="emi-widget">

<h2>EMI Calculator</h2>

<label>Loan Amount</label>
<div class="currency-input">
<input type="number" min="0" id="loanAmount">
<span class="symbol">₹</span>
</div>

<label>Interest Rate</label>
<div class="currency-input">
<input type="number" min="0" id="interestRate">
<span class="symbol">%</span>
</div>

<label>Tenure</label>

<div class="tenure-wrapper">

<input type="number" id="tenure" min ="0" placeholder="Enter tenure">

<select id="tenureType">
<option value="years">Years</option>
<option value="months">Months</option>
</select>

</div>

<h3>Loan Summary</h3>

<div class="summary-cards">

<div class="summary-card">
<div class="card-title">Monthly EMI</div>
<div class="card-value" id="emi">₹0</div>
</div>

<div class="summary-card">
<div class="card-title">Total Interest</div>
<div class="card-value" id="totalInterest">₹0</div>
</div>

<div class="summary-card">
<div class="card-title">Total Payment</div>
<div class="card-value" id="totalPayment">₹0</div>
</div>

<div class="summary-card">
<div class="card-title">Flat Rate (PA)</div>
<div class="card-value" id="flatRatePA">0%</div>
</div>

<div class="summary-card">
<div class="card-title">Flat Rate (PM)</div>
<div class="card-value" id="flatRatePM">0%</div>
</div>

<div class="summary-card">
<div class="card-title">Yearly Interest</div>
<div class="card-value" id="yearlyInterest">₹0</div>
</div>

</div>

<button id="calculateBtn">Calculate EMI</button>

<p id="errorMessage" style="color:red"></p>


<h3>Principal vs Interest</h3>
<canvas id="loanChart"></canvas>
<h3>Amortization Schedule</h3>

<div class="table-container">

<table id="scheduleTable">
<thead>
<tr>
<th>Month</th>
<th>EMI</th>
<th>Principal</th>
<th>Interest</th>
<th>Balance</th>
</tr>
</thead>
<tbody></tbody>
</table>
</div>

</div>
`;



const calculateBtn = document.getElementById("calculateBtn");

calculateBtn.addEventListener("click" , calculateEMI);

async function calculateEMI(){

    let loanAmount = parseFloat(document.getElementById("loanAmount").value);
    let interestRate = parseFloat(document.getElementById("interestRate").value);
    let tenureYears = parseInt(document.getElementById("tenure").value);

    let errorMessage = document.getElementById("errorMessage");
    
    
    if (!loanAmount || !interestRate || !tenureYears){
        errorMessage.innerText = "Please fill all the input fields";
        return;
    }

    if (loanAmount <= 0 || interestRate < 0 || tenureYears <=0){
        errorMessage.innerText = "Values must be postive numbers.";
        return;
    }
    errorMessage.innerText="";


    let tenureType = document.getElementById("tenureType").value;

    let tenureMonths;

    if(tenureType === "years"){
    tenureMonths = tenureYears * 12;
    }else{
    tenureMonths = tenureYears;
    }

    const response = await fetch("http://127.0.0.1:8000/api/calculate-emi" ,{
        method : "POST" ,
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            loan_amount : loanAmount,
            interest_rate : interestRate,
            tenure : tenureMonths
        })
    });


    
    const data = await response.json();

    document.getElementById("emi").innerText = "₹" + data.emi.toLocaleString();
    document.getElementById("totalPayment").innerText = "₹" + data.total_payment.toLocaleString();
    document.getElementById("totalInterest").innerText = "₹" + data.total_interest.toLocaleString();

    document.getElementById("flatRatePA").innerText = data.flat_rate_pa + "%";
    document.getElementById("flatRatePM").innerText = data.flat_rate_pm + "%";

    document.getElementById("yearlyInterest").innerText =
        "₹" + data.yearly_interest.toLocaleString();


    const ctx = document.getElementById("loanChart").getContext("2d");

    if(loanChart){
        loanChart.destroy();
    }

loanChart = new Chart(ctx , {

    type : "pie",

    data : {
        labels:["Principal" , "Interest"],
        datasets: [{
            data : [loanAmount , data.total_interest],
            backgroundColor: [
                "#4CAF50",
                "#FF6384"
            ]
        }]
    },

    options : {
        responsive : true,
        plugins: {
            title: {
                display: true,
                text: "Principal vs Interest Breakdown",
                font: {
                    size: 16
                }
            },
            legend: {
                position: "bottom"
                
            }
        }
    }

});
    


    let tableBody = document.querySelector("#scheduleTable tbody");

    tableBody.innerHTML = "";

    data.schedule.forEach(row => {

        let tr = document.createElement("tr");

        tr.innerHTML =`
        <td> ${row.month}</td>
        <td> ${row.emi}</td>
        <td> ${row.principal}</td>
        <td> ${row.interest}</td>
        <td> ${row.balance}</td>
        `;
        tableBody.appendChild(tr);
    });
}


