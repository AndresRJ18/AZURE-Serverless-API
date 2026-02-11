# Azure Serverless Product API

![Azure](https://img.shields.io/badge/Azure-Serverless-0078D4?style=for-the-badge&logo=microsoft-azure)
![Azure Functions](https://img.shields.io/badge/Azure_Functions-v4-0062AD?style=for-the-badge&logo=azure-functions)
![Azure Static Web Apps](https://img.shields.io/badge/Static_Web_Apps-Frontend-5E2D79?style=for-the-badge&logo=microsoft-azure)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwind-css)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge)

Aplicación fullstack serverless lista para producción, construida sobre Microsoft Azure. Implementa un sistema completo de gestión de productos con una API REST en el backend y un dashboard moderno y responsivo en el frontend — desplegada íntegramente en los servicios gratuitos de Azure a **$0/mes**.

**Demo en vivo:** [https://zealous-pebble-02548630f.1.azurestaticapps.net](https://zealous-pebble-02548630f.1.azurestaticapps.net) &nbsp;|&nbsp;
**API:** [https://fnapi6794.azurewebsites.net](https://fnapi6794.azurewebsites.net) &nbsp;|&nbsp;
**Repositorio:** [GitHub](https://github.com/AndresRJ18/AZURE-Serverless-API)

---

## 📚 Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Referencia de la API](#referencia-de-la-api)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Desarrollo Local](#desarrollo-local)
- [Despliegue](#despliegue)
- [Pruebas](#pruebas)
- [Costos](#costos)
- [Roadmap](#roadmap)
- [Contribuciones](#contribuciones)
- [Autor](#autor)
- [Licencia](#licencia)



### Health Check
```bash
curl https://fnapi6794.azurewebsites.net/api/health
```
>>>>>>> 4c7b0e5930075431c182d9696a8b26d5bf29ffeb

---

## Características

### Backend — Azure Functions

| Capacidad | Detalle |
|---|---|
| Endpoints REST | 6 HTTP triggers (health check + CRUD completo) |
| Validación de datos | Pydantic v1.10.13 con validación de esquema |
| Arquitectura | Modular: `models/`, `services/`, `utils/` |
| Manejo de errores | Centralizado con envoltura estándar `success/error` |
| CORS | Configurado por origen para integración con el frontend |
| Runtime | Python 3.12 con anotaciones de tipo completas |
| Escalado | Azure Consumption Plan — escala a cero, sin costo en reposo |

### Frontend — Azure Static Web Apps

| Capacidad | Detalle |
|---|---|
| Framework de UI | Vanilla JavaScript ES6+ — sin paso de compilación |
| Estilos | Tailwind CSS 3.4 via CDN |
| Modo oscuro | Toggle con persistencia en `localStorage` |
| Responsivo | Diseño mobile-first en todos los viewports |
| Experiencia de usuario | Búsqueda en tiempo real, paginación, notificaciones toast, estados de carga |
| Iconos | Lucide Icons |

### DevOps

| Capacidad | Detalle |
|---|---|
| CI/CD | GitHub Actions — despliegue automático en cada push a `main` |
| Deploy frontend | Gestionado por el workflow de Azure Static Web Apps |
| Deploy backend | `func azure functionapp publish` vía GitHub Actions |
| Entornos | Aislamiento basado en ramas |

---

## Stack Tecnológico

### Backend

| Componente | Tecnología |
|---|---|
| Runtime | Python 3.12 |
| Framework | Azure Functions v4 |
| Validación | Pydantic 1.10.13 |
| Tipo de trigger | HTTP Trigger (nivel de autenticación anónimo) |

### Frontend

| Componente | Tecnología |
|---|---|
| Lenguaje | JavaScript ES6+ (Vanilla) |
| Estilos | Tailwind CSS 3.4 (CDN) |
| Iconos | Lucide Icons |
| Hosting | Azure Static Web Apps (Free Tier) |

### Infraestructura Azure

| Recurso | Nombre | Región |
|---|---|---|
| Grupo de recursos | `rg-products-api` | East US |
| Function App | `fnapi6794` | East US |
| Cuenta de almacenamiento | `stapi2025andres` | East US |
| Static Web App | `products-dashboard-6627` | East US 2 |

---

## Referencia de la API

### Endpoints

| Método | Endpoint | Descripción | Cuerpo |
|---|---|---|---|
| `GET` | `/api/health` | Health check del servicio | — |
| `GET` | `/api/products` | Listar todos los productos | — |
| `GET` | `/api/products/{id}` | Obtener producto por ID | — |
| `POST` | `/api/products` | Crear un producto | `name`, `price`, `stock` |
| `PUT` | `/api/products/{id}` | Actualizar un producto | `name`, `price`, `stock` (parcial) |
| `DELETE` | `/api/products/{id}` | Eliminar un producto | — |

Todas las respuestas siguen una envoltura consistente:

```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": "Descripción del error" }
```

### Ejemplos de Uso

**Health Check**
```bash
curl https://fnapi6794.azurewebsites.net/api/health
```
```json
{ "status": "healthy", "timestamp": "2025-02-10T12:00:00Z", "service": "Products API" }
```

**Crear producto**
```bash
curl -X POST https://fnapi6794.azurewebsites.net/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop Dell XPS 15", "price": 1499.99, "stock": 25}'
```
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Laptop Dell XPS 15",
    "price": 1499.99,
    "stock": 25,
    "created_at": "2025-02-10T12:00:00Z"
  }
}
```

**Listar productos**
```bash
curl https://fnapi6794.azurewebsites.net/api/products
```
```json
{
  "success": true,
  "data": [ { "id": "...", "name": "Laptop Dell XPS 15", "price": 1499.99, "stock": 25 } ],
  "count": 1
}
```

Referencia completa con todos los esquemas de solicitud y respuesta: [`docs/API.md`](docs/API.md)

---

## Estructura del Proyecto

```
AZURE-Serverless-API/
│
├── backend/                      # Aplicación Azure Functions
│   ├── models/
│   │   └── product_model.py      # Definiciones de esquema Pydantic
│   ├── services/
│   │   └── product_service.py    # Lógica de negocio / capa CRUD
│   ├── utils/
│   │   └── response_helper.py    # Constructor de respuestas JSON estandarizadas
│   ├── HealthCheck/              # GET    /api/health
│   ├── GetProducts/              # GET    /api/products
│   ├── GetProduct/               # GET    /api/products/{id}
│   ├── CreateProduct/            # POST   /api/products
│   ├── UpdateProduct/            # PUT    /api/products/{id}
│   ├── DeleteProduct/            # DELETE /api/products/{id}
│   ├── host.json
│   └── requirements.txt
│
├── frontend/                     # Static Web App
│   ├── index.html
│   └── js/app.js                 # Vanilla JS — llamadas API, DOM, estado
│
├── docs/
│   ├── API.md                    # Referencia completa de la API
│   ├── DEPLOYMENT.md             # Guía de despliegue paso a paso
│   └── ARCHITECTURE.md           # Decisiones de arquitectura
│
├── .github/workflows/            # Pipelines de CI/CD
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## Desarrollo Local

### Requisitos Previos

| Herramienta | Versión | Referencia |
|---|---|---|
| Python | 3.12+ | [python.org](https://www.python.org/downloads/) |
| Azure Functions Core Tools | v4 | [learn.microsoft.com](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local) |
| Azure CLI | 2.50+ | [learn.microsoft.com](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) |
| Git | cualquiera | [git-scm.com](https://git-scm.com/) |

### Configuración

```bash
# Clonar el repositorio
git clone https://github.com/AndresRJ18/AZURE-Serverless-API.git
cd AZURE-Serverless-API

# Instalar dependencias del backend
cd backend
pip install -r requirements.txt

# Crear archivo de configuración local
echo '{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "python"
  }
}' > local.settings.json

# Iniciar el runtime de Azure Functions
func start
```

En una terminal separada:

```bash
# Servir el frontend
cd frontend
python -m http.server 8000
```

| Servicio | URL local |
|---|---|
| Frontend | http://localhost:8000 |
| API | http://localhost:7071/api/health |

> Para desarrollo local, asegúrate de que `API_BASE_URL` en `frontend/js/app.js` apunte a `http://localhost:7071`.

---

## Despliegue

### 1. Aprovisionar recursos en Azure

```bash
az login
az account set --subscription "Suscripción de Azure 1"
az group create --name rg-products-api --location eastus
```

### 2. Desplegar el backend

```bash
# Crear la Function App
az functionapp create \
  --resource-group rg-products-api \
  --consumption-plan-location eastus \
  --runtime python --runtime-version 3.12 \
  --functions-version 4 \
  --name fnapi6794 \
  --storage-account stapi2025andres \
  --os-type Linux

# Publicar desde el código fuente
cd backend
func azure functionapp publish fnapi6794 --python
```

### 3. Desplegar el frontend

```bash
az staticwebapp create \
  --name products-dashboard \
  --resource-group rg-products-api \
  --source https://github.com/AndresRJ18/AZURE-Serverless-API \
  --location eastus2 \
  --branch main \
  --app-location "/frontend" \
  --login-with-github
```

Una vez aprovisionado, todos los despliegues posteriores se automatizan mediante GitHub Actions en cada push a `main`.

### 4. Configurar CORS

```bash
az functionapp cors add \
  --name fnapi6794 \
  --resource-group rg-products-api \
  --allowed-origins https://zealous-pebble-02548630f.1.azurestaticapps.net
```

Guía completa con rollback y monitoreo: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

---

## Pruebas

### En local

```bash
curl http://localhost:7071/api/health
curl http://localhost:7071/api/products

# Crear un producto de prueba
curl -X POST http://localhost:7071/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Producto de prueba", "price": 49.99, "stock": 5}'
```

### En producción

```bash
curl https://fnapi6794.azurewebsites.net/api/health
curl https://fnapi6794.azurewebsites.net/api/products
```

---

## Costos

| Servicio | Plan | Costo mensual |
|---|---|---|
| Azure Functions | Consumption Plan — 1 millón de ejecuciones/mes gratis | $0.00 |
| Azure Static Web Apps | Free Tier — 100 GB de ancho de banda/mes | $0.00 |
| Azure Storage Account | General Purpose v2 — uso mínimo | ~$0.00 |
| **Total** | | **$0.00 / mes** |

> Los costos pueden aumentar si se superan los límites del nivel gratuito. Consulta la [calculadora de precios de Azure](https://azure.microsoft.com/es-es/pricing/) para más detalles.

---

## Roadmap

**Fase 1 — MVP** ✅
- [x] API REST completa con validación Pydantic
- [x] Dashboard frontend responsivo con modo oscuro
- [x] Despliegue en Azure (Functions + Static Web Apps)
- [x] CI/CD automatizado con GitHub Actions

**Fase 2 — Hardening para producción**
- [ ] Suite de pruebas unitarias con `pytest`
- [ ] Azure SQL Database para almacenamiento persistente
- [ ] Integración con Application Insights
- [ ] Rate limiting en la API
- [ ] Autenticación con Azure AD B2C

**Fase 3 — Capacidades extendidas**
- [ ] Documentación OpenAPI / Swagger autogenerada
- [ ] Carga de imágenes de productos vía Azure Blob Storage
- [ ] Exportación / importación en formato CSV
- [ ] Notificaciones en tiempo real con Azure SignalR Service
- [ ] Integración con Azure Cognitive Search

---

## Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue el flujo estándar de fork y Pull Request:

1. Haz fork del repositorio
2. Crea una rama de funcionalidad: `git checkout -b feature/tu-funcionalidad`
3. Realiza commits usando Conventional Commits: `git commit -m 'feat: descripción'`
4. Haz push y abre un Pull Request contra `main`

Consulta [`CONTRIBUTING.md`](CONTRIBUTING.md) para conocer las guías de estilo de código, convenciones de commits y requisitos de pruebas.

---

## Autor

**Andrés Rodas**  
Estudiante de Ingeniería Informática — Universidad Peruana Cayetano Heredia (UPCH)  
Entusiasta de Cloud Computing e Inteligencia Artificial

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Andrés_Rodas-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/andres-rodas-802309272)
[![GitHub](https://img.shields.io/badge/GitHub-@AndresRJ18-181717?style=flat&logo=github)](https://github.com/AndresRJ18)
[![Email](https://img.shields.io/badge/Email-andrescloud18sj@gmail.com-D14836?style=flat&logo=gmail)](mailto:andrescloud18sj@gmail.com)

---

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [`LICENSE`](LICENSE) para más detalles.

---

<div align="center">
Si este proyecto te resultó útil, considera darle una ⭐ en GitHub.
<br><br>
<a href="#azure-serverless-product-api">Volver al inicio ↑</a>
</div>
