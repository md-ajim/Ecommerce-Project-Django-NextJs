import uuid
from .models import Payment

def process_payment(data):
    payment_method = data.get("payment_method")
    amount = data.get("amount")

    
    if payment_method == "Credit Card":
        transaction_id = process_credit_card(amount)
    elif payment_method == "PayPal":
        transaction_id = process_paypal(amount)
    elif payment_method == "Stripe":
        transaction_id = process_stripe(amount)
    elif payment_method == "Authorize.net":
        transaction_id = process_authorize_net(amount)
    elif payment_method == "Bank Transfer":
        transaction_id = f"BT-{uuid.uuid4()}"
    
    # Ensure transaction_id is returned
    if not transaction_id:
        raise ValueError("Failed to generate a transaction ID.")

    return transaction_id


# Dummy payment processing functions
def process_credit_card(amount):
    # Here, you would integrate with a real credit card API (e.g., Stripe)
    return f"CC-{uuid.uuid4()}"

def process_paypal(amount):
    # Integrate with PayPal's API
    return f"PP-{uuid.uuid4()}"

def process_stripe(amount):
    # Integrate with Stripe's API
    return f"STR-{uuid.uuid4()}"

def process_authorize_net(amount):
    # Integrate with Authorize.net's API
    return f"AN-{uuid.uuid4()}"
