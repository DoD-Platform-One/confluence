# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---
## [1.20.0-bb.7] - 2024-06-08
### Changed
- ironbank/atlassian/confluence-data-center/confluence-node updated from 8.8.1 to 8.9.2

## [1.20.0-bb.6] - 2024-05-28
### Added
- Revert confluence-node-lts back to confluence-node
- update renovate.json to reflect upstream changes from registry1.dso.mil/ironbank/atlassian/confluence-data-center/confluence-node
- upgraded ironbank/atlassian/confluence-data-center/confluence-node to 8.8.1

## [1.20.0-bb.5] - 2024-06-05
### Changed
- Cypress updated from 13.9.0 to 13.10.0

## [1.20.0-bb.4] - 2024-05-30
### Fixed 
- Revert to working securityContext

## [1.20.0-bb.3] - 2024-05-28
### Added
- Added authorization policies

## [1.20.0-bb.2] - 2024-05-22
### Changed
-  update renovate.json to reflect upstream changes from registry1.dso.mil/ironbank/atlassian/confluence-data-center/confluence-node-lts

## [1.20.0-bb.1] - 2024-05-16
### Changed
-  opensearch-project.github.io/helm-charts from 2.19.0 to 2.20.0

## [1.20.0-bb.0] - 2024-05-14
### Changed
- ironbank/atlassian/confluence-data-center/confluence-node-lts updated from 8.5.8 to 8.5.9

## [1.19.0-bb.1] - 2024-05-13
### Changed
- cypress from 13.8.1 to 13.9.0

## [1.19.0-bb.0] - 2024-05-08
### Changed
- gluon updated from 0.4.8 to 0.5.0
- ironbank/atlassian/confluence-data-center/confluence-node-lts updated from 8.5.7 to 8.5.8
- ironbank/opensource/postgres/postgresql updated from 15.6 to 16.2
- cypress from 13.2.0 to 13.8.1

## [1.18.1-bb.4] - 2024-04-30
### Changed
- Added k8s templates to support Istio Egress destination allow list
- Corrected development address to new confluence.dev.bigbang.mil
- Updated documentation

## [1.18.1-bb.3] - 2024-04-23
### Fixed
- Non-root policy fix

## [1.18.1-bb.2] - 2024-04-11
### Changed
- Update horizontal pod api version

## [1.18.1-bb.1] - 2024-04-04
### Added 
- Added custom network policies

## [1.18.1-bb.0] - 2024-03-28
### Changed
- ironbank/atlassian/confluence-data-center/confluence-node updated from 8.8.0 to 8.8.1

## [1.18.0-bb.1] - 2024-03-14
### Changed
- use monitoring.jmxExporterInitContainer.customSecurityContext or confluence.containerSecurityContext for the fetch-jmx-exporter

## [1.18.0-bb.0] - 2024-02-15
### Changed
- ironbank/atlassian/confluence-data-center/confluence-node updated from 8.7.2 to 8.8.0
- ironbank/opensource/postgres/postgresql updated from 15.5 to 15.6
- common updated to 1.2.6

## [1.17.2-bb.1] - 2024-02-02
### Changed
- gluon updated from 0.4.7 to 0.4.8

## [1.17.2-bb.0] - 2024-01-19
### Changed
- gluon updated from 0.4.5 to 0.4.7
- ironbank/atlassian/confluence-data-center/confluence-node updated from 8.7.1 to 8.7.2

## [1.17.1-bb.0] - 2023-12-10
### Changed
- gluon updated from 0.4.4 to 0.4.5
- ironbank/atlassian/confluence-data-center/confluence-node updated from 8.6.1 to 8.7.1

## [1.16.6-bb.4] - 2023-11-7
### Updated
- postgres subchart from 13.2.1 to 13.2.2
- BB base image from 2.0.0 to 2.1.0
- renovate.json improvements for more efficient updates over time
- postgresql to 15.5

## [1.16.6-bb.3] - 2023-11-6
### Updated
- postgres subchart from 13.2.0 to 13.2.1

## [1.16.6-bb.2] - 2023-11-2
### Updated
- updated annotation reference for 8.6.1

## [1.16.6-bb.1] - 2023-11-1
### Updated
- gluon from 0.4.1 to 0.4.4
- postgres subchart from 13.1.5 to 13.2.0

## [1.16.6-bb.0] - 2023-10-31
### Updated
- Confluence chart version to 1.16.6
- Confluence image to 8.6.1
- common to 1.2.5

## [1.15.0-bb.7] - 2023-10-13
### Updated
- confluence-node to 8.6.0
- postgresql to 15.4
- postgresql chart dependency to 13.1.5

