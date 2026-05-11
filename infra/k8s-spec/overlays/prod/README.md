# Production Overlay

This overlay contains production-specific configurations for deploying app to a EKS.

## Configuration

### ECR Image Registry
- Step 1: Update the `<YOUR_ECR_REGISTRY>` placeholders in `kustomization.yaml` with your ECR registry URL:

```bash
# Example: 123456789.dkr.ecr.us-east-1.amazonaws.com
```
Replace all instances of `<YOUR_ECR_REGISTRY>` with your actual ECR registry URL.
- Step 2: Update the newTag field for every image
Replace prod-v1 tag in the newTag field.
### Usage

#### Apply via Kustomize:
```bash
kubectl apply -k infra/k8s-spec/overlays/prod
```

#### Apply via ArgoCD:
ArgoCD will automatically sync this overlay based on the configured Application resource.

## External Secrets handling:
- Run this on EKS to install External Secrets Operator (ESO), this resource must be created before ArgoCD:
```bash
helm repo add external-secrets https://charts.external-secrets.io

helm repo update

helm install external-secrets \
  external-secrets/external-secrets \
  -n external-secrets \
  --create-namespace
```
- Create secrets in AWS Secrets Manager for 3 app services, and the api gateway app
- Setup IAM Permission for External Secrets Operator
- Attach Permission to cluster via IRSA
## ECR Private Registry Access

Since we gonna deploy app to EKS, there's no need to setup for ECR private registry access.
However, for extra safety, below is the instructions to setup ECR secret:

- Create an ImagePullSecret:

```bash
kubectl create secret docker-registry ecr-secret \
  --docker-server=<YOUR_ECR_REGISTRY> \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password --region <REGION>) \
  --docker-email=not@valid.com \
  -n aimatch
```
- Then update the deployments to reference the secret:

```yaml
spec:
  template:
    spec:
      imagePullSecrets:
      - name: ecr-secret
```

