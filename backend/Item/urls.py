# # urls.py
# from django.urls import include, path
# from django.conf import settings
# from django.conf.urls.static import static
# from rest_framework.routers import DefaultRouter
# from .views import ProductViewSet, CategoryViewSet, OrderViewSet, CouponViewSet ,ProductViewSet_custom_filtering
# router = DefaultRouter()
# router.register(r'products', ProductViewSet_custom_filtering)
# router.register(r'categories', CategoryViewSet)
# router.register(r'orders', OrderViewSet)
# router.register(r'coupons', CouponViewSet)

# urlpatterns = [
#     path('', include(router.urls)),
#     path('api-auth/', include('rest_framework.urls')),

# ]
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Initialize the router
router = DefaultRouter()

# Register all viewsets with the router
router.register(r'custom-identifiers', views.CustomIdentifierViewSet)
router.register(r'external-identifiers', views.ExternalIdentifierViewSet)
router.register(r'addresses', views.AddressViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'coupons', views.CouponViewSet)
router.register(r'colors1', views.Color1ViewSet)
# Register other color viewsets if needed (Color2 through Color10)
router.register(r'colors', views.ColorsViewSet)
router.register(r'details', views.DetailsViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'favorite',views.FavoriteViewSet)
router.register(r'product-reviews', views.ProductReviewViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'warehouses', views.WarehouseViewSet)
router.register(r'inventories', views.InventoryViewSet)
router.register(r'wishlists', views.WishlistViewSet)
router.register(r'product-recommendations', views.ProductRecommendationViewSet)
router.register(r'orders', views.OrderViewSets)
router.register(r'order-items', views.OrderItemViewSet)
router.register(r'payments', views.PaymentViewSet)
router.register(r'shipments', views.ShipmentViewSet)
router.register(r'currencies', views.CurrencyViewSet)
router.register(r'prices', views.PriceViewSet)
router.register(r'carts', views.CartViewSet)
router.register(r'cart-items', views.CartItemViewSet)
router.register(r'sales-reports', views.SalesReportViewSet)
router.register(r'flash-sales', views.FlashSaleViewSet)
router.register(r'user-activities', views.UserActivityViewSet)
router.register(r'total-item',views.TotalCartViewSet)


# Include the router URLs
urlpatterns = [
    path('', include(router.urls)),
    path('cart-item-get/',views.Cart_ItemViewSet_get.as_view({'get':'list'})),
    path('api/create-payment-intent/',views.CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('payments/', views.PaymentView.as_view(), name='payment'),
    path('get_order/', views.OrderViewSet_Get.as_view({'get':'list'}), name='get_order'),
    path('get_order_item/', views.OrderItemViewSet_Get.as_view({'get':'list'}), name='get_order_item'),
    path('payments_get/', views.PaymentViewSet_Get.as_view({'get':'list'}), name='payments_get'),
    path('get_users/', views.UserViewsGet.as_view(), name='user-lists'),
    
    
    path('get_user/<int:pk>/', views.UserViewSet_Profile.as_view(), name='user-list')

    
    
]


if settings.DEBUG:  # Only serve media in development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)