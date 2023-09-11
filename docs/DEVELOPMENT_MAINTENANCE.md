# How to upgrade the Confluence Package chart
1. Checkout the branch that renovate created. This branch will have the image tag updates and typically some other necessary version changes that you will want. You can either work off of this branch or branch off of it.
2. Update the chart via `kpt`. You should be able to run `kpt pkg update chart@confluence-$version --strategy alpha-git-patch` (ex: `kpt pkg update chart@confluence-8.4.0 --strategy alpha-git-patch`).
3. Update version references for the Chart. `version` should be `<version>-bb.0` (ex: `1.14.3-bb.0`) and `appVersion` should be `<version>` (ex: `1.14.3`). Also validate that the BB annotation for confluence is updated.
4. Add a changelog entry for the update. At minimum mention updating the image versions.
5. Update the readme following the [steps in Gluon](https://repo1.dso.mil/platform-one/big-bang/apps/library-charts/gluon/-/blob/master/docs/bb-package-readme.md).
6. Open MR (or check the one that Renovate created for you) and validate that the pipeline is successful. Also follow the testing steps below for some manual confirmations.

# Install Confluence Chart to Big Bang Cluster
You will want to bring up a big bang cluster before running the following command:

`helm upgrade -i confluence chart/ -f ../overrides/registry.yaml -n monitoring`

Note: You will need your registry creds in an override.
TODO: We are using `monitoring` namespace but ultimately we want our own namespace.

NOTE: If you want to enable istio including ingress (confluence.bigbang.dev).  Then you will want to change the confluence values to have the following:

```
istio:
  enabled: true
  gateways:
  - istio-system/public
```
# Testing new Confluence version

1. Ensure that Confluence Pod (ie. confluence-0) is up and running successfully.
2. Navigate to Confluence (confluencek.bigbang.dev OR port forwarding if you did not enable istio) and validate you are prompted to enter a license.
3. You can obtain a trial license quickly here: https://my.atlassian.com/license/evaluation?_ga=2.40938405.644877387.1570464610-1349982554.1568648451
4. Validate that you can create and edit a post.


# Modifications made to upstream chart
This is a high-level list of modifications that Big Bang has made to the upstream helm chart. You can use this as as cross-check to make sure that no modifications were lost during the upgrade process.

## chart/templates/statefulset.yaml
- move `include "confluence.volumeClaimTemplates"` line to resolve template rendering issue
- changed the initcontainer for jmx-exporter-fetch to explicitly set run as non root and arguments necessary after move to ironbank image

## chart/templates/config-jvm.yaml
- add `-` indention to `include "confluence.sysprop.s3Config"` line to resolve template rendering issue

## chart/templates/statefulset-synchrony.yaml
- add conditional check for `SYNCHRONY_SERVICE_URL` variable injection: use Istio URL if enabled, then default to .Values.ingress

## chart/templates/_helpers.tpl
- add conditional checks for `ATL_DB_TYPE`, `ATL_JDBC_URL`, `ATL_JDBC_USER`, and `ATL_JDBC_PASSWORD` variable injection: use cluster-internal Postgres values if enabled
- add conditional checks for `SYNCHRONY_DATABASE_URL`, `SYNCHRONY_DATABASE_USERNAME`, and `SYNCHRONY_DATABASE_PASSWORD` variable injection: use cluster-internal Postgres values if enabled