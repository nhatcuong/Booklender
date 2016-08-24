from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response

from shelf.models import Book, Reader


def get_book(request):
    book_id = get_data_from_request('bookId', request)
    if not book_id:
        return None, Response({'error': 'bookId is required'},
                              status.HTTP_400_BAD_REQUEST)
    try:
        book = Book.objects.get(pk=book_id)
    except ObjectDoesNotExist:
        return None, Response({'error': 'book not found'},
                              status.HTTP_404_NOT_FOUND)
    return book, None


def get_reader(request):
    reader_id = get_data_from_request('readerId', request)
    if not reader_id:
        return None, Response({'error': 'readerId is required'},
                              status.HTTP_400_BAD_REQUEST)
    try:
        reader = Reader.objects.get(pk=reader_id)
    except ObjectDoesNotExist:
        return None, Response({'error': 'reader not found'},
                              status.HTTP_404_NOT_FOUND)
    return reader, None


def get_data_from_request(field, request):
    if request.data.get(field, None):
        return request.data[field]
    return request.GET.get(field, None)