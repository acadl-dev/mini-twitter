from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Follower
from .serializers import FollowSerializer
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated

# Create your views here.



@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Certifique-se de que o usuário está autenticado
def follow_user(request, username):
    try:
        user_to_follow = User.objects.get(username=username)
        follower = request.user

        # Verificar se já está seguindo
        if Follower.objects.filter(follower=follower, followed=user_to_follow).exists():
            return Response({"detail": "Você já está seguindo este usuário."}, status=status.HTTP_400_BAD_REQUEST)

        # Criar uma nova instância de Follower
        Follower.objects.create(follower=follower, followed=user_to_follow)

        return JsonResponse({"message": f"Você seguiu {user_to_follow.username}."}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return JsonResponse({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def unfollow_user(request, username):
    try:
        # Buscar o usuário a ser deixado de seguir pelo username
        user_to_unfollow = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    follower = request.user

    # Verificar se já não está seguindo
    follow_instance = Follower.objects.filter(follower=follower, followed=user_to_unfollow).first()
    if not follow_instance:
        return Response({"detail": "You are not following this user."}, status=status.HTTP_400_BAD_REQUEST)
    
    follow_instance.delete()
    return Response({"detail": "Successfully unfollowed."}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def check_follow_status(request, user_id):
    user = request.user
    is_following = Follower.objects.filter(follower=user, followed_id=user_id).exists()
    return Response({"is_following": is_following})

@api_view(['GET'])
def followers_count(request, user_id):
    try:
        user_to_check = User.objects.get(id=user_id)
        count = Follower.objects.filter(followed=user_to_check).count()
        return Response({'followers_count': count}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def following_list(request):
    user = request.user
    # Usar `followed_id` para obter os usernames dos usuários que o usuário está seguindo
    following = Follower.objects.filter(follower=user).values_list('followed__username', flat=True)
    
    return Response({"following": list(following)})