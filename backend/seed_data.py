"""
Script independiente de datos semilla para Marketplace CINNDET UPN.
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.core.management import call_command

if __name__ == "__main__":
    print("Ejecutando seed_db...")
    call_command("seed_db")
