from django.db import models
from django.contrib.auth.models import AbstractUser


# Custom Identifier models (Unchanged)
class CustomIdentifier(models.Model):
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}: {self.value}"


class ExternalIdentifier(models.Model):
    client_user_id = models.CharField(max_length=100)
    custom_identifiers = models.ManyToManyField(CustomIdentifier)

    def __str__(self):
        return self.client_user_id


class Address(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="addresses")
    address_line1 = models.CharField(max_length=255, blank=True, null=True)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, null=True)
    email = models.EmailField(null=True, default="admin@gmail.com")
    phone = models.CharField(max_length=20, null=True)
    address = models.CharField(max_length=255, null=True, default="Dhaka")
    apartment = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.address_line1}, {self.city}, {self.country}"


class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True, null=True)
    external_identifiers = models.OneToOneField(
        "ExternalIdentifier", on_delete=models.CASCADE, null=True, blank=True
    )
    profile_image = models.ImageField(
        upload_to="profile_images/", blank=True, null=True
    )
    loyalty_points = models.PositiveIntegerField(default=0)
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_groups",  # Updated to avoid clash
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_permissions",  # Updated to avoid clash
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    wishlist = models.OneToOneField(
        "Wishlist",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="user_wishlist",
    )  # New wishlist field

    def __str__(self):
        return self.email


class Coupon(models.Model):
    code = models.CharField(max_length=20, unique=True)
    discount_percentage = models.PositiveIntegerField()  # E.g., 20 for 20%
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    active = models.BooleanField(default=True)
    applicable_categories = models.ManyToManyField(
        "Category", blank=True
    )  # New field for category-specific coupons
    applicable_products = models.ManyToManyField("Product", blank=True)

    def __str__(self):
        return f"Coupon {self.code} - {self.discount_percentage}% off"


class Color(models.Model):
    # A single combined color choice list with names and codes as tuples
    COLOR_CHOICES = [
        ("Black", "#000000"),
        ("White", "#FFFFFF"),
        ("Red", "#FF0000"),
        ("Blue", "#0000FF"),
        ("Green", "#008000"),
        ("Yellow", "#FFFF00"),
        ("Orange", "#FFA500"),
        ("Purple", "#800080"),
        ("Pink", "#FFC0CB"),
        ("Gray", "#808080"),
        ("Brown", "#A52A2A"),
        ("Cyan", "#00FFFF"),
        ("Magenta", "#FF00FF"),
        ("Maroon", "#800000"),
        ("Navy", "#000080"),
        ("Olive", "#808000"),
        ("Teal", "#008080"),
        ("Lime", "#00FF00"),
        ("Beige", "#F5F5DC"),
        ("Gold", "#FFD700"),
        ("Silver", "#C0C0C0"),
        ("Violet", "#EE82EE"),
        ("Indigo", "#4B0082"),
        ("Turquoise", "#40E0D0"),
        ("Lavender", "#E6E6FA"),
        ("Crimson", "#DC143C"),
        ("Coral", "#FF7F50"),
        ("Peach", "#FFE5B4"),
        ("Mint", "#98FF98"),
        ("Ivory", "#FFFFF0"),
        ("Charcoal", "#36454F"),
        ("Burgundy", "#800020"),
        ("Rose", "#FF007F"),
        ("Emerald", "#50C878"),
        ("Saffron", "#F4C430"),
        ("Azure", "#007FFF"),
    ]

    # Separate fields for name and code
    color = models.CharField(
        max_length=100,
        choices=[(name, name) for name, _ in COLOR_CHOICES],
        null=True,
        blank=True,
    )
    color_code = models.CharField(
        max_length=7,
        choices=[(code, code) for _, code in COLOR_CHOICES],
        null=True,
        blank=True,
    )
    image = models.ImageField(
        upload_to="color_image", max_length=100, null=True, blank=True
    )

    # Automatically sync color_code based on color selection
    def save(self, *args, **kwargs):
        if self.color:
            self.color_code = dict(self.COLOR_CHOICES).get(self.color)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.color or 'Color'} ({self.color_code})"



class Colors(models.Model):
    color = models.ManyToManyField(Color, blank=True)
 


