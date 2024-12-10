from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth import password_validation




class UserSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(write_only=True)
    
    def validate_password(self, value ):
        password_validation.validate_password( value)
        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long."
            )
             
        return value
    
    class Meta:
        model = User
        fields = [ "id", "username", "email", "password" , 'is_active']  
        
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_active=False 
        )
       
        return user
              
              

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)  
    remember_me = serializers.BooleanField()    
    
    
    
class SocialSerializer(serializers.Serializer):
    provider = serializers.CharField(max_length=255, required=True)
    access_token = serializers.CharField(max_length=4096, required=True, trim_whitespace=True)    
    
    
class OTPRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError('No user is registered with this email address.')
        return value    
    
    
class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        from .models import OTP
        try:
            otp_entry = OTP.objects.get(email=data['email'], otp=data['otp'], is_used=False)
        except OTP.DoesNotExist:
            raise serializers.ValidationError('Invalid or expired OTP.')

        if not otp_entry.is_valid():
            raise serializers.ValidationError('Invalid or expired OTP.')

        return data

    def save(self):
        from .models import OTP
        otp_entry = OTP.objects.get(email=self.validated_data['email'], otp=self.validated_data['otp'])
        user = User.objects.get(email=self.validated_data['email'])
        user.set_password(self.validated_data['new_password'])
        user.save()
        
        otp_entry.is_used = True
        otp_entry.save()    
        
    
    


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        User = get_user_model()
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user associated with this email address.")
        return value    
    
    
class PasswordResetSerializers(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, required=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def save(self, user):
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
            