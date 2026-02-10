# 🚀 Deployment Guide

Guía completa para desplegar **Azure Serverless Product API** en Microsoft Azure desde cero.

---

## 📋 Tabla de Contenidos

1. [Prerrequisitos](#prerrequisitos)
2. [Configuración Inicial](#configuración-inicial)
3. [Deploy Backend (Azure Functions)](#deploy-backend-azure-functions)
4. [Deploy Frontend (Static Web App)](#deploy-frontend-static-web-app)
5. [Configuración CORS](#configuración-cors)
6. [CI/CD con GitHub Actions](#cicd-con-github-actions)
7. [Verificación del Deployment](#verificación-del-deployment)
8. [Troubleshooting](#troubleshooting)
9. [Rollback y Gestión de Versiones](#rollback-y-gestión-de-versiones)

---

## 🔧 Prerrequisitos

### Software Requerido

| Herramienta | Versión Mínima | Instalación |
|-------------|----------------|-------------|
| **Azure CLI** | 2.50+ | [Descargar](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) |
| **Azure Functions Core Tools** | 4.0+ | [Descargar](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local) |
| **Python** | 3.12 | [Descargar](https://www.python.org/downloads/) |
| **Git** | 2.0+ | [Descargar](https://git-scm.com/) |
| **Node.js** | 18+ (opcional) | [Descargar](https://nodejs.org/) |

### Verificar Instalaciones

```bash
# Azure CLI
az --version

# Azure Functions Core Tools
func --version

# Python
python --version

# Git
git --version
```

### Cuenta de Azure

- [ ] Cuenta activa de Azure
- [ ] Suscripción válida (Free Tier disponible)
- [ ] Permisos de Contributor en la suscripción

**Crear cuenta gratuita:** [azure.microsoft.com/free](https://azure.microsoft.com/free)

---

## ⚙️ Configuración Inicial

### 1. Login a Azure CLI

```bash
# Iniciar sesión
az login

# Verificar cuenta
az account show

# Listar suscripciones
az account list --output table

# Seleccionar suscripción específica (si tienes múltiples)
az account set --subscription "Suscripción de Azure 1"
```

### 2. Clonar el Repositorio

```bash
# Clonar proyecto
git clone https://github.com/AndresRJ18/AZURE-Serverless-API.git
cd AZURE-Serverless-API

# Verificar estructura
ls -la
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# .env
RESOURCE_GROUP=rg-products-api
LOCATION=eastus
FUNCTION_APP_NAME=fnapi6794
STORAGE_ACCOUNT_NAME=stapi2025andres
STATIC_WEB_APP_NAME=products-dashboard
PYTHON_VERSION=3.12
```

---

## 🔵 Deploy Backend (Azure Functions)

### Paso 1: Crear Resource Group

```bash
# Crear grupo de recursos
az group create \
  --name rg-products-api \
  --location eastus

# Verificar creación
az group show --name rg-products-api
```

### Paso 2: Crear Storage Account

```bash
# Crear cuenta de almacenamiento
az storage account create \
  --name stapi2025andres \
  --resource-group rg-products-api \
  --location eastus \
  --sku Standard_LRS \
  --kind StorageV2

# Verificar
az storage account show \
  --name stapi2025andres \
  --resource-group rg-products-api
```

> ⚠️ **Importante:** El nombre de la storage account debe ser único globalmente (solo minúsculas y números).

### Paso 3: Crear Function App

```bash
# Crear Azure Function App
az functionapp create \
  --resource-group rg-products-api \
  --consumption-plan-location eastus \
  --runtime python \
  --runtime-version 3.12 \
  --functions-version 4 \
  --name fnapi6794 \
  --storage-account stapi2025andres \
  --os-type Linux \
  --disable-app-insights false

# Esperar a que termine (puede tardar 2-3 minutos)
```

**Parámetros explicados:**
- `--consumption-plan-location`: Región del plan serverless
- `--runtime python`: Runtime de Python
- `--runtime-version 3.12`: Versión de Python
- `--functions-version 4`: Azure Functions v4
- `--os-type Linux`: Sistema operativo (requerido para Python)
- `--disable-app-insights false`: Habilita Application Insights

### Paso 4: Configurar App Settings

```bash
# Configurar variables de entorno
az functionapp config appsettings set \
  --name fnapi6794 \
  --resource-group rg-products-api \
  --settings \
    "PYTHON_VERSION=3.12" \
    "ENABLE_ORYX_BUILD=true" \
    "SCM_DO_BUILD_DURING_DEPLOYMENT=true"

# Verificar configuración
az functionapp config appsettings list \
  --name fnapi6794 \
  --resource-group rg-products-api \
  --output table
```

### Paso 5: Deploy del Código

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias localmente (opcional, para verificar)
pip install -r requirements.txt

# Deploy con Azure Functions Core Tools
func azure functionapp publish fnapi6794 --python

# Alternativa: Deploy con Azure CLI
# az functionapp deployment source config-zip \
#   --resource-group rg-products-api \
#   --name fnapi6794 \
#   --src backend.zip
```

**Output esperado:**
```
Getting site publishing info...
Creating archive for current directory...
Uploading 2.34 MB [####################]
Upload completed successfully.
Deployment completed successfully.
Syncing triggers...
Functions in fnapi6794:
    CreateProduct - [httpTrigger]
        Invoke url: https://fnapi6794.azurewebsites.net/api/products
    DeleteProduct - [httpTrigger]
        Invoke url: https://fnapi6794.azurewebsites.net/api/products/{id}
    GetProduct - [httpTrigger]
        Invoke url: https://fnapi6794.azurewebsites.net/api/products/{id}
    GetProducts - [httpTrigger]
        Invoke url: https://fnapi6794.azurewebsites.net/api/products
    HealthCheck - [httpTrigger]
        Invoke url: https://fnapi6794.azurewebsites.net/api/health
    UpdateProduct - [httpTrigger]
        Invoke url: https://fnapi6794.azurewebsites.net/api/products/{id}
```

### Paso 6: Verificar Backend

```bash
# Health check
curl https://fnapi6794.azurewebsites.net/api/health

# Listar productos
curl https://fnapi6794.azurewebsites.net/api/products
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2025-02-10T...",
  "service": "Products API"
}
```

---

## 🌐 Deploy Frontend (Static Web App)

### Opción A: Deploy Manual con Azure CLI

#### Paso 1: Crear Static Web App

```bash
# Crear Static Web App
az staticwebapp create \
  --name products-dashboard \
  --resource-group rg-products-api \
  --source https://github.com/AndresRJ18/AZURE-Serverless-API \
  --location eastus \
  --branch main \
  --app-location "/frontend" \
  --login-with-github
```

**Nota:** Deberás autorizar Azure a acceder a tu repositorio de GitHub.

#### Paso 2: Configurar Build

El comando anterior genera un workflow de GitHub Actions automáticamente. Verifica que se haya creado:

```bash
# Ver el archivo generado
cat .github/workflows/azure-static-web-apps-*.yml
```

### Opción B: Deploy Manual desde Portal Azure

1. **Ir a Azure Portal:**
   - Navega a [portal.azure.com](https://portal.azure.com)
   - Click en "Create a resource"
   - Busca "Static Web App"

2. **Configuración básica:**
   - **Subscription:** Suscripción de Azure 1
   - **Resource Group:** rg-products-api
   - **Name:** products-dashboard
   - **Region:** East US
   - **Plan type:** Free

3. **Deployment:**
   - **Source:** GitHub
   - **Organization:** AndresRJ18
   - **Repository:** AZURE-Serverless-API
   - **Branch:** main

4. **Build Details:**
   - **App location:** `/frontend`
   - **API location:** (dejar vacío)
   - **Output location:** `/`

5. **Review + Create**
   - Click en "Create"
   - Espera 2-3 minutos

### Paso 3: Obtener URL del Frontend

```bash
# Listar Static Web Apps
az staticwebapp list \
  --resource-group rg-products-api \
  --output table

# Obtener URL específica
az staticwebapp show \
  --name products-dashboard \
  --resource-group rg-products-api \
  --query "defaultHostname" \
  --output tsv
```

**Output:**
```
nice-beach-0a1b2c3d4.azurestaticapps.net
```

### Paso 4: Actualizar Frontend con la URL del Backend

Edita `frontend/js/app.js`:

```javascript
// Cambiar esta línea:
const API_BASE_URL = 'http://localhost:7071';

// Por:
const API_BASE_URL = 'https://fnapi6794.azurewebsites.net';
```

Commit y push:

```bash
git add frontend/js/app.js
git commit -m "Update API URL for production"
git push origin main
```

El deployment se hará automáticamente con GitHub Actions.

---

## 🔐 Configuración CORS

Para permitir que el frontend acceda al backend, configura CORS:

### Método 1: Azure CLI

```bash
# Agregar origen del frontend
az functionapp cors add \
  --name fnapi6794 \
  --resource-group rg-products-api \
  --allowed-origins https://nice-beach-0a1b2c3d4.azurestaticapps.net

# Verificar configuración CORS
az functionapp cors show \
  --name fnapi6794 \
  --resource-group rg-products-api
```

### Método 2: Azure Portal

1. Ve a Function App → fnapi6794
2. En el menú izquierdo: **API → CORS**
3. Agrega: `https://nice-beach-0a1b2c3d4.azurestaticapps.net`
4. Click en **Save**

### Método 3: Código (host.json)

Edita `backend/host.json`:

```json
{
  "version": "2.0",
  "extensions": {
    "http": {
      "routePrefix": "api",
      "cors": {
        "allowedOrigins": [
          "https://nice-beach-0a1b2c3d4.azurestaticapps.net"
        ],
        "supportCredentials": false
      }
    }
  }
}
```

Luego re-deploy:

```bash
cd backend
func azure functionapp publish fnapi6794 --python
```

---

## 🔄 CI/CD con GitHub Actions

### Backend Workflow

Crea `.github/workflows/backend-deploy.yml`:

```yaml
name: Deploy Azure Functions Backend

on:
  push:
    branches:
      - main
    paths:
      - 'backend/**'
  workflow_dispatch:

env:
  AZURE_FUNCTIONAPP_NAME: fnapi6794
  AZURE_FUNCTIONAPP_PACKAGE_PATH: './backend'
  PYTHON_VERSION: '3.12'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: 'Checkout GitHub Action'
        uses: actions/checkout@v4

      - name: Setup Python ${{ env.PYTHON_VERSION }}
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}

      - name: 'Install dependencies'
        shell: bash
        run: |
          cd ${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}
          python -m pip install --upgrade pip
          pip install -r requirements.txt --target=".python_packages/lib/site-packages"

      - name: 'Run Azure Functions Action'
        uses: Azure/functions-action@v1
        with:
          app-name: ${{ env.AZURE_FUNCTIONAPP_NAME }}
          package: ${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}
          publish-profile: ${{ secrets.AZURE_FUNCTIONAPP_PUBLISH_PROFILE }}
          scm-do-build-during-deployment: true
          enable-oryx-build: true
```

### Obtener Publish Profile

```bash
# Descargar publish profile
az functionapp deployment list-publishing-profiles \
  --name fnapi6794 \
  --resource-group rg-products-api \
  --xml > publish-profile.xml

# Ver contenido
cat publish-profile.xml
```

### Agregar Secret a GitHub

1. Ve a GitHub → Repositorio → Settings → Secrets and variables → Actions
2. Click en **New repository secret**
3. Name: `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`
4. Value: Pega el contenido de `publish-profile.xml`
5. Click en **Add secret**

### Frontend Workflow

El workflow del frontend se crea automáticamente al crear la Static Web App. Verifica:

```bash
cat .github/workflows/azure-static-web-apps-*.yml
```

---

## ✅ Verificación del Deployment

### Checklist de Verificación

```bash
# 1. Backend Health Check
curl https://fnapi6794.azurewebsites.net/api/health

# 2. Backend API Endpoints
curl https://fnapi6794.azurewebsites.net/api/products

# 3. Frontend accesible
curl https://nice-beach-0a1b2c3d4.azurestaticapps.net

# 4. CORS funcionando (desde el navegador)
# Abre DevTools → Network → verifica que no haya errores CORS

# 5. Logs del backend
az functionapp log tail \
  --name fnapi6794 \
  --resource-group rg-products-api

# 6. Estado de deployments
az functionapp deployment list \
  --name fnapi6794 \
  --resource-group rg-products-api \
  --output table
```

### Tests de Integración

```bash
# Test completo de flujo CRUD
# 1. Crear producto
curl -X POST https://fnapi6794.azurewebsites.net/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Product", "price": 99.99, "stock": 10}'

# 2. Listar productos (debe incluir el creado)
curl https://fnapi6794.azurewebsites.net/api/products

# 3. Actualizar producto (usa el ID del paso 1)
curl -X PUT https://fnapi6794.azurewebsites.net/api/products/{ID} \
  -H "Content-Type: application/json" \
  -d '{"price": 89.99}'

# 4. Eliminar producto
curl -X DELETE https://fnapi6794.azurewebsites.net/api/products/{ID}
```

---

## 🐛 Troubleshooting

### Problema 1: Function App no se crea

**Error:**
```
The subscription is not registered to use namespace 'Microsoft.Web'
```

**Solución:**
```bash
az provider register --namespace Microsoft.Web
az provider show --namespace Microsoft.Web --query "registrationState"
# Espera hasta que diga "Registered"
```

### Problema 2: Deploy falla por timeout

**Error:**
```
Deployment timed out after 600 seconds
```

**Solución:**
```bash
# Aumentar timeout
func azure functionapp publish fnapi6794 --python --timeout 1200

# O usar deployment por zip
cd backend
zip -r ../backend.zip .
cd ..
az functionapp deployment source config-zip \
  --resource-group rg-products-api \
  --name fnapi6794 \
  --src backend.zip
```

### Problema 3: CORS errors en el frontend

**Error (en navegador):**
```
Access to fetch at '...' has been blocked by CORS policy
```

**Solución:**
```bash
# 1. Verificar CORS actual
az functionapp cors show \
  --name fnapi6794 \
  --resource-group rg-products-api

# 2. Agregar origen correcto
az functionapp cors add \
  --name fnapi6794 \
  --resource-group rg-products-api \
  --allowed-origins https://tu-frontend-url.azurestaticapps.net

# 3. Para desarrollo local temporal (NO usar en producción)
az functionapp cors add \
  --name fnapi6794 \
  --resource-group rg-products-api \
  --allowed-origins "*"
```

### Problema 4: Python version mismatch

**Error:**
```
The Python version is not supported
```

**Solución:**
```bash
# Verificar versión configurada
az functionapp config show \
  --name fnapi6794 \
  --resource-group rg-products-api \
  --query "linuxFxVersion"

# Configurar Python 3.12
az functionapp config set \
  --name fnapi6794 \
  --resource-group rg-products-api \
  --linux-fx-version "PYTHON|3.12"
```

### Problema 5: Dependencias no se instalan

**Error:**
```
ModuleNotFoundError: No module named 'pydantic'
```

**Solución:**
```bash
# 1. Verificar requirements.txt
cat backend/requirements.txt

# 2. Habilitar remote build
az functionapp config appsettings set \
  --name fnapi6794 \
  --resource-group rg-products-api \
  --settings \
    "ENABLE_ORYX_BUILD=true" \
    "SCM_DO_BUILD_DURING_DEPLOYMENT=true"

# 3. Re-deploy
cd backend
func azure functionapp publish fnapi6794 --python --build remote
```

### Problema 6: 500 Internal Server Error

**Solución:**
```bash
# 1. Ver logs en tiempo real
az functionapp log tail \
  --name fnapi6794 \
  --resource-group rg-products-api

# 2. Ver logs históricos
az monitor app-insights query \
  --app fnapi6794 \
  --analytics-query "requests | where timestamp > ago(1h) | order by timestamp desc"

# 3. Test local para debug
cd backend
func start
```

---

## 🔄 Rollback y Gestión de Versiones

### Ver Deployments Anteriores

```bash
az functionapp deployment list \
  --name fnapi6794 \
  --resource-group rg-products-api \
  --output table
```

### Rollback a Versión Anterior

```bash
# Método 1: Slot swap (requiere Standard tier)
# No disponible en Consumption Plan

# Método 2: Re-deploy desde Git tag
git checkout v1.0.0
cd backend
func azure functionapp publish fnapi6794 --python
git checkout main

# Método 3: Deploy desde backup local
cd backup/backend-v1.0.0
func azure functionapp publish fnapi6794 --python
```

### Crear Snapshot del Deployment Actual

```bash
# Backup del código
git tag -a v1.0.1 -m "Production deployment 2025-02-10"
git push origin v1.0.1

# Backup de configuración
az functionapp config appsettings list \
  --name fnapi6794 \
  --resource-group rg-products-api \
  > config-backup-$(date +%Y%m%d).json
```

---

## 📊 Monitoreo Post-Deployment

### Application Insights

```bash
# Ver métricas en tiempo real
az monitor app-insights metrics show \
  --app fnapi6794 \
  --metric requests/count \
  --interval PT1M

# Query logs
az monitor app-insights query \
  --app fnapi6794 \
  --analytics-query "
    requests 
    | where timestamp > ago(24h) 
    | summarize count() by resultCode 
    | order by count_ desc
  "
```

### Alertas

```bash
# Crear alerta para errores 500
az monitor metrics alert create \
  --name "high-error-rate" \
  --resource-group rg-products-api \
  --scopes /subscriptions/{sub-id}/resourceGroups/rg-products-api/providers/Microsoft.Web/sites/fnapi6794 \
  --condition "count requests/failed > 10" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --action email your@email.com
```

---

## 💰 Estimación de Costos Post-Deployment

```bash
# Ver costos acumulados
az consumption usage list \
  --start-date 2025-02-01 \
  --end-date 2025-02-28 \
  --output table
```

**Costos estimados mensuales (Free Tier):**
- Azure Functions: $0 (hasta 1M ejecuciones)
- Static Web App: $0 (hasta 100GB bandwidth)
- Storage Account: ~$0.50 (uso mínimo)
- Application Insights: $0 (hasta 5GB/mes)

**Total: < $1/mes** 🎉

---

## 🎯 Próximos Pasos

- [ ] Configurar custom domain
- [ ] Agregar SSL certificate (Let's Encrypt)
- [ ] Implementar Azure AD B2C para autenticación
- [ ] Configurar Azure SQL Database
- [ ] Habilitar Application Insights dashboards
- [ ] Implementar rate limiting
- [ ] Configurar alertas de monitoreo

---

## 📚 Referencias

- [Azure Functions Documentation](https://learn.microsoft.com/en-us/azure/azure-functions/)
- [Static Web Apps Documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [Azure CLI Reference](https://learn.microsoft.com/en-us/cli/azure/)
- [GitHub Actions for Azure](https://github.com/Azure/actions)

---

**⬅️ [Volver al README principal](../README.md)**
