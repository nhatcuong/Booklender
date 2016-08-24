from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from shelf.api import utils
from shelf.api.serializers import BookSerializer, ReaderSerializer
from shelf.models import Book, Reader, Lending


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('title')
    serializer_class = BookSerializer


class ReaderViewSet(viewsets.ModelViewSet):
    queryset = Reader.objects.all().order_by('name')
    serializer_class = ReaderSerializer


@api_view(http_method_names=('POST',))
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
def get_back(request):
    book, error_response = utils.get_book(request)
    if error_response:
        return error_response
    book.get_back_if_lended()
    return Response({'done': 'sucess'},status=status.HTTP_202_ACCEPTED)


@api_view(http_method_names=('GET',))
def current_borrower_of_book(request):
    book, error_response = utils.get_book(request)
    if error_response:
        return error_response
    if book.current_lending:
        borrower_id = book.current_lending.borrower_id
        borrower = Reader.objects.get(pk=borrower_id)
        return Response(ReaderSerializer(borrower).data,
                        status.HTTP_200_OK)
    return Response({'error': 'book is not currently lent'},
                    status.HTTP_400_BAD_REQUEST)


@api_view(http_method_names=('GET', 'POST',))
def purge(_):
    Book.objects.all().delete()
    Reader.objects.all().delete()
    Lending.objects.all().delete()
    return Response(status=status.HTTP_202_ACCEPTED)
