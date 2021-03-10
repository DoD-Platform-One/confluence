# Confluence Database

Confluence requires a database for operation. The following documentation will help you configure an external database.  There are two options presented, setting up a postgreSQL database using the [Zalando postgres operator](https://github.com/zalando/postgres-operator) and manually setting up an external database.

## Zalando Operator

The [Zalando postgres operator](https://github.com/zalando/postgres-operator) can be leveraged to quickly deploy a PostgreSQL database.  First, the operator is deployed to the cluster.  Then, a `postgresql` custom resource is deployed, which creates the database.

### Prerequisites

- Kubernetes cluster
- [Helm](https://helm.sh/docs/intro/install/)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/)

### Deploy Zalando

Using [Big Bang's Zalando Helm chart](), deploy Zalando to your cluster.  You may need to add a pull secret to the values.yaml to insure images can be pulled from Iron Bank.

```bash
helm upgrade -i -n postgres-operator --create-namespace postgres-operator ./chart
```

### Configure your PostgreSQL instance

Using the [Big Bang's PostgreSQL Helm chart](), you can configure your database settings through the `values.yaml` file.

By default, the database is configured to deploy:

- Default users (postgres and standby)
- Default databases
- High-availability using two instances
- PostgreSQL version 13

For compatibility with Confluence, the following values need to be overridden:

```yaml
volume:
  size: 1Gi                     # Set to the size of the database you need
  storageClass: my-sc           # Override the default storage class to the storage class for persistent storage in your cluster
users:
  confluence-user: []           # Setup an application user
databases:
  confluence: confluence-user   # Setup a database for the application, with the user as the owner
version: 10                     # Confluence does not support > version 10 (https://confluence.atlassian.com/doc/supported-platforms-207488198.html)
```

If desired, [supported values](https://github.com/zalando/postgres-operator/blob/master/manifests/complete-postgres-manifest.yaml) can be added using the `additionalValues` key.

If you are using the [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) to monitor your cluster, turn on monitoring to enable a ServiceMonitor for the database:

```yaml
monitoring:
  enabled: true
```

### Deploy PostgreSQL

Using [Big Bang's PostgreSQL Helm chart](), deploy the database.

```bash
helm upgrade -i -n confluence --create-namespace -f ./myvalues.yaml confluence-db ./chart
```

### Operator Resources Created

After deployment, the operator will automatically create the following resources in the cluster:

- A cluster service named `confluence-database` listening on port 5432 for the primary database
- Another cluster service named `confluence-database-repl` listening on port 5432 for accessing the replica database (read-only)
- A secret containing database credentials named `confluence-user.confluence-database.credentials.postgresql.acid.zalan.do`
- Two pods with HA failover running the database

In addition, if `monitoring.enabled` is set to true, Prometheus monitoring resources will be deployed to allow metrics scraping of the database.  These include:

- A service named `postgres-metrics` listening on port 9187 (default PostgreSQL port for Prometheus)
- A service monitor named `postgres-database` that works with the [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) to enable metrics scraping.

### Operator Database Connection Details

The following configuration needs to be setup in Confluence's `values.yaml` so it can connect to the database created by the operator.

```yaml
database:
  type: postgresql
  url: jdbc:postgresql://confluence-database.confluence.svc.cluster.local:5432/confluence # assuming you deploy into the 'confluence' namespace
  credentials:
    secretName: confluence-user.confluence-database.credentials.postgresql.acid.zalan.do
```

## Manual Setup

If you decide not to use the Zalando operator, the following setup will be required for your database.

### Setup External Database

Select and [setup an external database for Confluence](https://confluence.atlassian.com/doc/database-configuration-159764.html)

### Database Credentials

The database credentials for Confluence need to be provided in a secret residing in the same namespace as Confluence.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: confluence-database-credentials
type: Opaque
stringData:
  username: <database username>
  password: <database password>
```

Create a blank database and credentials for Confluence to use.  Your user must be able to create database objects and must have login permissions.  You should follow the [Database setup guide](https://confluence.atlassian.com/doc/database-configuration-159764.html).

### External Database Connection Details

The following configuration needs to be setup in `values.yaml` so Confluence can connect your database.

```yaml
database:
  type: postgresql # Valid values: 'postgresql', 'mysql', 'oracle', 'mssql'
  url: jdbc:postgresql://mydb.domain.com:5432/confluence # jdbc:postgresql://host:port/databasename
  credentials:
    secretName: confluence-database-credentials
```
