containerName=tree-studio-server
port_out=8999
port_in=9000
imageName=ts-flask-image:latest

echo 'Try to get container ID which name is '$containerName

containerID=$(docker ps -a --filter "NAME=$containerName" --format "{{.ID}}")
if ["$containerID" = ""]
then
    echo "Can't find container: $containerName"
else
    echo "container ID: "$containerID
    echo "Stop server..."
    docker rm -f $containerID
    echo "Stop server DONE"
fi

echo "Try to reboot server..."
docker run -tid --name $containerName -p $port_out:$port_in \
-v $(pwd):/flask_server \
$imageName python main.py

echo "Reboot server DONE"

exit 0