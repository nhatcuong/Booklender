from django.conf.urls import url, include
from django.views.generic import TemplateView
from django.contrib.auth.views import *

from shelf.views import LendingPageView, SignupView, AboutView

urlpatterns = [
    url(r'^api/', include('shelf.api.urls')),
    url(r'^home$', LendingPageView.as_view(), name='home'),

    url(r'^$', login, kwargs={'redirect_authenticated_user': True}, name='login'),
    url(r'^logout/$', logout_then_login, kwargs={'login_url': '/'}, name='logout'),
    url(r'^signup/$', SignupView.as_view(), name='signup'),
    url(r'^about/$', AboutView.as_view(), name='about')
]

