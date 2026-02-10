import json
import azure.functions as func
from typing import Any, Dict

def success_response(data: Any, status_code: int = 200) -> func.HttpResponse:
    """Respuesta exitosa"""
    return func.HttpResponse(
        body=json.dumps(data, default=str),
        status_code=status_code,
        mimetype="application/json"
    )

def error_response(message: str, status_code: int = 400, details: Dict = None) -> func.HttpResponse:
    """Respuesta de error"""
    error_body = {"error": message}
    if details:
        error_body["details"] = details
    
    return func.HttpResponse(
        body=json.dumps(error_body),
        status_code=status_code,
        mimetype="application/json"
    )

def not_found_response(resource: str = "Resource") -> func.HttpResponse:
    """Respuesta 404"""
    return error_response(f"{resource} not found", status_code=404)

def validation_error_response(errors: list) -> func.HttpResponse:
    """Respuesta de error de validación"""
    return error_response(
        "Validation error",
        status_code=422,
        details={"validation_errors": errors}
    )