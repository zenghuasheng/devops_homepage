// background.js
// background.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('Received message:', request);
    if (request.action === 'getSprints') {
        // Define the GraphQL query and variables
        // {"query":"\n      query QuerySprints {\n
        // sprints(\n        filter: {\n          project_in: $projectUUIDList\n          uuid_in: $sprintDepList\n        },\n        orderBy: $orderBy\n      ) {\n          uuid\n          progress\n        }\n      }\n    ","variables":{"projectUUIDList":["KuZfE9scT2ca5BXF"],"orderBy":{"name":"ASC"},"sprintDepList":["HxN3hM66"]}}
        let sprintQuery = `{
sprints(
    filter: $filter 
    orderBy: $orderBy
) {
    uuid
    name
}
        }`

        // Define the queries and variables for each endpoint
        let sprintVariables = {
            filter: {
                project_in: ["KuZfE9scT2ca5BXF"],
                statusCategory_in: ["in_progress"]
            },
            orderBy: {name: "ASC"}
        }
        const fetchPromise1 = fetch('https://our.ones.pro/project/api/project/team/RDjYMhKq/items/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add other necessary headers
            },
            body: JSON.stringify({
                query: sprintQuery,
                variables: sprintVariables,
            }),
        })
            .then(response => response.json())
            .then(data => {
                // {"data":{"sprints":[{"progress":5005153,"uuid":"HxN3hM66"}]}}
                return data.data.sprints;
            })
            .catch(error => {
                console.error('Error:', error);
                return [];
            });


        Promise.all([fetchPromise1])
            .then(([sprints]) => {
                const allSprints = [...sprints];
                sendResponse(allSprints);
            })
            .catch(error => {
                console.error('Error :', error);
                sendResponse([]);
            });


        // Keep the message channel open until the asynchronous request is completed
        return true;
    }
});
