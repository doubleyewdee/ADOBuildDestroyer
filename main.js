const { config } = require("./config/config");
const { getAllBuilds, getBuildLeases, deleteBuildLease, removeKeepForeverOnBuild, deleteBuild, deleteBuildDefinition } = require('./services/azure');

const app = async definitionID => {
    while (true) {
        clean = true;

        const builds = await getAllBuilds(definitionID);

        if (builds.length === 0) break;

        for (const build of builds) {
            if (build.keepForever === true) {
                if (!await removeKeepForeverOnBuild(build.id)) {
                    console.log(`Failed to remove keepforever bit on build ${build.id}`);
                }
            }

            const leases = await getBuildLeases(build.id);
            if (leases) {
                for (const lease of leases) {
                    if (!await deleteBuildLease(lease.leaseId)) {
                        console.log(`Failed to delete lease ${lease.leaseId}`);
                        clean = false;
                    }
                }
            }

            if (!await deleteBuild(build.url)) {
                console.log(`Failed to delete build ${build.id}`);
                clean = false;
            }
        };
        if (!clean) {
            console.log('Failed to delete all builds. The ADO API struggles with old builds. Good luck with the UI.');
            break;
        }
    }

    console.log('Done trying to delete leases/builds. Attempting to delete build definition.');
    await deleteBuildDefinition(definitionID);
    return clean;
}

if (!await app(process.argv[2])) {
    console.log('Failed to delete all builds.');
} else {
    console.log('I believe in miracles! Cleaned up all builds!');
}

