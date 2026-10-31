from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request

if __package__ and "." in __package__:
    from ..db.db_connection import SupabaseConnection
else:
    from db.db_connection import SupabaseConnection

router = APIRouter(prefix="/user", tags=["users"])


def get_db_connection(request: Request) -> SupabaseConnection:
    return request.app.state.db_conn


@router.get("/{user_id}")
def get_user(
    user_id: UUID,
    db_conn: SupabaseConnection = Depends(get_db_connection),
) -> dict[str, Any]:
    response = (
        db_conn.supabase.table("user")
        .select("*")
        .eq("id", str(user_id))
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")
    return response.data[0]


@router.patch("/{user_id}")
def update_user(
    user_id: UUID,
    user: dict[str, Any],
    db_conn: SupabaseConnection = Depends(get_db_connection),
) -> dict[str, Any]:
    response = (
        db_conn.supabase.table("user")
        .update(user)
        .eq("id", str(user_id))
        .select("*")
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")
    return response.data[0]


@router.delete("/{user_id}")
def delete_user(
    user_id: UUID,
    db_conn: SupabaseConnection = Depends(get_db_connection),
) -> dict[str, Any]:
    response = (
        db_conn.supabase.table("user")
        .delete()
        .eq("id", str(user_id))
        .select("*")
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")
    return response.data[0]
