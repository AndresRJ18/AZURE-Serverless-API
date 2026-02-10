import azure.functions as func
import logging
import sys
import os

# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from services.product_service import product_service
from utils.responses import success_response, error_response

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Obteniendo lista de productos')
    try:
        products = product_service.get_all()
        products_data = [p.dict() for p in products]
        return success_response({
            "count": len(products_data),
            "products": products_data
        })
    except Exception as e:
        logging.error(f"Error: {str(e)}", exc_info=True)
        return error_response(f"Error: {str(e)}", status_code=500)
