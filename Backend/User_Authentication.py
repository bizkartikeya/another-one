from fastapi import HTTPException
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import sqlite3

load_dotenv()

class UserAuthentication:
    def __init__(self):
        self.client = MongoClient("mongodb+srv://ks12nd:M5iYhFLBFhSd5bSk@cluster0.rxrofz2.mongodb.net/?retryWrites=true&w=majority")
        self.db = self.client['Users']
        self.collection = self.db['Users']

    async def authenticate_user(self, email: str, password: str):
        """
        Authenticates a user based on the provided email and password.

        Parameters:
        - email (str): The user's email.
        - password (str): The user's password.

        Returns:
        - dict or None: A dictionary containing user information if authentication succeeds,
          or None if the user is not found or the provided credentials are incorrect.
        """
        user = self.collection.find_one({"email": email, "password": password})
        return user

    async def get_current_user(self, email, password):
        """
        Validates the current user based on the provided email and password.

        Parameters:
        - email (str): The user's email.
        - password (str): The user's password.

        Returns:
        - bool: True if the user is authenticated, False otherwise.

        Raises:
        - HTTPException: Raised with a 401 status code and "Invalid credentials" detail if the user
          is not authenticated.
        """
        user = await self.authenticate_user(email, password)
        if user is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
            return False
        else:
            return True
