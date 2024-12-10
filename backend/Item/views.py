

from rest_framework import viewsets
from .models import *
from .serializers import *
import stripe

from rest_framework import generics
from rest_framework.permissions import IsAdminUser , AllowAny

from rest_framework import status
from .models import Payment
from .serializers import PaymentSerializer
from .utils import process_payment  # Assuming process_payment is in utils.py
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY


from rest_framework.decorators import action
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from .filters import ProductFilter
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
import logging

from rest_framework.views import APIView


class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "name",
        "product_id",
        "category_name",
        "product_variant_id",
        "product_details__color",
        "product_details__size",
    ]
    filterset_fields = [
        "category_name",
        "categories__category_name",
        "product_details__color",
        "product_details__size",
        "price",
    ]
    ordering_fields = ["price", "name", "popularity", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Optional: Price range filtering
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")

        if min_price and max_price:
            queryset = queryset.filter(price__gte=min_price, price__lte=max_price)

        return queryset


# CustomIdentifier ViewSet
class CustomIdentifierViewSet(viewsets.ModelViewSet):
    queryset = CustomIdentifier.objects.all()
    serializer_class = CustomIdentifierSerializer


# ExternalIdentifier ViewSet
class ExternalIdentifierViewSet(viewsets.ModelViewSet):
    queryset = ExternalIdentifier.objects.all()
    serializer_class = ExternalIdentifierSerializer


# Address ViewSet
class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class =  UserSerializer
    
    
class UserViewSet_Profile(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer_Profile
    

class UserViewsGet(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer_Profile
        
    
    


# Coupon ViewSet
class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer


# Color1 ViewSet
class Color1ViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer


# Similar viewsets for Color2 through Color10 if needed.


# Colors ViewSet
class ColorsViewSet(viewsets.ModelViewSet):
    queryset = Colors.objects.all()
    serializer_class = ColorsSerializer



# Favorite ViewSet

class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer



# Details ViewSet
class DetailsViewSet(viewsets.ModelViewSet):
    queryset = Details.objects.all()
    serializer_class = DetailsSerializer




# ProductReview ViewSet
class ProductReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = ProductReview.objects.all()
    serializer_class = ProductReviewSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    @action(detail=True, methods=["get"])
    def products(self, request, pk=None):
        category = self.get_object()
        products = category.products.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


# Warehouse ViewSet
class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer


# Inventory ViewSet
class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer


# Wishlist ViewSet
class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer


# ProductRecommendation ViewSet
class ProductRecommendationViewSet(viewsets.ModelViewSet):
    queryset = ProductRecommendation.objects.all()
    serializer_class = ProductRecommendationSerializer


# Order ViewSet
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class OrderViewSet_Get(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializers_Get


# OrderItem ViewSet
class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer


class OrderItemViewSet_Get(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer_Get


# Payment ViewSet
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class PaymentViewSet_Get(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer_Get



# Shipment ViewSet
class ShipmentViewSet(viewsets.ModelViewSet):
    queryset = Shipment.objects.all()
    serializer_class = ShipmentSerializer


# Currency ViewSet
class CurrencyViewSet(viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer


# Price ViewSet
class PriceViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Price.objects.all()
    serializer_class = PriceSerializer


# Cart ViewSet
class CartViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Cart.objects.all()
    serializer_class = CartSerializer


# CartItem ViewSet
class CartItemViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer


class Cart_ItemViewSet_get(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializers


# SalesReport ViewSet
class SalesReportViewSet(viewsets.ModelViewSet):
    queryset = SalesReport.objects.all()
    serializer_class = SalesReportSerializer


# FlashSale ViewSet
class FlashSaleViewSet(viewsets.ModelViewSet):
    queryset = FlashSale.objects.all()
    serializer_class = FlashSaleSerializer


# UserActivity ViewSet
class UserActivityViewSet(viewsets.ModelViewSet):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer


class TotalCartViewSet(viewsets.ModelViewSet):
    queryset = TotalCart.objects.all()
    serializer_class = TotalCartSerializer


class OrderViewSets(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class CreatePaymentIntentView(APIView):
    def post(self, request):
        try:
            # Retrieve amount and currency from request data
            amount = request.data.get("amount", 0)
            currency = request.data.get("currency", "usd")

            # Create a Stripe Payment Intent
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Amount in cents
                currency=currency,
            )

            return Response(
                {"clientSecret": intent["client_secret"]}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


logger = logging.getLogger(__name__)


class PaymentView(APIView):
    def post(self, request):
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            payment_data = serializer.validated_data

            # Process the payment
            try:
                transaction_id = process_payment(payment_data)

                # Check if transaction_id was returned
                if not transaction_id:
                    raise ValueError("Transaction ID was not generated.")

                payment_data["transaction_id"] = transaction_id
                payment_data["status"] = "Completed"  # Set status based on success

                # Save the payment to the database
                payment = Payment.objects.create(**payment_data)
                return Response(
                    PaymentSerializer(payment).data, status=status.HTTP_201_CREATED
                )

            except Exception as e:
                logger.error(f"Payment processing error: {e}")
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
