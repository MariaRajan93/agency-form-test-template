#!/bin/bash

# Ensure jq is installed
if ! command -v jq &> /dev/null; then
  echo "jq is not installed. Please install it and try again."
  return 1
fi

# Check if input file is provided
if [ -z "$1" ]; then
  echo "Error: No input file provided."
  echo "Usage: $0 <path-to-results.json>"
  return 1
fi

# Assign input file from argument
INPUT_FILE="$1"

# Check if the file exists
if [ ! -f "$INPUT_FILE" ]; then
  echo "Error: Input file $INPUT_FILE does not exist."
  return 1
fi

# Process K6 results with percentiles
echo "Processing K6 results with percentiles..."
jq -r '
  [
    inputs |
    select(.metric == "http_req_duration") |                    # Process only HTTP duration metrics
    select(.data.tags != null and .data.tags.name != null) |    # Ensure tags and name exist
    {
      name: .data.tags.name,
      duration: .data.value,
      method: (.data.tags.method // "Unknown"),
      status: (.data.tags.status // "Unknown")
    }
  ]
  | group_by({name: .name, status: .status})                   # Group by both name and status
  | map({
      "API Name": .[0].name,
      "HTTP Method": .[0].method,
      "HTTP Status": .[0].status,
      "Request Count": length,
      "Mean Duration (ms)": ([.[].duration] | add / length),
      "Median Duration (ms)": ([.[].duration] | sort | .[length / 2 | floor]),
      "Min Duration (ms)": ([.[].duration] | min),
      "Max Duration (ms)": ([.[].duration] | max),
      "Standard Deviation (ms)": ([.[].duration] | (add / length) as $mean | map((. - $mean) * (. - $mean)) | add / length | sqrt),
      "P95 (ms)": ([.[].duration] | sort | .[(length * 95 / 100 | floor)]),
      "P99 (ms)": ([.[].duration] | sort | .[(length * 99 / 100 | floor)])
    })
  | (["API Name", "HTTP Method", "HTTP Status", "Request Count", "Mean Duration (ms)", "Median Duration (ms)", "Min Duration (ms)", "Max Duration (ms)", "Standard Deviation (ms)", "P95 (ms)", "P99 (ms)"] | @tsv),
    (.[] | [.["API Name"], .["HTTP Method"], .["HTTP Status"], .["Request Count"], .["Mean Duration (ms)"], .["Median Duration (ms)"], .["Min Duration (ms)"], .["Max Duration (ms)"], .["Standard Deviation (ms)"], .["P95 (ms)"], .["P99 (ms)"]] | @tsv)
' "$INPUT_FILE" | column -t -s $'\t'
