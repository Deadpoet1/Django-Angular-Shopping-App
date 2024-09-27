
import datetime
from django.db import models 

from django.dispatch import receiver

class Product(models.Model):
    id = models.AutoField(primary_key=True,unique=True)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to='product_images/')
    Quantity = models.IntegerField(default=0)
    Product_Status = models.BooleanField(default=True)
    catagory = models.ForeignKey('Catagorie', on_delete=models.CASCADE, default=1)
    def __str__(self):
       return self.name
    
class Catagorie(models.Model):
    catagory_name = models.CharField(max_length=100)

class Order(models.Model):
    product=models.ForeignKey(Product,on_delete=models.CASCADE, default=1)
    quantity = models.PositiveIntegerField(default=1)
    order_date = models.DateField(default=datetime.datetime.today)
    username=models.CharField(max_length=100, default='')
    
    def __str__(self):
       return f"Order {self.id} for {self.product.name} (quantity: {self.quantity})"
    
class HomePage(models.Model):
    title= models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='home_page_images/')


  