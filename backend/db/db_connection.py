from supabase import Client, create_client
from supabase.client import ClientOptions


class SupabaseConnection:
    def __init__(self, url, key):
        self.url = url
        self.key = key
        self.supabase: Client = create_client(
            url, key, options=ClientOptions(schema="public")
        )

    def for_user(self, access_token: str) -> Client:
        client = create_client(
            self.url, self.key, options=ClientOptions(schema="public")
        )
        client.postgrest.auth(access_token)
        return client
