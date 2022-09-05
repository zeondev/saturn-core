var Core = {
    pkg: {
        run: async(category, author, name, args, owned_by) => {
            let PKG_URL = `/packages/${category}/${author}-${name}.js`;
            try {
                const PID = Core.processList.length;
                const PROCESS_NAME = `${category}:${author}-${name}`
                let Package = await
                import (PKG_URL);
                if (Package.default) {
                    function Returns(obj) {
                        Core.processList[PID] = {
                            name: PROCESS_NAME,
                            pid: PID,
                            owner: owned_by || -1,
                            proc: obj
                        };
                        Returns = null;

                        return { obj };
                    }
                    await Package.default.run(
                        PROCESS_NAME,
                        PID,
                        Package,
                        Returns,
                        args,
                        owned_by || -1,
                    );
                } else {
                    console.log('Package does not have a default property.');
                    return { type: 'error', message: 'PkgNoDefault' }
                }
            } catch (e) {
                console.log(`ERROR in ${name}:`, e);
                return false;
            }
        },
        get: async(category, author, name) => {
            let PKG_URL = `/packages/${category}/${author}-${name}.js`;
            console.log(PKG_URL)

            const d = await fetch(PKG_URL);
            return await d.text();
        },
    },
    processList: [],
}

Core.pkg.run('service', 'Saturn', 'Preload');

// folder structure:
// src/public/packages/CATEGORY/AUTHOR-PKG_NAME.js
// src/public/packages/Ui/ZeonDev-Desktop.js