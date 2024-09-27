from django.contrib import admin

from app1.models import Product, Order,Catagorie



    # Implement logic to send product update to Kafka
    

class AdminProduct(admin.ModelAdmin):
    list_display = ['id','name', 'price', 'description','Quantity', 'Product_Status']
    

admin.site.register(Product,AdminProduct)
admin.site.register(Order)
admin.site.register(Catagorie)