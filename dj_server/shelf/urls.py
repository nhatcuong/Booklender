from django.conf.urls import url, include
from django.contrib.auth.views import *

from shelf.views import LendingPageView, SignupView

urlpatterns = [
    url(r'^api/', include('shelf.api.urls')),
    url(r'^home$', LendingPageView.as_view(), name='lending_page'),

    url(r'^$', login, kwargs={'redirect_authenticated_user': True}, name='login'),
    url(r'^logout/', logout_then_login, kwargs={'login_url': '/'}, name='logout'),
    # url(r'^signup/', CreateView.as_view(
    #     template_name='registration/signup.html',
    #     form_class=UserCreationForm,
    #     success_url='/'
    # ), name='signup'),
    url(r'^signup/', SignupView.as_view(), name='signup'),
]

