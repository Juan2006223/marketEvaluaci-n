from django.db import migrations, models


def crear_secciones_iniciales(apps, schema_editor):
    Seccion = apps.get_model("productos", "SeccionORM")
    for orden, nombre, slug, descripcion in (
        (10, "Soluciones Destacadas", "destacadas", "Recursos principales del Marketplace."),
        (20, "Innovaciones del Mes", "mes", "Novedades y recursos recientes."),
        (30, "Colección Recomendada", "recomendadas", "Selección institucional recomendada."),
        (90, "Catálogo General", "general", "Recursos disponibles fuera de las colecciones destacadas."),
    ):
        Seccion.objects.get_or_create(slug=slug, defaults={
            "name": nombre, "description": descripcion, "display_order": orden, "is_active": True,
        })


class Migration(migrations.Migration):
    dependencies = [("productos", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="SeccionORM",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100)),
                ("slug", models.SlugField(max_length=100, unique=True)),
                ("description", models.TextField(blank=True, default="")),
                ("display_order", models.PositiveIntegerField(default=0)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"db_table": "marketplace_section", "ordering": ["display_order", "name"]},
        ),
        migrations.AddField(
            model_name="productoorm",
            name="image_data",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.RunPython(crear_secciones_iniciales, migrations.RunPython.noop),
    ]
