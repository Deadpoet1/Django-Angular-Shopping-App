

from django.urls import path,include
from django.contrib.auth import views as auth_views
from rest_framework.routers import DefaultRouter
from .views import UserLoginView,HomeViewSet
from . import views
router = DefaultRouter()
router.register(r'products',views.ProductViewSet)

router.register(r'orders', views.OrderViewSet)
router.register(r'users', views.UserSignupView, basename='signup')
urlpatterns = [
  path('api/',include(router.urls)),
  path('api/login/', UserLoginView.as_view(), name='login'),
  path('',HomeViewSet.as_view({'get':'list'}))
]

  

