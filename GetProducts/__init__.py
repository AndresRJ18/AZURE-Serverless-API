import azure.functions as func
import logging
from services.product_service import product_service
from utils.responses import success_response, error_response

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Obteniendo lista de productos')
    try:
        products = product_service.get_all()
        products_data = [p.model_dump() for p in products]
        return success_response({
            "count": len(products_data),
            "products": products_data
        })
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return error_response("Error interno del servidor", status_code=500)
