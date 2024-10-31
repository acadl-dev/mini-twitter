from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import PostSerializer
from .models import Post
import boto3
import uuid
from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Post, Like
from rest_framework import generics, permissions
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from user.models import Follower  # Importar o modelo Follower
from rest_framework import viewsets # Importar viewsets do Django Rest Framework
from .pagination import TweetCursorPagination  # Importe a sua classe de paginação





class PostCreateView(APIView):                                                   #para criar os tweets
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )

        # Verifica se uma imagem foi enviada
        if 'image' in request.FILES:
            image = request.FILES['image']
            image_name = f"{uuid.uuid4()}_{image.name}"
            try:
                s3_client.upload_fileobj(
                    image,
                    settings.AWS_BUCKET_NAME,
                    image_name, 
                    ExtraArgs={'ContentType': image.content_type}
                )
                image_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{image_name}"
                data['image_url'] = image_url
            except Exception as e:
                return Response({'error': 'Erro ao fazer o upload da imagem', 'details': str(e)},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            data['image_url'] = None

        # Define o user e likes_count
        data['user'] = request.user  # Atribui a instância do usuário autenticado
        data['likes_count'] = 0  # Inicializa a contagem de likes

        # Passa o contexto do request para o serializer
        serializer = PostSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()  # Salva o post no banco de dados
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserFeedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tweets = Post.objects.filter(user=request.user).order_by('-created_at')
        serializer = PostSerializer(tweets, many=True, context={'request': request})  # Passar o contexto aqui
        return Response(serializer.data)

    
class TweetDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Retorna apenas os tweets do usuário autenticado
        user = self.request.user
        return Post.objects.filter(user=user)  # Alterado de 'author' para 'user'

    def destroy(self, request, *args, **kwargs):
        # Obtém o tweet a ser excluído
        tweet = self.get_object()
        
        # Verifica se o usuário é o autor do tweet
        if tweet.user != request.user:
            return Response({"detail": "Você não tem permissão para excluir este tweet."}, status=403)

        # Se o usuário for o autor, exclui o tweet
        self.perform_destroy(tweet)
        return Response(status=204)  # Retorna um status 204 No Content após a exclusão
    
class TweetListView(generics.ListAPIView):
    queryset = Post.objects.all()  # Defina o queryset inicial aqui
    serializer_class = PostSerializer
    pagination_class = TweetCursorPagination  # Adiciona paginação
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        posts = super().get_queryset()
        # Adiciona is_liked ao queryset
        for post in posts:
            post.is_liked = Like.objects.filter(user=user, post=post).exists()
        return posts


    
class LikePost(APIView):
    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        # Verifica se o usuário já curtiu o post
        if Like.objects.filter(user=request.user, post=post).exists():
            return JsonResponse({'message': 'You already liked this post.'}, status=400)

        # Cria uma nova curtida
        Like.objects.create(user=request.user, post=post)
        post.likes_count += 1
        post.save()
        return JsonResponse({'message': 'Post liked successfully.', 'likes_count': post.likes_count})

class UnlikePost(APIView):
    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        # Verifica se o usuário já curtiu o post
        like = Like.objects.filter(user=request.user, post=post).first()
        if not like:
            return JsonResponse({'message': 'You have not liked this post.'}, status=400)

        # Remove a curtida
        like.delete()
        post.likes_count -= 1
        post.save()
        return JsonResponse({'message': 'Post unliked successfully.', 'likes_count': post.likes_count})
    
    
@api_view(['GET'])
def following_posts(request):
    # Obtém o usuário autenticado
    follower = request.user

    # Obtém os IDs dos usuários que o usuário está seguindo
    following_ids = Follower.objects.filter(follower=follower).values_list('followed', flat=True)

    # Busca todos os posts dos usuários seguidos
    posts = Post.objects.filter(user__in=following_ids).order_by('-created_at')

    # Serializa os posts
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

class TweetViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')  # Ordene os tweets
    serializer_class = PostSerializer
    pagination_class = TweetCursorPagination  # Aplique a classe de paginação personalizada
