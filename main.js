require("./config/config");
const { getAllBuilds, getBuildLeases, deleteBuildLease, removeKeepForeverOnBuild, deleteBuild } = require('./services/azure');

const app = async () => {

    const builds = await getAllBuilds();

    for (const build of builds) {
        if (build.keepForever === true) {
            await removeKeepForeverOnBuild(build.url);
        }

        if (build.retainedByRelease === true) {
            const leases = await getBuildLeases(build.id);
            for (const lease of leases) {
                if (lease.protectPipeline === true) await deleteBuildLease(lease.leaseId);
            };
        }

        await deleteBuild(build.url);
    };

    console.log('Protect pipeline retention leases deleted successfully');
}

app();

