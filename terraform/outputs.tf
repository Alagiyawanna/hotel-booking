output "public_ip" {
  value       = aws_instance.app_server.public_ip
  description = "Public IP of the EC2 instance"
}

output "public_dns" {
  value       = aws_instance.app_server.public_dns
  description = "Public DNS of the EC2 instance"
}