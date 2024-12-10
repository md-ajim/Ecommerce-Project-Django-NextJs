from django.urls import path
from .views import PostMultipleOrderView , OrderViewSets , PaymentSuccessViewSet , OrderSuccessViewSet , OrderSuccessViewSet_get
from rest_framework.routers import DefaultRouter
from django.urls import include

router = DefaultRouter()


router.register(r'order',OrderViewSets)
router.register(r'payment-paid',PaymentSuccessViewSet)
router.register(r'order-success',OrderSuccessViewSet)


urlpatterns = [
    path('post-multiple-order/', PostMultipleOrderView.as_view(), name='post-multiple-order'),
    path('order-success-get/',OrderSuccessViewSet_get.as_view({'get':'list'}) , name='order-success'),
    path('', include(router.urls)),
]

