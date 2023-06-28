# Node.js tool for deleting Azure DevOps build pipelines

This is a pretty heavily modified fork of [asturlan/RetentionLeaseRemover](https://github.com/asturlan/RetentionLeaseRemover) that enables the deletion of Azure DevOps build pipelines. ADO itself makes this very cumbersome, because if you have any number of builds attached to a build definition with some kind of retention policy, the definition itself cannot be deleted (and there is no UI or CLI mechanism to easily remove builds or retention policies from builds).

If your compliance people come by and flag you for having ancient/encrusted builds/build definitions, this should help you nuke them from orbit. Note that this tool is deeply stupid, might need several runs to clean up, and has basically no good safeguards in place. Use with extreme care.

## How to use

create and edit config/config.json with following parameters:

{
    "BASE_API_URL": https://{organization}/{project}/_apis
    "PAT": "{your_full_access_PAT}",
    "USERNAME": "{your_username}"
}

notes:
- Create a PAT with full access in Azure Devops -> User settings -> Personal access tokens.
  At minimum you'll need total access to read/modify/delete pipelines/runs/etc.
- Build definition id can be found in URL when you open the pipeline in Azure Devops (definitionId)

## How to run

```sh
npm install
npm run start <build definition ID>
```
