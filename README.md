# Launch asynchronous tasks in separate kubernetes pod

This repository is an example on how you can use NodeJS to start a resource-intensive task outside the api's process in a kubernetes pod.

## Build the fake resource intensive Docker image

Go to the process folder: ```cd process```

Ensure you are logged in to your docker hub account with the command ```docker login```.   
   
After that, you can build your image with ```docker build -t $dockerhubaccount/fake-js-process-fifty-seconds:1.0.0 .``` (replace $dockerhubaccount with your docker username )    
   
And finally, push it to your repository: ```docker push $dockerhubaccount/fake-js-process-fifty-seconds:1.0.0``` (replace $dockerhubaccount with your docker username)   

## Run the API locally 

You need to duplicate the config.example.mjs and name it config.mjs.   

Update the config.mjs file and replace the name of the image by the image you just built.  

You need to install and run minikube: https://minikube.sigs.k8s.io/docs/start/

This project was made to be ran on Minikube locally, so you need to set your host machine IP in the config.mjs file. You can find this IP using ```minikube ssh grep host.minikube.internal /etc/hosts | cut -f1```

## How to use

Once you configured both variable in config.mjs, you should be able to run: ```npm run start```

Calling POST /start should start a new pod in minikube. This endpoint returns a taskId that you can use to get the status of the task. 

GET /:taskId will return the status of the task.

## Learn more

Check out the article I wrote around this use case here: WHEN PUBLISHED
