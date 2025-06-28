# 🚀 Deploy en AWS Free Tier

## 📋 Pasos para Deploy:

### 1. 🔑 Configurar AWS CLI
```bash
# Instalar AWS CLI
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Configurar credenciales
aws configure
# AWS Access Key ID: [TU_ACCESS_KEY]
# AWS Secret Access Key: [TU_SECRET_KEY]
# Default region: us-east-1
# Default output format: json
```

### 2. 🖥️ Crear EC2 Instance
```bash
# Crear instancia t2.micro (Free Tier)
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --count 1 \
  --instance-type t2.micro \
  --key-name krav-maga-key \
  --security-groups krav-maga-sg
```

### 3. 🔐 Configurar Security Group
```bash
# Crear security group
aws ec2 create-security-group \
  --group-name krav-maga-sg \
  --description "Krav Maga System Security Group"

# Permitir HTTP (puerto 80)
aws ec2 authorize-security-group-ingress \
  --group-name krav-maga-sg \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Permitir SSH (puerto 22)
aws ec2 authorize-security-group-ingress \
  --group-name krav-maga-sg \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0
```

### 4. 📦 Preparar Aplicación
```bash
# Compilar frontend
npm run build

# Instalar dependencias del servidor
npm install --production

# Inicializar base de datos
node server/init-db-aws.js
```

### 5. 🌐 Deploy Manual
```bash
# Conectar a EC2
ssh -i krav-maga-key.pem ec2-user@[IP_PUBLICA]

# En el servidor:
sudo yum update -y
sudo yum install -y nodejs npm git

# Clonar repositorio
git clone https://github.com/gadiazsaavedra/krav-maga-system.git
cd krav-maga-system

# Instalar dependencias
npm install --production
cd client && npm install && npm run build && cd ..

# Inicializar DB
node server/init-db-aws.js

# Instalar PM2 para mantener la app corriendo
sudo npm install -g pm2

# Iniciar aplicación
pm2 start server/app-aws.js --name "krav-maga"
pm2 startup
pm2 save
```

## 🎯 URLs Finales:
- **Sistema**: http://[IP_PUBLICA_EC2]
- **API**: http://[IP_PUBLICA_EC2]/api/health

## 💰 Costos (Free Tier):
- ✅ EC2 t2.micro: $0/mes (750 horas)
- ✅ EBS 30GB: $0/mes
- ✅ Transferencia: $0/mes (15GB)
- ✅ **Total: $0/mes por 12 meses**