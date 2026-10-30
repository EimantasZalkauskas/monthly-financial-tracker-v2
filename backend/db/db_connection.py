from supabase import Client, create_client
from supabase.client import ClientOptions


class SupabaseConnection:
    def __init__(self, url, key):
        self.supabase: Client = create_client(
            url, key, options=ClientOptions(schema="public")
        )
