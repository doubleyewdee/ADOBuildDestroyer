const axios = require('axios');

const headers = {
    Authorization: `Basic ${Buffer.from(process.env.USERNAME + ':' + process.env.PAT).toString('base64')}`
}

const getAllBuilds = async () => {
    const params = { 
        "definitions": process.env.BUILD_DEFINITION_ID, 
        "statusFilter": "completed", 
        "api-version": "6.0" 
    };

    try {
        console.log(`Getting all builds for definition ${process.env.BUILD_DEFINITION_ID}`)
        const res = await axios.get(
            `${process.env.BASE_API_URL}/build/builds`, { headers, params }
        );
        console.log(`Found ${res.data.count} builds`)
        return res.data.value;
    } catch (e) {
        console.log(e.message)
    }
}

const getBuildLeases = async buildID => {
    const params = {
        'api-version': '7.1-preview.2'
    }

    try {
        console.log(`Getting leases for build ${buildID}`)
        const res = await axios.get(
            `${process.env.BASE_API_URL}/build/builds/${buildID}/leases`, { headers, params }
        );
        console.log(`Found ${res.data.count} leases for ${buildID}`);
        return res.data.value;
    } catch (e) {
        console.log(e.message);
    }
}

const deleteBuildLease = async leaseID => {
    const params = {
        'api-version': '7.1-preview.2'
    }

    try {
        console.log(`Deleting lease ${leaseID}`)
        const res = await axios.delete( `${process.env.BASE_API_URL}/build/retention/leases?ids=${leaseID}`, { headers, params });
        return res.status === 200 || res.status === 204;
    } catch (e) {
        console.log(e.message);
        return false;
    }
}

const removeKeepForeverOnBuild = async buildID => {
    const params = {
        'api-version': '6.0'
    }
    try {
        const url = `${process.env.BASE_API_URL}/build/builds/${buildID}`;
        console.log(`Removing keepforever bit at ${url}`)
        const res = await axios.patch(url, {'keepForever': false}, { headers, params });
        return res.status === 200 || res.status === 204;
    } catch (e) {
        console.log(e.message);
        return false;
    }
}

const deleteBuild = async buildURL => {
    const params = {
        'api-version': '7.1-preview.7'
    }

    try {
        console.log(`Deleting build at ${buildURL}`)
        const res = await axios.delete(buildURL, { headers, params });
        return res.status === 200 || res.status === 204;
    } catch (e) {
        console.log(e.message);
        return false;
    }
}

module.exports = {
    getAllBuilds,
    getBuildLeases,
    deleteBuildLease,
    removeKeepForeverOnBuild,
    deleteBuild
}