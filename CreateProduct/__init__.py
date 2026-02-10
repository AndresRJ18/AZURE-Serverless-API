import azure.functions as func
import logging
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

try:
    from models.product import ProductCreate
    from services.product_service import product_service
    from utils.responses import success_response, error_response, validation_error_response
    from pydantic import ValidationError
except ImportError as e:
    logging.error(f"Import error: {e}")
    raise

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('CreateProduct function triggered')
    try:
        req_body = req.get_json()
        product_data = ProductCreate(**req_body)
        new_product = product_service.create(product_data)
        return success_response(new_product.model_dump(), status_code=201)
    except ValueError as e:
        logging.error(f"JSON error: {e}")
        return error_response("Invalid JSON format")
    except ValidationError as e:
        logging.error(f"Validation error: {e}")
        return validation_error_response(e.errors())
    except Exception as e:
        logging.error(f"Error in CreateProduct: {str(e)}", exc_info=True)
        return error_response(f"Internal error: {str(e)}", status_code=500)
