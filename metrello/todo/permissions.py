from rest_framework.permissions import BasePermission

class IsAuthor(BasePermission):
    """
    Verifica que el usuario en sesion sea el mismo quien creo el obj
    """

    def has_object_permission(self, request, view, obj):
    	
        return obj.author == request.user