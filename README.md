# fullstack-todo app

## Deploying Backend To AWS ECS

### 1. Set up AWS credentials:
- Create an IAM user in your AWS account with permissions to interact with ECS and ECR.
- Generate an access key for the IAM user.
- Add the access key and secret key as GitHub Secrets in your repository settings.

### 2. Create a GitHub Actions workflow:

- Create/navigate to the .github/workflows directory.
- Create a new YAML file for your workflow, e.g., deploy.yml.
- Define a wokflow like so
```yaml
    name: Deploy to AWS ECS

    on:
      push:
        branches:
          - main
    
    jobs:
      deploy:
        runs-on: ubuntu-latest
    
        steps:
          - name: Checkout code
            uses: actions/checkout@v2
    
          - name: Configure AWS credentials
            uses: aws-actions/configure-aws-credentials@v1
            with:
              aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
              aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
              aws-region: <YOUR_AWS_REGION>
    
          - name: Login to Amazon ECR
            id: login-ecr
            run: aws ecr get-login-password --region <YOUR_AWS_REGION> | docker login --username AWS --password-stdin <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.<YOUR_AWS_REGION>.amazonaws.com
    
          - name: Build Docker image
            run: docker build -t <YOUR_ECR_REPOSITORY_URI> .
    
          - name: Push Docker image to ECR
            run: docker push <YOUR_ECR_REPOSITORY_URI>
    
          - name: Deploy to ECS
            run: |
              aws ecs update-service --cluster <YOUR_ECS_CLUSTER_NAME> --service <YOUR_ECS_SERVICE_NAME> --force-new-deployment

```

- Replace placeholders like <YOUR_AWS_REGION>, <YOUR_AWS_ACCOUNT_ID>, <YOUR_ECR_REPOSITORY_URI>, <YOUR_ECS_CLUSTER_NAME>, and <YOUR_ECS_SERVICE_NAME> with actual AWS and ECS details.

### 3. Commit and push:
- Commit the workflow file to your repository.
- Push the changes to trigger the workflow.

This workflow will automatically build the Docker images, push it to ECR, and deploy it to ECS whenever changes are pushed to the main branch of your GitHub repository