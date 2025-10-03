<!-- Warning: Do not manually edit this file. See notes on gluon + helm-docs at the end of this file for more information. -->
# confluence

![Version: 2.0.4-bb.2](https://img.shields.io/badge/Version-2.0.4--bb.2-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 10.0.3](https://img.shields.io/badge/AppVersion-10.0.3-informational?style=flat-square) ![Maintenance Track: bb_maintained](https://img.shields.io/badge/Maintenance_Track-bb_maintained-yellow?style=flat-square)

A chart for installing Confluence Data Center on Kubernetes

## Upstream References

- <https://atlassian.github.io/data-center-helm-charts/>
- <https://github.com/atlassian/data-center-helm-charts>
- <https://bitbucket.org/atlassian-docker/docker-atlassian-confluence-server/>

## Upstream Release Notes

This package has no upstream release note links on file. Please add some to [chart/Chart.yaml](chart/Chart.yaml) under `annotations.bigbang.dev/upstreamReleaseNotesMarkdown`.
Example:
```yaml
annotations:
  bigbang.dev/upstreamReleaseNotesMarkdown: |
    - [Find our upstream chart's CHANGELOG here](https://link-goes-here/CHANGELOG.md)
    - [and our upstream application release notes here](https://another-link-here/RELEASE_NOTES.md)
```

## Learn More

- [Application Overview](docs/overview.md)
- [Other Documentation](docs/)

## Pre-Requisites

- Kubernetes Cluster deployed
- Kubernetes config installed in `~/.kube/config`
- Helm installed

Kubernetes: `>=1.21.x-0`

Install Helm

https://helm.sh/docs/intro/install/

## Deployment

- Clone down the repository
- cd into directory

```bash
helm install confluence chart/
```

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| hostnamePrefix | string | `"confluence"` |  |
| hostname | string | `"dev.bigbang.mil"` |  |
| istio.enabled | bool | `false` |  |
| istio.gateways[0] | string | `"istio-system/public"` |  |
| istio.hardened.enabled | bool | `false` |  |
| istio.hardened.customAuthorizationPolicies | list | `[]` |  |
| istio.hardened.outboundTrafficPolicyMode | string | `"REGISTRY_ONLY"` |  |
| istio.hardened.customServiceEntries | list | `[]` |  |
| postgresql.install | bool | `false` |  |
| postgresql.image.registry | string | `"registry1.dso.mil"` |  |
| postgresql.image.debug | bool | `true` |  |
| postgresql.image.repository | string | `"ironbank/opensource/postgres/postgresql"` |  |
| postgresql.image.tag | string | `"17.6"` |  |
| postgresql.image.pullSecrets[0] | string | `"private-registry"` |  |
| postgresql.auth.username | string | `"confuser"` |  |
| postgresql.auth.password | string | `"bogus-satisfy-upgrade"` |  |
| postgresql.auth.postgresPassword | string | `"bogus-satisfy-upgrade"` |  |
| postgresql.auth.database | string | `"confluence"` |  |
| postgresql.auth.existingSecret | string | `nil` |  |
| postgresql.auth.secretKeys.adminPasswordKey | string | `nil` |  |
| postgresql.auth.secretKeys.userPasswordKey | string | `nil` |  |
| postgresql.primary.persistence.mountPath | string | `"/var/lib/postgresql"` |  |
| postgresql.primary.initdb.args | string | `"-A scram-sha-256"` |  |
| postgresql.primary.containerSecurityContext.runAsUser | int | `1001` |  |
| postgresql.primary.containerSecurityContext.runAsGroup | int | `1001` |  |
| postgresql.primary.containerSecurityContext.runAsNonRoot | bool | `true` |  |
| postgresql.primary.extraEnvVars[0].name | string | `"POSTGRES_DB"` |  |
| postgresql.primary.extraEnvVars[0].value | string | `"{{ .Values.auth.database }}"` |  |
| postgresql.postgresqlDataDir | string | `"/var/lib/postgresql/pgdata/data"` |  |
| postgresql.volumePermissions.enabled | bool | `false` |  |
| bbtests.enabled | bool | `false` |  |
| bbtests.cypress.artifacts | bool | `true` |  |
| bbtests.cypress.envs.cypress_url | string | `"http://{{ include \"common.names.fullname\" . }}:{{ .Values.upstream.confluence.service.port }}/setup/setuplicense.action"` |  |
| bbtests.cypress.resources.requests.cpu | string | `"1"` |  |
| bbtests.cypress.resources.requests.memory | string | `"2Gi"` |  |
| bbtests.cypress.resources.limits.cpu | string | `"1"` |  |
| bbtests.cypress.resources.limits.memory | string | `"2Gi"` |  |
| helmTestImage | string | `"registry1.dso.mil/ironbank/big-bang/base:2.1.0"` | Image used for the upstream provided helm tests |
| hpa.enabled | bool | `false` |  |
| hpa.maxReplicas | int | `4` |  |
| hpa.cpu | int | `70` |  |
| hpa.memory | int | `80` |  |
| hpa.behavior.enabled | bool | `false` |  |
| hpa.behavior.time | int | `300` |  |
| networkPolicies.enabled | bool | `false` |  |
| networkPolicies.ingressLabels.app | string | `"public-ingressgateway"` |  |
| networkPolicies.ingressLabels.istio | string | `"ingressgateway"` |  |
| networkPolicies.allowMinioOperatorIngress.enabled | bool | `false` |  |
| networkPolicies.controlPlaneCidr | string | `"0.0.0.0/0"` |  |
| networkPolicies.additionalPolicies | list | `[]` |  |
| upstream.nameOverride | string | `"confluence"` |  |
| upstream.image.repository | string | `"registry1.dso.mil/ironbank/atlassian/confluence-data-center/confluence-node-lts"` |  |
| upstream.image.pullPolicy | string | `"Always"` |  |
| upstream.image.imagePullSecrets | string | `"private-registry"` |  |
| upstream.image.tag | string | `"9.2.8"` |  |
| upstream.serviceAccount.create | bool | `true` |  |
| upstream.serviceAccount.name | string | `nil` |  |
| upstream.serviceAccount.imagePullSecrets[0].name | string | `"private-registry"` |  |
| upstream.serviceAccount.annotations | object | `{}` |  |
| upstream.serviceAccount.role.create | bool | `true` |  |
| upstream.serviceAccount.clusterRole.create | bool | `false` |  |
| upstream.serviceAccount.clusterRole.name | string | `nil` |  |
| upstream.serviceAccount.roleBinding.create | bool | `true` |  |
| upstream.serviceAccount.clusterRoleBinding.create | bool | `false` |  |
| upstream.serviceAccount.clusterRoleBinding.name | string | `nil` |  |
| upstream.serviceAccount.eksIrsa.roleArn | string | `nil` |  |
| upstream.database.type | string | `nil` |  |
| upstream.database.user | string | `nil` |  |
| upstream.database.password | string | `"userpassword"` |  |
| upstream.database.url | string | `nil` |  |
| upstream.database.credentials.secretName | string | `nil` |  |
| upstream.database.credentials.usernameSecretKey | string | `"username"` |  |
| upstream.database.credentials.passwordSecretKey | string | `"password"` |  |
| upstream.volumes.sharedHome.efs.enabled | bool | `false` |  |
| upstream.volumes.sharedHome.efs.driver | string | `nil` |  |
| upstream.volumes.sharedHome.efs.efsid | string | `nil` |  |
| upstream.volumes.sharedHome.efs.persistentVolumeClaim.create | bool | `false` |  |
| upstream.volumes.sharedHome.efs.persistentVolumeClaim.accessModes[0] | string | `"ReadWriteMany"` |  |
| upstream.volumes.sharedHome.efs.persistentVolumeClaim.storageClassName | string | `nil` |  |
| upstream.volumes.sharedHome.efs.persistentVolumeClaim.resources.requests.storage | string | `"1Gi"` |  |
| upstream.volumes.sharedHome.nfs.enabled | bool | `false` |  |
| upstream.volumes.sharedHome.nfs.server | string | `"IP"` |  |
| upstream.volumes.sharedHome.nfs.path | string | `"/"` |  |
| upstream.volumes.sharedHome.nfs.persistentVolumeClaim.create | bool | `false` |  |
| upstream.volumes.sharedHome.nfs.persistentVolumeClaim.accessModes[0] | string | `"ReadWriteMany"` |  |
| upstream.volumes.sharedHome.nfs.persistentVolumeClaim.storageClassName | string | `nil` |  |
| upstream.volumes.sharedHome.nfs.persistentVolumeClaim.resources.requests.storage | string | `"1Gi"` |  |
| upstream.volumes.sharedHome.nfsPermissionFixer.enabled | bool | `false` |  |
| upstream.volumes.sharedHome.nfsPermissionFixer.mountPath | string | `"/shared-home"` |  |
| upstream.volumes.sharedHome.nfsPermissionFixer.imageRepo | string | `"registry1.dso.mil/ironbank/redhat/ubi/ubi8-minimal"` |  |
| upstream.volumes.sharedHome.nfsPermissionFixer.imageTag | string | `"8.10"` |  |
| upstream.volumes.sharedHome.nfsPermissionFixer.resources | object | `{}` |  |
| upstream.volumes.additional[0].name | string | `"server-xml-j2"` |  |
| upstream.volumes.additional[0].configMap.name | string | `"server-xml-j2"` |  |
| upstream.volumes.additional[0].configMap.defaultMode | int | `484` |  |
| upstream.volumes.additional[1].name | string | `"server-xml"` |  |
| upstream.volumes.additional[1].configMap.name | string | `"server-xml"` |  |
| upstream.volumes.additional[1].configMap.defaultMode | int | `484` |  |
| upstream.volumes.additional[2].name | string | `"footer-content-vm"` |  |
| upstream.volumes.additional[2].configMap.name | string | `"footer-content-vm"` |  |
| upstream.volumes.additional[2].configMap.defaultMode | int | `484` |  |
| upstream.confluence.containerSecurityContext.runAsUser | int | `2002` |  |
| upstream.confluence.containerSecurityContext.runAsGroup | int | `2002` |  |
| upstream.confluence.containerSecurityContext.runAsNonRoot | bool | `true` |  |
| upstream.confluence.containerSecurityContext.capabilities.drop[0] | string | `"ALL"` |  |
| upstream.confluence.readinessProbe.customProbe | object | `{}` |  |
| upstream.confluence.startupProbe.enabled | bool | `false` |  |
| upstream.confluence.livenessProbe.initialDelaySeconds | int | `60` |  |
| upstream.confluence.additionalJvmArgs[0] | string | `"-Dcom.redhat.fips=false"` |  |
| upstream.confluence.additionalVolumeMounts[0].name | string | `"server-xml-j2"` |  |
| upstream.confluence.additionalVolumeMounts[0].mountPath | string | `"/opt/atlassian/etc/server.xml.j2"` |  |
| upstream.confluence.additionalVolumeMounts[0].subPath | string | `"server.xml.j2"` |  |
| upstream.confluence.additionalVolumeMounts[1].name | string | `"server-xml"` |  |
| upstream.confluence.additionalVolumeMounts[1].mountPath | string | `"/opt/atlassian/confluence/conf/server.xml"` |  |
| upstream.confluence.additionalVolumeMounts[1].subPath | string | `"server.xml"` |  |
| upstream.confluence.additionalVolumeMounts[2].mountPath | string | `"/opt/atlassian/confluence/confluence/decorators/includes/footer-content.vm"` |  |
| upstream.confluence.additionalVolumeMounts[2].name | string | `"footer-content-vm"` |  |
| upstream.confluence.additionalVolumeMounts[2].subPath | string | `"footer-content.vm"` |  |
| upstream.monitoring.jmxExporterInitContainer.runAsRoot | bool | `true` |  |
| upstream.monitoring.jmxExporterInitContainer.customSecurityContext | object | `{}` |  |
| upstream.monitoring.jmxExporterInitContainer.resources | object | `{}` |  |
| upstream.monitoring.jmxExporterImageRepo | string | `"registry1.dso.mil/ironbank/opensource/prometheus/jmx-exporter"` |  |
| upstream.monitoring.jmxExporterImageTag | string | `"0.18.0"` |  |
| upstream.monitoring.grafana.dashboardLabels.grafana_dashboard | string | `"1"` |  |
| upstream.fluentd.imageRepo | string | `"fluent/fluentd-kubernetes-daemonset"` |  |
| upstream.fluentd.imageTag | string | `"v1.11.5-debian-elasticsearch7-1.2"` |  |
| upstream.testPods.image.permissionsTestContainer | string | `"registry1.dso.mil/ironbank/redhat/ubi/ubi8-minimal:8.10"` |  |
| upstream.testPods.image.statusTestContainer | string | `"registry1.dso.mil/ironbank/big-bang/base:2.1.0"` |  |

## Contributing

Please see the [contributing guide](./CONTRIBUTING.md) if you are interested in contributing.

---

_This file is programatically generated using `helm-docs` and some BigBang-specific templates. The `gluon` repository has [instructions for regenerating package READMEs](https://repo1.dso.mil/big-bang/product/packages/gluon/-/blob/master/docs/bb-package-readme.md)._

