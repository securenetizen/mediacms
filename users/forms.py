from django import forms
from django.utils.translation import gettext_lazy as _
from allauth.mfa.base.forms import AuthenticateForm, ReauthenticateForm
from allauth.mfa.totp.forms import ActivateTOTPForm

from allauth.account import app_settings
from .models import Channel, User

class CustomAuthenticateForm(AuthenticateForm):
    """This form is fetched for standard authentication,
    and represents both TOTP authenticator code and recovery codes."""
    
    code = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "placeholder": _(""), 
                "class": "otp-hidden-input",
                "inputmode": "numeric"
            },
        )
    )

class CustomActivateTOTPForm(ActivateTOTPForm):
    """This form is fetched when the user is
    setting up authentication"""

    code = forms.CharField(
        max_length=6,
        widget=forms.TextInput(
            attrs={
                "placeholder": _(""), 
                "autocomplete": "one-time-code",
                "class": "otp-hidden-input",
                "inputmode": "numeric",
                "pattern": "[0-9]{6}"
            },
        ),
    )

class CustomReauthenticateTOTPForm(CustomAuthenticateForm):
    pass

class Date_Input(forms.DateInput):
    input_type = "date"


class MultipleSelect(forms.CheckboxSelectMultiple):
    input_type = "checkbox"

class SignupForm(forms.Form):
    name = forms.CharField(max_length=100, label="Name")

    def signup(self, request, user):
        user.name = self.cleaned_data["name"]
        user.save()
        if self.data.get("subscribe"):
            from files.tasks import subscribe_user

            subscribe_user.delay(user.email, user.name)


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = (
            "name",
            "description",
            "email",
            "location_country",
            "home_page",
            "social_media_links",
            "logo",
            "notification_on_comments",
            "is_featured",
            "advancedUser",
            "is_manager",
            "is_editor",
            "allow_contact",
        )

    #        widgets = {
    #           'logo': forms.FileInput(),
    #      }

    def clean_logo(self):
        image = self.cleaned_data.get("logo", False)
        if image:
            if image.size > 2 * 1024 * 1024:
                raise forms.ValidationError("Image file too large ( > 2mb )")
            return image
        else:
            raise forms.ValidationError("Please provide a logo")

    def __init__(self, user, *args, **kwargs):
        super(UserForm, self).__init__(*args, **kwargs)
        self.fields.pop("is_featured")
        if not user.is_superuser:
            self.fields.pop("advancedUser")
            self.fields.pop("is_manager")
            self.fields.pop("is_editor")


class ChannelForm(forms.ModelForm):
    class Meta:
        model = Channel
        fields = ("banner_logo",)

    def clean_banner_logo(self):
        image = self.cleaned_data.get("banner_logo", False)
        if image:
            if image.size > 2 * 1024 * 1024:
                raise forms.ValidationError("Image file too large ( > 2mb )")
            return image
        else:
            raise forms.ValidationError("Please provide a banner")
