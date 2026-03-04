# YFlow Deployment Guide

## Environment Variables Setup

Create a `.env` file with the following YFlow-specific configurations:

```bash
# Basic YFlow Configuration
AP_APP_TITLE=YFlow
AP_FRONTEND_URL=https://app.yflow.ru
AP_FAVICON_URL=https://cdn.yflow.ru/favicon.ico

# Database Configuration
AP_POSTGRES_DATABASE=yflow_yflow
AP_POSTGRES_HOST=postgres
AP_POSTGRES_PORT=5432
AP_POSTGRES_USERNAME=yflow_user
AP_POSTGRES_PASSWORD=your_secure_password

# Redis Configuration  
AP_REDIS_HOST=redis
AP_REDIS_PORT=6379

# Security
AP_API_KEY=your_secure_api_key
AP_ENCRYPTION_KEY=your_32_character_hex_key
AP_JWT_SECRET=your_jwt_secret

# YFlow Specific
AP_DEFAULT_LOCALE=ru
AP_TEMPLATES_SOURCE_URL="https://app.yflow.ru/api/v1/flow-templates"
AP_ENVIRONMENT=prod
```

## Docker Compose for YFlow

Update your `docker-compose.yml`:

```yaml
services:
  yflow-yflow:
    image: yflow/yflow:latest
    container_name: yflow-yflow
    restart: unless-stopped
    ports:
      - '80:80'
      - '443:443'
    depends_on:
      - postgres
      - redis
    env_file: .env
    volumes:
      - ./cache:/usr/src/app/cache
      - ./ssl:/etc/ssl/certs
    networks:
      - yflow

  postgres:
    image: 'postgres:14.4'
    container_name: yflow-postgres
    restart: unless-stopped
    env_file: .env
    environment:
      - 'POSTGRES_DB=${AP_POSTGRES_DATABASE}'
      - 'POSTGRES_PASSWORD=${AP_POSTGRES_PASSWORD}'
      - 'POSTGRES_USER=${AP_POSTGRES_USERNAME}'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - yflow

  redis:
    image: 'redis:7.0.7'
    container_name: yflow-redis
    restart: unless-stopped
    volumes:
      - 'redis_data:/data'
    networks:
      - yflow

volumes:
  postgres_data:
  redis_data:

networks:
  yflow:
```

## SSL Certificate Setup

1. Install certbot:
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

2. Obtain SSL certificate:
```bash
sudo certbot --nginx -d app.yflow.ru
```

3. Auto-renewal:
```bash
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Database Migration

After starting the services, run the database migrations:

```bash
# Access the container
docker exec -it yflow-Yflowbash

# Run migrations
npm run migration:run
```

## YKassa Integration Setup

1. Create YKassa shop in your YKassa account
2. Add environment variables:
```bash
YKASSA_SHOP_ID=your_shop_id
YKASSA_SECRET_KEY=your_secret_key
```

3. The YKassa webhook endpoint: `https://app.yflow.ru/api/ykassa/webhooks`

## Verification Steps

1. Check service status:
```bash
docker-compose ps
```

2. View logs:
```bash
docker-compose logs -f yflow-yflow
```

3. Test the application:
   - Visit https://app.yflow.ru
   - Check YFlow branding is displayed
   - Test user registration
   - Verify Russian locale is default

## Monitoring

Set up monitoring for:
- Application health: `https://app.yflow.ru/api/health`
- Database connections
- Redis connections
- SSL certificate expiry

## Backup Strategy

1. Database backup:
```bash
docker exec yflow-postgres pg_dump -U yflow_user yflow_Yflow> backup_$(date +%Y%m%d).sql
```

2. Redis backup:
```bash
docker exec yflow-redis redis-cli BGSAVE
```

## Troubleshooting

Common issues and solutions:

1. **SSL Certificate Issues**: Check nginx configuration and certificate paths
2. **Database Connection**: Verify PostgreSQL credentials and network connectivity
3. **Redis Connection**: Ensure Redis is accessible from the application container
4. **YKassa Integration**: Check webhook URL and API credentials

## Support

For YFlow-specific issues:
- Documentation: https://docs.yflow.ru
- Community: https://community.yflow.ru  
- Feedback: https://feedback.yflow.ru
