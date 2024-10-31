from django.urls import path
from . import views
from .views import following_list


urlpatterns = [
    path('follow/<str:username>/', views.follow_user, name='follow_user'),  # Rota para seguir um usuário
    path('unfollow/<str:username>/', views.unfollow_user, name='unfollow_user'),  # Rota para deixar de seguir um usuário
    path('follow-status/<int:user_id>/', views.check_follow_status, name='check_follow_status'),  # Rota para verificar o status de seguimento
    path('followers-count/<int:user_id>/', views.followers_count, name='followers_count'),  # Rota para obter o contador de seguidores
    path('following/', following_list, name='following-list'),
    
]
