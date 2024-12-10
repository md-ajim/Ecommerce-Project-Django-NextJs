from rest_framework import serializers
from .models import Product, Order, OrderItem , PaymentSuccess , OrderSuccess

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'images', 'price', 'quantity', 'currency', 'metadata']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  # Nested serializer to include product details

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)  # Nested serializer for order items

    class Meta:
        model = Order
        fields = ['id', 'customer_email', 'tax_rate_id', 'metadata', 'items', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            product_data = item_data.pop('product')
            product, _ = Product.objects.get_or_create(**product_data)
            OrderItem.objects.create(order=order, product=product, **item_data)
        return order


class PaymentSuccessSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PaymentSuccess
        fields= '__all__'
        
        
        
class OrderSuccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderSuccess
        fields = '__all__'     


class OrderSuccessSerializer_get(serializers.ModelSerializer):
    order = OrderSerializer()
    payment = PaymentSuccessSerializer()
    class Meta:
        model = OrderSuccess
        fields = '__all__'     
