from django.contrib import admin
from .models import (
    CustomIdentifier,
    ExternalIdentifier,
    Address,
    User,
    Coupon,
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
    Notification,
    Color,
    Colors,
    TotalCart,
     OrderCartItem
)

# Register your models here.
admin.site.register(CustomIdentifier)
admin.site.register(ExternalIdentifier)
admin.site.register(Address)
admin.site.register(User)
admin.site.register(Coupon)
admin.site.register(Details)
admin.site.register(Product)
admin.site.register(ProductReview)
admin.site.register(Category)
admin.site.register(Warehouse)
admin.site.register(Inventory)
admin.site.register(Wishlist)
admin.site.register(ProductRecommendation)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Payment)
admin.site.register(Shipment)
admin.site.register(Currency)
admin.site.register(Price)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(SalesReport)
admin.site.register(FlashSale)
admin.site.register(UserActivity)
admin.site.register(Notification)
admin.site.register(Color)
admin.site.register(Colors)
admin.site.register(TotalCart)
admin.site.register(OrderCartItem)


