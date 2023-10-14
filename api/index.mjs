import express from 'express';
import k8s from '@kubernetes/client-node';
import bodyParser from 'body-parser';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import { createNewPod } from './utils.mjs';

const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

app.get('/:taskId', async (req, res) => {
    const { body: pod } = await k8sApi.readNamespacedPod(req.params.taskId, 'default');
    const data = fs.readFileSync(`./${req.params.taskId}.json`, { encoding: 'utf-8' });
    res.json({ data: JSON.parse(data), pod: { status: pod.status.phase, startTime: pod.status.startTime } });
});

app.post('/webhook', async (req, res) => {
    try {
        const body = {
            status: 'FINISHED',
            message: 'Process finished successfully.',
            endTime: new Date().toISOString(),
        };
        
        fs.writeFileSync(`./${req.body.taskId}.json`, JSON.stringify(body));
        res.status(200).json(body)
    } catch (err) {
        res.status(500).json(err);
    };
})

app.post('/start', async (req, res) => {
    try {
        const podName = `asynchronous-pod-${uuid()}`;

        const pod = await createNewPod(podName);
        
        fs.writeFileSync(`./${podName}.json`, JSON.stringify({ status: 'START' }));
        res.status(200).json({
            taskId: pod.metadata.name,
            namespace: pod.metadata.namespace,
            uid: pod.metadata.uid,
        });
    } catch (err) {
        res.status(500).json(err);
    };
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})