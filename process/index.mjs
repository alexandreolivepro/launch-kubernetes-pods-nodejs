const main = async () => {
    console.log('Starting process...');

    // Stays on for 50 seconds.
    await new Promise(resolve => setTimeout(resolve, 50000));

    try {
        const result = await fetch(process.env.WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                taskId: process.env.TASK_ID,
            }),
        });
        const json = await result.json();

        console.log(json);
    } catch (err) {
        console.error(err);
    }

    console.log('Process finished.');

    process.exit(0);
}

main();
