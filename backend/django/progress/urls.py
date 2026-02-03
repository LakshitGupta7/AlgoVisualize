from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlgorithmProgressViewSet, VisualizationHistoryViewSet

router = DefaultRouter()
router.register('algorithms', AlgorithmProgressViewSet, basename='algorithm-progress')
router.register('history', VisualizationHistoryViewSet, basename='visualization-history')

urlpatterns = [
    path('', include(router.urls)),
]
