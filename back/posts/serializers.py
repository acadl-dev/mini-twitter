from rest_framework import serializers
from .models import Post, Like

class PostSerializer(serializers.ModelSerializer):
    is_liked = serializers.SerializerMethodField()  # Adiciona um campo calculado

    class Meta:
        model = Post
        fields = ['id', 'user', 'username', 'content', 'image_url', 'likes_count', 'created_at', 'is_liked']
        read_only_fields = ['user', 'username', 'likes_count', 'created_at']

    def create(self, validated_data):
        # Define o campo `username` com base no `user`
        user = self.context['request'].user  # Obtém o usuário autenticado
        validated_data['username'] = user.username
        validated_data['user'] = user  # Atribui o usuário ao validated_data

        return super().create(validated_data)

    def get_is_liked(self, obj):
        user = self.context['request'].user  # Obtém o usuário autenticado
        return Like.objects.filter(user=user, post=obj).exists()  # Verifica se o usuário curtiu o post
