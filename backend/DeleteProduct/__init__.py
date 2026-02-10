import azure.functions as func
import logging
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from services.product_service import product_service
from utils.responses import success_response, error_response

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Eliminando producto')
    
    try:
        product_id = req.route_params.get('id')
        
        if not product_id:
            return error_response("ID de producto no proporcionado", status_code=400)
        
        deleted = product_service.delete(product_id)
        
        if not deleted:
            return error_response(f"Producto con ID {product_id} no encontrado", status_code=404)
        
        return success_response({"message": f"Producto {product_id} eliminado correctamente"})
    
    except Exception as e:
        logging.error(f"Error: {str(e)}", exc_info=True)
        return error_response(f"Error: {str(e)}", status_code=500)