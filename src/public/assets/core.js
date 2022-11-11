/**
 * The Zeon.dev Saturn project is licensed under GPL-v3. 
 * Please keep this comment in the file or link back to the original repository when using.
 * https://github.com/zeondev/saturn
 */

 'use strict';
 var Core = {
     get: async function (url, type = 'text') {
         return await (await fetch(url))[type]();
     },
     assets: {},
     /**
      * findEmptyPID — Check for open Process IDs (null ones)
      * @returns Number if successful, false if none available
      */
     findEmptyPID: function () {
         let r = Core.processList.findIndex(p => p === null);
         return r !== -1 ? r : false;
     },
     pkg: {
         run: async (category, author, name, args, owned_by) => {
             let PKG_URL = `/packages/${category}/${author}-${name}.js`;
             // console.debug('Starting', PKG_URL);
             return await Core.pkg.start({
                 category, author, name, args, owned_by, PKG_URL
             });
         },
         start: async function (d) {
             try {
                 // console.debug(Core.processList);
                 let Package = await
                     import(d.PKG_URL);
                 const PID = Core.findEmptyPID() || Core.processList.length;
                 const PROCESS_NAME = d.url || `${d.category}:${d.author}-${d.name}`
                 console.group(`${d.name}: ${PID}`);
                 // console.debug(d.name, 'going to slot', PID, '—>', JSON.stringify(Core.processList, null, 2));
                 if (Package.default) {
                     try {
                         // it *should* error!
                         if (Package.default.noProc === undefined) throw new Error();
                         console.debug(`%cWait, ${d.name} (${PID}) is a library! I won't reserve as process.`, 'font-weight:bold;color:red');
                         // Don't run as process
                         return Package.default;
                     }
                     catch (e) {
                         function Returns(obj) {
                             console.debug(`%c${d.name}: ${PID} returned early!`, 'font-weight:bold;color:red');
                             console.debug(`${d.name} (${PID}) returns pl of`, JSON.stringify(Core.processList, null, 2));
                             Core.processList[PID] = {
                                 name: PROCESS_NAME,
                                 pid: PID,
                                 owner: d.owned_by || -1,
                                 proc: obj
                             };
                             Returns = null;
 
                             console.debug(`${d.name} (${PID}) after insertion`, JSON.stringify(Core.processList, null, 2));
 
                             return { obj };
                         }
                         await Package.default.run(
                             Core,
                             PROCESS_NAME,
                             PID,
                             Package,
                             Returns,
                             d.args,
                             d.owned_by || -1,
                         );
 
                         console.debug(`${d.name}: ${PID}`, 'finished running.. the pl is', JSON.stringify(Core.processList, null, 2));
                         window.dispatchEvent(new CustomEvent('saturn-core.package.run', {
                             detail: {
                                 Package,
                                 PROCESS_NAME,
                                 PID
                             }
                         }));
                         return {
                             PROCESS_NAME,
                             PID
                         }
                     }
                     finally {
                         console.groupEnd();
                     }
                 } else {
                     // console.debug('Package does not have a default property.');
                     return { type: 'error', message: 'PkgNoDefault' }
                 }
             } catch (e) {
                 console.debug(`ERROR in ${name}:`, e);
                 // console.error("error in " + name)
                 return false;
             }
         },
         // TODO: Make core actually cache packages
         cacheRun: async (category, author, name, args, owned_by) => {
             let PKG_URL = `/packages/${category}/${author}-${name}.js`;
             // console.debug('Starting', PKG_URL);
             let cachedPackage = Core.pkgCache.find(e => e.item === `/packages/${category}/${author}-${name}.js`);
             if (cachedPackage !== undefined) {
                 PKG_URL = cachedPackage.blob;
             }
             // console.debug('cach', cachedPackage, PKG_URL);
             return await Core.pkg.start({
                 category, author, name, args, owned_by, PKG_URL
             })
         }
     },
     pkgCache: [],
     listen: (event, func, element = document) => {
         element.addEventListener(event, func);
     },
     unlisten: (event, func, element = document) => {
         element.addEventListener(event, func);
     },
     processList: [],
     cleanupProcess: function (pid) {
         let proc = Core.processList.filter(p => p !== null).find(p => p.pid === pid);
         console.group('Process cleanup (' + pid, proc.name + ')')
         console.debug(`%cProcess ${proc.name} (${proc.pid}) was ended.`, 'color:green;font-weight:bold');
         Core.processList[pid] = null;
         console.groupEnd();
     },
     version: '0.4.0'
 }
 Core.pkg.run('service', 'Saturn', 'Preload');
 
 console.log("%cHey!\n%cDon't paste anything in here.\nEntering any code into this console can leak your account details and/or files to external sources. Use it at your own risk.%c\n\nIf you %cdo %cknow what you're doing, you can contribute to this project at https://github.com/zeondev/saturn/", 'text-shadow: 0 0 10px red;color:red;font-size: x-large',  'color: auto;font-size: large;', 'color: auto;font-size:1.2rem', 'color: auto;font-style:italic;font-size:1.2rem', 'color: auto;font-size:1.2rem');

 /**
 * The Zeon.dev Saturn project is licensed under GPL-v3. 
 * Please keep this comment in the file or link back to the original repository when using.
 * https://github.com/zeondev/saturn
 */
