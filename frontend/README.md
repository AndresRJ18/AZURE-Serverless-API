\# 🎨 Products API Dashboard



Modern, responsive dashboard for managing products via the Azure Functions API.



\## ✨ Features



\- 📊 Real-time product management (CRUD)

\- 🌓 Dark mode with persistence

\- 📱 Fully responsive (mobile-first design)

\- 🔍 Search and filter products

\- 📄 Pagination

\- 🎨 Modern UI with Tailwind CSS

\- ⚡ Fast and lightweight (no build required)

\- ♿ Accessible (WCAG compliant)



\## 🛠️ Tech Stack



\- \*\*HTML5\*\* - Semantic markup

\- \*\*JavaScript ES6+\*\* - Modern vanilla JS

\- \*\*Tailwind CSS 3.4\*\* - Utility-first CSS

\- \*\*Lucide Icons\*\* - Beautiful icon set

\- \*\*Google Fonts (Inter)\*\* - Professional typography



\## 🚀 Quick Start



\### Local Development



1\. \*\*Open directly in browser:\*\*

```bash

&nbsp;  # Simply open index.html in your browser

&nbsp;  # Or use a local server (recommended)

```



2\. \*\*Using Python:\*\*

```bash

&nbsp;  cd frontend

&nbsp;  python -m http.server 8000

&nbsp;  # Visit http://localhost:8000

```



3\. \*\*Using VS Code Live Server:\*\*

&nbsp;  - Install "Live Server" extension

&nbsp;  - Right-click `index.html` → "Open with Live Server"



\### Configuration



Update API URL in `js/app.js`:

```javascript

const API\_BASE\_URL = 'https://your-api-url.azurewebsites.net/api';

```



\## 📁 Structure

```

frontend/

├── index.html          # Main dashboard

├── js/

│   └── app.js         # Application logic

└── README.md          # This file

```



\## 🎨 Design System



\### Colors



\- \*\*Primary:\*\* #0078D4 (Azure Blue)

\- \*\*Success:\*\* #10B981

\- \*\*Error:\*\* #EF4444

\- \*\*Background (Light):\*\* #F9FAFB

\- \*\*Background (Dark):\*\* #111827



\### Typography



\- \*\*Font Family:\*\* Inter

\- \*\*Headings:\*\* Bold, 600-700 weight

\- \*\*Body:\*\* Regular, 400 weight



\### Breakpoints



\- \*\*Mobile:\*\* < 768px

\- \*\*Tablet:\*\* 768px - 1024px

\- \*\*Desktop:\*\* > 1024px



\## 🌐 Deployment



\### Azure Static Web Apps (Recommended)

```bash

\# Will be deployed via GitHub Actions

```



\### Manual Deployment



1\. Build (if needed - not required for this project)

2\. Upload `frontend/` folder to hosting

3\. Configure CORS on API backend



\## 🔧 Features Breakdown



\### Dashboard

\- Summary cards (Total Products, Categories, Avg Stock)

\- Real-time statistics



\### Products Table

\- Sortable columns

\- Search functionality

\- Category filter

\- Pagination

\- Responsive (table on desktop, cards on mobile)



\### Create/Edit Modal

\- Form validation

\- Error handling

\- Success notifications



\### Dark Mode

\- Toggle switch

\- Persists preference in localStorage

\- Smooth transitions



\## 📱 Mobile Support



\- Collapsible sidebar

\- Responsive table → card layout

\- Touch-friendly buttons

\- Optimized for small screens



\## ♿ Accessibility



\- ARIA labels

\- Keyboard navigation

\- Focus states

\- Screen reader support

\- WCAG 2.1 AA compliant



\## 🐛 Troubleshooting



\### CORS Issues



If you see CORS errors, ensure backend has:

```bash

az functionapp cors add --name YOUR\_FUNCTION\_APP --resource-group YOUR\_RG --allowed-origins "\*"

```



\### API Not Loading



1\. Check API URL in `app.js`

2\. Verify API is running

3\. Check browser console for errors



\## 📄 License



MIT License - See main project LICENSE



---



Made with ❤️ using Azure Functions + Tailwind CSS

