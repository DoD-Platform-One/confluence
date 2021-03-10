# Confluence Clustering

By default, the Helm charts are will not configure the products for [Data Center clustering](https://confluence.atlassian.com/doc/clustering-with-confluence-data-center-790795847.html).

## Prerequisites

There are several prerequisites to enable clustering, including the following:

- A read-write shared home directory that can be volume mounted as a filesystem in the pods
- A load balancer with session affinity and WebSockets support
- Multiple server nodes for the Confluence application

## Configuration

In order to enable clustering, set the following in `values.yaml`:

```yaml
confluence:
  clustering:
    enabled: true
```

You will also need to setup your shared home directory.  You will need a `PersistentVolume` for your chosen volume solution.  Here is an example of one that will work with [k3d](k3d.io)'s local file system.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: confluence-shared-home
spec:
  volumeMode: Filesystem
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  storageClassName: manual
  claimRef:
    namespace: confluence
    name: confluence-shared-home
  hostPath:
    path: /tmp
```

Then, setup the `PersistentVolumeClaim` values in `values.yaml`:

```yaml
volumes:
  sharedHome:
    persistentVolumeClaim:
      create: true
      storageClassName: <your storage class>
      resources:
        requests:
          storage: 1Gi
```

## Additional information

See [Atlassian's documentation on setting up clustering](https://confluence.atlassian.com/doc/set-up-a-confluence-data-center-cluster-982322030.html) for more information.
