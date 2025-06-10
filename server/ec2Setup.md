## connect EC2 via SSH client
{
    # do all the steps inside GIT BASH

    // go inside keys folder and run this command
    {
        chmod 400 "online-compiler-server.pem"
    }

    // then run this command
    {
        ssh -i "online-compiler-server.pem" ec2-user@ec2-13-232-118-150.ap-south-1.compute.amazonaws.com
    }

}

## aws configure
# enter all the details

## Now, you have logged in (IAM)

## update packages
# sudo yum update -y

## install docker
# sudo yum install -y docker

## start docker service
# sudo service docker start

## Add your user to the docker group (to run without sudo)
# sudo usermod -a -G docker ec2-user

## reboot the EC2 instance
# sudo reboot

## wait for 1 to 2 min (bcoz EC2 is restarting)

## connect to EC2 again
# ssh -i "online-compiler-server.pem" ec2-user@ec2-13-232-118-150.ap-south-1.compute.amazonaws.com

## check if docker is installed or not
# docker info

## check for images
# docker images

## sometimes after reboot, configure settings gets reset, if changed, then enter your access details
# aws configure

## pull the docker image from ECR using image URI
# docker pull <image URI>

## if you encounter *Error response from daemon: no basic auth credentials*
# <run the first command of the ***ECR's view push command***>

## now again run the pull image command
# docker pull <image URI>

## now check for images
# docker images

## create a .env file
# nano .env

## copy all the content from our .env to ec2's .env

## check using cat command
# cat .env

## spin the container
# docker run --env-file .env -d -p 5000:5000 --name online-compiler-container fc00bc318574

## check if container is running or not
# docker ps


