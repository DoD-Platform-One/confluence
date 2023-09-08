# Object Storage
Confluence supports S3-compliant object storage for [attachments](https://confluence.atlassian.com/doc/configuring-s3-object-storage-1206794554.html).

This storage strategy provides higher durability and scalability for Confluence attachments, along with out-of-the-box object storage features like [versioning](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html).

## Amazon S3
To utilize Amazon S3 for attachment object storage:
1. Create your S3 bucket. This can be done by hand, or example Terraform code is provided below.
2. Create a plaintext file named `credentials` that contains your AWS access key and secret access key in the following format:
```
[default]
aws_access_key_id = myaccesskeyid123
aws_secret_access_key = mysecretaccesskey123
```
3. Create a secret from your credential file:
```bash
$ kubectl create secret generic aws-login --from-file credentials --namespace my-namespace
```
4. Deploy the Confluence chart with the following value overrides:
```
additionalFiles:
  - name: aws-login
    type: secret
    key: credentials
    mountPath: /var/atlassian/application-data/confluence/.aws/

confluence:
  s3AttachmentsStorage:
    bucketName: my-bucket-name
    bucketRegion: us-gov-west-1
```
5. To validate you have object storage enabled, once Confluence is setup:
    1. Go to Administration -> General Configuration -> System Information
    2. Next to 'Attachment Storage Type' you'll see 'S3'


> __Note__:
>
> Other methods of passing AWS credentials to JVM include 
> environment variables and [Java System Properties](https://docs.oracle.com/javase/tutorial/essential/environment/sysprop.html).
> 
> While the chart supports injecting values like that, Confluence seems unable to recognize the presence of said credentials:
> ```yaml
>confluence:
>  s3AttachmentsStorage:
>    bucketName: my-bucket-name
>    bucketRegion: us-gov-west-1
>
>  additionalJvmArgs:
>    # https://access.redhat.com/documentation/en-us/openjdk/11/html-single/configuring_openjdk_11_on_rhel_with_fips/index#config-fips-in-openjdk
>    - -Dcom.redhat.fips=false
>    - -Daws.accessKeyId=<snip>
>    - -Daws.secretKey=<snip>
>
>  additionalEnvironmentVariables:
>    - name: AWS_ACCESS_KEY_ID
>      value: <snip>
>    - name: AWS_SECRET_ACCESS_KEY
>      value: <snip>
>    - name: AWS_DEFAULT_REGION
>      value: us-gov-west-1
> ```
> 
> With those above values, Confluence will error on startup, stating that AWS credentials cannot be found (despite providing them in two different ways).
> 
> The passing of credentials via `Secret` seems more robust.


### Terraform Example
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

module "s3-bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "3.15.1"

  bucket  = random_pet.this.id
  force_destroy = true

  versioning = {
    enabled = true
  }
}

resource "random_pet" "this" {
  length = 2
}

output "bucket_arn" {
  description = "ARN of S3 bucket. Use to find the unique bucket name"
  value       = module.s3-bucket.s3_bucket_arn
}
```

#### Usage
Plan and provision the infrastructure:
```
$ terraform init
$ terraform plan
$ terraform apply
```

Viewing the `bucket_arn` output, enter in the unique S3 bucket name (not the full ARN, just the name) into the `confluence.s3AttachmentsStorage.bucketName` value.

Change `confluence.s3AttachmentsStorage.bucketRegion` if you modified the AWS region as well.


## MinIO
MinIO is an alternative method for adding durable attachment storage, but without relying on the external entity of AWS. 

MinIO can be deployed directly into your Kubernetes cluster and utilized by Confluence in the same manner as S3.

1. Deploy Big Bang with the MinIO addon:
```yaml
addons:
 minio:
   enabled: true
   accesskey: "testaccesskey"
   secretkey: "testsecretkey"
```

2. Login to MinIO using the console at https://minio.bigbang.dev

3. Create a bucket, take note of the name, and check "Versioning".

4. Create a plaintext file named `credentials` that contains your AWS access key and secret access key in the following format:
```
[default]
aws_access_key_id = testaccesskey
aws_secret_access_key = testsecretkey
```
5. Create a secret from your credential file:
```bash
$ kubectl create secret generic aws-login --from-file credentials --namespace my-namespace
```
6. Deploy Confluence with the following values:
```yaml
confluence:
  s3AttachmentsStorage:
    bucketName: my-minio-bucket-name
    bucketRegion: us-east-1
    endpointOverride: "http://minio.minio:80"

additionalFiles:
  - name: aws-login
    type: secret
    key: credentials
    mountPath: /var/atlassian/application-data/confluence/.aws/
```
7. To validate you have object storage enabled, once Confluence is setup:
    1. Go to Administration -> General Configuration -> System Information
    2. Next to 'Attachment Storage Type' you'll see 'S3'