terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }
}

provider "vercel" {
}

resource "vercel_project" "beaconhost_webapp" {
  name      = "beaconhost-webapp"
  framework = "nextjs"
  git_repository = {
    type = "github"
    repo = "OSmall/beaconhost"
  }
  root_directory                                    = "webapp"
  automatically_expose_system_environment_variables = false
}

resource "vercel_project_environment_variable" "aws_region" {
  project_id = vercel_project.beaconhost_webapp.id
  key        = "AWS_REGION"
  value      = "ap-southeast-2"
  target     = ["development", "preview", "production"]
}

resource "vercel_project_environment_variable" "app" {
  project_id = vercel_project.beaconhost_webapp.id
  key        = "APP"
  value      = "beaconhost-website"
  target     = ["development", "preview", "production"]
}
