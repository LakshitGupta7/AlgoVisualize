from django.urls import path
from .views import RegisterView, ProfileView, CurrentUserView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
]
