import azure.functions as func
import logging
from services.product_service import product_service
from utils.responses import success_response, not_found_response, error_response

def main(req: func.HttpRequest) -> func.HttpResponse:
    product_id = req.route_params.get('id')
    logging.info(f'Obteniendo producto: {product_id}')
    try:
        product = product_service.get_by_id(product_id)
        if not product:
            return not_found_response("Product")
        return success_response(product.model_dump())
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return error_response("Error interno del servidor", status_code=500)
