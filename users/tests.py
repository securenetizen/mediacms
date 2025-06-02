from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model

from .models import User

class LoginTestCase(TestCase):
    """Test cases for user authentication"""
    
    def setUp(self):
        # Create a test user
        self.username = "testuser"
        self.password = "securepassword123"
        self.email = "test@example.com"

        # Superuser creds
        self.superuser_username = "test_superuser"
        self.superuser_password = "superuser123"
        self.superuser_email = "superuser@example.com"
        
        self.user = User.objects.create_user(
            username=self.username,
            email=self.email,
            password=self.password,
        )

        self.superuser = User.objects.create_superuser(
            username=self.superuser_username,
            email=self.superuser_email,
            password=self.superuser_password
        )
        
        # Setup the test client
        self.client = Client()
    
    def test_successful_login(self):
        """Test that a (regular) user can successfully log in with correct credentials"""
        # Get the login URL
        login_url = reverse('account_login')
        
        # Attempt to login with correct credentials
        response = self.client.post(login_url, {
            'login': self.username,  # allauth uses 'login' for username or email
            'password': self.password,
        })

        # Check if the login was successful (should redirect to home page)
        self.assertRedirects(response, '/', fetch_redirect_response=False)
        
        # Verify the user is authenticated
        self.assertTrue(response.wsgi_request.user.is_authenticated)
        self.assertEqual(response.wsgi_request.user.username, self.username)

    def test_superuser_redirect(self):
        """Test that checks if a new superuser on creation has been redirected to the MFA setup page"""
        login_url = reverse('account_login')
        response = self.client.post(login_url, {
            'login': self.superuser_username,
            'password': self.superuser_password
        })

        # Check if the login was successful (should redirect to home page)
        self.assertRedirects(response, '/accounts/2fa/totp/activate', fetch_redirect_response=False)
        
        # Verify the user is authenticated
        self.assertTrue(response.wsgi_request.user.is_authenticated)
        self.assertEqual(response.wsgi_request.user.username, self.superuser_username)
    
    # TODO: implement additional possible use cases for testing
