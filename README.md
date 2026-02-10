# ☁️ Azure Serverless Product API — Fullstack Cloud Application

![Azure](https://img.shields.io/badge/Azure-Serverless-0078D4?style=for-the-badge&logo=microsoft-azure)
![Azure Functions](https://img.shields.io/badge/Azure_Functions-v4-0062AD?style=for-the-badge&logo=azure-functions)
![Azure Static Web Apps](https://img.shields.io/badge/Static_Web_Apps-Frontend-5E2D79?style=for-the-badge&logo=microsoft-azure)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 📋 Descripción

**Azure Serverless Product API** es una aplicación fullstack completa construida con arquitectura serverless en Microsoft Azure. Implementa un sistema CRUD de gestión de productos con API REST backend y un dashboard frontend moderno, todo desplegado en servicios serverless de Azure con **costo $0/mes** usando el free tier.

### Problema que resuelve

Demuestra cómo construir y desplegar aplicaciones cloud-native escalables sin gestionar servidores, utilizando las mejores prácticas de desarrollo serverless, validación de datos robusta, y diseño responsive profesional.

---

## 🌐 Demo en Vivo

🚀 **Frontend:** [https://[static-app-name].azurewebsites.net](https://zealous-pebble-02548630f.1.azurestaticapps.net/)  
⚡ **API Backend:** [https://fnapi6794.azurewebsites.net](https://fnapi6794.azurewebsites.net)  
📦 **GitHub:** [https://github.com/AndresRJ18/AZURE-Serverless-API](https://github.com/AndresRJ18/AZURE-Serverless-API)

### Health Check
```bash
curl https://fnapi6794.azurewebsites.net/api/health
```

---

## 🏗️ Arquitectura

```
┌─────────────────┐
│   Usuario Web   │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────────────────┐
│ Azure Static Web Apps       │
│ • HTML5 + JavaScript ES6+   │
│ • Tailwind CSS 3.4          │
│ • Dark Mode Toggle          │
│ • Responsive Design         │
└────────┬────────────────────┘
         │ REST API Calls
         │ (CORS Enabled)
         ▼
┌─────────────────────────────┐
│ Azure Functions (Python)    │
│ ┌─────────────────────────┐ │
│ │ GET  /api/health        │ │
│ │ GET  /api/products      │ │
│ │ GET  /api/products/{id} │ │
│ │ POST /api/products      │ │
│ │ PUT  /api/products/{id} │ │
│ │ DEL  /api/products/{id} │ │
│ └─────────────────────────┘ │
│ • Pydantic Validation       │
│ • Modular Architecture      │
│ • Error Handling            │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ In-Memory Data Store        │
│ (Extendible a Azure SQL/    │
│  CosmosDB)                  │
└─────────────────────────────┘
```

**Flujo de datos:**
1. Usuario interactúa con el dashboard (Static Web App)
2. Frontend realiza llamadas AJAX al backend (Azure Functions)
3. Backend valida datos con Pydantic
4. Procesa la lógica de negocio (CRUD operations)
5. Retorna respuestas JSON estandarizadas
6. Frontend actualiza UI con toast notifications

---

## ✨ Características

### Backend (Azure Functions)
- ✅ **6 Endpoints REST** completamente funcionales
- ✅ **Validación robusta** con Pydantic v1.10.13
- ✅ **Arquitectura modular** (models/, services/, utils/)
- ✅ **CORS configurado** para integración frontend
- ✅ **Manejo de errores** centralizado
- ✅ **Responses estandarizadas** (success/error)
- ✅ **Python 3.12** con type hints
- ✅ **Consumption Plan** (auto-scaling)

### Frontend (Static Web App)
- ✅ **Dashboard profesional** con diseño moderno
- ✅ **Dark Mode** con persistencia en localStorage
- ✅ **100% Responsive** (mobile-first)
- ✅ **Búsqueda en tiempo real**
- ✅ **Paginación** de resultados
- ✅ **Toast notifications** para feedback
- ✅ **Loading states** en todas las operaciones
- ✅ **Formularios validados** con UX optimizada
- ✅ **Tailwind CSS 3.4** (sin compilador)
- ✅ **Lucide Icons** para iconografía

### DevOps
- ✅ **CI/CD automático** con GitHub Actions
- ✅ **Deploy on push** a main branch
- ✅ **Zero-downtime deployments**
- ✅ **Environment isolation**

---

## 💰 Costos Estimados

| Servicio | Plan | Costo Mensual |
|----------|------|---------------|
| Azure Functions | Consumption (Free Tier) | **$0** (1M ejecuciones gratis) |
| Azure Static Web Apps | Free Tier | **$0** (100GB bandwidth) |
| Azure Storage Account | General Purpose v2 | **$0** (uso mínimo) |
| **TOTAL** | | **$0/mes** 🎉 |

> ⚠️ **Nota:** Los costos pueden variar si se exceden los límites del free tier.

---

## 🚀 Quick Start

### Requisitos Previos
- Python 3.12+
- Azure CLI (`az --version`)
- Azure Functions Core Tools v4 (`func --version`)
- Git
- Cuenta de Azure (free tier disponible)

### Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/AndresRJ18/AZURE-Serverless-API.git
cd AZURE-Serverless-API

# 2. Instalar dependencias del backend
cd backend
pip install -r requirements.txt

# 3. Ejecutar Azure Functions localmente
func start

# 4. En otra terminal, servir el frontend
cd ../frontend
python -m http.server 8000

# 5. Abrir en el navegador
# Frontend: http://localhost:8000
# API: http://localhost:7071/api/health
```

### Configuración de Variables de Entorno

```bash
# backend/local.settings.json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "CORS_ORIGINS": "*"
  }
}
```

---

## 📡 API Documentation

### Endpoints Disponibles

| Método | Endpoint | Descripción | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/api/health` | Health check | - |
| `GET` | `/api/products` | Listar todos los productos | - |
| `GET` | `/api/products/{id}` | Obtener producto por ID | - |
| `POST` | `/api/products` | Crear nuevo producto | `{"name": "...", "price": 0.0, "stock": 0}` |
| `PUT` | `/api/products/{id}` | Actualizar producto | `{"name": "...", "price": 0.0, "stock": 0}` |
| `DELETE` | `/api/products/{id}` | Eliminar producto | - |

### Ejemplos de Uso

#### Health Check
```bash
curl https://fnapi6794.azurewebsites.net/api/health
```

**Respuesta:**
```json
{
  "status": "healthy",
  "timestamp": "2025-02-10T12:00:00Z",
  "service": "Products API"
}
```

#### Crear Producto
```bash
curl -X POST https://fnapi6794.azurewebsites.net/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Dell XPS 15",
    "price": 1499.99,
    "stock": 25
  }'
```

**Respuesta:**
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

#### Listar Productos
```bash
curl https://fnapi6794.azurewebsites.net/api/products
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Laptop Dell XPS 15",
      "price": 1499.99,
      "stock": 25,
      "created_at": "2025-02-10T12:00:00Z"
    }
  ],
  "count": 1
}
```

📖 **Documentación completa:** Ver [docs/API.md](docs/API.md)

---

## 📂 Estructura del Proyecto

```
AZURE-Serverless-API/
│
├── backend/                      # Azure Functions Backend
│   ├── models/                   # Pydantic Models
│   │   └── product_model.py      # Product schema y validación
│   ├── services/                 # Business Logic
│   │   └── product_service.py    # CRUD operations
│   ├── utils/                    # Utilidades compartidas
│   │   └── response_helper.py    # JSON response builder
│   ├── HealthCheck/              # GET /api/health
│   │   ├── __init__.py
│   │   └── function.json
│   ├── GetProducts/              # GET /api/products
│   │   ├── __init__.py
│   │   └── function.json
│   ├── GetProduct/               # GET /api/products/{id}
│   │   ├── __init__.py
│   │   └── function.json
│   ├── CreateProduct/            # POST /api/products
│   │   ├── __init__.py
│   │   └── function.json
│   ├── UpdateProduct/            # PUT /api/products/{id}
│   │   ├── __init__.py
│   │   └── function.json
│   ├── DeleteProduct/            # DELETE /api/products/{id}
│   │   ├── __init__.py
│   │   └── function.json
│   ├── host.json                 # Azure Functions config
│   ├── requirements.txt          # Python dependencies
│   └── local.settings.json       # Local environment vars
│
├── frontend/                     # Static Web App Frontend
│   ├── index.html                # Dashboard principal
│   ├── js/
│   │   └── app.js                # Frontend logic (AJAX, DOM)
│   └── README.md                 # Frontend docs
│
├── docs/                         # Documentación adicional
│   ├── API.md                    # API reference completa
│   ├── DEPLOYMENT.md             # Guía de deployment
│   └── ARCHITECTURE.md           # Decisiones de arquitectura
│
├── .github/
│   └── workflows/                # CI/CD pipelines
│       ├── backend-deploy.yml    # Auto-deploy backend
│       └── frontend-deploy.yml   # Auto-deploy frontend
│
├── .gitignore                    # Git ignore rules
├── LICENSE                       # MIT License
├── README.md                     # Este archivo
└── CONTRIBUTING.md               # Guía para contribuir
```

---

## 🔧 Tecnologías Utilizadas

### Backend
![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![Azure Functions](https://img.shields.io/badge/Azure_Functions-v4-0062AD?logo=azure-functions)
![Pydantic](https://img.shields.io/badge/Pydantic-1.10.13-E92063?logo=pydantic)

- **Runtime:** Python 3.12
- **Framework:** Azure Functions v4
- **Validación:** Pydantic 1.10.13
- **HTTP:** Azure Functions HTTP Trigger
- **CORS:** azure-functions-cors (custom)

### Frontend
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwind-css)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)

- **Lenguaje:** JavaScript ES6+ (Vanilla, sin frameworks)
- **UI:** Tailwind CSS 3.4 (CDN)
- **Icons:** Lucide Icons
- **Hosting:** Azure Static Web Apps

### Infraestructura Azure
- **Resource Group:** `rg-products-api`
- **Function App:** `fnapi6794`
- **Storage Account:** `stapi2025andres`
- **Static Web App:** `[auto-generated]`
- **Region:** East US
- **Plan:** Consumption (Serverless)

### DevOps
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=github-actions&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)

- **CI/CD:** GitHub Actions
- **Version Control:** Git + GitHub
- **Deployment:** Automatic on push to main

---

## 🚢 Deployment

### Deploy a Azure (Paso a Paso)

#### 1. Preparar Azure CLI
```bash
# Login a Azure
az login

# Seleccionar suscripción
az account set --subscription "Suscripción de Azure 1"

# Crear resource group
az group create --name rg-products-api --location eastus
```

#### 2. Deploy Backend (Azure Functions)
```bash
cd backend

# Crear Function App
az functionapp create \
  --resource-group rg-products-api \
  --consumption-plan-location eastus \
  --runtime python \
  --runtime-version 3.12 \
  --functions-version 4 \
  --name fnapi6794 \
  --storage-account stapi2025andres \
  --os-type Linux

# Deploy con Azure Functions Core Tools
func azure functionapp publish fnapi6794 --python

# Verificar
curl https://fnapi6794.azurewebsites.net/api/health
```

#### 3. Deploy Frontend (Static Web App)
```bash
cd frontend

# Crear Static Web App (desde Azure Portal o CLI)
az staticwebapp create \
  --name products-dashboard \
  --resource-group rg-products-api \
  --source https://github.com/AndresRJ18/AZURE-Serverless-API \
  --location eastus \
  --branch main \
  --app-location "/frontend" \
  --login-with-github

# El deployment es automático con GitHub Actions
```

#### 4. Configurar CORS
```bash
# Permitir el origen del frontend
az functionapp cors add \
  --name fnapi6794 \
  --resource-group rg-products-api \
  --allowed-origins https://[static-app-name].azurewebsites.net
```

📖 **Guía completa:** Ver [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 🧪 Testing

### Probar Localmente

```bash
# Terminal 1: Backend
cd backend
func start

# Terminal 2: Frontend
cd frontend
python -m http.server 8000

# Terminal 3: Curl tests
curl http://localhost:7071/api/health
curl http://localhost:7071/api/products
```

### Probar en Producción

```bash
# Health check
curl https://fnapi6794.azurewebsites.net/api/health

# CRUD completo
curl https://fnapi6794.azurewebsites.net/api/products
curl -X POST https://fnapi6794.azurewebsites.net/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Product", "price": 99.99, "stock": 10}'
```

---

## 🎓 Aprendizajes Clave

Este proyecto demuestra competencias en:

### Cloud Computing
- ☁️ Arquitectura serverless en Azure
- ☁️ Gestión de recursos cloud (Resource Groups, Storage)
- ☁️ Servicios PaaS (Functions, Static Web Apps)
- ☁️ Optimización de costos (Free Tier usage)

### Backend Development
- 🐍 Python 3.12 con type hints
- 🔒 Validación de datos con Pydantic
- 🏗️ Arquitectura modular y escalable
- 🌐 APIs RESTful siguiendo best practices
- ⚡ Event-driven programming (HTTP Triggers)

### Frontend Development
- 🎨 Diseño responsive sin frameworks pesados
- 🌙 Dark mode con persistencia
- ⚡ Vanilla JavaScript moderno (ES6+)
- 🎯 UX optimization (loading, errors, feedback)

### DevOps
- 🚀 CI/CD con GitHub Actions
- 📦 Deployment automatizado
- 🔄 Version control con Git
- 📊 Monitoring con Azure Portal

---

## 🗺️ Roadmap

### ✅ Fase 1 - MVP (Completado)
- [x] API REST funcional
- [x] Dashboard web responsive
- [x] Deployment en Azure
- [x] CI/CD automático

### 🚧 Fase 2 - Mejoras (En progreso)
- [ ] Tests unitarios (pytest)
- [ ] Azure SQL Database para persistencia
- [ ] Application Insights para monitoring
- [ ] Rate limiting en la API
- [ ] Autenticación con Azure AD B2C

### 🔮 Fase 3 - Features Avanzadas
- [ ] Búsqueda con Azure Cognitive Search
- [ ] Image upload para productos (Blob Storage)
- [ ] Export/Import de productos (CSV)
- [ ] API documentation con Swagger/OpenAPI
- [ ] Notificaciones en tiempo real (SignalR)
- [ ] Multi-tenancy support

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

---

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Andrés Rodas**  
Informatics Engineering Student – UPCH  
☁️ Cloud Computing & AI Enthusiast

- 💼 **LinkedIn:** [www.linkedin.com/in/andres-rodas-802309272](https://www.linkedin.com/in/andres-rodas-802309272)
- 📧 **Email:** [andrescloud18sj@gmail.com](mailto:andrescloud18sj@gmail.com)
- 🐙 **GitHub:** [@AndresRJ18](https://github.com/AndresRJ18)

---

## 🙏 Agradecimientos

- Microsoft Azure por el free tier generoso
- Azure Functions team por la excelente documentación
- Tailwind CSS por facilitar el diseño responsive
- Comunidad open source

---

## 📸 Screenshots

### Desktop View - Light Mode
![Dashboard Desktop Light](docs/images/dashboard-desktop-light.png)

### Desktop View - Dark Mode
![Dashboard Desktop Dark](docs/images/dashboard-desktop-dark.png)

### Mobile View
![Dashboard Mobile](docs/images/dashboard-mobile.png)

### API Response Example
![API Response](docs/images/api-response.png)

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub ⭐**

[⬆ Volver arriba](#-azure-serverless-product-api--fullstack-cloud-application)

</div>
