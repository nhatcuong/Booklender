from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from shelf.api.views import BookViewSet, ReaderViewSet
from shelf.api.views import lend, get_back
from shelf.api.views import current_borrower_of_book, purge

router = DefaultRouter()
router.register(r'books', BookViewSet, base_name='book')
router.register(r'readers', ReaderViewSet, base_name='reader')

urlpatterns = [
    url(r'', include(router.urls)),
    url(r'lend/$', lend),
    url(r'getBack/$', get_back),
    url(r'currentBorrowerOfBook/$', current_borrower_of_book),
    url(r'purge/$', purge),
]