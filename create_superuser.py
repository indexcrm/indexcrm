import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
username = 'admin@example.com'
password = 'adminpassword123'

if not User.objects.filter(email=username).exists() and not User.objects.filter(username=username).exists():
    try:
        user = User.objects.create_superuser(username='admin', email=username, password=password)
    except Exception as e:
        try:
            user = User.objects.create_superuser(email=username, password=password)
        except Exception as e2:
            print("Could not create:", e2)
    print(f"Admin user created: {username} / {password}")
else:
    user = User.objects.filter(email=username).first() or User.objects.filter(username=username).first()
    if user:
        user.set_password(password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        print(f"Admin user updated: {username} / {password}")
