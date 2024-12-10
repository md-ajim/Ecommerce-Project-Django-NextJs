
from rest_framework import serializers
from .models import (
    CustomIdentifier,
    ExternalIdentifier,
    Address,
    User,
    Coupon,
    Color,
    Colors,
    Details,
    Product,
    ProductReview,
    Category,
    Warehouse,
    Inventory,
    Wishlist,
    ProductRecommendation,
    Order,
    OrderItem,
    Payment,
    Shipment,
    Currency,
    Price,
    Cart,
    CartItem,
    SalesReport,
    FlashSale,
    UserActivity,
    TotalCart,
    OrderCartItem,
    Favorite
)


# CustomIdentifier Serializer
class CustomIdentifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomIdentifier
        fields = "__all__"


# ExternalIdentifier Serializer
class ExternalIdentifierSerializer(serializers.ModelSerializer):
    custom_identifiers = CustomIdentifierSerializer(many=True)

    class Meta:
        model = ExternalIdentifier
        fields = "__all__"


# Address Serializer
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    external_identifiers = ExternalIdentifierSerializer()
    addresses = AddressSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = "__all__"
        
        
        
class UserSerializer_Profile(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['username','email','first_name','last_name','phone','profile_image']
        


# Coupon Serializer
class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = "__all__"


# Color Serializers
class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = "__all__"




# Add similar serializers for Color2 through Color10 if needed.


class ColorsSerializer(serializers.ModelSerializer):
    color = ColorSerializer(many=True)


    class Meta:
        model = Colors
        fields = "__all__"


# Details Serializer
class DetailsSerializer(serializers.ModelSerializer):
    colors = ColorsSerializer(many=True)

    class Meta:
        model = Details
        fields = "__all__"


# Product Serializer
class ProductSerializer(serializers.ModelSerializer):
    product_details = DetailsSerializer(many=True)
    reviews = serializers.StringRelatedField(many=True)

    class Meta:
        model = Product
        fields = "__all__"



# Favorite Serializer

class FavoriteSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Favorite
        fields = '__all__'

# ProductReview Serializer
class ProductReviewSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ProductReview
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True)

    class Meta:
        model = Category
        fields = [
            "category_name",
            "products",
            "description",
            "category_image",
            "parent_category",
        ]


# Warehouse Serializer
class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = "__all__"


# Inventory Serializer
class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = "__all__"


# Wishlist Serializer
class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = "__all__"


# ProductRecommendation Serializer
class ProductRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductRecommendation
        fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = CartItem
        fields = "__all__"


class CartItemSerializers(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = CartItem
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):

    products = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), many=True  # Allows multiple product IDs
    )

    cart_item = serializers.PrimaryKeyRelatedField(
        queryset=CartItem.objects.all(), many=True  # Allows multiple product IDs
    )

    class Meta:
        model = OrderItem
        fields = "__all__"


# Order Serializer


class OrderSerializer(serializers.ModelSerializer):
    # items = OrderItemSerializer( many=True )
    class Meta:

        model = Order
        fields = [
            "id",
            "user",
            "items",
            "billing_address",
            'shipping_address',
            "total_amount",
            "occurred_at",
            "status",
            "shipment",
            "payment",
        ]


# class OrderSerializer(serializers.ModelSerializer):
#     items = OrderItemSerializer(many=True)  # Allow multiple OrderItems in an Order

#     class Meta:
#         model = Order
#         fields = ['user', 'items',  'billing_address', 'total_amount', 'occurred_at', 'status', 'shipment', 'payment']

#     def create(self, validated_data):
#         items_data = validated_data.pop('items')
#         order = Order.objects.create(**validated_data)


#         # Loop over OrderItems data and create each one associated with this order
#         for item_data in items_data:
#             cart_products = item_data.pop('cart_product')
#             order_item = CartItem.objects.create(cart_products)
#             order_item.cart_product.set(cart_products)  # Associate CartItems
#         return order


# Payment Serializer
# class PaymentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Payment
#         fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(
         queryset= Order.objects.all(), many=True
    )
    class Meta:
        model = Payment
        fields = '__all__'

# Shipment Serializer
class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = "__all__"


# Currency Serializer
class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = "__all__"


# Price Serializer
class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = "__all__"


# Cart Serializer
class CartSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cart
        fields = "__all__"


# CartItem Serializer
class CartItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = CartItem
        fields = "__all__"


# SalesReport Serializer
class SalesReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesReport
        fields = "__all__"


# FlashSale Serializer
class FlashSaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlashSale
        fields = "__all__"


# UserActivity Serializer
class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = "__all__"


class TotalCartSerializer(serializers.ModelSerializer):

    # product_item = ProductSerializer()
    class Meta:
        model = TotalCart
        fields = "__all__"




class OrderItemSerializer_Get(serializers.ModelSerializer):
    cart_item = CartItemSerializers(many=True)
    products = ProductSerializer(many=True)

    class Meta:
        model = OrderItem
        fields = "__all__"



class OrderSerializers_Get(serializers.ModelSerializer):
    
    items = OrderItemSerializer_Get(many=True)

    class Meta:
        model = Order
        fields ='__all__'





class PaymentSerializer_Get(serializers.ModelSerializer):
    shipment =ShipmentSerializer()
    order = OrderSerializers_Get(many=True)
    class Meta:
        model = Payment
        fields = '__all__'