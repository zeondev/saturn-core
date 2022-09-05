// Using the Preloader is optional, this is just to show how packages can load other packages.

let pid = -1;

export default {
    // Edit the details below to change the preloaded packages
    run: async (PROCESS_NAME, PID, Package, Returns, Arguments) => {
        // Start the Hello World example app!
        await Core.pkg.run('apps', 'Saturn', 'HelloWorld', "Custom arguments!");
    }
}