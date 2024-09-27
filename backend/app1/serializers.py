from  rest_framework import serializers
from .models import Product,HomePage,Order
from django.contrib.auth.models import User
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id','name','description','price','image','Quantity']
class HomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePage
        fields = ['title','description']
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name','last_name','username','email','password']
        extra_kwargs = {'password':{'write_only':True}}
    def create(self,validated_data):
        user = User.objects.create_user(**validated_data)
        return user
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'