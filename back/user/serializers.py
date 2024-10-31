from rest_framework import serializers
from .models import Follower
from posts.models import Post  # Supondo que Post esteja em um app chamado 'posts'

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follower
        fields = ['follower', 'followed', 'created_at']
        read_only_fields = ['created_at']

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'user', 'username', 'content', 'image_url', 'likes_count', 'created_at']
