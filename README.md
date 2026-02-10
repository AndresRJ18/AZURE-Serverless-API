# 🚀 Products API - Fullstack Serverless Application

Aplicación fullstack serverless construida con Azure Functions (Python) y frontend moderno con Tailwind CSS.

## 📊 Arquitectura

\\\
┌─────────────────┐      HTTP      ┌─────────────────┐
│                 │ ──────────────> │                 │
│  Frontend       │                 │  Azure Functions│
│  (Static Web)   │ <────────────── │  (Python API)   │
│                 │      JSON       │                 │
└─────────────────┘                 └─────────────────┘
\\\

## 🌐 URLs de Producción

- **Frontend:** [Pendiente deployment]
- **Backend API:** https://fnapi6794.azurewebsites.net

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Python 3.12
- **Framework:** Azure Functions v4
- **Validación:** Pydantic 1.10.13
- **Arquitectura:** Serverless / Consumption Plan

### Frontend
- **UI:** HTML5, JavaScript ES6+
- **Estilos:** Tailwind CSS 3.4
- **Iconos:** Lucide Icons
- **Hosting:** Azure Static Web Apps

## ✨ Características

- ✅ API REST completa (CRUD)
- ✅ Validación de datos con Pydantic
- ✅ Arquitectura modular y escalable
- ✅ Dashboard interactivo con dark mode
- ✅ Diseño responsive (mobile-first)
- ✅ Manejo de errores robusto
- ✅ CORS configurado
- ✅ 100% Serverless

## 📋 Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | \/api/health\ | Health check |
| GET | \/api/products\ | Listar productos |
| GET | \/api/products/{id}\ | Obtener producto |
| POST | \/api/products\ | Crear producto |
| PUT | \/api/products/{id}\ | Actualizar producto |
| DELETE | \/api/products/{id}\ | Eliminar producto |

## 🚀 Deployment

### Backend (Azure Functions)
\\\ash
cd backend
func azure functionapp publish fnapi6794 --python
\\\

### Frontend (Azure Static Web Apps)
Ver [frontend/README.md](frontend/README.md)

## 📁 Estructura del Proyecto

\\\
serverless-api-azure/
├── backend/              # API Azure Functions
│   ├── models/          # Modelos Pydantic
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades
│   ├── HealthCheck/     # Function: Health
│   ├── GetProducts/     # Function: GET all
│   ├── GetProduct/      # Function: GET by ID
│   ├── CreateProduct/   # Function: POST
│   ├── UpdateProduct/   # Function: PUT
│   ├── DeleteProduct/   # Function: DELETE
│   ├── host.json        # Config Functions
│   └── requirements.txt # Dependencias
├── frontend/            # Dashboard web
│   ├── index.html       # UI principal
│   ├── app.js           # Lógica frontend
│   └── README.md        # Docs frontend
├── docs/                # Documentación
└── README.md            # Este archivo
\\\

## 🔧 Desarrollo Local

### Backend
\\\ash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
func start
\\\

### Frontend
\\\ash
cd frontend
# Abrir index.html en navegador
# O usar Live Server en VSCode
\\\

## 📊 Recursos Azure

| Recurso | Nombre | Tipo |
|---------|--------|------|
| Resource Group | rg-products-api | Grupo de recursos |
| Storage Account | stapi2025andres | Storage |
| Function App | fnapi6794 | Functions |
| Static Web App | [Pendiente] | Static Web Apps |

## 💰 Costos

- **Function App (Consumption):** ~\/mes (free tier)
- **Storage Account:** ~\.01/mes
- **Static Web App:** \/mes (free tier)
- **Total estimado:** ~\/mes

## 👨‍💻 Autor

**Andrés RJ**
- GitHub: [@AndresRJ18](https://github.com/AndresRJ18)
- Proyecto: Serverless API con Azure Functions

## 📄 Licencia

Este proyecto es de código abierto para fines educativos.

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
