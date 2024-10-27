from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email')

        # Verifica se o nome de usuário ou email já existe
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)

        # Criação do usuário
        user = User(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=make_password(password)
        )       

        # Salva o usuário no banco de dados
        user.save()

        # Mensagem de retorno ao sucesso da criação do usuário
        return JsonResponse({'message': 'User created successfully'}, status=201)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('login')  # Pode ser username ou email
    password = request.data.get('password')

    # Tenta obter o usuário pelo username ou pelo email
    user = User.objects.filter(username=username).first() or User.objects.filter(email=username).first()

    # Se o usuário foi encontrado, autentica com o password
    if user and user.check_password(password):
        # Gera o token JWT
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=200)
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=400)



