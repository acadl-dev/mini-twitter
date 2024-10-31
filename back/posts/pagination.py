# pagination.py
from rest_framework.pagination import CursorPagination

class TweetCursorPagination(CursorPagination):
    page_size = 20  # Defina quantos tweets serão carregados por página
    ordering = '-created_at'  # Ordene os tweets pela data de criação, do mais recente ao mais antigo
    cursor_query_param = 'cursor'  # Nome do parâmetro na URL para o cursor
