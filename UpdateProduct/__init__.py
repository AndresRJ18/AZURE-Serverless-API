import azure.functions as func
import logging
from models.product import ProductUpdate
from services.product_service import product_service
from utils.responses import success_response, not_found_response, error_response, validation_error_response
from pydantic import ValidationError

def main(req: func.HttpRequest) -> func.HttpResponse:
    product_id = req.route_params.get('id')
    logging.info(f'Actualizando producto: {product_id}')
    try:
        req_body = req.get_json()
        product_data = ProductUpdate(**req_body)
        updated_product = product_service.update(product_id, product_data)
        if not updated_product:
            return not_found_response("Product")
        return success_response(updated_product.model_dump())
    except ValueError:
        return error_response("Invalid JSON format")
    except ValidationError as e:
        return validation_error_response(e.errors())
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return error_response("Error interno del servidor", status_code=500)
