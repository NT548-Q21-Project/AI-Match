# This manifests only serve local development purpose
## Instruction to run this locally to create 3 "mock" databases
### Prerequisites: A local cluster like kind, minikube, or whatever you want
- Step 1: cd to the k8s-spec/local/postgres directory
- Step 2:
```
chmod +x scripts/cloneDefaultStorageClass.sh
./script/cloneDefaultStorageClass.sh
```
- Step 3: create pvc
```
kubectl apply -f pvc
```
- Step 4: create configmap, secrets and services
```
kubectl apply -f configmaps/ -f secret/ -f services
```
- Step 5: create statefulset (although statefulset or deployment are not different in this situation, I'd prefer statefulset as following best practices)
```
kubectl apply -f statefulsets/ 
```