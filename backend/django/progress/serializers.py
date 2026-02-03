from rest_framework import serializers
from .models import AlgorithmProgress, VisualizationHistory


class AlgorithmProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlgorithmProgress
        fields = ['id', 'algorithm_name', 'category', 'status', 'times_practiced', 
                  'last_practiced', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class VisualizationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VisualizationHistory
        fields = ['id', 'algorithm_name', 'category', 'input_data', 'completed', 
                  'duration_seconds', 'created_at']
        read_only_fields = ['id', 'created_at']
