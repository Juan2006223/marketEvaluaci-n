import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from marketplace.models import Category, Product

# Create superuser
if not User.objects.filter(username='admin@upn.edu.co').exists():
    User.objects.create_superuser('admin@upn.edu.co', 'admin@upn.edu.co', 'admin123')
    print("Superuser created: admin@upn.edu.co / admin123")
elif not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("Superuser created: admin / admin123")

# Create initial categories
categories_data = [
    {'name': 'IA', 'slug': 'ia'},
    {'name': 'Gamificación', 'slug': 'gamificacion'},
    {'name': 'VR', 'slug': 'vr'},
    {'name': 'Apps', 'slug': 'apps'},
]

for cat in categories_data:
    Category.objects.get_or_create(name=cat['name'], slug=cat['slug'])

# Create initial products
products_data = [
    # SOLUCIONES DESTACADAS (Original HTML lines 456-621)
    {
        'title': 'IA Tutoring',
        'description': 'Sistema inteligente con análisis predictivo para tutorías personalizadas.',
        'short_description': 'Sistema inteligente con análisis predictivo',
        'price': 150,
        'category_slug': 'ia',
        'image_url': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=800&fit=crop',
        'section': 'destacadas'
    },
    {
        'title': 'Kit Gamificación',
        'description': 'Lleva el juego al aula con puntos, insignias y desafíos dinámicos.',
        'short_description': 'Puntos, insignias y desafíos',
        'price': 120,
        'category_slug': 'gamificacion',
        'image_url': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop',
        'section': 'destacadas'
    },
    {
        'title': 'VR Lab',
        'description': 'Laboratorio de realidad virtual para experimentos seguros y envolventes.',
        'short_description': 'Laboratorio virtual',
        'price': 200,
        'category_slug': 'vr',
        'image_url': 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=300&fit=crop',
        'section': 'destacadas'
    },
    {
        'title': 'App Evaluación',
        'description': 'Exámenes adaptativos que se ajustan al nivel del estudiante en tiempo real.',
        'short_description': 'Exámenes adaptativos',
        'price': 90,
        'category_slug': 'apps',
        'image_url': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        'section': 'destacadas'
    },
    {
        'title': 'Asistente de Redacción IA',
        'description': 'Corrección y estilo académico asistido por inteligencia artificial.',
        'short_description': 'Corrección y estilo académico',
        'price': 95,
        'category_slug': 'ia',
        'image_url': 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=600&h=400&fit=crop',
        'section': 'destacadas'
    },
    {
        'title': 'Panel Analytics Aula',
        'description': 'Indicadores de avance y desempeño para una gestión educativa basada en datos.',
        'short_description': 'Indicadores de avance',
        'price': 140,
        'category_slug': 'apps',
        'image_url': 'https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=774&auto=format&fit=crop',
        'section': 'destacadas'
    },
    
    # INNOVACIONES DEL MES (Original HTML lines 664-825)
    {
        'title': 'ChatBot IA',
        'description': 'Asistente virtual educativo con procesamiento de lenguaje natural (NLP).',
        'short_description': 'Asistente virtual educativo con NLP',
        'price': 85,
        'category_slug': 'ia',
        'image_url': 'https://images.unsplash.com/photo-1684369175833-4b445ad6bfb5?q=80&w=796&auto=format&fit=crop',
        'section': 'mes'
    },
    {
        'title': 'Gamificación Escolar',
        'description': 'Plataforma integral de misiones, logros y rankings para colegios.',
        'short_description': 'Misiones, logros y rankings',
        'price': 110,
        'category_slug': 'gamificacion',
        'image_url': 'https://images.unsplash.com/photo-1717588282722-ab1beb899c26?q=80&w=1034&auto=format&fit=crop',
        'section': 'mes'
    },
    {
        'title': 'Lab VR Química',
        'description': 'Experimentos inmersivos 3D para laboratorios de química de secundaria.',
        'short_description': 'Experimentos inmersivos 3D',
        'price': 180,
        'category_slug': 'vr',
        'image_url': 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&h=400&fit=crop',
        'section': 'mes'
    },
    {
        'title': 'Banco de Reactivos',
        'description': 'Generación y control de ítems para bancos de preguntas automatizados.',
        'short_description': 'Generación y control de ítems',
        'price': 70,
        'category_slug': 'apps',
        'image_url': 'https://images.unsplash.com/photo-1725404343886-a111bc5555c1?q=80&w=788&auto=format&fit=crop',
        'section': 'mes'
    },
    {
        'title': 'Rúbricas Inteligentes',
        'description': 'Evaluación asistida por IA para una retroalimentación más rápida y justa.',
        'short_description': 'Evaluación asistida por IA',
        'price': 95,
        'category_slug': 'ia',
        'image_url': 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=800&h=600&fit=crop',
        'section': 'mes'
    },

    # COLECCIÓN RECOMENDADA (Original HTML lines 846-960)
    {
        'title': 'Simulador de Laboratorio',
        'description': 'Prácticas interactivas en entornos virtuales 3D para ingeniería.',
        'short_description': 'Prácticas interactivas en entornos virtuales 3D.',
        'price': 180,
        'category_slug': 'vr',
        'image_url': 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=500&h=400&fit=crop',
        'section': 'recomendadas'
    },
    {
        'title': 'Gestor de Clases Virtuales',
        'description': 'Planifica sesiones, tareas y reportes académicos de forma eficiente.',
        'short_description': 'Planifica sesiones, tareas y reportes académicos.',
        'price': 120,
        'category_slug': 'apps',
        'image_url': 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500&h=400&fit=crop',
        'section': 'recomendadas'
    },
    {
        'title': 'Biblioteca Virtual',
        'description': 'Acceso a miles de recursos académicos digitales y libros interactivos.',
        'short_description': 'Acceso a miles de recursos académicos digitales.',
        'price': 95,
        'category_slug': 'apps',
        'image_url': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&h=400&fit=crop',
        'section': 'recomendadas'
    },
    {
        'title': 'Analizador de Desempeño',
        'description': 'Evaluaciones asistidas con IA educativa para medir el progreso real.',
        'short_description': 'Evaluaciones asistidas con IA educativa.',
        'price': 150,
        'category_slug': 'ia',
        'image_url': 'https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?w=500&h=400&fit=crop',
        'section': 'recomendadas'
    },
    {
        'title': 'Panel de Seguimiento',
        'description': 'Visualiza métricas de avance y desempeño en tiempo real.',
        'short_description': 'Visualiza métricas de avance y desempeño.',
        'price': 110,
        'category_slug': 'apps',
        'image_url': 'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?q=80&w=873&auto=format&fit=crop',
        'section': 'recomendadas'
    },
    {
        'title': 'Aula Interactiva 360',
        'description': 'Entornos inmersivos para clases presenciales y remotas de nueva generación.',
        'short_description': 'Entornos inmersivos para clases presenciales y remotas.',
        'price': 220,
        'category_slug': 'vr',
        'image_url': 'https://images.unsplash.com/photo-1758012228738-4f2b6e91ad04?q=80&w=870&auto=format&fit=crop',
        'section': 'recomendadas'
    }
]

# Clean existing products to avoid duplicates during seed
Product.objects.all().delete()

for p in products_data:
    try:
        cat = Category.objects.get(slug=p['category_slug'])
        Product.objects.create(
            title=p['title'],
            description=p['description'],
            short_description=p['short_description'],
            price=p['price'],
            category=cat,
            image_url=p['image_url'],
            section=p['section']
        )
    except Exception as e:
        print(f"Error creating product {p['title']}: {e}")

print("Seed data complete. All original products restored.")
