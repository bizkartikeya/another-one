from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from Data_Analysis import BankDataAnalysis, QueryRequest, resultvalue
from User_Authentication import UserAuthentication

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



bank_analysis = BankDataAnalysis()
bank_analysis.load_data()
bank_analysis.initialize_llm()
user_auth = UserAuthentication()


@app.post("/query/")
async def query_endpoint(query_req: QueryRequest):
    """FastAPI endpoint for handling queries and returning the results."""
    result = bank_analysis.query_data(query_req)
    return resultvalue(result)

@app.post("/clear-cache/")
async def clear_cache_endpoint():
    """FastAPI endpoint for clearing the cache."""
    try:
        result = bank_analysis.clear_cache()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Login route
@app.post("/login")
async def login(request: Request):
    """
    Endpoint for user login.

    Parameters:
    - request (Request): The FastAPI Request object containing JSON-formatted login credentials.

    Returns:
    - dict: A JSON response with a success message if the login is successful,
      or an error message if the credentials are invalid.

    Example:
    ```
    {
        "email": "user@example.com",
        "password": "secretpassword"
    }
    ```
    """
    form_data = await request.json()
    email = form_data['email']
    password = form_data['password']
    print("API se mila::",email,password)
    # Authenticate user
    user = await user_auth.get_current_user(email, password)
    print("True / False:::",user)
    if user:
        status = 200
        return {"message": f"Welcome back {email}!"}, status
    else:
        status = 400
        return {"error": "Invalid credentials"}, status