import azure.functions as func
import logging
import sys
import os
import json

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from services.product_service import product_service
from models.product import ProductCreate
from utils.responses import success_response, error_response
from pydantic import ValidationError

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Creando nuevo producto')
    
    try:
        req_body = req.get_json()
        
        product_data = ProductCreate(**req_body)
        new_product = product_service.create(product_data)
        
        return success_response(new_product.dict(), status_code=201)
    
    except ValidationError as e:
        logging.warning(f"Validation error: {str(e)}")
        return error_response(f"Datos inválidos: {e.errors()}", status_code=400)
    
    except ValueError as e:
        return error_response(str(e), status_code=400)
    
    except Exception as e:
        logging.error(f"Error: {str(e)}", exc_info=True)
        return error_response(f"Error: {str(e)}", status_code=500)