from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView, FormView
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.conf import settings


class LendingPageView(LoginRequiredMixin, TemplateView):
    login_url = '/'
    template_name = 'lending_page.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context.update({'base_url': getattr(settings,'BASE_URL')})
        return context


class SignupView(FormView):
    form_class = UserCreationForm
    template_name = 'registration/signup.html'
    success_url = '/home'

    def get_context_data(self, **kwargs):
        context_data = super().get_context_data(**kwargs)
        all_errors = list(context_data['form'].errors.values())
        if all_errors:
            context_data['first_error_msg'] = all_errors[0][0]
        return context_data

    def form_valid(self, form):
        user = form.save()
        if user:
            login(self.request, user)
        return super().form_valid(form)


class AboutView(TemplateView):
    template_name = 'about.html'
    is_about_page = True

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['is_about_page'] = True
        return context
