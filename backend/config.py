"""
Configuration management for different environments
"""
import os
from dotenv import load_dotenv

load_dotenv()

class BaseConfig:
    """Base configuration shared by all environments"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = False
    TESTING = False
    
    # CORS settings
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000')
    
    # Flask settings
    JSON_SORT_KEYS = False
    PROPAGATE_EXCEPTIONS = True

class DevelopmentConfig(BaseConfig):
    """Development environment configuration"""
    DEBUG = True
    ENV = 'development'

class ProductionConfig(BaseConfig):
    """Production environment configuration"""
    DEBUG = False
    ENV = 'production'
    # In production, be more restrictive with CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')

class TestingConfig(BaseConfig):
    """Testing environment configuration"""
    TESTING = True
    DEBUG = True
    ENV = 'testing'

# Config mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config(env='development'):
    """Get config class for environment"""
    return config.get(env, config['default'])
