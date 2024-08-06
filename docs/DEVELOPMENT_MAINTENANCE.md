# How to upgrade the Confluence Package chart
1. Checkout the branch that renovate created. This branch will have the image tag updates and typically some other necessary version changes that you will want. You can either work off of this branch or branch off of it.
2. Update the chart via `kpt`. You should be able to run `kpt pkg update chart@confluence-$version --strategy alpha-git-patch` (ex: `kpt pkg update chart@confluence-8.6.0 --strategy alpha-git-patch`).
3. Update version references for the Chart. `version` should be `<version>-bb.0` (ex: `1.14.3-bb.0`) and `appVersion` should be `<version>` (ex: `1.14.3`). Also validate that the BB annotation for confluence is updated.
4. Add a changelog entry for the update. At minimum mention updating the image versions.
5. Update the readme following the [steps in Gluon](https://repo1.dso.mil/platform-one/big-bang/apps/library-charts/gluon/-/blob/master/docs/bb-package-readme.md).
6. Open MR (or check the one that Renovate created for you) and validate that the pipeline is successful. Also follow the testing steps below for some manual confirmations.

# Install Confluence Chart to Big Bang Cluster
Reference the `Usage` section in `docs/README.md`.

# Testing new Confluence version
1. Ensure that Confluence Pod (ie. confluence-0) is up and running successfully.
2. Navigate to Confluence (if istio enabled and /etc/hosts edited, confluence.dev.bigbang.mil -- else, use Kubernetes port forwarding) and validate you are prompted to enter a license.
3. You can obtain a trial license quickly here: https://my.atlassian.com/license/evaluation?_ga=2.40938405.644877387.1570464610-1349982554.1568648451
4. Validate that you can create and edit a post.

### Big Bang Integration Testing

As part of your MR that modifies bigbang packages, you should modify the bigbang  [bigbang/tests/test-values.yaml](https://repo1.dso.mil/big-bang/bigbang/-/blob/master/tests/test-values.yaml?ref_type=heads) against your branch for the CI/CD MR testing by enabling your packages. 

    - To do this, at a minimum, you will need to follow the instructions at [bigbang/docs/developer/test-package-against-bb.md](https://repo1.dso.mil/big-bang/bigbang/-/blob/master/docs/developer/test-package-against-bb.md?ref_type=heads) with changes for Confluence enabled (the below is a reference, actual changes could be more depending on what changes where made to Confluence in the package MR).

### [test-values.yaml](https://repo1.dso.mil/big-bang/bigbang/-/blob/master/tests/test-values.yaml?ref_type=heads)
    ```yaml
    packages:
      confluence:
        enabled: true
        git:
          tag: null
          branch: <my-package-branch-that-needs-testing>
        values:
          istio:
            hardened:
              enabled: true
      ### Additional compononents of Confluence should be changed to reflect testing changes introduced in the package MR
    ```

# Files that need integration testing

If you modify any of these things, you should perform an integration test with your branch against the rest of bigbang. Some of these files have automatic tests already defined, but those automatic tests may not model corner cases found in full integration scenarios.

* `./chart/templates/bigbang/networkpolicies`
* `./chart/templates/bigbang/authorization-policies`
* `./chart/templates/configmaps-*`
* `./chart/templates/service*`
* `./chart/values.yaml` if it involves any of:
  * monitoring changes
  * network policy changes
  * kyverno policy changes
  * istio hardening rule changes
  * service definition changes
  * TLS settings
  * server ingress settings
  * headless server settings (especially port or other comms settings)

Follow [the standard process](https://repo1.dso.mil/big-bang/bigbang/-/blob/master/docs/developer/test-package-against-bb.md?ref_type=heads) for performing an integration test against bigbang.

# automountServiceAccountToken
The mutating Kyverno policy named `update-automountserviceaccounttokens` is leveraged to harden all ServiceAccounts in this package with `automountServiceAccountToken: false`. This policy is configured by namespace in the Big Bang umbrella chart repository at [chart/templates/kyverno-policies/values.yaml](https://repo1.dso.mil/big-bang/bigbang/-/blob/master/chart/templates/kyverno-policies/values.yaml?ref_type=heads).

This policy revokes access to the K8s API for Pods utilizing said ServiceAccounts. If a Pod truly requires access to the K8s API (for app functionality), the Pod is added to the `pods:` array of the same mutating policy. This grants the Pod access to the API, and creates a Kyverno PolicyException to prevent an alert.

# Modifications made to upstream chart
This is a high-level list of modifications that Big Bang has made to the upstream helm chart. You can use this as as cross-check to make sure that no modifications were lost during the upgrade process.

## chart/templates/statefulset.yaml
- move `include "confluence.volumeClaimTemplates"` line to resolve template rendering issue
- changed the initcontainer for jmx-exporter-fetch to explicitly set run as non root and arguments necessary after move to ironbank image
- add call to bigbang labels to add Kiali required labels

## chart/templates/config-jvm.yaml
- add `-` indention to `include "confluence.sysprop.s3Config"` line to resolve template rendering issue

## chart/templates/statefulset-synchrony.yaml
- add conditional check for `SYNCHRONY_SERVICE_URL` variable injection: use Istio URL if enabled, then default to .Values.ingress

## chart/templates/_helpers.tpl
- add conditional checks for `ATL_DB_TYPE`, `ATL_JDBC_URL`, `ATL_JDBC_USER`, and `ATL_JDBC_PASSWORD` variable injection: use cluster-internal Postgres values if enabled
- add conditional checks for `SYNCHRONY_DATABASE_URL`, `SYNCHRONY_DATABASE_USERNAME`, and `SYNCHRONY_DATABASE_PASSWORD` variable injection: use cluster-internal Postgres values if enabled
