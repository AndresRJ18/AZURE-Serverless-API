// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL = 'https://fnapi6794.azurewebsites.net/api';

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

let products = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 10;
let editingProductId = null;

// ============================================================================
// API FUNCTIONS
// ============================================================================

async function fetchProducts() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/products`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        products = data.products || [];
        filteredProducts = [...products];
        
        renderProducts();
        renderSummaryCards();
        updateCategoryFilter();
        hideLoading();
        
        showToast('Products loaded successfully', 'success');
    } catch (error) {
        console.error('Error fetching products:', error);
        hideLoading();
        showToast('Failed to load products', 'error');
    }
}

async function createProduct(productData) {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create product');
        }
        
        const newProduct = await response.json();
        products.push(newProduct);
        filteredProducts = [...products];
        
        renderProducts();
        renderSummaryCards();
        updateCategoryFilter();
        
        showToast('Product created successfully', 'success');
        return true;
    } catch (error) {
        console.error('Error creating product:', error);
        showToast(error.message, 'error');
        return false;
    }
}

async function updateProduct(id, productData) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update product');
        }
        
        const updatedProduct = await response.json();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = updatedProduct;
            filteredProducts = [...products];
        }
        
        renderProducts();
        renderSummaryCards();
        
        showToast('Product updated successfully', 'success');
        return true;
    } catch (error) {
        console.error('Error updating product:', error);
        showToast(error.message, 'error');
        return false;
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete product');
        }
        
        products = products.filter(p => p.id !== id);
        filteredProducts = [...products];
        
        renderProducts();
        renderSummaryCards();
        updateCategoryFilter();
        
        showToast('Product deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Failed to delete product', 'error');
    }
}

// ============================================================================
// UI RENDERING
// ============================================================================

function renderSummaryCards() {
    const totalProducts = products.length;
    const categories = [...new Set(products.map(p => p.category))].length;
    const avgStock = products.length > 0 
        ? (products.reduce((sum, p) => sum + p.stock, 0) / products.length).toFixed(1)
        : 0;
    
    const summaryHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">${totalProducts}</p>
                </div>
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <i data-lucide="package" class="w-6 h-6 text-blue-600 dark:text-blue-400"></i>
                </div>
            </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">${categories}</p>
                </div>
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <i data-lucide="grid" class="w-6 h-6 text-green-600 dark:text-green-400"></i>
                </div>
            </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Stock</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">${avgStock}</p>
                </div>
                <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <i data-lucide="trending-up" class="w-6 h-6 text-purple-600 dark:text-purple-400"></i>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('summary-cards').innerHTML = summaryHTML;
    lucide.createIcons();
}

function renderProducts() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);
    
    // Desktop table
    const tableBody = document.getElementById('products-table-body');
    if (paginatedProducts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center">
                        <i data-lucide="package-open" class="w-16 h-16 text-gray-400 mb-4"></i>
                        <p class="text-gray-500 dark:text-gray-400 text-lg">No products found</p>
                        <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search or filter</p>
                    </div>
                </td>
            </tr>
        `;
    } else {
        tableBody.innerHTML = paginatedProducts.map(product => `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                            <i data-lucide="box" class="w-5 h-5 text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <div>
                            <div class="text-sm font-medium text-gray-900 dark:text-white">${product.name}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">${product.description || 'No description'}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        ${product.category}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                    $${product.price.toFixed(2)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${product.stock}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onclick="viewProduct('${product.id}')" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                    <button onclick="editProduct('${product.id}')" class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1.5 hover:bg-green-50 dark:hover:bg-green-900/30 rounded">
                        <i data-lucide="edit" class="w-4 h-4"></i>
                    </button>
                    <button onclick="deleteProduct('${product.id}')" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    // Mobile grid
    const grid = document.getElementById('products-grid');
    if (paginatedProducts.length === 0) {
        grid.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12">
                <i data-lucide="package-open" class="w-16 h-16 text-gray-400 mb-4"></i>
                <p class="text-gray-500 dark:text-gray-400 text-lg">No products found</p>
            </div>
        `;
    } else {
        grid.innerHTML = paginatedProducts.map(product => `
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-900 dark:text-white">${product.name}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${product.description || 'No description'}</p>
                    </div>
                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        ${product.category}
                    </span>
                </div>
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                        <span class="text-lg font-bold text-gray-900 dark:text-white">$${product.price.toFixed(2)}</span>
                        <span class="text-sm text-gray-600 dark:text-gray-400">Stock: ${product.stock}</span>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="viewProduct('${product.id}')" class="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded">
                            <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                        <button onclick="editProduct('${product.id}')" class="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30 rounded">
                            <i data-lucide="edit" class="w-4 h-4"></i>
                        </button>
                        <button onclick="deleteProduct('${product.id}')" class="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderPagination();
    lucide.createIcons();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
    } else {
        let html = '';
        
        // Previous button
        html += `
            <button 
                onclick="changePage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}
                class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}"
            >
                Previous
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `
                    <button 
                        onclick="changePage(${i})" 
                        class="px-3 py-2 rounded-lg border text-sm font-medium ${i === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}"
                    >
                        ${i}
                    </button>
                `;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += '<span class="px-2 py-2 text-gray-500">...</span>';
            }
        }
        
        // Next button
        html += `
            <button 
                onclick="changePage(${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''}
                class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}"
            >
                Next
            </button>
        `;
        
        pagination.innerHTML = html;
    }
    
    // Update results info
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, filteredProducts.length);
    document.getElementById('results-info').textContent = 
        `Showing ${start}-${end} of ${filteredProducts.length} products`;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateCategoryFilter() {
    const categories = [...new Set(products.map(p => p.category))].sort();
    const filter = document.getElementById('category-filter');
    
    filter.innerHTML = '<option value="">All Categories</option>' + 
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

// ============================================================================
// MODAL FUNCTIONS
// ============================================================================

function openModal(mode = 'create', productId = null) {
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    
    editingProductId = productId;
    
    if (mode === 'edit' && productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            modalTitle.textContent = 'Edit Product';
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-description').value = product.description || '';
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-stock').value = product.stock;
            document.getElementById('product-category').value = product.category;
        }
    } else {
        modalTitle.textContent = 'New Product';
        form.reset();
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    editingProductId = null;
}

function editProduct(id) {
    openModal('edit', id);
}

function viewProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        alert(`Product: ${product.name}\nPrice: $${product.price}\nStock: ${product.stock}\nCategory: ${product.category}\nDescription: ${product.description || 'N/A'}`);
    }
}

