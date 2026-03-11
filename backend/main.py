from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import LoanRequest , LoanResponse
from emi_service import calculate_emi , calculate_loan_summary , generate_amortization_schedule


app = FastAPI()
app.add_middleware(
     CORSMiddleware,
     allow_origins =["*"],
     allow_credentials=True,
     allow_methods = ["*"],
     allow_headers=["*"]
 )

@app.get("/")
def root():
    return {"message" : "API is running"}


@app.post("/api/calculate-emi" , response_model=LoanResponse)
def calculate_emi_api(request:LoanRequest):

    loan_amount = request.loan_amount
    interest_rate = request.interest_rate
    tenure = request.tenure

    emi = calculate_emi(loan_amount, interest_rate , tenure)

    total_payment , total_interest = calculate_loan_summary(loan_amount , emi ,tenure)

    years = tenure / 12

    flat_rate_pa = (total_interest / (loan_amount * years)) * 100

    flat_rate_pm = flat_rate_pa / 12

    yearly_interest = total_interest / years


    schedule = generate_amortization_schedule(loan_amount ,interest_rate ,tenure ,emi)

    return {
    "emi": round(emi, 2),
    "total_payment": round(total_payment, 2),
    "total_interest": round(total_interest, 2),
    "flat_rate_pa": round(flat_rate_pa, 2),
    "flat_rate_pm": round(flat_rate_pm, 4),
    "yearly_interest": round(yearly_interest, 2),
    "schedule": schedule
}