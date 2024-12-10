from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import OrderSerializer , PaymentSuccessSerializer , OrderSuccessSerializer , OrderSuccessSerializer_get
from.models import Order , PaymentSuccess , OrderSuccess
from rest_framework import viewsets

class PostMultipleOrderView(APIView):
    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderViewSets(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    

class PaymentSuccessViewSet(viewsets.ModelViewSet):
    queryset =  PaymentSuccess.objects.all()
    serializer_class = PaymentSuccessSerializer    
    
    

class  OrderSuccessViewSet(viewsets.ModelViewSet):
    queryset = OrderSuccess.objects.all()
    serializer_class = OrderSuccessSerializer   
    
    


class  OrderSuccessViewSet_get(viewsets.ModelViewSet):
    queryset = OrderSuccess.objects.all()
    serializer_class =  OrderSuccessSerializer_get
    