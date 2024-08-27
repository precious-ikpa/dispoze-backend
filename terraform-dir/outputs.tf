
output "web_app_ecr_repository_url" {
  value = module.ecr.web_app_repository_url
}

output "database_app_ecr_repository_url" {
  value = module.ecr.database_app_repository_url
}
