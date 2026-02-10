from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
import uuid

class ProductBase(BaseModel):
    """Base model para Product"""
    name: str = Field(..., min_length=1, max_length=100, description="Nombre del producto")
    description: Optional[str] = Field(None, max_length=500, description="Descripción del producto")
    price: float = Field(..., gt=0, description="Precio debe ser mayor a 0")
    stock: int = Field(..., ge=0, description="Stock no puede ser negativo")
    category: str = Field(..., min_length=1, description="Categoría del producto")
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('El nombre no puede estar vacío')
        return v.strip()
    
    @validator('price')
    def price_max_two_decimals(cls, v):
        return round(v, 2)

class ProductCreate(ProductBase):
    """Model para crear un producto"""
    pass

class ProductUpdate(BaseModel):
    """Model para actualizar un producto (todos los campos opcionales)"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    category: Optional[str] = Field(None, min_length=1)

class Product(ProductBase):
    """Model completo con metadata"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }