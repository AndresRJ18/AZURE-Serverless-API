# 🏗️ Architecture Documentation

Documentación técnica de la arquitectura de **Azure Serverless Product API**.

---

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Decisiones de Arquitectura](#decisiones-de-arquitectura)
3. [Componentes del Sistema](#componentes-del-sistema)
4. [Flujo de Datos](#flujo-de-datos)
5. [Estructura del Código](#estructura-del-código)
6. [Patrones de Diseño](#patrones-de-diseño)
7. [Escalabilidad](#escalabilidad)
8. [Seguridad](#seguridad)
9. [Monitoreo y Observabilidad](#monitoreo-y-observabilidad)
10. [Evolución Futura](#evolución-futura)

---

## 🎯 Visión General

### Arquitectura de Alto Nivel

```
┌──────────────────────────────────────────────────────────────┐
│                    Internet / User Browser                    │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                  Azure Static Web Apps                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Frontend (HTML + JavaScript + Tailwind CSS)           │  │
│  │  • index.html                                          │  │
│  │  • app.js (Vanilla JS)                                 │  │
│  │  • Dark mode, Responsive design                        │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ REST API (JSON)
                             │ CORS Enabled
                             ▼
┌──────────────────────────────────────────────────────────────┐
│           Azure Functions (Consumption Plan)                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  HTTP Triggers (Python 3.12)                           │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  HealthCheck/          (GET /api/health)         │  │  │
│  │  │  GetProducts/          (GET /api/products)       │  │  │
│  │  │  GetProduct/           (GET /api/products/{id})  │  │  │
│  │  │  CreateProduct/        (POST /api/products)      │  │  │
│  │  │  UpdateProduct/        (PUT /api/products/{id})  │  │  │
│  │  │  DeleteProduct/        (DELETE /api/products/{id})│  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  Shared Code Modules                             │  │  │
│  │  │  • models/product_model.py (Pydantic validation) │  │  │
│  │  │  • services/product_service.py (Business logic)  │  │  │
│  │  │  • utils/response_helper.py (JSON responses)     │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                   In-Memory Data Store                        │
│  (Future: Azure SQL Database / CosmosDB)                      │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│              Supporting Azure Services                        │
│  • Azure Storage Account (Function App storage)              │
│  • Application Insights (Monitoring & Logs)                  │
│  • Azure Monitor (Metrics & Alerts)                          │
└──────────────────────────────────────────────────────────────┘
```

### Características Clave

- **100% Serverless**: Sin servidores que gestionar
- **Auto-scaling**: Escala automáticamente con la demanda
- **Pay-per-use**: Costo $0 en free tier
- **Stateless**: Cada request es independiente
- **Event-driven**: HTTP triggers para cada endpoint
- **Decoupled**: Frontend y backend completamente independientes

---

## 🧠 Decisiones de Arquitectura

### 1. ¿Por qué Azure Functions?

**Ventajas:**
- ✅ No requiere gestión de infraestructura
- ✅ Auto-scaling automático
- ✅ Pay-per-execution (free tier generoso)
- ✅ Integración nativa con otros servicios Azure
- ✅ Soporte para Python 3.12
- ✅ Local development fácil con Core Tools

**Alternativas consideradas:**
- **Azure App Service**: Más costoso, requiere always-on
- **Azure Container Apps**: Overkill para este caso de uso
- **Azure Kubernetes Service (AKS)**: Demasiado complejo

### 2. ¿Por qué Azure Static Web Apps?

**Ventajas:**
- ✅ Hosting gratuito de archivos estáticos
- ✅ CDN global integrado
- ✅ SSL automático
- ✅ CI/CD con GitHub Actions out-of-the-box
- ✅ Custom domains gratis
- ✅ Preview environments por PR

**Alternativas consideradas:**
- **Azure Blob Storage + CDN**: Más configuración manual
- **Azure App Service**: Más costoso para archivos estáticos
- **Vercel/Netlify**: Preferencia por stack 100% Azure

### 3. ¿Por qué Python con Pydantic?

**Ventajas:**
- ✅ Validación de datos robusta y automática
- ✅ Type hints para mejor IDE support
- ✅ Serialización/deserialización JSON automática
- ✅ Errores de validación claros
- ✅ Documentación auto-generada (OpenAPI futuro)

**Código ejemplo:**
```python
from pydantic import BaseModel, Field

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    price: float = Field(..., gt=0)
    stock: int = Field(..., ge=0)
```

### 4. ¿Por qué In-Memory Storage (por ahora)?

**Razón:** Simplificar el MVP y demostrar la arquitectura serverless.

**Próxima evolución:**
- Azure SQL Database (relacional)
- Azure CosmosDB (NoSQL, globalmente distribuido)
- Azure Table Storage (key-value simple)

**Trade-off:**
- ❌ Los datos se pierden al reiniciar la Function App
- ✅ Cero costo
- ✅ Latencia ultra-baja
- ✅ Simplicidad en desarrollo

### 5. ¿Por qué Vanilla JavaScript (no React/Vue)?

**Ventajas:**
- ✅ Cero build step
- ✅ Cero configuración de bundler
- ✅ Carga instantánea (sin frameworks pesados)
- ✅ Fácil de entender para reclutadores
- ✅ Demuestra conocimiento de JavaScript puro

**Tailwind CSS vía CDN:**
- ✅ Sin compilador requerido
- ✅ Diseño profesional sin CSS custom
- ❌ Limitado a clases predefinidas (no JIT)

---

## 🔧 Componentes del Sistema

### Backend Components

#### 1. HTTP Triggers (Azure Functions)

Cada endpoint es una Azure Function independiente:

```
backend/
├── HealthCheck/
│   ├── __init__.py          # Handler function
│   └── function.json        # Function configuration
├── GetProducts/
│   ├── __init__.py
│   └── function.json
├── GetProduct/
│   ├── __init__.py
│   └── function.json
├── CreateProduct/
│   ├── __init__.py
│   └── function.json
├── UpdateProduct/
│   ├── __init__.py
│   └── function.json
└── DeleteProduct/
    ├── __init__.py
    └── function.json
```

**Ejemplo: `GetProducts/function.json`**
```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get"],
      "route": "products"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ]
}
```

**Ejemplo: `GetProducts/__init__.py`**
```python
import azure.functions as func
from services.product_service import ProductService
from utils.response_helper import success_response, error_response

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        products = ProductService.get_all_products()
        return success_response(products, count=len(products))
    except Exception as e:
        return error_response(str(e), status_code=500)
```

#### 2. Models (Pydantic)

**`models/product_model.py`**
```python
from pydantic import BaseModel, Field, validator
from typing import Optional
import uuid
from datetime import datetime

class ProductBase(BaseModel):
    """Base model con campos comunes"""
    name: str = Field(..., min_length=3, max_length=100)
    price: float = Field(..., gt=0)
    stock: int = Field(..., ge=0)
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty or whitespace')
        return v.strip()

class ProductCreate(ProductBase):
    """Model para crear productos (sin ID)"""
    pass

class ProductUpdate(BaseModel):
    """Model para actualizar productos (campos opcionales)"""
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)

class Product(ProductBase):
    """Model completo con metadatos"""
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        json_encoders = {
            uuid.UUID: str,
            datetime: lambda v: v.isoformat()
        }
```

#### 3. Services (Business Logic)

**`services/product_service.py`**
```python
import uuid
from datetime import datetime
from typing import List, Optional
from models.product_model import Product, ProductCreate, ProductUpdate

class ProductService:
    """Service para gestionar productos"""
    
    _products: dict[uuid.UUID, Product] = {}
    
    @classmethod
    def get_all_products(cls) -> List[Product]:
        """Retorna todos los productos"""
        return list(cls._products.values())
    
    @classmethod
    def get_product_by_id(cls, product_id: uuid.UUID) -> Optional[Product]:
        """Retorna un producto por ID"""
        return cls._products.get(product_id)
    
    @classmethod
    def create_product(cls, product_data: ProductCreate) -> Product:
        """Crea un nuevo producto"""
        now = datetime.utcnow()
        product = Product(
            id=uuid.uuid4(),
            **product_data.dict(),
            created_at=now,
            updated_at=now
        )
        cls._products[product.id] = product
        return product
    
    @classmethod
    def update_product(cls, product_id: uuid.UUID, 
                      product_data: ProductUpdate) -> Optional[Product]:
        """Actualiza un producto existente"""
        product = cls._products.get(product_id)
        if not product:
            return None
        
        update_data = product_data.dict(exclude_unset=True)
        updated_product = product.copy(update={
            **update_data,
            'updated_at': datetime.utcnow()
        })
        cls._products[product_id] = updated_product
        return updated_product
    
    @classmethod
    def delete_product(cls, product_id: uuid.UUID) -> bool:
        """Elimina un producto"""
        if product_id in cls._products:
            del cls._products[product_id]
            return True
        return False
```

#### 4. Utilities (Response Helpers)

**`utils/response_helper.py`**
```python
import azure.functions as func
import json
from typing import Any, Optional

def success_response(
    data: Any = None, 
    message: str = "Success",
    status_code: int = 200,
    **kwargs
) -> func.HttpResponse:
    """Genera respuesta de éxito estandarizada"""
    body = {
        "success": True,
        "data": data,
        "message": message,
        **kwargs
    }
    return func.HttpResponse(
        json.dumps(body, default=str),
        status_code=status_code,
        mimetype="application/json"
    )

def error_response(
    error: str,
    details: Optional[dict] = None,
    status_code: int = 400
) -> func.HttpResponse:
    """Genera respuesta de error estandarizada"""
    body = {
        "success": False,
        "error": error
    }
    if details:
        body["details"] = details
    
    return func.HttpResponse(
        json.dumps(body),
        status_code=status_code,
        mimetype="application/json"
    )
```

### Frontend Components

#### 1. HTML Structure (`index.html`)

```html
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Management Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header>...</header>
    
    <!-- Main Content -->
    <main>
        <!-- Search & Filters -->
        <section id="search-section">...</section>
        
        <!-- Product Grid -->
        <section id="product-grid">...</section>
        
        <!-- Pagination -->
        <section id="pagination">...</section>
    </main>
    
    <!-- Modals -->
    <div id="create-modal">...</div>
    <div id="edit-modal">...</div>
    
    <!-- Toast Notifications -->
    <div id="toast-container">...</div>
    
    <script src="js/app.js"></script>
</body>
</html>
```

#### 2. JavaScript Application (`js/app.js`)

**Estructura:**
```javascript
// Configuration
const API_BASE_URL = 'https://fnapi6794.azurewebsites.net';

// State Management
let products = [];
let currentPage = 1;
let itemsPerPage = 9;
let searchQuery = '';

// API Functions
async function fetchProducts() { ... }
async function createProduct(productData) { ... }
async function updateProduct(id, productData) { ... }
async function deleteProduct(id) { ... }

// UI Functions
function renderProducts() { ... }
function showToast(message, type) { ... }
function toggleModal(modalId) { ... }

// Event Listeners
document.getElementById('create-btn').addEventListener('click', ...);
document.getElementById('search-input').addEventListener('input', ...);

// Dark Mode
function initDarkMode() { ... }

// Initialize App
window.addEventListener('DOMContentLoaded', async () => {
    initDarkMode();
    await fetchProducts();
});
```

---

## 🔄 Flujo de Datos

### 1. Request Flow (Crear Producto)

```
User clicks "Create Product"
    ↓
JavaScript collects form data
    ↓
Validates data locally (basic validation)
    ↓
fetch POST to /api/products
    ↓
Azure Functions receives request
    ↓
Pydantic validates request body
    ↓
ProductService.create_product()
    ↓
Stores in in-memory dict
    ↓
Returns Product object
    ↓
Response helper formats JSON
    ↓
Azure Functions returns HTTP 201
    ↓
JavaScript receives response
    ↓
Updates UI with new product
    ↓
Shows success toast notification
```

### 2. Error Flow

```
User submits invalid data
    ↓
JavaScript sends request
    ↓
Azure Functions receives request
    ↓
Pydantic validation FAILS
    ↓
Raises ValidationError
    ↓
Exception handler catches error
    ↓
Response helper formats error JSON
    ↓
Azure Functions returns HTTP 422
    ↓
JavaScript receives error response
    ↓
Displays error toast with message
    ↓
User corrects data and retries
```

---

## 🎨 Patrones de Diseño

### 1. Separation of Concerns

**Backend:**
- **Models**: Data structure y validación
- **Services**: Business logic
- **Utils**: Funciones compartidas
- **Functions**: HTTP handling

**Frontend:**
- **HTML**: Structure
- **Tailwind CSS**: Styling
- **JavaScript**: Behavior

### 2. DRY (Don't Repeat Yourself)

**Backend:**
```python
# Reutilizamos response_helper en todas las functions
from utils.response_helper import success_response, error_response

# En lugar de repetir:
# func.HttpResponse(json.dumps({...}), status_code=200)
# Usamos:
return success_response(data, message="Product created")
```

**Frontend:**
```javascript
// Función reutilizable para mostrar notificaciones
function showToast(message, type = 'info') {
    // Usada en todas las operaciones CRUD
}
```

### 3. Single Responsibility Principle

Cada componente tiene una responsabilidad clara:

- `ProductService`: Solo gestiona productos
- `response_helper`: Solo formatea respuestas
- `product_model`: Solo define estructura de datos

### 4. Dependency Injection (Implícito)

```python
# Los services son stateless y usan class methods
class ProductService:
    @classmethod
    def get_all_products(cls) -> List[Product]:
        # No requiere instanciación
        pass

# Uso en functions:
products = ProductService.get_all_products()
```

---

## 📈 Escalabilidad

### Escalabilidad Horizontal (Auto-scaling)

**Azure Functions Consumption Plan:**
- Auto-scale de 0 a 200 instancias
- Scale-out basado en:
  - Número de requests HTTP
  - CPU usage
  - Memory usage

**Configuración:**
```json
// host.json
{
  "version": "2.0",
  "extensions": {
    "http": {
      "maxConcurrentRequests": 100,
      "maxOutstandingRequests": 200
    }
  }
}
```

### Escalabilidad de Datos

**Actual:** In-memory (no escalable)

**Futuro - Azure SQL Database:**
```python
# services/product_service_sql.py
import pyodbc

class ProductService:
    @classmethod
    def get_all_products(cls) -> List[Product]:
        conn = pyodbc.connect(os.getenv('SQL_CONNECTION_STRING'))
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products")
        # ...
```

**Futuro - Azure CosmosDB:**
```python
# services/product_service_cosmos.py
from azure.cosmos import CosmosClient

class ProductService:
    _client = CosmosClient.from_connection_string(
        os.getenv('COSMOS_CONNECTION_STRING')
    )
    _container = _client.get_database_client('products-db')\
                        .get_container_client('products')
    
    @classmethod
    def get_all_products(cls) -> List[Product]:
        items = list(cls._container.read_all_items())
        return [Product(**item) for item in items]
```

### Performance Optimization

**Backend:**
- Caching (Azure Redis Cache)
- Connection pooling
- Batch operations

**Frontend:**
- Lazy loading de imágenes
- Pagination
- Debouncing en search

---

## 🔒 Seguridad

### Actual (MVP)

- ✅ HTTPS everywhere
- ✅ CORS configurado
- ✅ Input validation (Pydantic)
- ✅ No hardcoded secrets

### Pendiente (Producción)

- [ ] **Authentication:** Azure AD B2C
- [ ] **Authorization:** Role-based access control (RBAC)
- [ ] **API Keys:** Para limitación por cliente
- [ ] **Rate Limiting:** Prevenir abuse
- [ ] **SQL Injection Protection:** Parameterized queries
- [ ] **XSS Prevention:** Content Security Policy headers

### Ejemplo Futuro - Azure AD B2C

```python
# functions con autenticación
import azure.functions as func
from azure.identity import DefaultAzureCredential

def main(req: func.HttpRequest) -> func.HttpResponse:
    # Verificar token JWT
    token = req.headers.get('Authorization', '').replace('Bearer ', '')
    if not validate_token(token):
        return error_response("Unauthorized", status_code=401)
    
    # Proceder con lógica...
```

---

## 📊 Monitoreo y Observabilidad

### Application Insights

**Metrics automáticos:**
- Request count
- Response time
- Failure rate
- Dependency calls

**Custom telemetry:**
```python
from applicationinsights import TelemetryClient

tc = TelemetryClient(os.getenv('APPINSIGHTS_INSTRUMENTATIONKEY'))

def main(req: func.HttpRequest) -> func.HttpResponse:
    tc.track_event('ProductCreated', {
        'product_name': product.name,
        'price': product.price
    })
    # ...
```

### Logging Best Practices

```python
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def main(req: func.HttpRequest) -> func.HttpResponse:
    logger.info(f"Received request: {req.method} {req.url}")
    
    try:
        # ...
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        return error_response("Internal error", status_code=500)
```

---

## 🚀 Evolución Futura

### Fase 2: Persistencia

```
┌─────────────────────────┐
│   Azure Functions       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Azure SQL Database     │
│  • Products table       │
│  • Users table          │
│  • Transactions log     │
└─────────────────────────┘
```

### Fase 3: Microservicios

```
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Products    │    │   Orders      │    │   Users       │
│   Function    │    │   Function    │    │   Function    │
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Azure Service  │
                    │  Bus (Events)   │
                    └─────────────────┘
```

### Fase 4: Global Distribution

```
┌──────────────┐         ┌──────────────┐
│  East US     │         │  West Europe │
│  Functions   │◄───────►│  Functions   │
└──────┬───────┘         └──────┬───────┘
       │                        │
       └────────┬───────────────┘
                │
         ┌──────▼──────┐
         │  CosmosDB   │
         │ (Multi-region)
         └─────────────┘
```

---

## 📖 Referencias Técnicas

- [Azure Functions Best Practices](https://learn.microsoft.com/en-us/azure/azure-functions/functions-best-practices)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Azure Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/)
- [Serverless Architecture Patterns](https://aws.amazon.com/serverless/)

---

**⬅️ [Volver al README principal](../README.md)**
