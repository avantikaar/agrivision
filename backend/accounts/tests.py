from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_user(self):
        r = self.client.post('/api/auth/register/', {
            'username': 'test1',
            'password': 'testpass123',
            'district': 'Bangalore',
        }, format='json')
        self.assertEqual(r.status_code, 201)
        self.assertTrue(User.objects.filter(username='test1').exists())

    def test_login_returns_tokens(self):
        User.objects.create_user(username='test2', password='testpass123')
        r = self.client.post('/api/auth/login/', {
            'username': 'test2',
            'password': 'testpass123',
        }, format='json')
        self.assertEqual(r.status_code, 200)
        self.assertIn('access', r.data)


class ReportTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='farmer', password='testpass123', district='Bangalore'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_list_reports_empty(self):
        r = self.client.get('/api/reports/')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data['count'], 0)

    def test_reports_require_auth(self):
        c = APIClient()
        r = c.get('/api/reports/')
        self.assertEqual(r.status_code, 401)


class OutbreakTests(TestCase):
    def test_outbreak_list_requires_auth(self):
        c = APIClient()
        r = c.get('/api/outbreaks/')
        self.assertEqual(r.status_code, 401)