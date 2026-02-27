# Erros Corrigidos na Instalação

## Problemas Identificados e Soluções

### 1. ✅ Erro de Caminho com Caracteres Especiais
**Problema**: PowerShell não conseguia navegar para o diretório devido a caracteres especiais ("Área de Trabalho")

**Solução**: Criado script `install.ps1` que usa `Split-Path` para obter o diretório correto

### 2. ✅ Formato Incorreto dos Métodos da Evolution API
**Problema**: Os métodos estavam sendo chamados com formato incorreto

**Correções Realizadas**:

#### textMessage
- ❌ Antes: `{ number, textMessage: { text } }`
- ✅ Agora: `{ number, text }`

#### buttonMessage
- ❌ Antes: `{ number, textMessage: { text }, buttons: [{ buttonId, buttonText }] }`
- ✅ Agora: `{ number, title, description, footer, buttons: [{ type, displayText, id, url, copyCode, phoneNumber }] }`

#### listMessage
- ❌ Antes: `{ number, textMessage: { text }, title, buttonText, sections }`
- ✅ Agora: `{ number, title, description, buttonText, footerText, sections }`

#### pollMessage
- ❌ Antes: `{ number, pollName, pollValues }`
- ✅ Agora: `{ number, name, values, selectableCount }`

### 3. ✅ Script de Instalação Criado
Criado `install.ps1` que:
- Verifica Node.js e npm
- Navega corretamente para o diretório
- Instala dependências
- Mostra próximos passos

### 4. ✅ Arquivo .env Criado
Criado arquivo `.env` com configurações padrão

## Como Instalar Agora

### Opção 1: Usar o Script PowerShell
```powershell
.\install.ps1
```

### Opção 2: Instalação Manual
```powershell
# Navegue para o diretório do projeto
cd "C:\Users\ALFA\OneDrive\Área de Trabalho\botoes\baileys_interactive"

# Instale as dependências
npm install
```

## Próximos Passos Após Instalação

1. **Configure o .env** (já criado com valores padrão)
2. **Compile a Evolution API**:
   ```bash
   cd ../../ap.api/evolution-api
   npm run build
   ```
3. **Execute o projeto**:
   ```bash
   npm run dev
   ```

## Verificação de Erros

Todos os erros de formato foram corrigidos. O código agora usa o formato correto da Evolution API conforme documentação oficial.
