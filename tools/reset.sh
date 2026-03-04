rm -rf ~/.yflow
docker compose down
docker volume rm yflow_redis_data
docker volume rm yflow_postgres_data
echo "Deleted Yflowdockers and volumes."
