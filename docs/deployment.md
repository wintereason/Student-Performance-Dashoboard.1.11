# Deployment Guide

Complete guide for deploying the Student Performance Dashboard to production.

## Pre-Deployment Checklist

- [ ] All tests passing (23/23 endpoints)
- [ ] Production environment variables configured
- [ ] CORS origins updated for production domain
- [ ] SSL/HTTPS certificate obtained
- [ ] Database backups configured
- [ ] Monitoring and logging set up
- [ ] Load balancer configured (if needed)

---

## Option 1: Docker Compose Deployment

### Prerequisites
- Docker 20.10+
- Docker Compose 1.29+
- Linux VM or server

### Step 1: Prepare the Server

```bash
# SSH into your server
ssh user@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 2: Clone and Configure

```bash
# Clone the repository
git clone <your-repo-url> student-performance
cd student-performance

# Create production environment file
cat > backend/.env.production << EOF
FLASK_ENV=production
FLASK_DEBUG=False
PORT=5000
CSV_FILE_PATH=data/student_data.csv
SECRET_KEY=$(python -c 'import secrets; print(secrets.token_hex(32))')
EOF
```

### Step 3: Build and Deploy

```bash
# Navigate to infrastructure directory
cd infra

# Build and start containers
docker-compose -f docker-compose.prod.yml up -d --build

# Verify containers are running
docker-compose -f docker-compose.prod.yml ps
```

### Step 4: Verify Deployment

```bash
# Test backend health
curl http://localhost:5000/api/health

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Test frontend
curl http://localhost/
```

### Production Docker Compose Configuration

**File**: `infra/docker-compose.prod.yml`

```yaml
version: '3.8'

services:
  backend:
    build: ../backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - FLASK_DEBUG=False
    volumes:
      - ./backend/data:/app/data
    restart: always

  frontend:
    build: ../frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always

networks:
  default:
    name: student-perf-network
```

---

## Option 2: Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (EKS, GKE, AKS, or self-hosted)
- kubectl configured
- Docker images pushed to registry

### Step 1: Build and Push Images

```bash
# Build backend image
cd backend
docker build -t your-registry/student-perf-api:latest .
docker push your-registry/student-perf-api:latest

# Build frontend image
cd ../frontend
docker build -t your-registry/student-perf-frontend:latest .
docker push your-registry/student-perf-frontend:latest
```

### Step 2: Create Kubernetes Manifests

**backend-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: student-perf-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: student-perf-api
  template:
    metadata:
      labels:
        app: student-perf-api
    spec:
      containers:
      - name: api
        image: your-registry/student-perf-api:latest
        ports:
        - containerPort: 5000
        env:
        - name: FLASK_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: student-perf-api-service
spec:
  selector:
    app: student-perf-api
  ports:
    - protocol: TCP
      port: 5000
      targetPort: 5000
  type: ClusterIP
```

**frontend-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: student-perf-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: student-perf-frontend
  template:
    metadata:
      labels:
        app: student-perf-frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/student-perf-frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: student-perf-frontend-service
spec:
  selector:
    app: student-perf-frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

### Step 3: Deploy

```bash
# Create namespace
kubectl create namespace student-perf

# Deploy applications
kubectl apply -f backend-deployment.yaml -n student-perf
kubectl apply -f frontend-deployment.yaml -n student-perf

# Check deployment status
kubectl get deployments -n student-perf
kubectl get services -n student-perf
```

---

## Option 3: AWS Elastic Beanstalk

### Step 1: Prepare Application

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
eb init -p python-3.9 student-performance --region us-east-1
```

### Step 2: Create Environment

```bash
# Create environment
eb create production-env

# Deploy application
eb deploy
```

### Step 3: Configure

```bash
# Set environment variables
eb setenv FLASK_ENV=production FLASK_DEBUG=False

# View logs
eb logs

# Monitor
eb open
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --standalone -d your-domain.com

# Configure Nginx
sudo nano /etc/nginx/sites-available/default
```

**Nginx Configuration**
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Monitoring and Logging

### Application Logs

```bash
# Docker Compose
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# Kubernetes
kubectl logs deployment/student-perf-api -n student-perf
kubectl logs deployment/student-perf-frontend -n student-perf
```

### Health Checks

```bash
# Configure health check endpoint
curl https://your-domain.com/api/health
```

### Monitoring Tools

**Recommended:**
- Prometheus for metrics
- Grafana for visualization
- ELK Stack for logging
- New Relic for APM

---

## Database Backup Strategy

### CSV Backup (Current Implementation)

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups/student-perf"
DATE=$(date +"%Y%m%d_%H%M%S")
cp backend/data/student_data.csv "$BACKUP_DIR/student_data_$DATE.csv"

# Keep last 30 days
find $BACKUP_DIR -name "*.csv" -mtime +30 -delete
```

### Add to Crontab

```bash
# Backup at midnight daily
0 0 * * * /path/to/backup-script.sh
```

### S3 Backup (AWS)

```bash
# Backup to S3
aws s3 cp backend/data/student_data.csv s3://your-bucket/backups/student_data_$(date +%Y%m%d).csv
```

---

## Performance Optimization

### Frontend Optimization

```bash
# Build optimized production bundle
npm run build

# Verify bundle size
npm run build -- --stats
```

### Backend Optimization

1. **Enable Gzip Compression**
```nginx
gzip on;
gzip_types text/plain application/json;
```

2. **Use Gunicorn Workers**
```bash
gunicorn -w 4 --threads 2 -b 0.0.0.0:5000 wsgi:app
```

3. **Cache CSV Data**
- Implement file caching mechanism
- Consider moving to database for large datasets

---

## Security Configuration

### Environment Variables

**Never commit secrets to version control!**

```bash
# backend/.env.production
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=<generate-strong-key>
CORS_ORIGINS=https://your-domain.com
DATABASE_URL=<if-using-db>
```

### CORS Configuration

Update `backend/app.py`:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://your-domain.com"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})
```

### Rate Limiting

```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=lambda: request.remote_addr)

@app.route('/api/students/')
@limiter.limit("100 per hour")
def get_students():
    ...
```

---

## Rollback Procedure

### Docker Compose

```bash
# Stop current version
docker-compose -f docker-compose.prod.yml down

# Start previous version
docker-compose -f docker-compose.prod.yml up -d \
  --build backend:previous-tag frontend:previous-tag
```

### Kubernetes

```bash
# Rollback to previous version
kubectl rollout undo deployment/student-perf-api -n student-perf
kubectl rollout undo deployment/student-perf-frontend -n student-perf
```

---

## Troubleshooting Deployment

| Issue | Solution |
|-------|----------|
| Backend won't start | Check logs: `docker logs <container-id>` |
| Frontend blank page | Check CORS, verify API URL in .env |
| API timeout | Increase Gunicorn workers |
| High memory usage | Add resource limits to containers |
| Database connection error | Verify CSV file path and permissions |

---

## Production Checklist

- [ ] SSL/HTTPS configured
- [ ] Environment variables set correctly
- [ ] Backups automated and tested
- [ ] Monitoring and alerting configured
- [ ] CORS origins updated
- [ ] Rate limiting enabled
- [ ] All endpoints tested (23/23 passing)
- [ ] Security headers configured
- [ ] Logs centralized
- [ ] Auto-scaling configured

---

**Last Updated**: December 12, 2025