// ============================================================================
// SEARCH & FILTER
// ============================================================================

function filterProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            (product.description && product.description.toLowerCase().includes(searchTerm));
        const matchesCategory = !category || product.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    currentPage = 1;
    renderProducts();
}

// Debounce search
let searchTimeout;
function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(filterProducts, 300);
}

// ============================================================================
// THEME TOGGLE
// ============================================================================

function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    if (isDark) {
        html.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        html.classList.add('dark');
        localStorage.theme = 'dark';
    }
}

// ============================================================================
// SIDEBAR TOGGLE (Mobile)
// ============================================================================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const id = 'toast-' + Date.now();
    
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };
    
    const icons = {
        success: 'check-circle',
        error: 'alert-circle',
        info: 'info'
    };
    
    const toast = document.createElement('div');
    toast.id = id;
    toast.className = `${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 transform transition-all duration-300 translate-x-full`;
    toast.innerHTML = `
        <i data-lucide="${icons[type]}" class="w-5 h-5"></i>
        <span class="font-medium">${message}</span>
        <button onclick="closeToast('${id}')" class="ml-4 hover:bg-white/20 rounded p-1">
            <i data-lucide="x" class="w-4 h-4"></i>
        </button>
    `;
    
    container.appendChild(toast);
    lucide.createIcons();
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        closeToast(id);
    }, 5000);
}

function closeToast(id) {
    const toast = document.getElementById(id);
    if (toast) {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}

// ============================================================================
// LOADING STATE
// ============================================================================

function showLoading() {
    document.getElementById('products-table-body').innerHTML = `
        <tr>
            <td colspan="5" class="px-6 py-4">
                <div class="flex items-center justify-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </td>
        </tr>
    `;
    
    document.getElementById('products-grid').innerHTML = `
        <div class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    `;
}

function hideLoading() {
    // Loading will be replaced by actual content in renderProducts
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Load products on page load
    fetchProducts();
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Sidebar toggle (mobile)
    document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);
    document.getElementById('sidebar-overlay').addEventListener('click', toggleSidebar);
    
    // Modal controls
    document.getElementById('new-product-btn').addEventListener('click', () => openModal('create'));
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    document.getElementById('modal-backdrop').addEventListener('click', closeModal);
    
    // Search and filter
    document.getElementById('product-search').addEventListener('input', debounceSearch);
    document.getElementById('global-search').addEventListener('input', function() {
        document.getElementById('product-search').value = this.value;
        debounceSearch();
    });
    document.getElementById('category-filter').addEventListener('change', filterProducts);
    
    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', fetchProducts);
    
    // Form submit
    document.getElementById('product-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const productData = {
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            price: parseFloat(document.getElementById('product-price').value),
            stock: parseInt(document.getElementById('product-stock').value),
            category: document.getElementById('product-category').value
        };
        
        let success;
        if (editingProductId) {
            success = await updateProduct(editingProductId, productData);
        } else {
            success = await createProduct(productData);
        }
        
        if (success) {
            closeModal();
        }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});