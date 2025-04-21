from django.shortcuts import render
from rest_framework.decorators import api_view , permission_classes
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.response import Response
from User.serializers import UserSerializer, LoginSerializer, SocialSerializer
from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from User.utlis import send_activation_email, send_password_reset_email
from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework.views import APIView
from django.http.response import HttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth import login
from social_django.utils import load_backend, load_strategy
from social_core.backends.oauth import BaseOAuth2
from social_core.exceptions import MissingBackend, AuthTokenError, AuthForbidden
from rest_framework_jwt.settings import api_settings
from rest_framework import generics, permissions
from requests.exceptions import HTTPError
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
import random
from django.conf import settings
from .models import OTP
from datetime import timedelta
from .serializers import (
    OTPRequestSerializer,
    OTPVerifySerializer,
    PasswordResetRequestSerializer,
    PasswordResetSerializers,
)

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags



jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER







@api_view(["POST"])
@permission_classes([AllowAny])  # Use decorator to set AllowAny permission
def logIn_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]
        remember_me = serializer.validated_data["remember_me"]

        # Authenticate the user
        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)

            # Customize token lifetime based on 'remember_me'
            if remember_me:
                # Example: 356 days for "Remember Me"
                refresh.set_exp(lifetime=timedelta(days=365))
            else:
                # Default token lifetime (for example: 1 day)
                refresh.set_exp(lifetime=timedelta(days=1))

            return Response(
                {   
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            )
        else:
            return Response(
                {"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(["POST"])
@permission_classes([AllowAny]) 
def register_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate Token or JWT
        refresh = RefreshToken.for_user(user)
        
        # Generate activation link
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        activation_link = f"http://localhost:3000/activate/{uid}/{refresh.access_token}"

        # Send activation email
        send_activation_email(user.username, user.email, activation_link)

        return Response({
            "detail": "User registered successfully. Activation email sent.",
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AccountActivationView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, uidb64, token):
        try:
            # Decode UID and get user
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return HttpResponse("User not found.", status=404)

        # Validate the JWT token
        try:
            access_token = AccessToken(token)
            if access_token["user_id"] != user.id:
                return HttpResponse("Invalid token for this user.", status=400)
        except Exception as e:
            return HttpResponse(f"Token invalid: {str(e)}", status=400)

        # Check if the user is already active
        if user.is_active:
            return HttpResponse("Activation link has already been used.", status=400)

        # Activate the user account
        user.is_active = True
        user.save()

        return HttpResponse("Your account has been activated successfully!", status=200)


@method_decorator(csrf_exempt, name="dispatch")
class SocialLoginView(generics.GenericAPIView):
    """Log in using social providers like Apple or Google etc"""

    serializer_class = SocialSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Authenticate user through the provider and access_token"""
        print(request, "request")
        serializer = self.serializer_class(data=request.data)
        print(serializer, "serializer")
        serializer.is_valid(raise_exception=True)

        provider = serializer.validated_data.get("provider")
        access_token = serializer.validated_data.get("access_token")

        strategy = load_strategy(request)
        print(strategy, "strategy")

        try:
            backend = load_backend(strategy=strategy, name=provider, redirect_uri=None)
            print(backend, "backend")
        except MissingBackend:
            return Response(
                {"error": "Please provide a valid provider"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            if isinstance(backend, BaseOAuth2):
                user = backend.do_auth(access_token)
                if user:
                    print(f"User authenticated: {user}")
                else:
                    print(f"User not authenticated")
        except AuthForbidden as error:
            print(f"AuthForbidden: {str(error)}")
            return Response(
                {"error": "Your credentials aren't allowed.", "details": str(error)},
                status=status.HTTP_403_FORBIDDEN,
            )
        except HTTPError as error:
            return Response(
                {"error": {"access_token": "Invalid token", "details": str(error)}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except AuthTokenError as error:
            return Response(
                {"error": "Invalid credentials", "details": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user and user.is_active:
            login(request, user)
            # token = jwt_encode_handler(jwt_payload_handler(user))
            refresh = RefreshToken.for_user(user)
            response_data = {
                "user_id": user.id,
                "email": user.email,
                "username": user.username,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
            return Response(data=response_data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)


class OTPRequestView(APIView):
    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            otp = str(random.randint(100000, 999999))  # Generate 6-digit OTP

            # Save OTP in the database
            OTP.objects.create(email=email, otp=otp)
            send_password_reset_email(email, otp)

            # Send OTP via email
            # send_mail(
            #     'Your OTP Code',
            #     f'Use this OTP to reset your password: {otp}',
            #     settings.DEFAULT_FROM_EMAIL,
            #     [email],
            # )

            return Response(
                {"message": "OTP has been sent to your email."},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPVerifyView(APIView):
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Password has been reset successfully."},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            User = get_user_model()
            email = serializer.validated_data["email"]
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            context = {
                "user": user,
                "token": token,
                "uid": uid,
                "protocol": "http" if settings.DEBUG else "https",
                "domain": "localhost:3000/",  # Replace with your domain
            }
            subject = "Password Reset Request"
            html_message = render_to_string("password_reset_email.html", context)
            plain_message = strip_tags(html_message)

            message = EmailMultiAlternatives(
                subject=subject,
                body=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email],
            )

            message.attach_alternative(html_message, "text/html")
            message.send()

            return Response(
                {"message": "Password reset email sent."}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            User = get_user_model()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            serializer = PasswordResetSerializers(data=request.data)
            if serializer.is_valid():
                serializer.save(user)
                return Response(
                    {"message": "Password has been reset."}, status=status.HTTP_200_OK
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(
                {"message": "Invalid link."}, status=status.HTTP_400_BAD_REQUEST
            )
