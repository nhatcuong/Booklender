from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions

from shelf.api import utils
from shelf.api.serializers import BookSerializer, ReaderSerializer
from shelf.models import Book, Reader, Lending


class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        qs = Book.objects.all()
        qs = qs.filter(user_id=self.request.user.id)
        qs = qs.order_by('title')
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReaderViewSet(viewsets.ModelViewSet):
    serializer_class = ReaderSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        qs = Reader.objects.all()
        qs = qs.filter(user_id=self.request.user.id)
        qs = qs.order_by('name')
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(http_method_names=('POST',))
@permission_classes((permissions.IsAuthenticated,))
def lend(request):
    book, error_response_book = utils.get_book(request)
    reader, error_response_reader = utils.get_reader(request)
    if error_response_book or error_response_reader:
        return error_response_book or error_response_reader
    if book.current_lending_id is not None:
        return Response({'error': 'book already lent to someone'},
                        status.HTTP_400_BAD_REQUEST)
    book.lend_to_reader(reader)
    return Response({'done': 'sucess'}, status=status.HTTP_202_ACCEPTED)


@api_view(http_method_names=('POST',))
@permission_classes((permissions.IsAuthenticated,))
def get_back(request):
    book, error_response = utils.get_book(request)
    if error_response:
        return error_response
    book.get_back_if_lended()
    return Response({'done': 'sucess'},status=status.HTTP_202_ACCEPTED)


@api_view(http_method_names=('GET',))
@permission_classes((permissions.IsAuthenticated,))
def current_borrower_of_book(request):
    book, error_response = utils.get_book(request)
    if error_response:
        return error_response
    if book.current_lending:
        borrower_id = book.current_lending.borrower_id
        borrower = Reader.objects.get(pk=borrower_id)
        return Response(ReaderSerializer(borrower).data,
                        status.HTTP_200_OK)
    return Response({'error': 'book is not currently lended'},
                    status.HTTP_400_BAD_REQUEST)


@api_view(http_method_names=('GET', 'POST',))
def purge(request):
    if request.user.is_superuser:
        Book.objects.all().delete()
        Reader.objects.all().delete()
        Lending.objects.all().delete()
        return Response(status=status.HTTP_202_ACCEPTED)
    return Response(status=status.HTTP_404_NOT_FOUND)
