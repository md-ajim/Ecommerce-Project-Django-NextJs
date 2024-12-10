from django.db import models
from Item.models import User
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    images = models.JSONField()  # To store an array of image URLs
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    currency = models.CharField(max_length=10)
    metadata = models.JSONField(blank=True, null=True)  # Additional product metadata

    def __str__(self):
        return self.name

class Order(models.Model):
    customer_email = models.EmailField()
    tax_rate_id = models.CharField(max_length=255)
    metadata = models.JSONField(blank=True, null=True)  # Additional order metadata
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.customer_email}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"



class PaymentSuccess(models.Model):
    order_id = models.CharField(max_length=20 , default='ABC1926')
    amount_subtotal = models.IntegerField(  blank=True , null=True)
    amount_total = models.IntegerField( blank=True , null=True)
    currency = models.CharField(max_length=20)
    customer_email = models.EmailField(null=True, blank=True)
    payment_id = models.CharField(max_length=1000,null=True, blank=True)
    payment_intent = models.CharField(max_length=1000,null=True, blank=True)
    payment_method_types = models.CharField(max_length=100,null=True, blank=True)
    payment_status = models.CharField(max_length=100)
    metadata = models.JSONField(blank=True, null=True)



class OrderSuccess(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    payment = models.ForeignKey(PaymentSuccess , on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE,default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    
    


    

    
    

    
