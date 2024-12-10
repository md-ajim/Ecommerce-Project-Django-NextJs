from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings


def send_activation_email(username, email, activation_link):
    # Prepare the context for the email template
    context = {"username": username, "activation_link": activation_link}

    # Render the HTML template with context
    html_message = render_to_string("activation_email.html", context)

    # Create a plain text version of the email
    plain_message = strip_tags(html_message)

    # Create the email message object
    message = EmailMultiAlternatives(
        subject="Activate your account",
        body=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,  # Use your default from email
        to=[email],  # Send to the provided recipient email
    )

    # Attach the HTML alternative
    message.attach_alternative(html_message, "text/html")

    # Send the email
    message.send()


def send_password_reset_email(email, otp_code):
    subject = "Password Reset Request"
    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = [email]
    

    context = {"email": email, "otp_code": otp_code}

    html_massage = render_to_string("password_reset.html", context)

    plain_message = strip_tags(html_massage)

    msg = EmailMultiAlternatives(
        subject=subject, body=plain_message, from_email=from_email, to=to_email
    )
    msg.attach_alternative(html_massage, "text/html")
    msg.send()
