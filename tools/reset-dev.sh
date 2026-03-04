rm -rf ~/.yflow
rm -rf node_modules/
docker container rm yflow_devcontainer_db_1 --force
docker container rm yflow_devcontainer_redis_1 --force
docker container rm yflow_devcontainer_app_1 --force
docker volume rm yflow_devcontainer_redis_data
docker volume rm yflow_devcontainer_postgres_data

echo "Deleted Yflowdev dockers and volumes."
