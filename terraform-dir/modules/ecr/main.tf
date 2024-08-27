resource "aws_ecr_repository" "web_app" {
  name                 = "web-app"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "database_app" {
  name                 = "database-app"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

output "web_app_repository_url" {
  value = aws_ecr_repository.web_app.repository_url
}

output "database_app_repository_url" {
  value = aws_ecr_repository.database_app.repository_url
}
