import math

def calculate_emi(loan_amount , annual_interest_rate , tenure_months):

    monthly_rate = annual_interest_rate / 12/ 100

    if monthly_rate == 0 :
        return loan_amount / tenure_months
   
    numerator = loan_amount * monthly_rate * math.pow((1 + monthly_rate) , tenure_months)

    denominator = math.pow((1 + monthly_rate) , tenure_months) - 1

    emi = numerator / denominator
   
    return emi




def calculate_loan_summary(loan_amount , emi , tenure_months):
    total_payment = emi * tenure_months
    total_interest = total_payment - loan_amount
    return total_payment , total_interest




def generate_amortization_schedule(loan_amount , annual_interest_rate , tenure_months ,emi):
    monthly_rate = annual_interest_rate / 12 / 100

    schedule = []

    balance = loan_amount

    for month in range (1 , tenure_months + 1):

        interest = balance * monthly_rate

        principal = emi - interest

        balance = balance - principal

        schedule.append({
            "month": month,
            "emi": round(emi, 2),
            "principal": round(principal, 2),
            "interest": round(interest, 2),
            "balance": round(balance, 2)
        })
    return schedule