# T-Shirt Product Details
class Details(models.Model):
    SIZE_CHOICES = [
        ("XS", "Extra Small"),
        ("S", "Small"),
        ("M", "Medium"),
        ("L", "Large"),
        ("XL", "Extra Large"),
        ("XXL", "Double Extra Large"),
        ("XXXL", "Triple Extra Large"),
    ]

    BAG_SIZE_CHOICES = [
        ("6 x 8 inch", "7 x 9 inch"),
        ("8 x 11 inch", "8 x 11 inch"),
        ("7 x 9 inch", "7 x 9 inch"),
        ("9 x 12 inch", "9 x 12 inch"),
        ("10 x 15 inch", "12 x 16 inch"),
    ]

    COLOR_CHOICES = [
        ("Black", "Black"),
        ("White", "White"),
        ("Red", "Red"),
        ("Blue", "Blue"),
        ("Green", "Green"),
        ("Yellow", "Yellow"),
        ("Orange", "Orange"),
        ("Purple", "Purple"),
        ("Pink", "Pink"),
        ("Gray", "Gray"),
        ("Brown", "Brown"),
        ("Cyan", "Cyan"),
        ("Magenta", "Magenta"),
        ("Maroon", "Maroon"),
        ("Navy", "Navy"),
        ("Olive", "Olive"),
        ("Teal", "Teal"),
        ("Lime", "Lime"),
        ("Beige", "Beige"),
        ("Gold", "Gold"),
        ("Silver", "Silver"),
        ("Violet", "Violet"),
        ("Indigo", "Indigo"),
        ("Turquoise", "Turquoise"),
        ("Lavender", "Lavender"),
        ("Crimson", "Crimson"),
        ("Coral", "Coral"),
        ("Peach", "Peach"),
        ("Mint", "Mint"),
        ("Ivory", "Ivory"),
        ("Charcoal", "Charcoal"),
        ("Burgundy", "Burgundy"),
        ("Rose", "Rose"),
        ("Emerald", "Emerald"),
        ("Saffron", "Saffron"),
        ("Azure", "Azure"),
    ]

    name = models.CharField(max_length=100)
    main_image = models.ImageField(upload_to="shirt_main_images/")
    color = models.CharField(max_length=9, choices=COLOR_CHOICES, blank=True, null=True)
    colors = models.ManyToManyField(Colors)
    size = models.CharField(max_length=4, choices=SIZE_CHOICES, blank=True, null=True)
    bag_size = models.CharField(
        max_length=15, choices=BAG_SIZE_CHOICES, blank=True, null=True
    )
    description = models.TextField(blank=True, null=True)


    def __str__(self):
        return self.name


# Generalized Product Models
class Product(models.Model):
    CATEGORY_CHOICES = [
        ("Accessories", "Accessories"),
        ("T-Shirt", "T-Shirt"),
        ("Bags", "Bags"),
        ("Clothing", "Clothing"),
        ("Electronics", "Electronics"),
        ("Footwear", "Footwear"),
        ("Headwear", "Headwear"),
        ("Hoodies", "Hoodies"),
        ("Shoes", "Shoes"),
    ]

    product_id = models.CharField(max_length=100, unique=True)
    product_variant_id = models.CharField(max_length=100, unique=True)
    product_image = models.URLField(null=True, blank=True)
    product_url = models.URLField(null=True, blank=True)
    image = models.ImageField(
        upload_to="image", default="product_image", null=True, blank=True
    )
    discount_percentage = models.PositiveIntegerField(
        default="3", null=True, blank=True
    )
    category_name = models.CharField(
        max_length=20, choices=CATEGORY_CHOICES, null=True, blank=True
    )
    price_in_currencies = models.ManyToManyField("Price", blank=True, related_name='item_currencies' )
    product_card_name = models.CharField(max_length=100, default="Acme Circles T-Shirt")
    name = models.CharField(max_length=1000)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )  # Discounted price
    stock_quantity = models.PositiveIntegerField(default=0)
    sold_quantity = models.PositiveIntegerField(default=0)
    product_details = models.ManyToManyField("Details")
    available = models.BooleanField(
        default=True
    )  # Whether product is available for sale
    popularity = models.IntegerField(
        default=0
    )  # This can be updated based on sales or views
    created_at = models.DateTimeField(auto_now_add=True)  # For latest arrivals
    warehouse_stock = models.ManyToManyField(
        "Warehouse", through="Inventory"
    )  # New warehouse relation
    flash_sale = models.OneToOneField(
        "FlashSale",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="product_flash_sale",
    )  # New flash sale field

    def __str__(self):
        return self.name


class Favorite (models.Model):
    Product = models.ForeignKey(Product , on_delete=models.CASCADE, null=True, blank=True)
    Product_Name = models.CharField( max_length=100)
    Product_Image = models.URLField(null=True, blank=True)
    Product_url = models.URLField( null=True, blank=True) 
    Stock_Status = models.PositiveIntegerField(default=0)
    Discount_Price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    Product_Price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    
    



