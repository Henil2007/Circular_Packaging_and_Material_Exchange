import os
from dotenv import load_dotenv
from supabase import create_client, Client
import httpx

# Disable SSL verification for local development
_original_init = httpx.Client.__init__
def _patched_init(self, *args, **kwargs):
    kwargs['verify'] = False
    _original_init(self, *args, **kwargs)
httpx.Client.__init__ = _patched_init

_original_async_init = httpx.AsyncClient.__init__
def _patched_async_init(self, *args, **kwargs):
    kwargs['verify'] = False
    _original_async_init(self, *args, **kwargs)
httpx.AsyncClient.__init__ = _patched_async_init

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: Supabase credentials not found in .env")

def get_db_client() -> Client:
    if SUPABASE_URL and SUPABASE_KEY:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    return None

db = get_db_client()
