AWS_ECR_REPO = web-app
AWS_REGION = eu-north-1
AWS_ACCOUNT_ID = 366815954674

build:
	docker build --platform linux/amd64 --provenance false -t $(AWS_ECR_REPO):latest .

run:
	docker run -p 4000:4000 $(AWS_ECR_REPO):latest

create-repo: 
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com
	aws ecr create-repository --repository-name $(AWS_ECR_REPO) --region $(AWS_REGION) --image-scanning-configuration scanOnPush=true --image-tag-mutability MUTABLE

login:
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com

tag-push:
	docker tag $(AWS_ECR_REPO):latest $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(AWS_ECR_REPO):latest
	docker push $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(AWS_ECR_REPO):latest