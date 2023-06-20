const { config } = require("./config/config");
const { getAllBuilds, getBuildLeases, deleteBuildLease, removeKeepForeverOnBuild, deleteBuild } = require('./services/azure');

const app = async () => {
    while (true) {
        clean = true;

        const builds = await getAllBuilds();

        if (builds.length === 0) break;

        for (const build of builds) {
            if (build.keepForever === true) {
                if (!await removeKeepForeverOnBuild(build.id)) {
                    console.log(`Failed to remove keepforever bit on build ${build.id}`);
                    clean = false;
                }
            }

            if (build.retainedByRelease === true) {
                const leases = await getBuildLeases(build.id);
                if (!leases || leases.length === 0) {
                    console.log('Legacy build has magic leases. giving up, go use the UI');
                    continue;
                }
                for (const lease of leases) {
                    if (lease.protectPipeline === true) {
                        if (!await deleteBuildLease(lease.leaseId)) {
                            console.log(`Failed to delete lease ${lease.leaseId}`);
                            clean = false;
                        }
                    }
                };
            }

            if (!await deleteBuild(build.url)) {
                console.log(`Failed to delete build ${build.id}`);
                clean = false;
            }
        };
        if (!clean) {
            console.log('Failed to delete all builds. The ADO API struggles with old builds. Good luck with the UI.');
            return clean;
        }
    }

    console.log('Deleted all builds successfully!');
    return clean;
}

if (!app()) {
    console.log('Failed to delete all builds.');
} else {
    console.log('I believe in miracles! Cleaned up all builds!');
}

