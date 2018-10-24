from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.renderers import CoreJSONRenderer
from rest_framework.schemas import SchemaGenerator
from rest_framework_swagger import renderers
from rest_framework.response import Response


class MySchemaGenerator(SchemaGenerator):
    title = 'REST API Index'

    def get_link(self, path, method, view):
        link = super(MySchemaGenerator, self).get_link(path, method, view)
        link._fields += self.get_core_fields(view)
        return link

    def get_core_fields(self, view):
        if hasattr(view, "get_core_fields"):
            return getattr(view, 'get_core_fields')(coreapi, coreschema)
        return ()


class SwaggerSchemaView(APIView):
    _ignore_model_permissions = True
    exclude_from_schema = True
    permission_classes = [AllowAny]
    renderer_classes = [
        CoreJSONRenderer,
        renderers.OpenAPIRenderer,
        renderers.SwaggerUIRenderer
    ]

    def get(self, request):
        generator = MySchemaGenerator(
            title="Perfil API",
            # url=url,
            # patterns=patterns,
            # urlconf=urlconf
        )
        schema = generator.get_schema(request=request)

        if not schema:
            raise exceptions.ValidationError(
                'The schema generator did not return a schema Document'
            )

        return Response(schema)
