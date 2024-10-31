from django.urls import path
from .views import PostCreateView  # Importar as views do app 'posts'
from .views import UserFeedView, TweetDetail, TweetListView # Importar a view para a API do feed do usuário
from .views import LikePost, UnlikePost # Importar as views para curtir e descurtir posts
from .views import following_posts  # Importar a view

urlpatterns = [
    path('create/', PostCreateView.as_view(), name='post-create'), # Rota para criar um novo post
    path('feed/', UserFeedView.as_view(), name='user_feed'), # Rota para a API do feed do usuário
    path('edit/<int:pk>/', TweetDetail.as_view(), name='tweet-detail'),  # Use 'pk' para o ID do tweet
    path('delete/<int:pk>/', TweetDetail.as_view(), name='tweet-delete'),  # Use 'pk' para o ID do tweet
    path('all/', TweetListView.as_view(), name='tweet-list'),  # Rota para listar todos os tweets
    path('<int:post_id>/like/', LikePost.as_view(), name='like_post'), # Rota para curtir um post
    path('<int:post_id>/unlike/', UnlikePost.as_view(), name='unlike_post'), # Rota para descurtir um post
    path('ifollowing/', following_posts, name='following-posts'),
]
