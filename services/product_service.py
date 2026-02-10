from typing import List, Optional, Dict
from models.product import Product, ProductCreate, ProductUpdate
from datetime import datetime
import logging

class ProductService:
    """Servicio para gestionar productos (in-memory storage)"""
    
    def __init__(self):
        self.products: Dict[str, Product] = {}
        self._init_sample_data()
    
    def _init_sample_data(self):
        """Inicializar con datos de ejemplo"""
        sample_products = [
            ProductCreate(
                name="Laptop Dell XPS 13",
                description="Laptop ultradelgada de alto rendimiento",
                price=1299.99,
                stock=15,
                category="Electronics"
            ),
            ProductCreate(
                name="Mouse Logitech MX Master 3",
                description="Mouse ergonómico inalámbrico",
                price=99.99,
                stock=50,
                category="Accessories"
            ),
            ProductCreate(
                name="Teclado Mecánico Keychron K2",
                description="Teclado mecánico compacto RGB",
                price=89.99,
                stock=30,
                category="Accessories"
            )
        ]
        
        for product_data in sample_products:
            product = Product(**product_data.model_dump())
            self.products[product.id] = product
    
    def get_all(self) -> List[Product]:
        """Obtener todos los productos"""
        logging.info(f"Obteniendo todos los productos. Total: {len(self.products)}")
        return list(self.products.values())
    
    def get_by_id(self, product_id: str) -> Optional[Product]:
        """Obtener producto por ID"""
        product = self.products.get(product_id)
        if product:
            logging.info(f"Producto encontrado: {product_id}")
        else:
            logging.warning(f"Producto no encontrado: {product_id}")
        return product
    
    def create(self, product_data: ProductCreate) -> Product:
        """Crear nuevo producto"""
        product = Product(**product_data.model_dump())
        self.products[product.id] = product
        logging.info(f"Producto creado: {product.id} - {product.name}")
        return product
    
    def update(self, product_id: str, product_data: ProductUpdate) -> Optional[Product]:
        """Actualizar producto existente"""
        product = self.products.get(product_id)
        if not product:
            logging.warning(f"Intento de actualizar producto inexistente: {product_id}")
            return None
        
        # Actualizar solo los campos proporcionados
        update_data = product_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(product, field, value)
        
        product.updated_at = datetime.utcnow()
        logging.info(f"Producto actualizado: {product_id}")
        return product
    
    def delete(self, product_id: str) -> bool:
        """Eliminar producto"""
        if product_id in self.products:
            del self.products[product_id]
            logging.info(f"Producto eliminado: {product_id}")
            return True
        logging.warning(f"Intento de eliminar producto inexistente: {product_id}")
        return False

# Instancia global del servicio (singleton)
product_service = ProductService()