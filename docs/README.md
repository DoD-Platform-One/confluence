# Confluence
Confluence is a collaborative document and workflow tool.  This is a licensed poduct and will require a license code the first time you access the product (see [Operations](#operations) for instructions on requesting a trial license).  Additional docs for using confluence can be found at <https://www.atlassian.com/software/confluence/features>.

This repository provides a Helm chart for deploying Confluence using Iron Bank images.  It is also used by Big Bang to deploy Confluence as a 3rd party package.

This baseline uses Confluence version 7.4.0.  This image was available in Iron Bank as a hardened container, but is in a peading approval status.  The image has been retagged and added to the public apps Confluence Registry.  

The generated yaml was produced by following these instructions

* git clone <https://github.com/stevehipwell/helm-charts.git>

* cd helm-charts

* helm dep update charts/confluence-server/

* helm template confluence charts/confluence-server/ -f ../generated/values.yaml > ../generated/generated.yaml

## Usage

### Prerequisites

* Kubernetes cluster deployed
* Kubernetes config installed in ~/.kube/config
* Install kubectl (`brew install kubectl`)
* Install kustomize (`brew install kustomize`)

**Option 1: Deployment through Bigbang (recommended)**

To install confluence as a community package in a Bigbang install, save the following YAML to a file (eg, confluence.yaml):

```yaml
packages:
  # This will be used as the namespace for the install, as well as the name of the helm release. If this is changed, the destination service (below) needs to also be changed.
  confluence:
    enabled: true
    git:
      repo: https://repo1.dso.mil/big-bang/product/community/confluence
      # It is recommended to update this to the latest bb tag
      tag: 1.17.2-bb.1
      path: chart
    # This section is ignored if wrapper.enabled, above, is false. In this case, creation of an ingress for web access is left as an exercise for the reader.
    values:
      istio:
        enabled: true
        hardened:
          enabled: true
        confluence:
          gateways:
            - istio-system/public
      # See the database section of this README, below, for more.
      postgresql:
        install: true
```

Then install/update bigbang via the standard `helm upgrade` command, adding `-f <YAML file location>` to the end. This will install Confluence into the named namespace. 

This method is recommended because it will also take care of creating private registry credentials, the istio virtual service, and network policies. Once the installation is complete, the Confluence UI will be reachable via `https://confluence.<your bigbang domain>`

**Option 2: Standalone deployment**

Deployment
* Clone repository: `git clone https://repo1.dso.mil/big-bang/product/community/confluence.git`
* Create the Confluence namespace: `kubectl create namespace confluence -o json|jq '.metadata += {"labels":{"istio-injection":"enabled"}}' | kubectl apply -f -`
* Create the `private-registry` secret: `kubectl create secret docker-registry private-registry --docker-server=registry1.dso.mil --docker-username=<Your IronBank Username> --docker-password=<Your IronBank Password> --docker-email=<Your E-mail Address> --namespace confluence`
* Helm install: `cd confluence && helm upgrade --install --namespace confluence confluence ./chart`; if modifying the values.yaml file directly is not desired, add `-f <override values YAML file>` to the end, or use `--set <key>=<value>`.

#### Database

See https://repo1.dso.mil/big-bang/product/community/confluence/-/blob/main/docs/PostgreSQL.md for more.

Confluence requires a database to run. A Postgres database can be included as part of an install by including `--set postgresql.install=true`; note that this database will not be set up with **any** persistent storage and so is entirely unsuitable for any sort of non-development environment. It is **highly** recommended that in any other environment a separate database is stood up with persistent storage and a backup/restore schedule. Set up of that database is outside the scope of this document.

If no database information is provided with the helm setup, Confluence will ask for this information as part of it's setup process through the web UI.

### Operations

Confluence is licensed by Atlassian; in order to use it, you will need a license key. Instructions to get a trial license are available at https://confluence.atlassian.com/confkb/how-to-generate-or-extend-an-evaluation-license-for-confluence-data-center-1027139877.html. 

### Contributing

* Clone repository: `git clone https://repo1.dso.mil/big-bang/product/community/confluence.git`
* Create a feature branch: `git checkout -b <branch>`
* Stage and commit changes `git add . && git commit -m "Made a change for reasons"`
* Push commits to upstream branch: `git push -u origin <branch>`
* Create a merge request at https://repo1.dso.mil/big-bang/product/community/confluence/-/merge_requests
