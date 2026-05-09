# ArgoCD Setup for AIMatch Production

This directory contains ArgoCD Application manifests for managing AIMatch deployments.

## Prerequisites

1. Create secret for argoCD to access github private repository (You can clone argo-cd-secret-example.yaml file, change the secret value with your value, but remember, dont commit this file to git)

2. ArgoCD installed in your cluster
   ```bash
   kubectl create namespace argocd
   kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
   ```

3. Git repository with this code (accessible to ArgoCD)

## Configuration

### Step 1: Update Git Repository Information

Edit `aimatch-prod-application.yaml` and update:

```yaml
spec:
  source:
    repoURL: https://github.com/NT548-Q21-Project/Course_Project
    targetRevision: main
```

### Step 2: Update ECR Registry

Before deploying, update the ECR registry URL in:
- `infra/k8s-spec/overlays/prod/kustomization.yaml`

Replace `<YOUR_ECR_REGISTRY>` with your actual ECR registry URL.

### Step 3: Configure ECR Access (optional for private ecr)

If using a private ECR registry:

```bash
kubectl create secret docker-registry ecr-secret \
  --docker-server=<YOUR_ECR_REGISTRY> \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password --region <YOUR_REGION>) \
  -n aimatch
```

Then update the deployments to use this secret (in base manifests or overlay patches).

### Step 4: Deploy the Application

```bash
kubectl apply -f infra/k8s-spec/argocd/aimatch-prod-application.yaml
```

## Managing the Application
This section is AI-generated, be careful with whatever you gonna apply to production environment
### View Application Status
```bash
argocd app get aimatch-prod
kubectl get application aimatch-prod -n argocd
```

### Manual Sync
```bash
argocd app sync aimatch-prod
# or
kubectl patch application aimatch-prod -n argocd \
  -p='{"metadata":{"annotations":{"argocd.argoproj.io/sync":"sync"}}}' --type merge
```

### Refresh
```bash
argocd app refresh aimatch-prod
```

### Rollback
```bash
argocd app rollback aimatch-prod <REVISION>
```

### View Logs
```bash
argocd app logs aimatch-prod
```

## Features Configured

### Auto-Sync
- **prune: true** - Deletes resources that are no longer in Git
- **selfHeal: true** - Auto-syncs when cluster state diverges from Git

### Retry Policy
- Retries failed syncs up to 5 times with exponential backoff
- Max backoff duration: 3 minutes

### Resource Management
- **CreateNamespace=true** - Automatically creates the aimatch namespace
- **Finalizers** - Ensures proper cleanup when Application is deleted

## Multi-Environment Support

Currently configured for **single production environment**. To add more environments:

1. Create additional overlays:
   ```
   infra/k8s-spec/overlays/staging/
   infra/k8s-spec/overlays/dev/
   ```

2. Create separate Application resources:
   ```bash
   cp aimatch-prod-application.yaml aimatch-staging-application.yaml
   ```
   Update the path, name, and namespace accordingly.

## Troubleshooting

### Application shows "OutOfSync"
```bash
# Check the diff
argocd app diff aimatch-prod

# If intentional, re-sync
argocd app sync aimatch-prod
```

### Images not pulling from ECR
- Verify ECR registry URL in `overlays/prod/kustomization.yaml`
- Verify ImagePullSecret exists if ECR is private
- Check Docker credentials with: `kubectl get secrets ecr-secret -n aimatch -o yaml`

### Sync stuck or failing
```bash
# Check Application status
argocd app get aimatch-prod

# View detailed status
kubectl describe application aimatch-prod -n argocd

# Check sync logs
argocd app logs aimatch-prod --follow
```

## Cleanup

To delete the application and all resources:
```bash
argocd app delete aimatch-prod --cascade
# or
kubectl delete application aimatch-prod -n argocd
```

This will delete all resources because the Finalizer is configured to cascade delete.

## References

- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [ArgoCD Application Spec](https://argo-cd.readthedocs.io/en/stable/operator-manual/application.yaml)
- [Kustomize Documentation](https://kustomize.io/)
