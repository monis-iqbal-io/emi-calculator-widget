from pydantic import BaseModel

class LoanRequest(BaseModel):
    loan_amount : float
    interest_rate : float
    tenure : int


class LoanResponse(BaseModel):
    emi: float
    total_payment: float
    total_interest: float
    flat_rate_pa: float
    flat_rate_pm: float
    yearly_interest: float
    schedule: list
    