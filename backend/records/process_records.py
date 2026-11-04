from dataclasses import dataclass
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from supabase import Client
from supabase_auth.errors import AuthApiError

if __package__ and "." in __package__:
    from ..db.db_connection import SupabaseConnection
else:
    from db.db_connection import SupabaseConnection

router = APIRouter(prefix="/record", tags=["records"])
bearer_scheme = HTTPBearer()


class CreateRecordRequest(BaseModel):
    record_id: int
    record_obj: dict[str, Any]


@dataclass
class AuthenticatedDatabase:
    supabase: Client
    user_id: str


def get_authenticated_database(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
) -> AuthenticatedDatabase:
    access_token = credentials.credentials
    db_conn: SupabaseConnection = request.app.state.db_conn
    supabase = db_conn.for_user(access_token)
    try:
        user_response = supabase.auth.get_user(access_token)
    except AuthApiError as error:
        raise HTTPException(
            status_code=401, detail="Invalid or expired access token"
        ) from error

    if user_response is None or user_response.user is None:
        raise HTTPException(status_code=401, detail="Invalid or expired access token")

    return AuthenticatedDatabase(supabase=supabase, user_id=user_response.user.id)


@router.get("/{record_id}")
def get_record(
    record_id: str,
    auth: AuthenticatedDatabase = Depends(get_authenticated_database),
):
    response = (
        auth.supabase.table("record").select("*").eq("id", int(record_id)).execute()
    )
    if not response.data:
        raise HTTPException(status_code=404, detail="Record not found")
    return response.data[0]


@router.post("/add")
def create_record(
    request: CreateRecordRequest,
    auth: AuthenticatedDatabase = Depends(get_authenticated_database),
):
    record = {
        **request.record_obj,
        "id": request.record_id,
        "owner_id": auth.user_id,
    }
    response = auth.supabase.table("record").insert(record).select("*").execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Record was not created")
    return response.data[0]


@router.patch("/add")
def update_record(
    record_id: int,
    record_obj: dict[str, Any],
    auth: AuthenticatedDatabase = Depends(get_authenticated_database),
):
    response = (
        auth.supabase.table("record")
        .update(record_obj)
        .eq("id", int(record_id))
        .select("*")
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=404, detail="Record not found")
    return response.data[0]


@router.delete("/{record_id}")
def delete_record(
    record_id: str,
    auth: AuthenticatedDatabase = Depends(get_authenticated_database),
):
    response = (
        auth.supabase.table("record")
        .delete()
        .eq("id", int(record_id))
        .select("*")
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=404, detail="Record not found")
    return response.data[0]
