import os
import sys
import getpass
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from modulos.Productos.Core.infraestructura.models import CategoriaORM, ProductoORM

class Command(BaseCommand):
    help = (
        "Puebla la base de datos con datos DEMOSTRATIVOS de categorías y recursos "
        "para pruebas del Marketplace CINNDET UPN y crea superusuario de desarrollo si se provee contraseña segura."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--no-admin",
            action="store_true",
            help="Omite la creación del superusuario administrador.",
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE(
            "Iniciando carga de datos DEMOSTRATIVOS para entorno de desarrollo/pruebas (Marketplace CINNDET UPN)..."
        ))

        # 1. Superusuario Administrador de Desarrollo
        if not options.get("no_admin"):
            admin_username = os.environ.get("SEED_ADMIN_USERNAME", "admin@upn.edu.co").strip()
            admin_email = os.environ.get("SEED_ADMIN_EMAIL", "admin@upn.edu.co").strip()
            admin_password = os.environ.get("SEED_ADMIN_PASSWORD", "").strip()

            if not User.objects.filter(username=admin_username).exists():
                if not admin_password:
                    # Si no está en variable de entorno, intentar solicitar de forma interactiva si hay TTY
                    if sys.stdin and hasattr(sys.stdin, "isatty") and sys.stdin.isatty():
                        self.stdout.write(self.style.WARNING(
                            f"Variable SEED_ADMIN_PASSWORD no encontrada en el entorno. Ingresa la contraseña para '{admin_username}':"
                        ))
                        try:
                            admin_password = getpass.getpass("Contraseña del Superusuario: ").strip()
                        except Exception:
                            admin_password = ""

                if admin_password and len(admin_password) >= 8:
                    User.objects.create_superuser(
                        username=admin_username,
                        email=admin_email,
                        password=admin_password,
                        first_name="Administrador",
                        last_name="CINNDET Demo"
                    )
                    self.stdout.write(self.style.SUCCESS(
                        f"Superusuario '{admin_username}' creado exitosamente (contraseña no mostrada por seguridad)."
                    ))
                else:
                    self.stdout.write(self.style.WARNING(
                        f"AVISO: No se creó el superusuario '{admin_username}' porque no se especificó "
                        f"SEED_ADMIN_PASSWORD (mínimo 8 caracteres) en variables de entorno ni por terminal interactiva."
                    ))
            else:
                self.stdout.write(self.style.WARNING(f"El superusuario '{admin_username}' ya existe."))

        # 2. Categorías Demostrativas
        categorias_data = [
            {
                "name": "Inteligencia Artificial y Analítica",
                "slug": "ia",
                "description": "Modelos pedagógicos, tutores virtuales y asistentes analíticos para el aprendizaje (Datos Demostrativos)."
            },
            {
                "name": "Gamificación y Aprendizaje Lúdico",
                "slug": "gamificacion",
                "description": "Metodologías basadas en juegos, insignias y dinámicas interactivas de aula (Datos Demostrativos)."
            },
            {
                "name": "Realidad Virtual y Simulación",
                "slug": "vr",
                "description": "Laboratorios inmersivos, simuladores 3D y entornos virtuales de experimentación (Datos Demostrativos)."
            },
            {
                "name": "Aplicaciones y Software Educativo",
                "slug": "apps",
                "description": "Herramientas de evaluación formativa, bancos de reactivos y gestión pedagógica (Datos Demostrativos)."
            },
        ]

        cat_map = {}
        for c in categorias_data:
            cat, created = CategoriaORM.objects.update_or_create(
                slug=c["slug"],
                defaults={
                    "name": c["name"],
                    "description": c["description"],
                    "is_active": True
                }
            )
            cat_map[c["slug"]] = cat
            estado = "creada" if created else "actualizada"
            self.stdout.write(f"Categoría demostrativa '{cat.name}' ({estado}).")

        # 3. Recursos Demostrativos (Identificados claramente como catálogo de prototipo/demostración)
        recursos_demo = [
            # SECCIÓN: Soluciones Destacadas
            {
                "title": "[Demo] Tutor Académico Inteligente UPN",
                "description": "Prototipo demostrativo de tutoría asistida con analítica de aprendizaje predictiva para orientación adaptativa.",
                "short_description": "Prototipo de sistema inteligente con análisis predictivo para tutorías.",
                "category_slug": "ia",
                "resource_type": "herramienta_digital",
                "price": Decimal("0.00"),
                "section": "destacadas",
                "is_featured": True,
                "external_url": "https://www.upn.edu.co",
                "image_url": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=800&fit=crop",
            },
            {
                "title": "[Demo] Kit de Gamificación Pedagógica",
                "description": "Colección demostrativa de recursos, insignias y dinámicas lúdicas para el aula presencial y virtual.",
                "short_description": "Lleva dinámicas de juego formativo al aula con insignias y desafíos.",
                "category_slug": "gamificacion",
                "resource_type": "recurso_educativo",
                "price": Decimal("0.00"),
                "section": "destacadas",
                "is_featured": True,
                "external_url": "https://www.upn.edu.co",
                "image_url": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop",
            },
            {
                "title": "[Demo] Laboratorio Virtual de Ciencias VR",
                "description": "Simulador inmersivo demostrativo para prácticas experimentales de física y química en entornos 3D.",
                "short_description": "Laboratorio inmersivo de realidad virtual para experimentos seguros.",
                "category_slug": "vr",
                "resource_type": "herramienta_digital",
                "price": Decimal("0.00"),
                "section": "destacadas",
                "is_featured": True,
                "external_url": "https://www.upn.edu.co",
                "image_url": "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=300&fit=crop",
            },
            {
                "title": "[Demo] Plataforma de Evaluación Adaptativa",
                "description": "Herramienta demostrativa para la formulación de evaluaciones que calibran dificultad según nivel del estudiante.",
                "short_description": "Exámenes formativos adaptativos con calibración de nivel en tiempo real.",
                "category_slug": "apps",
                "resource_type": "herramienta_digital",
                "price": Decimal("0.00"),
                "section": "destacadas",
                "is_featured": False,
                "external_url": "https://www.upn.edu.co",
                "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
            },
            {
                "title": "[Demo] Asistente de Redacción Académica",
                "description": "Servicio de orientación de estilo, estructura argumentativa y citación académica para trabajos de investigación.",
                "short_description": "Revisión de estilo y coherencia argumentativa para producción académica.",
                "category_slug": "ia",
                "resource_type": "servicio",
                "price": Decimal("0.00"),
                "section": "destacadas",
                "is_featured": False,
                "external_url": "https://www.upn.edu.co",
                "image_url": "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=600&h=400&fit=crop",
            },
            {
                "title": "[Demo] Panel de Analítica para Gestión Docente",
                "description": "Dashboard para visualización de progreso grupal, seguimiento pedagógico y alertas tempranas.",
                "short_description": "Indicadores de avance y desempeño para gestión pedagógica informada.",
                "category_slug": "apps",
                "resource_type": "herramienta_digital",
                "price": Decimal("0.00"),
                "section": "destacadas",
                "is_featured": False,
                "external_url": "https://www.upn.edu.co",
                "image_url": "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=774&auto=format&fit=crop",
            },

            # SECCIÓN: Innovaciones del Mes
            {
                "title": "[Demo] Agente Conversacional Pedagógico",
                "description": "Asistente virtual demostrativo para resolución de dudas metodológicas y orientación curricular.",
                "short_description": "Asistente conversacional para apoyo pedagógico y curricular.",
                "category_slug": "ia",
                "resource_type": "servicio",
                "price": Decimal("0.00"),
                "section": "mes",
                "is_featured": False,
                "external_url": "https://www.upn.edu.co",
                "image_url": "https://images.unsplash.com/photo-1684369175833-4b445ad6bfb5?q=80&w=796&auto=format&fit=crop",
            },
            {
                "title": "[Demo] Sistema de Misiones y Logros Escolares",
                "description": "Plataforma gamificada para estructuración de secuencias didácticas basadas en retos formativos.",
                "short_description": "Plataforma integral de misiones, logros y desafíos pedagógicos.",
                "category_slug": "gamificacion",
                "resource_type": "recurso_educativo",
                "price": Decimal("0.00"),
                "section": "mes",
                "is_featured": False,
                "external_url": "https://www.upn.edu.co",
                "image_url": "https://images.unsplash.com/photo-1717588282722-ab1beb899c26?q=80&w=1034&auto=format&fit=crop",
            },
            {
                "title": "[Demo] Simulador Inmersivo de Reacciones Químicas",
                "description": "Módulos 3D demostrativos para exploración de enlaces moleculares y transformaciones químicas.",
                "short_description": "Experimentos interactivos 3D para apoyo a la enseñanza de la química.",
                "category_slug": "vr",
                "resource_type": "herramienta_digital",
                "price": Decimal("0.00"),
                "section": "mes",
                "is_featured": False,
                "external_url": "https://www.upn.edu.co",
                "image_url": "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&h=400&fit=crop",
            },
            {
                "title": "[Demo] Banco Curricular de Reactivos",
                "description": "Repositorio demostrativo para estructuración de ítems de evaluación formativa y sumativa.",
                "short_description": "Generación y control de reactivos e instrumentos evaluativos.",
                "category_slug": "apps",
                "resource_type": "recurso_educativo",
                "price": Decimal("0.00"),
                "section": "mes",
                "is_featured": False,
                "external_url": "https://www.upn.edu.co",
                "image_url": "https://images.unsplash.com/photo-1725404343886-a111bc5555c1?q=80&w=788&auto=format&fit=crop",
            },

            # SECCIÓN: Colección Recomendada
            {
                "title": "[Demo] Simulador Didáctico de Física",
                "description": "Prácticas interactivas demostrativas para mecánica clásica y óptica en entornos virtuales.",
                "short_description": "Simulaciones interactivas para docencia en ciencias naturales.",
                "category_slug": "vr",
                "resource_type": "recurso_educativo",
                "price": Decimal("0.00"),
                "section": "recomendadas",
                "is_featured": True,
                "external_url": "https://www.upn.edu.co",
                "image_url": "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=500&h=400&fit=crop",
            },
            {
                "title": "[Demo] Repositorio de Recursos Pedagógicos Abiertos",
                "description": "Catálogo de objetos de aprendizaje, guías didácticas y secuencias formativas de acceso abierto.",
                "short_description": "Objetos de aprendizaje y secuencias didácticas de libre consulta.",
                "category_slug": "apps",
                "resource_type": "recurso_educativo",
                "price": Decimal("0.00"),
                "section": "recomendadas",
                "is_featured": False,
                "external_url": "https://www.upn.edu.co",
                "image_url": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&h=400&fit=crop",
            },
            {
                "title": "[Demo] Taller de Capacitación en Tecnologías Inmersivas",
                "description": "Taller formativo para docentes sobre diseño e integración de tecnologías inmersivas en el currículo.",
                "short_description": "Capacitación docente en diseño de experiencias inmersivas.",
                "category_slug": "vr",
                "resource_type": "capacitacion",
                "price": Decimal("0.00"),
                "section": "recomendadas",
                "is_featured": False,
                "external_url": "https://www.upn.edu.co",
                "image_url": "https://images.unsplash.com/photo-1758012228738-4f2b6e91ad04?q=80&w=870&auto=format&fit=crop",
            },
        ]

        creados = 0
        actualizados = 0
        for r in recursos_demo:
            cat = cat_map.get(r["category_slug"])
            if not cat:
                continue
            obj, created = ProductoORM.objects.update_or_create(
                title=r["title"],
                defaults={
                    "description": r["description"],
                    "short_description": r["short_description"],
                    "category": cat,
                    "resource_type": r["resource_type"],
                    "price": r["price"],
                    "section": r["section"],
                    "is_featured": r["is_featured"],
                    "external_url": r["external_url"],
                    "image_url": r["image_url"],
                    "is_active": True,
                }
            )
            if created:
                creados += 1
            else:
                actualizados += 1

        self.stdout.write(self.style.SUCCESS(
            f"Carga de datos demostrativos finalizada: {creados} recursos creados, {actualizados} actualizados."
        ))
