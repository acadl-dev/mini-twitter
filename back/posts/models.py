from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=255)
    content = models.TextField()
    image_url = models.URLField(blank=True, null=True)
    likes_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # Garantir que um usuário só possa curtir um post uma vez

