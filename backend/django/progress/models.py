from django.db import models
from django.conf import settings


class AlgorithmProgress(models.Model):
    """Track user's learning progress for each algorithm"""
    CATEGORY_CHOICES = [
        ('sorting', 'Sorting'),
        ('searching', 'Searching'),
        ('graph', 'Graph'),
        ('tree', 'Tree'),
        ('dp', 'Dynamic Programming'),
    ]
    
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress')
    algorithm_name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    times_practiced = models.IntegerField(default=0)
    last_practiced = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'algorithm_progress'
        unique_together = ['user', 'algorithm_name']
    
    def __str__(self):
        return f"{self.user.email} - {self.algorithm_name}"


class VisualizationHistory(models.Model):
    """Track visualization history for analytics"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='history')
    algorithm_name = models.CharField(max_length=100)
    category = models.CharField(max_length=20)
    input_data = models.JSONField()
    completed = models.BooleanField(default=False)
    duration_seconds = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'visualization_history'
        ordering = ['-created_at']
