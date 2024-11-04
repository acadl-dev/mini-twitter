# accounts/urls.py
from django.urls import path
from . import views
from .views import login

urlpatterns = [
     path('register/', views.register, name='register'),
     path('login/', login, name='login'),
     path('get_user_info/', views.get_user_info, name='get_user_info'),
]
