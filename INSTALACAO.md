# Guia de Instalação - Baileys Interactive com Evolution API

## ✅ Todos os Erros Foram Corrigidos!

### Erros Corrigidos:
1. ✅ Formato incorreto dos métodos da Evolution API
2. ✅ Problemas com caminhos e caracteres especiais
3. ✅ Script de instalação criado

## 🚀 Instalação Rápida

### Passo 1: Execute o Script de Instalação

**Windows PowerShell:**
```powershell
cd "C:\Users\ALFA\OneDrive\Área de Trabalho\botoes\baileys_interactive"
.\install.ps1
```

**Ou manualmente:**
```powershell
npm install
```

### Passo 2: Configure o Ambiente

O arquivo `.env` já foi criado com valores padrão. Se necessário, ajuste:

```env
PORT=8787
API_KEY=ACFH4RFOTME4RU50R4FKGNW34LDFG8DSQ
AUTH_FOLDER=auth
EVOLUTION_API_PATH=../../ap.api/evolution-api
```

### Passo 3: Compile a Evolution API

```bash
cd ../../ap.api/evolution-api
npm install
npm run build
```

### Passo 4: Execute o Projeto

```bash
cd "C:\Users\ALFA\OneDrive\Área de Trabalho\botoes\baileys_interactive"
npm run dev
```

## 📋 Verificação

Após a instalação, verifique:

1. ✅ Dependências instaladas (`node_modules` existe)
2. ✅ Evolution API compilada (`dist/` existe na Evolution API)
3. ✅ Arquivo `.env` configurado
4. ✅ Servidor inicia sem erros

## 🔧 Troubleshooting

Se encontrar problemas:

1. **Erro de caminho**: Use o script `install.ps1`
2. **Evolution API não encontrada**: Verifique `EVOLUTION_API_PATH` no `.env`
3. **Erro ao compilar**: Certifique-se de que a Evolution API tem todas as dependências instaladas

## 📝 Arquivos Criados

- ✅ `install.ps1` - Script de instalação automática
- ✅ `.env` - Configurações de ambiente
- ✅ `ERROS_CORRIGIDOS.md` - Lista de erros corrigidos
- ✅ `INTEGRACAO_EVOLUTION.md` - Documentação da integração
- ✅ `TROUBLESHOOTING.md` - Guia de resolução de problemas

## ✨ Pronto para Usar!

O projeto está configurado e pronto para testar. Execute `npm run dev` e acesse `http://localhost:8787`
