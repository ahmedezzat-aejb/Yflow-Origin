# Update YflowDocker Instances
echo "Updating yflow..."
git pull
docker compose pull
docker compose up -d --remove-orphans
echo "Successfully updated yflow."
