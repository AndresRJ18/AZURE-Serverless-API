import azure.functions as func
import logging
from models.product import ProductCreate
from services.product_service import product_service
from utils.responses import success_response, error_response, validation_error_response
from pydantic import ValidationError

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Creando nuevo producto')
    try:
        req_body = req.get_json()
        product_data = ProductCreate(**req_body)
        new_product = product_service.create(product_data)
        return success_response(new_product.model_dump(), status_code=201)
    except ValueError:
        return error_response("Invalid JSON format")
    except ValidationError as e:
        return validation_error_response(e.errors())
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return error_response("Error interno del servidor", status_code=500)
