from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    full_name: str
    phone_number: str # Formato internacional: 5511999999999
    is_active: bool = True

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

# Modelo para o Casal/Grupo
class CoupleBase(SQLModel):
    user_id: int = Field(foreign_key="user.id")
    partner_name: str
    partner_phone: str # Formato internacional
    group_jid: Optional[str] = Field(default=None) # ID do grupo no WhatsApp (ex: 12345@g.us)
    status: str = "pending" # pending, active, archived

class Couple(CoupleBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CoupleCreate(SQLModel):
    partner_name: str
    partner_phone: str

class CoupleRead(CoupleBase):
    id: int
