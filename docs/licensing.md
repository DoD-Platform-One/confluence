# Confluence Licensing

Confluence is a licensed product and requires a valid license key before using it.  Traditionally, this license is installed after connecting to Confluence (e.g. confluence.bigbang.dev) throught a browser.  However, the helm chart supports adding the licence through a secret in the cluster so that your deployment will be immutable.
> NOTE: Licensing through a secret is supported in Confluence version 7.9+.  Earlier versions will not use the secret.

## Secret

For deploying the license through Helm, a secret must be added to the same namespace as Confluent.  The secret should contain a key named `license-key` with the value of the license.  Below is an example containing a 3-hour license for Confluence.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: confluence-license
type: Opaque
stringData:
  # https://developer.atlassian.com/platform/marketplace/timebomb-licenses-for-testing-server-apps/
  license-key: AAABtQ0ODAoPeNp9kV9v0zAUxd/9Ka7EWyWnTmESqxSJNQlbxdJUTbLBgAfXuV0NqR3ZTqHfHjdpYVSCB7/4/jm/e86rR6wh4wdgE2Bsyq6nLITbrIQJC9+SRbdbo8k3lUVjo5CRWCvHhVvwHUZ1y42RdvuOu4ZbK7kKhN4RodUm8D1yj5EzHZJlZ8SWW0y4w+i4lrIrykJyLwUqi+WhxX5fnGdZuornN/fnUvqzlebQzy1f353F04zL5l/qBZo9mnkSzW6vS/qxenhDPzw93dEZCx8HtBeyLyX7mpfiMSqHZkAvurUVRrZOajX8jEajRV7S9/mKLld5UsXlPF/Qqkh9IYoNetYa1gdwW4STEqRK6BoNtEZ/Q+Hg89a59st0PH7WwV/042aYoDhMfA0g0aC0g1paZ+S6c+g3SwtOg+is0zufS0C8IZ5ZcSUuLfNU8Sq9KdOEzj4dEf8XWuG4+X36Cd47WanvSv9QpEgXkX/0ijGSm2eupOW9MQnusdGtv7BE685nk94NX7/M/TKFy/BPJjz4047bJyTBPyH0CqcO2GgDvG2hPgNYku550w1YG954il/X0fxXMC0CFQCRUd9kwqDYeFIFJyQmlQPeMMYDLQIUYpH3kyyXea6e1PzAN2rpSuuUl4M=X02l1
```

While we could perform a `kubectl apply -n confluence -f license.yaml` to deploy the license, a better approach would be use [GitOps](https://www.weave.works/technologies/gitops/) to automatically deploy (and update) the license.  We don't want to store the license in Git for everyone to use.  So, we can encrypt it using [SOPS](https://github.com/mozilla/sops).  So long as the private key to decrypt the secret is secured, the license is unsuable by others.  With a GitOps tool like [Flux](https://toolkit.fluxcd.io/), you can decrypt and deploy the secrets into the cluster directly from Git.  This is the approach Big Bang uses for customers to [configure their environment](https://repo1.dso.mil/platform-one/big-bang/customers/template).

## Configuration

Once you have a secret in the cluster holding the license key, you must configure `values.yaml` to reference the secret:

```yaml
confluence:
  license:
    secretName: confluence-license
    secretKey: license-key
```

## Deployment

When you deploy the chart using Helm, the license should be automatically applied.  You can verify this by connecting to Confluence through your browser and validating it does not request a license key.
