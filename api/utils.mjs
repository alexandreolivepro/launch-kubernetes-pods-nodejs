import { config } from "./config.mjs";

export const createNewPod = async (podName, k8sApi) => {
    const { body: pod } = await k8sApi.createNamespacedPod('default', {
        metadata: {
            name: podName,
        },
        spec: {
            restartPolicy: 'Never',
            hostAliases: config.localMinikubeHostIp ? [
                {
                    ip: config.localMinikubeHostIp,
                    hostnames: ['host.minikube.internal'],
                }
            ] : [],
            containers: [{
                name: podName,
                image: config.dockerImage,
                env: [
                    { name: 'TASK_ID', value: podName },
                    { name: 'WEBHOOK', value: `http://host.minikube.internal:3000/webhook` },
                ],
            }],
        },
    });

    return pod;
}