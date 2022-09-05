let pid = -1;

export default {
    run: async (PROCESS_NAME, PID, Package, Returns, Arguments) => {
        pid = PID;

        // Create some text to be displayed
        let text = document.createElement('div');
        text.innerHTML = '<h1>Welcome to Saturn-Core!</h1><p>This is running from the <i><code>' + PROCESS_NAME + '</code></i> package!';
        document.body.appendChild(text);

        // Return early if you need to
        Returns({
            kill: _ => {
                // Clean up process
                console.log(`Process ${PROCESS_NAME} (${PID}) was killed.`)
            }
        });
    },
}