# filters.py
import django_filters
from .models import Product

class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    category = django_filters.CharFilter(field_name="categories__category_name", lookup_expr='iexact')
    
    class Meta:
        model = Product
        fields = ['categories__category_name', 'price', 'product_details__color', 'product_details__size']