class ProductReview(models.Model):
    product = models.ForeignKey(
        Product, related_name="reviews", on_delete=models.CASCADE
    )
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(
        choices=[(i, i) for i in range(1, 6)]
    )  # Rating out of 5
    comment = models.TextField(blank=True, null=True)
    profile_names = models.CharField(max_length=50 , blank=True , null=True)
    user_profilePic = models.URLField( null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  #

    def __str__(self):
        return f"{self.rating}"


# Updated Category Model
class Category(models.Model):
    CATEGORY_CHOICES = [
        ("Accessories", "Accessories"),
        ("T-Shirt", "T-Shirt"),
        ("Bags", "Bags"),
        ("Clothing", "Clothing"),
        ("Electronics", "Electronics"),
        ("Footwear", "Footwear"),
        ("Headwear", "Headwear"),
        ("Hoodies", "Hoodies"),
        ("Shoes", "Shoes"),
    ]

    category_name = models.CharField(
        max_length=20, choices=CATEGORY_CHOICES, null=True, blank=True
    )
    parent_category = models.ForeignKey(
        "self", blank=True, null=True, on_delete=models.CASCADE
    )  # For nested categories
    description = models.TextField(blank=True, null=True)
    category_image = models.ImageField(
        upload_to="category_images/", blank=True, null=True
    )
    products = models.ManyToManyField(Product, related_name="categories")
    promotion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.category_name


class Warehouse(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    capacity = models.PositiveIntegerField()
    current_stock = models.PositiveIntegerField()

    def __str__(self):
        return self.name


class Inventory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity} of {self.product.name} in {self.warehouse.name}"


class Wishlist(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="wishlist_user"
    )
    products = models.ManyToManyField(Product)

    def __str__(self):
        return f"{self.user.email}'s Wishlist"


class ProductRecommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recommended_products = models.ManyToManyField(Product)

    def __str__(self):
        return f"Recommendations for {self.user.email}"


class TotalCart(models.Model):
    product_item = models.ForeignKey(Product, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    total_Quantity = models.PositiveSmallIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)


# The above classes define models for a shopping cart, order, and order items in a Django application.
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through="CartItem")
    last_updated = models.DateTimeField(auto_now=True)
    abandoned = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.email}'s Cart"
    
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    cart_total_item_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    color = models.CharField(max_length=50, null=True, blank=True)
    size = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in {self.cart.user.email}'s Cart"
    
    
class OrderItem(models.Model):
    products = models.ManyToManyField(Product, blank=True)
    cart_item = models.ManyToManyField(CartItem, related_name='cart_item' , blank=True)
    quantity = models.PositiveIntegerField()
    price_at_order = models.DecimalField(
        max_digits=10, decimal_places=2, null=True
    )  # Capture price at time of order

    def __str__(self):
        return f"{self.quantity}"
    


class Order(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Shipped", "Shipped"),
        ("Delivered", "Delivered"),
        ("Cancelled", "Cancelled"),
    ]
    

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    items = models.ManyToManyField(OrderItem)
    shipping_address = models.ForeignKey(
        Address, related_name="shipping_orders", on_delete=models.CASCADE, null=True
    )
    billing_address = models.ForeignKey(
        Address, related_name="billing_orders", on_delete=models.CASCADE, null=True
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    occurred_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    shipment = models.OneToOneField(
        "Shipment",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="order_shipment",
    )
    payment = models.OneToOneField(
        "Payment",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="order_payment",
    )

    def __str__(self):
        return f"Order {self.pk} by {self.user.email}"


class OrderCartItem(models.Model):
    order = models.ForeignKey("Order", on_delete=models.CASCADE)
    cart_item = models.ForeignKey(CartItem, on_delete=models.CASCADE)

    def __str__(self):
        return f"CartItem {self.cart_item.pk} in Order {self.order.pk}"


class Payment(models.Model):
    PAYMENT_METHODS = [
        ("Credit Card", "Credit Card"),
        ("PayPal", "PayPal"),
        ("Stripe", "Stripe"),
        ("Authorize.net", "Authorize.net "),
        ("Bank Transfer", "Bank Transfer"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order = models.ManyToManyField(Order , related_name='order_payment')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="Pending")
    shipment =models.ForeignKey('Shipment',on_delete=models.CASCADE,blank=True , null=True)

    def __str__(self):
        return f"Payment {self.transaction_id}"

class Shipment(models.Model):
    
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="shipment_order"
    )
    tracking_number = models.CharField(max_length=100, unique=True)
    carrier = models.CharField(max_length=50)
    shipped_at = models.DateTimeField(auto_now_add=True)
    estimated_delivery = models.DateTimeField()
    delivered_at = models.DateTimeField(null=True, blank=True)
    Snaply = models.BooleanField(null=True, blank=True)
    Standard = models.BooleanField(null=True, blank=True)

    def __str__(self):
        return f"Shipment {self.tracking_number} for Order {self.order.pk}"


class Currency(models.Model):
    code = models.CharField(max_length=3, unique=True)
    exchange_rate = models.DecimalField(
        max_digits=10, decimal_places=4
    )  # Relative to USD

    def __str__(self):
        return self.code


class Price(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="product_prices"
    )
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.amount} {self.currency.code} for {self.product.name}"


class SalesReport(models.Model):
    date = models.DateField()
    total_sales = models.DecimalField(max_digits=10, decimal_places=2)
    total_orders = models.PositiveIntegerField()
    total_products_sold = models.PositiveIntegerField()

    def __str__(self):
        return f"Sales Report for {self.date}"


class FlashSale(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="flash_sale_product"
    )
    discount_percentage = models.PositiveIntegerField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self):
        return f"Flash Sale: {self.discount_percentage}% off on {self.product.name}"


class UserActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.activity_type} by {self.user.email} at {self.timestamp}"


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.email}: {self.message}"

