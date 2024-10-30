from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,    
)


urlpatterns = [
    path('admin/', admin.site.urls),    
    path('api/accounts/', include('accounts.urls')),  # Inclua as URLs de 'accounts'   
    path('api/posts/', include('posts.urls')),  # Inclua as URLs de 'posts'
    path('api/user/', include('user.urls')),  # Inclua as URLs de 'user' 
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),     # Rota para obter o token (login)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),   # Rota para renovar o token "access" usando o "refresh"   
    
    
]
