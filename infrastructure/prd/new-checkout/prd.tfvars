###############################
### CONTAINER CONFIGURATION ###
###############################

nginx_default_image = "${NGINX_IMAGE}"
php_default_image = "${PHP_IMAGE}"
cpu = 2048
memory = 4096
max_capacity = 0
min_capacity = 0

#############################
### GENERAL CONFIGURATION ###
#############################

name = "greenn-pci-prd-new-checkout-svc"
environment = "production"

#############################
### NETWORK CONFIGURATION ###
#############################

vpc_id = "vpc-0b48a107f6cc24c91"
app_subnets = [ 
    "subnet-01832e59d13feeb83", 
    "subnet-05f7d1d93a3cb93c0" 
]
container_security_group = [ 
    "sg-0114a1bc1366eb27a" 
]

#########################
### ALB CONFIGURATION ###
#########################

application_host_header_values = [
  "payfast.greenn.com.br",
  "payfastdebug.greenn.com.br",
  "pay-staging.greenn.com.br"
]
alb_https_listener = "arn:aws:elasticloadbalancing:us-east-1:590184113591:listener/app/greenn-prd-pci-alb/c2cd98123c4ea2ce/38c6fd6ddc19e459"
