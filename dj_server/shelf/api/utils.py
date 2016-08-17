from django.core.exceptions import ObjectDoesNotExist
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework import status
from rest_framework.response import Response

from shelf.models import Book, Reader


def get_book(request):
    try:
        book = Book.objects.get(pk=request.data['bookId'])
    except KeyError:
        return None, Response({'error': 'bookId is required'},
                              status.HTTP_400_BAD_REQUEST)
    except ObjectDoesNotExist:
        return None, Response({'error': 'book not found'},
                              status.HTTP_404_NOT_FOUND)
    return book, None


def get_reader(request):
    try:
        reader = Reader.objects.get(pk=request.data['readerId'])
    except KeyError:
        return None, Response({'error': 'readerId is required'},
                              status.HTTP_400_BAD_REQUEST)
    except ObjectDoesNotExist:
        return None, Response({'error': 'reader not found'},
                              status.HTTP_404_NOT_FOUND)
    return reader, None
