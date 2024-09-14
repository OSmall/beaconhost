variable "aws_region" {
  type    = string
  default = "ap-southeast-2"
}

variable "environment" {
  type = string
}

variable "vercel_aws_access_key_id" {
  type = string
}

variable "vercel_aws_secret_access_key" {
  type = string
}

variable "vercel_github_id" {
  type = string
}

variable "vercel_github_secret" {
  type = string
}

terraform {
  required_providers {
    aws = {
      source  = "opentofu/aws"
      version = "~> 5.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
    random = {
      source  = "opentofu/random"
      version = "3.6.2"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "null_resource" "default" {
  provisioner "local-exec" {
    command = "echo 'Hello World'"
  }
}

resource "aws_dynamodb_table" "authjs" {
  name         = "${var.environment}-webapp-authjs"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  attribute {
    name = "GSI1PK"
    type = "S"
  }

  attribute {
    name = "GSI1SK"
    type = "S"
  }

  global_secondary_index {
    name            = "GSI1"
    hash_key        = "GSI1PK"
    range_key       = "GSI1SK"
    projection_type = "ALL"
  }

  ttl {
    attribute_name = "expires"
    enabled        = true
  }
}

data "vercel_project" "beaconhost_webapp" {
  name = "beaconhost-webapp"
}

resource "vercel_project_environment_variable" "stage" {
  project_id = data.vercel_project.beaconhost_webapp.id
  key        = "STAGE"
  value      = "dev"
  target     = var.environment == "prod" ? ["production"] : ["preview"]
}

resource "vercel_project_environment_variable" "aws_access_key_id" {
  project_id = data.vercel_project.beaconhost_webapp.id
  key        = "AWS_ACCESS_KEY_ID"
  value      = var.vercel_aws_access_key_id
  target     = var.environment == "prod" ? ["production"] : ["preview"]
}

resource "vercel_project_environment_variable" "aws_secret_access_key" {
  project_id = data.vercel_project.beaconhost_webapp.id
  key        = "AWS_SECRET_ACCESS_KEY"
  value      = var.vercel_aws_secret_access_key
  target     = var.environment == "prod" ? ["production"] : ["preview"]
}

resource "vercel_project_environment_variable" "github_id" {
  project_id = data.vercel_project.beaconhost_webapp.id
  key        = "GITHUB_ID"
  value      = var.vercel_github_id
  target     = var.environment == "prod" ? ["production"] : ["preview"]
}

resource "vercel_project_environment_variable" "github_secret" {
  project_id = data.vercel_project.beaconhost_webapp.id
  key        = "GITHUB_SECRET"
  value      = var.vercel_github_secret
  target     = var.environment == "prod" ? ["production"] : ["preview"]
}

resource "random_string" "auth_secret" {
  length  = 64
  special = true
}

resource "vercel_project_environment_variable" "auth_secret" {
  project_id = data.vercel_project.beaconhost_webapp.id
  key        = "AUTH_SECRET"
  value      = random_string.auth_secret.result
  target     = var.environment == "prod" ? ["production"] : ["preview"]
}
