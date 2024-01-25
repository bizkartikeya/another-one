from cachetools import TTLCache
import pandas as pd
from pandasai import Agent
from pandasai import SmartDataframe
from pandasai import SmartDatalake
from pandasai.llm import AzureOpenAI
import os
from loguru import logger
import base64
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException

class QueryRequest(BaseModel):
    query: str

class BankDataAnalysis:
    def __init__(self):
        """ Initializes the BankDataAnalysis class with necessary configurations, including cache setup."""

        self.OPENAI_API_KEY=os.environ['OPENAI_API_KEY']
        self.api_base=os.environ["api_base"]
        self.AZURE_OPENAI_API_ENDPOINT=os.environ["AZURE_OPENAI_API_ENDPOINT"]
        self.OPENAI_API_VERSION=os.environ["OPENAI_API_VERSION"]
        self.OPENAI_API_TYPE=os.environ['OPENAI_API_TYPE']
        self.dl = None  # Initialize dl to None

        
        # Configure cache with a time-to-live (TTL) of 1 hour
        self.cache = TTLCache(maxsize=1000, ttl=3600)
        self.keywords= ["Acc_Holder", "Acc_Status", "Acc_Type", "Acount", "Add_Type", "Adress","Branch","Currency","cust_address", "custom_address","Cust_Tele_Num","customer", "Emp","House_Own","Inden_Doc", "InterestRate", "MS", "Prod_IR",
                        "Prod_Type","Product","Proof_Add","Tel_Num_Type","Tel_Number","Trans"]


    def load_data(self):

        """Loads data from Parquet files into Pandas DataFrames."""

        self.df_Acc_Holder= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\AccountHolder.parquet", engine='pyarrow')
        self.df_Acc_Status= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\AccountStatus.parquet", engine='pyarrow')
        self.df_Acc_Type= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\AccountType.parquet", engine='pyarrow')
        self.df_Acount= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\Account.parquet", engine='pyarrow')
        self.df_Add_Type= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\AddressType.parquet", engine='pyarrow')
        self.df_Address= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\Address.parquet", engine='pyarrow')
        self.df_Adress= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\Address.parquet", engine='pyarrow')

        self.df_Branch= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\Branch.parquet", engine='pyarrow')
        self.df_Currency= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\Currency.parquet", engine='pyarrow')
        self.df_cust_address= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\CustomerAddress.parquet", engine='pyarrow')
        self.df_custom_address= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\CustomerAddress.parquet", engine='pyarrow')

        self.df_Cust_Tele_Num= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\CustomerTelephoneNumber.parquet", engine='pyarrow')
        self.df_customer= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\customer.parquet", engine='pyarrow')
        self.df_Emp= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\Employee.parquet", engine='pyarrow')
        self.df_House_Own= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\HouseOwnership.parquet", engine='pyarrow')
        self.df_Inden_Doc= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\IndentificationDocument.parquet", engine='pyarrow')
        self.df_InterestRate= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\InterestRate.parquet", engine='pyarrow')
        self.df_MS= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\MaritalStatus.parquet", engine='pyarrow')
        self.df_Prod_IR= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\ProductInterestRate.parquet", engine='pyarrow')
        self.df_Prod_Type= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\ProductType.parquet", engine='pyarrow')
        self.df_Product= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\Product.parquet", engine='pyarrow')
        self.df_Proof_Add= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\ProofOfAddress.parquet", engine='pyarrow')
        self.df_Tel_Num_Type= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\TelephoneNumberType.parquet", engine='pyarrow')
        self.df_Tel_Number= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\TelephoneNumber.parquet", engine='pyarrow')
        self.df_Trans= pd.read_parquet("C:\Project\PandasAI\Data_Model_Parquet\Transaction.parquet", engine='pyarrow')    
        
        pass

    def initialize_llm(self):

        """Initializes the Language Model (llm) for natural language processing."""

        llm = AzureOpenAI(deployment_name="chat",
                          model_name="gpt-35-turbo",
                          api_base=os.environ['api_base'],
                          azure_endpoint=os.environ['AZURE_OPENAI_API_ENDPOINT'],
                          temperature=0,
                          model_kwargs={"api_type": "azure",
                                        "api_version": "2023-07-01-preview"})
        
        self.Acc_Holder = SmartDataframe(self.df_Acc_Holder, name="Acc_Holder")
        self.Acc_Status = SmartDataframe(self.df_Acc_Status, name="Acc_Status")
        self.Acc_Type = SmartDataframe(self.df_Acc_Type, name="Acc_Type")
        self.Acount = SmartDataframe(self.df_Acount, name="Acount")
        self.Add_Type = SmartDataframe(self.df_Add_Type, name="Add_Type")
        self.Address = SmartDataframe(self.df_Address, name="Address")
        self.Adress = SmartDataframe(self.df_Adress, name="Adress")

        
        self.Branch = SmartDataframe(self.df_Branch, name="Branch")
        self.Currency = SmartDataframe(self.df_Currency, name="Currency")
        self.cust_address = SmartDataframe(self.df_cust_address, name="cust_address")
        self.custom_address = SmartDataframe(self.df_custom_address, name="custom_address")
        self.Cust_Tele_Num = SmartDataframe(self.df_Cust_Tele_Num, name="Cust_Tele_Num")
        self.customer = SmartDataframe(self.df_customer, name="customer")
        self.Emp = SmartDataframe(self.df_Emp, name="Emp")
        self.House_Own = SmartDataframe(self.df_House_Own, name="House_Own")
        self.Inden_Doc = SmartDataframe(self.df_Inden_Doc, name="Inden_Doc")
        self.InterestRate = SmartDataframe(self.df_InterestRate, name="InterestRate")
        self.MS = SmartDataframe(self.df_MS, name="MS")
        self.Prod_IR = SmartDataframe(self.df_Prod_IR, name="Prod_IR")
        self.Prod_Type = SmartDataframe(self.df_Prod_Type, name="Prod_Type")
        self.Product = SmartDataframe(self.df_Product, name="Product")
        self.Proof_Add = SmartDataframe(self.df_Proof_Add, name="Proof_Add")
        self.Tel_Num_Type = SmartDataframe(self.df_Tel_Num_Type, name="Tel_Num_Type")
        self.Tel_Number = SmartDataframe(self.df_Tel_Number, name="Tel_Number")       
        self.Trans = SmartDataframe(self.df_Trans, name="Trans")

        self.dl = Agent([self.Acc_Holder, self.Acc_Status, self.Acc_Type, self.Acount, self.Add_Type, self.Adress, self.Branch, self.Currency,
                        self.cust_address,self.custom_address, self.Cust_Tele_Num, self.customer, self.Emp, self.House_Own, self.Inden_Doc, self.InterestRate, self.MS, self.Prod_IR,
                        self.Prod_Type, self.Product, self.Proof_Add, self.Tel_Num_Type, self.Tel_Number, self.Trans],config={"llm": llm, "custom_whitelisted_dependencies": ["os"], "verbose": True,"save_charts":True ,"conversational": True})
        return self.dl
    
    def process_keywords_and_print_dataframes(self, result_keyword):
        """
            Process the specified DataFrames based on the given list of keywords.

            Parameters:
            - result_keyword (list): A list of keywords representing the DataFrames to be processed.

            Returns:
            dict: A dictionary containing the processed DataFrames in the form {DataFrameName: DataFrameRecords}.
                If a DataFrame is not found, it is not included in the dictionary.
            """
        dataframes_dict={}
        for df_name in result_keyword:
            dataframe = getattr(self, df_name, None)
            # print("datafrae",dataframe)
            if dataframe is not None:
                print(f"Dataframe for {df_name}:")
                # result = {df_name: dataframe.to_dict(orient='records') for i, df_name in enumerate(result_keyword, start=1)}
                dataframes_dict[df_name] = dataframe.to_dict(orient='records')

            
            else:
                print(f"Dataframe {df_name} not found.")
            # print("Dataframes Dictionary:", dataframes_dict)
        return dataframes_dict

    def query_data(self, query_req: QueryRequest):

        """ Queries data using the initialized data lake and returns the result."""

        # Check if result is already in the cache
        query_hashable = hash(str(query_req))

        cached_result = self.cache.get(query_hashable)
        if cached_result:
            return cached_result

        if self.dl is None:
            raise HTTPException(status_code=500, detail="Datalake not initialized")

        result = self.dl.chat(query_req.query)
        
        code_df=self.dl.last_code_executed
        # print("final",(code_df))

        result_keyword =self.check_keywords_occurrence(code_df, self.keywords)

        if result_keyword is not None:
            print("Keywords with multiple occurrences:", result_keyword)
            # if "Adress" in result_keyword and "Address" in result_keyword:
            #     result_keyowrd=result_keyowrd.remove("Adress")
            #     print(result_keyowrd)
            # else:
            #     ("do nothing")

            self.process_keywords_and_print_dataframes(result_keyword)
            response_df=self.process_keywords_and_print_dataframes(result_keyword)
            last_code_generated=self.dl.last_code_executed
            response = {"result": result, "last_code_generated":last_code_generated,"dataframe":response_df}
            print("seperste",response["last_code_generated"])



        else:
            print("No keywords appear more than once.")
            # raise HTTPException(status_code=400, detail="Reframe you sentence")
            response = {"result": result, "last_code_generated": self.dl.last_code_executed}

        # Store the result in the cache
        self.cache[query_hashable] = response
        # print("response",self.cache[query_hashable])
        # print("before",self.cache)
        # print("after",self.cache)

        return response
    
    def check_keywords_occurrence(self,result, keywords):

        """Check occurrence of keywords in the query result."""

        keyword_count = {keyword: result.count(keyword) for keyword in keywords}

        # Filter keywords that appear more than once
        multiple_occurrence_keywords = [keyword for keyword, count in keyword_count.items() if count > 1]

        return multiple_occurrence_keywords
    
    def clear_cache(self):
        """Clears the cache."""
        self.cache.clear()
        return {"message": "Cache cleared successfully"}
        


def image_to_base64(image_path):

    """Converts an image file to base64 encoding."""

    with open(image_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode("utf-8")
        return base64_image

def resultvalue(result):

    """Processes the query result and handles image conversion to base64 if applicable."""

    result['result'] = str(result['result'])

    if ".png" not in result['result']:
        logger.debug("no image here")
        response = result
        logger.debug(response)
        return response
        
    elif ".png" in result['result']:
        logger.debug("Image path:", result)
        base64_image = image_to_base64(result['result'])
        response = {
            "image_path": result,
            "base64_image": base64_image
        }
        
        return response
