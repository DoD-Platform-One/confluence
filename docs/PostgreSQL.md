# External PostgreSQL
An external instance of Postgres is recommended for any production-indicative deployment scenario.

This is configured through overriding values in `.Values.database`:

```yaml
database:
  type: postgresql
  user: confuser
  password: <your-password-here>
  url: 'jdbc:postgresql://confluence.example.us-gov-west-1.rds.amazonaws.com:5432/confluence'

  credentials:
    secretName: my-newly-created-secret
```

## Amazon RDS Terraform Example
This is an example Amazon RDS deployment (Postgres engine) that will work with Confluence.

```terraform
provider "aws" {
  region = "us-gov-west-1"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.00"
    }
  }
}

module "security_group" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 5.0"

  name        = "confluence-dev"
  description = "Confluence proof-of-concept database"
#   vpc_id      = default VPC

  ingress_with_cidr_blocks = [
    {
      from_port   = 5432
      to_port     = 5432
      protocol    = "tcp"
      description = "PostgreSQL access"
      cidr_blocks = "172.31.0.0/16"
    },
  ]
}

module "rds_db_instance" {
  source  = "terraform-aws-modules/rds/aws//modules/db_instance"
  version = "6.1.1"
  
  identifier = "confluence-dev"

  engine               = "postgres"
  engine_version       = "14"
  instance_class       = "db.t4g.large"

  allocated_storage     = 20
  max_allocated_storage = 100

  db_name  = "confluence"
  username = "confuser"
  password = "<your-password-here>"
  port     = 5432

  vpc_security_group_ids = [module.security_group.security_group_id]
  skip_final_snapshot    = true
}

output "rds_hostname" {
  description = "RDS instance hostname"
  value       = module.rds_db_instance.db_instance_address
}

output "rds_dbname" {
  description = "RDS instance hostname"
  value       = module.rds_db_instance.db_instance_name
}

output "rds_port" {
  description = "RDS instance port"
  value       = module.rds_db_instance.db_instance_port
}

output "rds_username" {
  description = "RDS instance username"
  value       = module.rds_db_instance.db_instance_username
  sensitive   = true
}
```

### Usage
Plan and provision the infrastructure:
```
$ terraform init
$ terraform plan
$ terraform apply
```

Viewing the outputs of `terraform apply`, enter in the appropriate connection information into your values override file (`database.url`, `database.user`, etc.).


# Internal PostgreSQL
If you wish to use a cluster-internal Postgres instance, set the following value:
```yaml
postgresql:
  install: true
```
By default, `.Values.postgresql.install` is set to `false`, under the assumption that the chart user will specify an external database in `.Values.database`. 

> __Note__: This cluster-internal Postgres instance should only be used for evaluation and development purposes. In production-indicative deployment scenarios, one should opt for an external database. 

To streamline the deployment of this internal Postgres, and to reduce maintenance over time, the [Bitnami Postgres chart](https://github.com/bitnami/charts/tree/main/bitnami/postgresql) is configured as a [subchart](https://helm.sh/docs/chart_template_guide/subcharts_and_globals/) to the parent Confluence chart.

## Credentials
There are three methods of passing credentials to the cluster-internal Postgres instance:

1. Overriding values:
```yaml
postgresql:
  install: true
  auth:
    username: confuser
    password: confpass
```
2. A custom secret:
```bash
kubectl create secret generic mysecret -n confluence --from-literal=userpassword=confpass --from-literal=adminpassword=confadminpass
```
```yaml
postgresql:
  install: true
  auth:
    existingSecret: mysecret
    secretKeys:
      adminPasswordKey: userpassword
      userPasswordKey: adminpassword
```

3. Supplying neither:
```yaml
postgresql:
  install: true
  auth:
    username: confuser
    password:
    existingSecret:
    secretKeys:
      adminPasswordKey:
      userPasswordKey:
```
In this scenario, the subchart will generate a random password for the Postgres user (in this case, `confuser`) and store it in the secret `confluence-postgresql`. The secret will be referenced by Confluence automatically (again by passing environment variables). 

> __Note__: `values.yaml` is utilizing method #1 by default to workaround a Bitnami chart upgrading limitation in our Big Bang package pipeline.


## Helm Upgrade
If you are not utilzing persistent volumes for local and shared home (`NOTES.txt` will warn you), and a `helm upgrade` causes the Confluence pod to restart, there will be data loss.

In that scenario, the cluster-internal Postgres instance still retains data since it *does* use a persistent volume. 

When the new Confluence pod comes up and tries to connect to the same database, you may see a message similar to the below:
```
The following error(s) occurred:
* Confluence tables already exist in the selected database

Confluence data already exists in the selected database. You can either overwrite the existing data or go back to the database selection page.
```

This is expected behavior since Postgres has retained all of its tables and data despite Confluence restarting.

Selecting `Continue and overwrite existing data` reformats the Postgres database and works correctly, as if it were a fresh database.


## Redeploy from Scratch
If you wish to redeploy Confluence from a completely fresh scenario (with the cluster-internal Postgres), A `helm uninstall <release>` will not entirely suffice.

In addition to the `helm uninstall`, You must delete the PVC `data-confluence-postgresql-0`:
```bash
helm uninstall confluence -n monitoring
kubectl delete pvc -n confluence data-confluence-postgresql-0
```

This is due to a known limitation of how Helm interacts with Statefulsets. PVCs that are granted through VolumeClaimTemplates are not tracked by Helm, and thus, are not deleted on `helm uninstall`. They must be manually deleted.

Failing to delete this PVC may leave some residual data from the previous deployment and can be problematic to a fresh deployment.

Ref: https://docs.bitnami.com/general/how-to/troubleshoot-helm-chart-issues/