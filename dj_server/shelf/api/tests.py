from rest_framework.test import APITestCase, APIClient

from shelf.models import Book, Reader
from django.contrib.auth.models import User
from django.urls import reverse


class TestBookReaderLending(APITestCase):
    def setUp(self):
        user1 = User.objects.create_user(username='user1')
        user1.set_password('pass')
        user1.save()
        user2 = User.objects.create_user(username='user2')
        user2.set_password('pass')
        user2.save()
        self.book11 = Book.objects.create(title='book11', author='author', user=user1)
        self.book12 = Book.objects.create(title='book12', author='author', user=user1)
        self.book21 = Book.objects.create(title='book21', author='author', user=user2)
        self.reader11 = Reader.objects.create(name='reader', user=user1)
        self.reader12 = Reader.objects.create(name='reader12', user=user1)

        self.client_user1 = APIClient()
        self.client_user1.login(username='user1', password='pass')
        self.client_user2 = APIClient()
        self.client_user2.login(username='user2', password='pass')
        self.client_anonymous = APIClient()

    def test_book_retrieve(self):
        books1 = self.client_user1.get(reverse('book-list'))
        self.assertEqual(len(books1.data), 2)
        books_anonymous = self.client_anonymous.get(reverse('book-list'))
        self.assertEqual(books_anonymous.status_code, 403)

    def test_reader_retrieve(self):
        readers1 = self.client_user1.get(reverse('reader-list'))
        self.assertEquals(len(readers1.data), 2)
        readers_ano = self.client_anonymous.get(reverse('reader-list'))
        self.assertEqual(readers_ano.status_code, 403)

    def test_add_book(self):
        response = self.client_user1.post(
            reverse('book-list'),
            data={'title': 'book13', 'author': 'author'}
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['title'], 'book13')

        response = self.client_anonymous.post(
            reverse('book-list'),
            data={'title': 'book13', 'author': 'author'}
        )
        self.assertEqual(response.status_code, 403)

    def test_add_reader(self):
        response = self.client_user1.post(
            reverse('reader-list'),
            data={'name': 'reader12'}
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['name'], 'reader12')

        response = self.client_anonymous.post(
            reverse('reader-list'),
            data={'name': 'reader12'}
        )
        self.assertEqual(response.status_code, 403)

    def test_lend(self):
        response = self.client_user1.post(
            reverse('lend'),
            data={'bookId': self.book11.id, 'readerId': self.reader11.id}
        )
        self.assertEqual(response.status_code, 202)

        response = self.client_user1.post(
            reverse('lend'),
            data={'bookId': self.book11.id, 'readerId': self.reader12.id}
        )
        self.assertEqual(response.status_code, 400) #book already lended

        response = self.client_user2.post(
            reverse('lend'),
            data={'bookId': self.book21.id, 'readerId': self.reader11.id}
        )
        self.assertEqual(response.status_code, 401)

        response = self.client_user2.post(
            reverse('lend'),
            data={'bookId': self.book21.id, 'readerId': '-1'}
        )
        self.assertEqual(response.status_code, 404)

    def test_current_borrower_of_book(self):
        self.client_user1.post(
            reverse('lend'),
            data={'bookId': self.book11.id, 'readerId': self.reader11.id}
        )
        response = self.client_user1.get(
            reverse('current_borrower_of_book'),
        )
        self.assertEqual(response.status_code,400) #bookId required
        response = self.client_user1.get(
            reverse('current_borrower_of_book'),
            data={'bookId': self.book11.id}
        )
        self.assertEqual(response.data['id'], self.reader11.id)

        self.client_user1.post(
            reverse('get_back'),
            data={'bookId': self.book11.id}
        )
        response = self.client_user1.get(
            reverse('current_borrower_of_book'),
            data={'bookId': self.book11.id}
        )
        self.assertEqual(response.status_code, 400) #book not currently lended