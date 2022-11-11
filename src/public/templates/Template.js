let pid = -1;

export default {
    run: async (Core, PROCESS_NAME, PID, Package, Returns, Arguments) => {
        pid = PID;

        // Do any asynchronous actions here, refer to assets/core.js for how it works

        Returns({
            kill: _ => {
                // Clean up process
                Core.cleanupProcess(PID);
            }
        });
    },
}