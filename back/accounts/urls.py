# accounts/urls.py
from django.urls import path
from . import views
from .views import login

urlpatterns = [
     path('register/', views.register, name='register'),
     path('login/', login, name='login'),
]
