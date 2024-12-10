from rest_framework import routers 
from .views import (
     register_view , AccountActivationView , logIn_view , SocialLoginView ,OTPRequestView, OTPVerifyView , PasswordResetRequestView ,PasswordResetRequestView,

PasswordResetView
)
from django.urls import path,include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

urlpatterns = [
    path('register/', register_view, name='register' ),
    path('activate/<str:uidb64>/<str:token>/', AccountActivationView.as_view(), name='activate'),
    path('login/', logIn_view, name='login'),
    path('oath2login/', SocialLoginView.as_view(),  name='social_login'),    
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('otp-request/', OTPRequestView.as_view(), name='otp_request'),
    path('otp-verify/', OTPVerifyView.as_view(), name='otp_verify'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/<uidb64>/<token>/', PasswordResetView.as_view(), name='password_reset_confirm'),
    
]
