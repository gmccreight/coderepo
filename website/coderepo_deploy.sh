#!/usr/bin/env bash

# This script is used to deploy coderepo to S3.
# Since the yaml file can't use ENV data we use a workaround of concatenating
# secret data from an untracked file.

cp nanoc.yaml nanoc_backup_before_deploy.yaml
cat untracked_aws_info >> nanoc.yaml
nanoc deploy fog
mv nanoc_backup_before_deploy.yaml nanoc.yaml
