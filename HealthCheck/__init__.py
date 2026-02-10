import azure.functions as func
from utils.responses import success_response

def main(req: func.HttpRequest) -> func.HttpResponse:
    return success_response({
        "status": "healthy",
        "service": "Products API",
        "version": "1.0.0"
    })
