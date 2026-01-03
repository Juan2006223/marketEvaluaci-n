from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class Product(models.Model):
    SECTION_CHOICES = [
        ('destacadas', 'Soluciones Destacadas'),
        ('mes', 'Innovaciones del Mes'),
        ('recomendadas', 'Colección Recomendada'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    short_description = models.CharField(max_length=500, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    image_url = models.URLField(max_length=1000, blank=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    section = models.CharField(max_length=20, choices=SECTION_CHOICES, default='destacadas')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
