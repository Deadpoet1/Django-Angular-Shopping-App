from kafka import KafkaProducer
from django.shortcuts import render,redirect
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product,HomePage,Order
from .serializers import ProductSerializer,HomeSerializer,UserSerializer,OrderSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import viewsets
from rest_framework import generics,status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers
from kafka import KafkaProducer
from rest_framework.authentication import TokenAuthentication
import json
import os
import sys
from rest_framework.permissions import IsAuthenticated
import logging
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
logger = logging.getLogger(__name__)
# Create your views here.
@method_decorator(csrf_exempt, name='dispatch')
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    
    serializer_class = ProductSerializer
    
   
    

    
  


"""
producer=KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
"""






class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']
        if product.Quantity >= quantity:
            product.Quantity -= quantity
            product.save()
            serializer.save()
            """
            if product.Quantity == 0:
                message = {'product_id': product.id, 'message': 'Out Of Stock'}

                logger.info(f'Attempting to send Kafka message: {message}')
            
                future = producer.send('product_stock', message)
                try:
                    record_metadata = future.get(timeout=10)
                    logger.info(f'Sent Kafka message: {message} to topic {record_metadata.topic} partition {record_metadata.partition} offset {record_metadata.offset}')
                except Exception as e:
                    logger.error(f'Failed to send Kafka message: {e}')
                producer.flush()
            
            """
            
                
                
                
        else:
            raise serializers.ValidationError("Not enough stock available")



class HomeViewSet(viewsets.ModelViewSet):
    queryset = HomePage.objects.all()
    serializer_class = HomeSerializer


class UserSignupView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
    
    