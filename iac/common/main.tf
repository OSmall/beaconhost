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
  automatically_expose_system_environment_variables = true
  # ignore_command                                    = "git diff HEAD^ HEAD --quiet -- ./webapp"
  environment = [{
    key    = "AWS_REGION"
    target = ["development", "preview", "production"]
    value  = "ap-southeast-2"
    }, {
    key    = "APP"
    target = ["development", "preview", "production"]
    value  = "beaconhost-website"
    }, {
    key    = "STAGE"
    target = ["preview"]
    value  = "dev"
    }, {
    key    = "AWS_ACCESS_KEY_ID"
    target = ["preview"]
    value  = "sensitive"
    }, {
    key    = "AWS_SECRET_ACCESS_KEY"
    target = ["preview"]
    value  = "sensitive"
    }, {
    key    = "AWS_SESSION_TOKEN"
    target = ["preview"]
    value  = "sensitive"
    }, {
    key    = "GITHUB_ID"
    target = ["preview"]
    value  = "8b5f569ef7f65de71cea"
    }, {
    key    = "GITHUB_SECRET"
    target = ["preview"]
    value  = "sensitive"
    }, {
    key    = "AUTH_SECRET"
    target = ["preview"]
    value  = "sensitive"
    }, {
    key    = "STAGE"
    target = ["production"]
    value  = "prod"
    }, {
    key    = "AWS_ACCESS_KEY_ID"
    target = ["production"]
    value  = "sensitive"
    }, {
    key    = "AWS_SECRET_ACCESS_KEY"
    target = ["production"]
    value  = "sensitive"
    }, {
    key    = "AWS_SESSION_TOKEN"
    target = ["production"]
    value  = "sensitive"
    }, {
    key    = "GITHUB_ID"
    target = ["production"]
    value  = "8ed3346a5498b1518bac"
    }, {
    key    = "GITHUB_SECRET"
    target = ["production"]
    value  = "sensitive"
    }, {
    key    = "AUTH_SECRET"
    target = ["production"]
    value  = "sensitive"
    }
  ]
}
