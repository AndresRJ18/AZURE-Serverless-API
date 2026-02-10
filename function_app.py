import azure.functions as func
import logging
import json
from models.product import ProductCreate, ProductUpdate
from services.product_service import product_service
from utils.responses import success_response, error_response, not_found_response, validation_error_response
from pydantic import ValidationError

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# ==================== GET ALL PRODUCTS ====================
@app.route(route="products", methods=["GET"])
def get_products(req: func.HttpRequest) -> func.HttpResponse:
    """
    GET /api/products
    Obtener todos los productos
    """
    logging.info('Obteniendo lista de productos')
    
    try:
        products = product_service.get_all()
        products_data = [p.model_dump() for p in products]
        
        return success_response({
            "count": len(products_data),
            "products": products_data
        })
    
    except Exception as e:
        logging.error(f"Error al obtener productos: {str(e)}")
        return error_response("Error interno del servidor", status_code=500)


# ==================== GET PRODUCT BY ID ====================
@app.route(route="products/{id}", methods=["GET"])
def get_product(req: func.HttpRequest) -> func.HttpResponse:
    """
    GET /api/products/{id}
    Obtener un producto por ID
    """
    product_id = req.route_params.get('id')
    logging.info(f'Obteniendo producto: {product_id}')
    
    try:
        product = product_service.get_by_id(product_id)
        
        if not product:
            return not_found_response("Product")
        
        return success_response(product.model_dump())
    
    except Exception as e:
        logging.error(f"Error al obtener producto {product_id}: {str(e)}")
        return error_response("Error interno del servidor", status_code=500)


# ==================== CREATE PRODUCT ====================
@app.route(route="products", methods=["POST"])
def create_product(req: func.HttpRequest) -> func.HttpResponse:
    """
    POST /api/products
    Crear un nuevo producto
    
    Body ejemplo:
    {
        "name": "Producto nuevo",
        "description": "Descripción",
        "price": 99.99,
        "stock": 10,
        "category": "Electronics"
    }
    """
    logging.info('Creando nuevo producto')
    
    try:
        # Parsear body
        req_body = req.get_json()
        
        # Validar con Pydantic
        product_data = ProductCreate(**req_body)
        
        # Crear producto
        new_product = product_service.create(product_data)
        
        return success_response(
            new_product.model_dump(),
            status_code=201
        )
    
    except ValueError as e:
        logging.warning(f"JSON inválido: {str(e)}")
        return error_response("Invalid JSON format")
    
    except ValidationError as e:
        logging.warning(f"Error de validación: {e.errors()}")
        return validation_error_response(e.errors())
    
    except Exception as e:
        logging.error(f"Error al crear producto: {str(e)}")
        return error_response("Error interno del servidor", status_code=500)


# ==================== UPDATE PRODUCT ====================
@app.route(route="products/{id}", methods=["PUT"])
def update_product(req: func.HttpRequest) -> func.HttpResponse:
    """
    PUT /api/products/{id}
    Actualizar un producto existente
    
    Body ejemplo (todos los campos son opcionales):
    {
        "name": "Nombre actualizado",
        "price": 149.99,
        "stock": 20
    }
    """
    product_id = req.route_params.get('id')
    logging.info(f'Actualizando producto: {product_id}')
    
    try:
        # Parsear body
        req_body = req.get_json()
        
        # Validar con Pydantic
        product_data = ProductUpdate(**req_body)
        
        # Actualizar producto
        updated_product = product_service.update(product_id, product_data)
        
        if not updated_product:
            return not_found_response("Product")
        
        return success_response(updated_product.model_dump())
    
    except ValueError as e:
        logging.warning(f"JSON inválido: {str(e)}")
        return error_response("Invalid JSON format")
    
    except ValidationError as e:
        logging.warning(f"Error de validación: {e.errors()}")
        return validation_error_response(e.errors())
    
    except Exception as e:
        logging.error(f"Error al actualizar producto {product_id}: {str(e)}")
        return error_response("Error interno del servidor", status_code=500)


# ==================== DELETE PRODUCT ====================
@app.route(route="products/{id}", methods=["DELETE"])
def delete_product(req: func.HttpRequest) -> func.HttpResponse:
    """
    DELETE /api/products/{id}
    Eliminar un producto
    """
    product_id = req.route_params.get('id')
    logging.info(f'Eliminando producto: {product_id}')
    
    try:
        success = product_service.delete(product_id)
        
        if not success:
            return not_found_response("Product")
        
        return success_response({
            "message": "Product deleted successfully",
            "id": product_id
        })
    
    except Exception as e:
        logging.error(f"Error al eliminar producto {product_id}: {str(e)}")
        return error_response("Error interno del servidor", status_code=500)


# ==================== HEALTH CHECK ====================
@app.route(route="health", methods=["GET"])
def health_check(req: func.HttpRequest) -> func.HttpResponse:
    """
    GET /api/health
    Health check endpoint
    """
    return success_response({
        "status": "healthy",
        "service": "Products API",
        "version": "1.0.0"
    })