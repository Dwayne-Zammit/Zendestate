import random
from routers.leads_router.leads_router_helpers.leads_helpers import call_history

async def generate_random_phone_number():
    country_code = "+356"
    prefix = random.choice(["79", "99", "77", "98"])  # Each prefix is a separate element
    number = f"{random.randint(0, 999999):06d}"  # Ensures the number is zero-padded to 6 digits
    generated_number = f"{country_code}{prefix}{number}"
    # generated_number_history = await leads_history(generated_number)
    generated_number_history = await call_history(generated_number)
    # print(generated_number_history)
    # print()
    generated_number_body = {
        "generated_number": generated_number,
        "generated_number_history": generated_number_history
    }
    print(generated_number_body)
    return generated_number_body