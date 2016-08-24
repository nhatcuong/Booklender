from django.conf.urls import url, include
from django.contrib.auth.forms import UserCreationForm
from django.views.generic.edit import CreateView

from shelf.views import LendingPageView

urlpatterns = [
    url(r'^api/', include('shelf.api.urls')),
    url(r'^$', LendingPageView.as_view()),
    url(r'^', include('django.contrib.auth.urls')),
    url(r'^signup/', CreateView.as_view(
        template_name='registration/signup.html',
        form_class=UserCreationForm,
        success_url='/'
    )),
]
