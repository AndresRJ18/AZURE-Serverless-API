# 📡 API Documentation

Documentación completa de la **Azure Serverless Product API** v1.0

## Base URL

```
Production: https://fnapi6794.azurewebsites.net
Local Dev:  http://localhost:7071
```

---

## 📋 Tabla de Contenidos

1. [Autenticación](#autenticación)
2. [Formato de Respuestas](#formato-de-respuestas)
3. [Códigos de Estado HTTP](#códigos-de-estado-http)
4. [Endpoints](#endpoints)
   - [Health Check](#1-health-check)
   - [Listar Productos](#2-listar-productos)
   - [Obtener Producto](#3-obtener-producto)
   - [Crear Producto](#4-crear-producto)
   - [Actualizar Producto](#5-actualizar-producto)
   - [Eliminar Producto](#6-eliminar-producto)
5. [Modelos de Datos](#modelos-de-datos)
6. [Códigos de Error](#códigos-de-error)
7. [Rate Limiting](#rate-limiting)
8. [Ejemplos con Postman](#ejemplos-con-postman)

---

## 🔐 Autenticación

**Versión actual:** No requiere autenticación (API pública)

> ⚠️ **Nota de seguridad:** En producción real, se recomienda implementar Azure AD B2C o API Keys.

---

## 📦 Formato de Respuestas

Todas las respuestas de la API siguen un formato JSON estandarizado:

### Respuesta Exitosa
```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operation completed successfully"
}
```

### Respuesta de Error
```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "details": { /* optional additional info */ }
}
```

---

## 🚦 Códigos de Estado HTTP

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| `200` | OK | Operación exitosa (GET, PUT, DELETE) |
| `201` | Created | Recurso creado exitosamente (POST) |
| `400` | Bad Request | Datos de entrada inválidos |
| `404` | Not Found | Recurso no encontrado |
| `422` | Unprocessable Entity | Validación de Pydantic falló |
| `500` | Internal Server Error | Error del servidor |

---

## 🎯 Endpoints

### 1. Health Check

Verifica que la API esté funcionando correctamente.

#### Request
```http
GET /api/health
```

#### Response
```json
{
  "status": "healthy",
  "timestamp": "2025-02-10T15:30:00.000Z",
  "service": "Products API",
  "version": "1.0.0"
}
```

#### Ejemplo cURL
```bash
curl https://fnapi6794.azurewebsites.net/api/health
```

#### Ejemplo JavaScript (Fetch)
```javascript
fetch('https://fnapi6794.azurewebsites.net/api/health')
  .then(response => response.json())
  .then(data => console.log(data));
```

#### Ejemplo Python (requests)
```python
import requests

response = requests.get('https://fnapi6794.azurewebsites.net/api/health')
print(response.json())
```

---

### 2. Listar Productos

Obtiene todos los productos disponibles en el sistema.

#### Request
```http
GET /api/products
```

#### Query Parameters
*No acepta parámetros por ahora. Filtros y paginación próximamente.*

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Laptop Dell XPS 15",
      "price": 1499.99,
      "stock": 25,
      "created_at": "2025-02-10T10:00:00.000Z",
      "updated_at": "2025-02-10T10:00:00.000Z"
    },
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "name": "Mouse Logitech MX Master 3",
      "price": 99.99,
      "stock": 150,
      "created_at": "2025-02-10T11:00:00.000Z",
      "updated_at": "2025-02-10T11:00:00.000Z"
    }
  ],
  "count": 2
}
```

#### Ejemplo cURL
```bash
curl https://fnapi6794.azurewebsites.net/api/products
```

#### Ejemplo JavaScript (Fetch)
```javascript
async function getAllProducts() {
  const response = await fetch('https://fnapi6794.azurewebsites.net/api/products');
  const data = await response.json();
  
  if (data.success) {
    console.log(`Total products: ${data.count}`);
    data.data.forEach(product => {
      console.log(`${product.name} - $${product.price}`);
    });
  }
}
```

#### Ejemplo Python (requests)
```python
import requests

response = requests.get('https://fnapi6794.azurewebsites.net/api/products')
data = response.json()

if data['success']:
    for product in data['data']:
        print(f"{product['name']} - ${product['price']}")
```

---

### 3. Obtener Producto

Obtiene los detalles de un producto específico por su ID.

#### Request
```http
GET /api/products/{id}
```

#### Path Parameters
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | UUID | Identificador único del producto |

#### Response - Éxito (200)
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Laptop Dell XPS 15",
    "price": 1499.99,
    "stock": 25,
    "created_at": "2025-02-10T10:00:00.000Z",
    "updated_at": "2025-02-10T10:00:00.000Z"
  }
}
```

#### Response - Error (404)
```json
{
  "success": false,
  "error": "Product not found"
}
```

#### Ejemplo cURL
```bash
curl https://fnapi6794.azurewebsites.net/api/products/550e8400-e29b-41d4-a716-446655440000
```

#### Ejemplo JavaScript (Fetch)
```javascript
async function getProduct(productId) {
  const response = await fetch(
    `https://fnapi6794.azurewebsites.net/api/products/${productId}`
  );
  const data = await response.json();
  
  if (data.success) {
    console.log(`Product: ${data.data.name}`);
    console.log(`Price: $${data.data.price}`);
    console.log(`Stock: ${data.data.stock} units`);
  } else {
    console.error(data.error);
  }
}

// Uso
getProduct('550e8400-e29b-41d4-a716-446655440000');
```

#### Ejemplo Python (requests)
```python
import requests

product_id = '550e8400-e29b-41d4-a716-446655440000'
response = requests.get(
    f'https://fnapi6794.azurewebsites.net/api/products/{product_id}'
)
data = response.json()

if response.status_code == 200:
    product = data['data']
    print(f"Product: {product['name']}")
    print(f"Price: ${product['price']}")
elif response.status_code == 404:
    print('Product not found')
```

---

### 4. Crear Producto

Crea un nuevo producto en el sistema.

#### Request
```http
POST /api/products
Content-Type: application/json
```

#### Request Body
```json
{
  "name": "Teclado Mecánico Keychron K2",
  "price": 89.99,
  "stock": 75
}
```

#### Request Body Schema
| Campo | Tipo | Requerido | Validaciones |
|-------|------|-----------|--------------|
| `name` | string | ✅ | Min: 3 chars, Max: 100 chars |
| `price` | float | ✅ | > 0 |
| `stock` | integer | ✅ | >= 0 |

#### Response - Éxito (201)
```json
{
  "success": true,
  "data": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "name": "Teclado Mecánico Keychron K2",
    "price": 89.99,
    "stock": 75,
    "created_at": "2025-02-10T15:45:00.000Z",
    "updated_at": "2025-02-10T15:45:00.000Z"
  },
  "message": "Product created successfully"
}
```

#### Response - Error de Validación (422)
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "field": "price",
      "message": "ensure this value is greater than 0"
    }
  ]
}
```

#### Ejemplo cURL
```bash
curl -X POST https://fnapi6794.azurewebsites.net/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teclado Mecánico Keychron K2",
    "price": 89.99,
    "stock": 75
  }'
```

#### Ejemplo JavaScript (Fetch)
```javascript
async function createProduct(productData) {
  const response = await fetch(
    'https://fnapi6794.azurewebsites.net/api/products',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    }
  );
  
  const data = await response.json();
  
  if (response.status === 201) {
    console.log('Product created:', data.data);
    return data.data;
  } else {
    console.error('Error:', data.error);
    throw new Error(data.error);
  }
}

// Uso
createProduct({
  name: 'Teclado Mecánico Keychron K2',
  price: 89.99,
  stock: 75
});
```

#### Ejemplo Python (requests)
```python
import requests

new_product = {
    'name': 'Teclado Mecánico Keychron K2',
    'price': 89.99,
    'stock': 75
}

response = requests.post(
    'https://fnapi6794.azurewebsites.net/api/products',
    json=new_product
)

if response.status_code == 201:
    product = response.json()['data']
    print(f"Product created with ID: {product['id']}")
else:
    print(f"Error: {response.json()['error']}")
```

---

### 5. Actualizar Producto

Actualiza los datos de un producto existente.

#### Request
```http
PUT /api/products/{id}
Content-Type: application/json
```

#### Path Parameters
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | UUID | Identificador único del producto |

#### Request Body
```json
{
  "name": "Teclado Mecánico Keychron K2 V2",
  "price": 94.99,
  "stock": 100
}
```

> 📝 **Nota:** Puedes enviar solo los campos que deseas actualizar (actualización parcial).

#### Request Body Schema
| Campo | Tipo | Requerido | Validaciones |
|-------|------|-----------|--------------|
| `name` | string | ❌ | Min: 3 chars, Max: 100 chars |
| `price` | float | ❌ | > 0 |
| `stock` | integer | ❌ | >= 0 |

#### Response - Éxito (200)
```json
{
  "success": true,
  "data": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "name": "Teclado Mecánico Keychron K2 V2",
    "price": 94.99,
    "stock": 100,
    "created_at": "2025-02-10T15:45:00.000Z",
    "updated_at": "2025-02-10T16:00:00.000Z"
  },
  "message": "Product updated successfully"
}
```

#### Response - Error (404)
```json
{
  "success": false,
  "error": "Product not found"
}
```

#### Ejemplo cURL
```bash
curl -X PUT https://fnapi6794.azurewebsites.net/api/products/7c9e6679-7425-40de-944b-e07fc1f90ae7 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teclado Mecánico Keychron K2 V2",
    "price": 94.99,
    "stock": 100
  }'
```

#### Ejemplo JavaScript (Fetch)
```javascript
async function updateProduct(productId, updates) {
  const response = await fetch(
    `https://fnapi6794.azurewebsites.net/api/products/${productId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    }
  );
  
  const data = await response.json();
  
  if (response.ok) {
    console.log('Product updated:', data.data);
    return data.data;
  } else {
    console.error('Error:', data.error);
    throw new Error(data.error);
  }
}

// Uso - Actualización parcial (solo precio)
updateProduct('7c9e6679-7425-40de-944b-e07fc1f90ae7', {
  price: 84.99
});
```

#### Ejemplo Python (requests)
```python
import requests

product_id = '7c9e6679-7425-40de-944b-e07fc1f90ae7'
updates = {
    'price': 94.99,
    'stock': 100
}

response = requests.put(
    f'https://fnapi6794.azurewebsites.net/api/products/{product_id}',
    json=updates
)

if response.status_code == 200:
    product = response.json()['data']
    print(f"Product updated: {product['name']}")
elif response.status_code == 404:
    print('Product not found')
```

---

### 6. Eliminar Producto

Elimina un producto del sistema.

#### Request
```http
DELETE /api/products/{id}
```

#### Path Parameters
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | UUID | Identificador único del producto |

#### Response - Éxito (200)
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

#### Response - Error (404)
```json
{
  "success": false,
  "error": "Product not found"
}
```

#### Ejemplo cURL
```bash
curl -X DELETE https://fnapi6794.azurewebsites.net/api/products/7c9e6679-7425-40de-944b-e07fc1f90ae7
```

#### Ejemplo JavaScript (Fetch)
```javascript
async function deleteProduct(productId) {
  const response = await fetch(
    `https://fnapi6794.azurewebsites.net/api/products/${productId}`,
    {
      method: 'DELETE'
    }
  );
  
  const data = await response.json();
  
  if (response.ok) {
    console.log('Product deleted successfully');
    return true;
  } else {
    console.error('Error:', data.error);
    return false;
  }
}

// Uso
deleteProduct('7c9e6679-7425-40de-944b-e07fc1f90ae7');
```

#### Ejemplo Python (requests)
```python
import requests

product_id = '7c9e6679-7425-40de-944b-e07fc1f90ae7'

response = requests.delete(
    f'https://fnapi6794.azurewebsites.net/api/products/{product_id}'
)

if response.status_code == 200:
    print('Product deleted successfully')
elif response.status_code == 404:
    print('Product not found')
```

---

## 📊 Modelos de Datos

### Product Model

#### Schema
```json
{
  "id": "string (UUID)",
  "name": "string",
  "price": "float",
  "stock": "integer",
  "created_at": "string (ISO 8601 datetime)",
  "updated_at": "string (ISO 8601 datetime)"
}
```

#### Validaciones (Pydantic)
```python
from pydantic import BaseModel, Field, validator
from typing import Optional
import uuid
from datetime import datetime

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    price: float = Field(..., gt=0)
    stock: int = Field(..., ge=0)
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty or whitespace')
        return v.strip()

class Product(ProductCreate):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
```

#### Ejemplos de Validación

**✅ Válido:**
```json
{
  "name": "Laptop Gaming ASUS ROG",
  "price": 1899.99,
  "stock": 15
}
```

**❌ Inválido - Nombre muy corto:**
```json
{
  "name": "PC",
  "price": 999.99,
  "stock": 5
}
```
**Error:** `name must have at least 3 characters`

**❌ Inválido - Precio negativo:**
```json
{
  "name": "Monitor LG UltraWide",
  "price": -299.99,
  "stock": 20
}
```
**Error:** `price must be greater than 0`

**❌ Inválido - Stock negativo:**
```json
{
  "name": "Webcam Logitech C920",
  "price": 79.99,
  "stock": -5
}
```
**Error:** `stock must be greater than or equal to 0`

---

## ⚠️ Códigos de Error

### Errores Comunes

| Código | Error | Causa | Solución |
|--------|-------|-------|----------|
| `400` | Bad Request | JSON malformado | Verifica el formato JSON |
| `404` | Product not found | ID no existe | Verifica el ID del producto |
| `422` | Validation error | Datos inválidos | Revisa las validaciones del modelo |
| `500` | Internal server error | Error del servidor | Contacta soporte o revisa logs |

### Ejemplo de Error Detallado
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "loc": ["body", "price"],
      "msg": "ensure this value is greater than 0",
      "type": "value_error.number.not_gt"
    },
    {
      "loc": ["body", "name"],
      "msg": "ensure this value has at least 3 characters",
      "type": "value_error.any_str.min_length"
    }
  ]
}
```

---

## 🚦 Rate Limiting

**Versión actual:** No implementado

**Próximamente:**
- 100 requests/minuto por IP
- 1000 requests/día por IP

---

## 📮 Ejemplos con Postman

### Colección Postman

Descarga la colección completa: [Azure-Serverless-API.postman_collection.json](../postman/Azure-Serverless-API.postman_collection.json)

### Configuración

1. **Importar Colección:**
   - Abre Postman
   - Click en "Import"
   - Selecciona el archivo `.json`

2. **Configurar Variables:**
   - Variable: `base_url`
   - Valor: `https://fnapi6794.azurewebsites.net`

3. **Ejecutar Tests:**
   - Selecciona "Run Collection"
   - Verifica todos los endpoints

### Ejemplo de Request en Postman

```
GET {{base_url}}/api/products
```

**Headers:**
```
Content-Type: application/json
```

**Tests (JavaScript en Postman):**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success field", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Response has data array", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an('array');
});
```

---

## 🔄 Flujo Completo de Ejemplo

### Caso de Uso: Gestión de Inventario

```javascript
// 1. Verificar que la API está activa
const health = await fetch('https://fnapi6794.azurewebsites.net/api/health');
console.log(await health.json());

// 2. Obtener todos los productos
const products = await fetch('https://fnapi6794.azurewebsites.net/api/products');
const allProducts = await products.json();
console.log(`Total productos: ${allProducts.count}`);

// 3. Crear un nuevo producto
const newProduct = await fetch('https://fnapi6794.azurewebsites.net/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Monitor Samsung 27"',
    price: 299.99,
    stock: 30
  })
});
const created = await newProduct.json();
const productId = created.data.id;
console.log(`Producto creado con ID: ${productId}`);

