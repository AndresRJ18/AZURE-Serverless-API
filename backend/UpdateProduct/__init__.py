
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
from models.product import ProductUpdate
from utils.responses import success_response, error_response
from pydantic import ValidationError

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Actualizando producto')
    
    try:
        product_id = req.route_params.get('id')
        
        if not product_id:
            return error_response("ID de producto no proporcionado", status_code=400)
        
        req_body = req.get_json()
        update_data = ProductUpdate(**req_body)
        
        updated_product = product_service.update(product_id, update_data)
        
        if not updated_product:
            return error_response(f"Producto con ID {product_id} no encontrado", status_code=404)
        
        return success_response(updated_product.dict())
    
    except ValidationError as e:
        logging.warning(f"Validation error: {str(e)}")
        return error_response(f"Datos inválidos: {e.errors()}", status_code=400)
    
    except ValueError as e:
        return error_response(str(e), status_code=400)
    
    except Exception as e:
        logging.error(f"Error: {str(e)}", exc_info=True)
        return error_response(f"Error: {str(e)}", status_code=500)