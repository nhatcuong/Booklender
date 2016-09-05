from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView


class LendingPageView(LoginRequiredMixin, TemplateView):
    login_url = '/login/'
    template_name = 'lendingpage.html'
