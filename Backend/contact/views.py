from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactMessageListCreateAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request):
        messages = ContactMessage.objects.all()
        serializer = ContactMessageSerializer(messages, many=True)

        return Response({
            "success": True,
            "message": "Contact messages retrieved successfully",
            "data": serializer.data,
        })

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Your message has been sent successfully",
                "data": serializer.data,
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)


class ContactMessageDetailAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        contact_message = get_object_or_404(ContactMessage, pk=pk)
        serializer = ContactMessageSerializer(contact_message)

        return Response({
            "success": True,
            "message": "Contact message retrieved successfully",
            "data": serializer.data,
        })

    def patch(self, request, pk):
        contact_message = get_object_or_404(ContactMessage, pk=pk)
        serializer = ContactMessageSerializer(
            contact_message,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Contact message updated successfully",
                "data": serializer.data,
            })

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        contact_message = get_object_or_404(ContactMessage, pk=pk)
        contact_message.delete()

        return Response({
            "success": True,
            "message": "Contact message deleted successfully",
        }, status=status.HTTP_200_OK)