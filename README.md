# Confluence

Confluence is a collaborative document and workflow tool.  This is a licensed poduct and will require a license code the first time you access the product.  Additional docs for using confluence can be found at <https://www.atlassian.com/software/confluence/features>.

This repository provides a Helm chart for deploying Confluence using Iron Bank images.  It is also used by Big Bang to deploy Confluence as an addon.  The Helm chart is based on the [data center chart from Atlassian](https://github.com/atlassian-labs/data-center-helm-charts).  It is kept in sync using [Kpt](https://googlecontainertools.github.io/kpt/).

## Usage

### Prerequisites

- [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [Helm](https://helm.sh/docs/intro/install/)
- A Kubernetes cluster, with its context selected in ~/.kube/config
- [Istio](https://istio.io/) installed on the cluster with appropriate TLS certificates for your domain

### Configuration

You must configure the following items before the Helm chart will work.  If you are using Big Bang to deploy, the following are automatically done for you.

1. [Create a secret in your deployment namespace containing Iron Bank pull credentials](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)

1. Add a reference in `values.yaml` to your pull secret:

    ```yaml
    serviceAccount:
      imagePullSecrets:
        - name: <name-of-secret-containing-pull-secrets-for-iron-bank>
    ```

1. Enable [istio](https://istio.io/) in `values.yaml` and configure the hostname to use (e.g. bigbang.dev).  The helm chart will create an endpoint at `confluence.bigbang.dev` to connect to the application.

    ```yaml
    hostname: bigbang.dev
    istio:
      enabled: true
    ```

> If you update `hostname`, you should also update the following in `values.yaml`:
>
> ```yaml
> confluence:
>   additionalEnvironmentVariables:
>   - name: ATL_PROXY_NAME
>     value: "confluence.bigbang.dev"
> synchrony:
>   ingressUrl: https://synchrony.bigbang.dev
> ```

For more advanced configuration (e.g. SSO with Keycloak, or Prometheus monitoring), look in [docs](./docs/).

### Deployment

To deploy Confluence to the `confluence` namespace, run the following:

```bash
helm upgrade -i -n confluence --create-namespace confluence ./chart
```

Navigate to `https://confluence.bigbang.dev` in your browser

> If you do not have DNS setup for your domain, you will need to add your cluster's external IP and `confluence.bigbang.dev` to your `/etc/hosts` file for routing.

If you need a temporary license for testing, there are time-limited (3 hours) Atlassian licenses available [here](https://developer.atlassian.com/platform/marketplace/timebomb-licenses-for-testing-server-apps/).

### Operations

By default, the following configuration of Confluence are deployed:

- Synchrony - simultaneusly editing files from multiple users
- Run as non-root
- Stand-alone (see the [clustering documentation](./docs/clustering.md) to turn on clustering)
- No database (see the [database documentation](./docs/database.md) for configuration)
- No monitoring (see the [Prometheus documentation](./docs/prometheus.md) for how to integrate with Prometheus)
- SSO turned off (see the [Keycloak documentation](./docs/keycloak.md) for how to use Keycload for SSO)
- No license (see the [licensing documentation](./docs/licensing.md) for how to add a license)

If you choose the default configuration, you can configure the clustering, database, and licensing through the GUI the first time you connect.  However, it is recommended that you use [the documentation](./docs) to configure a `values.yaml` so your deployment is immutable.