// 4. Actualizar el stock
const updated = await fetch(`https://fnapi6794.azurewebsites.net/api/products/${productId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ stock: 25 })
});
console.log('Stock actualizado:', await updated.json());

// 5. Consultar el producto actualizado
const product = await fetch(`https://fnapi6794.azurewebsites.net/api/products/${productId}`);
console.log('Producto actual:', await product.json());

// 6. Eliminar el producto
const deleted = await fetch(`https://fnapi6794.azurewebsites.net/api/products/${productId}`, {
  method: 'DELETE'
});
console.log('Producto eliminado:', await deleted.json());
```

---

## 🐛 Troubleshooting

### Error: CORS

**Problema:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solución:**
```bash
az functionapp cors add \
  --name fnapi6794 \
  --resource-group rg-products-api \
  --allowed-origins https://tu-frontend.azurewebsites.net
```

### Error: 500 Internal Server Error

**Problema:** La API retorna error 500

**Solución:**
1. Revisar logs en Azure Portal
2. Ejecutar localmente para debug:
   ```bash
   cd backend
   func start
   ```

### Error: Function not found

**Problema:** `404 - Function not found`

**Solución:**
1. Verificar deployment:
   ```bash
   func azure functionapp list-functions fnapi6794
   ```
2. Re-deploy si es necesario:
   ```bash
   func azure functionapp publish fnapi6794 --python
   ```

---

## 📚 Recursos Adicionales

- [Azure Functions HTTP Triggers](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook)
- [Pydantic Documentation](https://docs.pydantic.dev/1.10/)
- [REST API Best Practices](https://restfulapi.net/)

---

## 📝 Changelog

### v1.0.0 (2025-02-10)
- ✅ Initial release
- ✅ 6 endpoints CRUD completos
- ✅ Validación con Pydantic
- ✅ Documentación completa

---

**⬅️ [Volver al README principal](../README.md)**
