{{/*
Bigbang labels
*/}}
{{- define "bigbang.labels" -}}
app: {{ template "common.names.name" . }} 
{{- if .Chart.AppVersion }}
version: {{ .Chart.AppVersion | quote }}
{{- end }}
{{- end }}
