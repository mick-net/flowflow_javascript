const FlowFlowClient = require('./flowflow_client'); // Update path as necessary

async function test() {
    const apiToken = process.env.FLOWFLOW_API_TOKEN;
    // Replace with your actual API token: https://flowflow.ai/settings/api-keys
    const client = new FlowFlowClient(apiToken);

    const workflowId = ''; // Replace with your workflow ID

    const data = {
        "input": "The weather in Amsterdam is sunny", // Replace with your input
        //"node_start_id": '' // Optionally: Override the automatically detected start node
    };

    const { results, progressData } = await client.startWorkflow(data, workflowId);

    // Print the results of all nodes in the workflow that are configured to display the node results.
    console.log(results);
}

test().catch(err => console.error(err));