## [1.15.0-bb.6] - 2023-09-26
### Updated
- common to 1.2.4
- Gluon to 0.4.1
- postgresql subchart to 12.12.7
- postgresql image to 14.9
- cypress to v13

## [1.15.0-bb.5] - 2023-09-15
### Fixed
- Duplicate securityContext fix
- Null fsgroup fix

## [1.15.0-bb.4] - 2023-09-13
### Fixed
- Duplicate annotation fix

## [1.15.0-bb.3] - 2023-09-08
### Fixed
- Fixed JMX Exporter Fetch after moving to ironbank image

## [1.15.0-bb.2] - 2023-09-08
### Fixed
- Policy adherance fix

## [1.15.0-bb.1] - 2023-09-08
### Updated
- Gluon to 0.4.0
- common to 1.2.3
### Fixed
- Grafana Integration/Dashboards
- Support for BB monitoring
- Kpt Integration
- BB Renovate support
- Cypress Tests
### Added
- Network Policies
- Optional Cluster-internal Postgres
- Documents
- Tests

## [1.15.0-bb.0] - 2023-08-10
### Updated
- Confluence chart version to 1.15.0
- Confluence image to 8.4.0

## [1.11.0-bb.0] - 2023-08-09
### Fixed
- Point Kpt file to updated repo
### Updated
- Confluence chart version to 1.11.0

## [1.10.0-bb.3] - 2023-05-08
### Fixed
- Removed footer logo background image

## [1.10.0-bb.2] - 2023-05-04
### Fixed
- Added padding to footer logo

## [1.10.0-bb.1] - 2023-03-22
### Updated
- Added DB password update to init script

## [1.10.0-bb.0] - 2023-02-28
### Updated
- Updated confluence to version `8.0.3`
- Updated chart to version `confluence-1.10.0`

## [1.8.1-bb.0] - 2022-01-18
### Updated
- Updated confluence to version `8.0.0`
- Updated chart to version `confluence-1.8.1`

## [1.5.1-bb.4] - 2023-01-17
### Changed
- Update gluon to new registry1 location + latest version (0.3.2)

## [1.5.1-bb.3] - 2023-01-13
### Fixed
- Disable FIPS alignment for openJDK

## [1.5.1-bb.2] - 2022-09-29
### Fixed
- Fixed duplicate init containers

## [1.5.1-bb.1] - 2022-09-14
### Update
- Updated gluon 0.3.1

## [1.5.1-bb.0] - 2022-09-06
### Update
- Updated Confluence node to 7.19.0 and gluon 0.3.0
- Updated kpt upstream

## [0.1.0-bb.21] - 2022-07-11
### Added
- Added livenessProbe configuration for statefulset pods

## [0.1.0-bb.20] - 2022-06-28
### Update
- Updated BB base image to 2.0.0

## [0.1.0-bb.19] - 2022-06-23
### Update
- Confluence to 7.18.1

## [0.1.0-bb.18] - 2022-06-08
### Update
- Hostname and synchrony updates to BB VirtualService

## [0.1.0-bb.17] - 2022-06-07
### Changed
- Enable user access logs by default in server.xml

## [0.1.0-bb.16] - 2022-05-17
### Update
- Moved image to Ironbank and updated to 7.17.1 and gluon 0.2.9

## [0.1.0-bb.15] - 2022-05-10
### Added
- Horizontal pod scaling yaml added with Value file update

## [0.1.0-bb.14] - 2022-04-18
### Fixed
- serviceMonitor for confluence by adding quote for endpoint port

## [0.1.0-bb.13] - 2022-04-12
### Added
- server.xml disabled tomcat error report configuration

## [0.1.0-bb.12] - 2022-02-01
### Added
- License added

## [0.1.0-bb.11] - 2022-01-05
### Added
- footer-content.vm file added to files section of the chart.
- footer-content-vm configmap template created.
- Values.yaml file updated with footer-content-vm configmap volume mount.
- This configuration does not display the app version and node on the footer section of the UI.

## [0.1.0-bb.10] - 2021-11-30
### Added
- renovate.json added for image tracking with IB
### Fxied
- Image name for statefulset, added the tag using template
- Deprecated istio api versions updated

## [0.1.0-bb.9] - 2021-09-14
### Update
- Moved image to Ironbank and updated to 7.13.0

## [0.1.0-bb.8] - 2021-09-02
### Fix
- Remove duplicate Confluence label and service template values.

## [0.1.0-bb.7] - 2021-08-25
### Fix
- Update server.xml file to support Confluence 7.13.0.

## [0.1.0-bb.6] - 2021-06-22
### Fix
- synchrony and confluence virtual service use same FDQN.
- synchrony URL can be reach via confluence url/synchrony

## [0.1.0-bb.5] - 2021-06-18
### Fix
- Fixed vitrual services and added needed values.
