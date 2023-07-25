const axios = require('axios');
const logger = require('loglevel');

class FlowFlowClient {
    constructor(apiToken, debug = false) {
        if (apiToken === undefined) {
            throw new Error("apiToken must be supplied during initialization. See: https://flowflow.ai/settings/api-keys");
        }
        this.apiToken = apiToken;
        this.debug = debug;
        this.pollMaxIterations = 10;
    }

    async startWorkflow(data, workflowId) {
        let host = this.debug ? 'http://localhost.localdomain:8000' : 'https://flowflow.ai';
        const url = `${host}/api/v1/workflow/start/${workflowId}`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiToken}`,
        };

        const response = await axios.post(url, data, { headers });
        const responseData = response.data;

        if (responseData.status !== 'OK') {
            throw new Error(`Error starting workflow: ${responseData.message}`);
        }

        let progressUrl = responseData.progress_api_url;
        let counter = 0;
        
        while (true) {
            logger.debug("poll");

            let progressResponse = await axios.get(progressUrl, { headers });
            let progressData = progressResponse.data;

            if (progressData.status !== 'OK') {
                throw new Error(`Error starting workflow: ${responseData.message}`);
            }

            if (progressData.status === 'FINISHED') {
                return { progressData };
            } else {
                // Wait for 2 seconds before next poll
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            counter += 1;
            if (counter >= this.pollMaxIterations) {
                break;
            }
        }

        progressData.status = 'Error';
        progressData.message = `Workflow did not finish in ${this.poll_max_iterations} polls. You can change the max poll iterations using the poll_max_iterations parameter during the client initialization.`;

        return progressData;
    }
}

module.exports = FlowFlowClient;
