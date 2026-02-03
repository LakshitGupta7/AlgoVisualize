from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import AlgorithmProgress, VisualizationHistory
from .serializers import AlgorithmProgressSerializer, VisualizationHistorySerializer


class AlgorithmProgressViewSet(viewsets.ModelViewSet):
    serializer_class = AlgorithmProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return AlgorithmProgress.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        progress = self.get_queryset()
        summary = {
            'total': progress.count(),
            'completed': progress.filter(status='completed').count(),
            'in_progress': progress.filter(status='in_progress').count(),
            'by_category': {}
        }
        for cat in ['sorting', 'searching', 'graph', 'tree', 'dp']:
            cat_progress = progress.filter(category=cat)
            summary['by_category'][cat] = {
                'total': cat_progress.count(),
                'completed': cat_progress.filter(status='completed').count()
            }
        return Response(summary)


class VisualizationHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = VisualizationHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return VisualizationHistory.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        # Update progress
        algo = serializer.validated_data['algorithm_name']
        category = serializer.validated_data['category']
        progress, _ = AlgorithmProgress.objects.get_or_create(
            user=self.request.user,
            algorithm_name=algo,
            defaults={'category': category}
        )
        progress.times_practiced += 1
        progress.last_practiced = timezone.now()
        if progress.status == 'not_started':
            progress.status = 'in_progress'
        progress.save()
