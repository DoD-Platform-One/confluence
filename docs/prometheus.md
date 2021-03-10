# Monitoring Confluence with Prometheus

With a plugin, Confluence can be configured to export metrics that Prometheus can scrape.

## Prerequisites

Either the [Prometheus Exporter for Confluence](https://marketplace.atlassian.com/apps/1222775/prometheus-exporter-for-confluence?hosting=server&tab=overview) or [Prometheus Exporter PRO for Confluence](https://marketplace.atlassian.com/apps/1222775/prometheus-exporter-for-confluence?hosting=server&tab=overview) plugins must be added to Confluence in order for metrics to work properly.  Since these plugins are not part of Big Bang or Iron Bank, they have not been evaluated for use in government deployments.

The [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) must be installed and [Prometheus](https://prometheus.io/) must be running in the cluster.  By default, Big Bang deploys both of these items.

## Configuration

In `values.yaml`, turning on monitoring will enable the `ServiceMonitor` required for Prometheus to scrape metrics on Confluence:

```yaml
monitoring:
  enabled: true
```
