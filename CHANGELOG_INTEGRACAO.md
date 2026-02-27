# Changelog - Integração Evolution API

## Alterações Realizadas

### ✅ Arquivos Criados

1. **`src/services/evolution-adapter.ts`**
   - Adaptador que integra a Evolution API
   - Mantém compatibilidade com a interface atual
   - Gerencia instâncias e QR codes através da Evolution API

2. **`INTEGRACAO_EVOLUTION.md`**
   - Documentação completa da integração
   - Instruções de configuração e uso

3. **`TROUBLESHOOTING.md`**
   - Guia de resolução de problemas
   - Soluções para erros comuns

### ✅ Arquivos Modificados

1. **`src/routes/instances.ts`**
   - Atualizado para usar `evolution-adapter`
   - Suporte para QR codes da Evolution API
   - Verificação de status de conexão

2. **`src/routes/messages.ts`**
   - Atualizado para usar métodos da Evolution API
   - Suporte para botões, listas, enquetes, etc.
   - Validação de instâncias conectadas

3. **`src/config.ts`**
   - Adicionado `evolutionApiPath` configurável
   - Suporte para variável de ambiente `EVOLUTION_API_PATH`

4. **`package.json`**
   - Descrição atualizada
   - Dependências otimizadas

### ✅ Funcionalidades Mantidas

Todas as rotas existentes continuam funcionando:

- ✅ `POST /v1/instances` - Criar instância
- ✅ `GET /v1/instances` - Listar instâncias
- ✅ `GET /v1/instances/:name` - Status da instância
- ✅ `GET /v1/instances/:name/qr` - Obter QR code
- ✅ `POST /v1/instances/:name/disconnect` - Desconectar
- ✅ `POST /v1/instances/:name/logout` - Logout
- ✅ `DELETE /v1/instances/:name` - Remover
- ✅ `POST /v1/messages/send_menu` - Menu texto
- ✅ `POST /v1/messages/send_buttons_helpers` - Botões
- ✅ `POST /v1/messages/send_interactive_helpers` - Botões CTA
- ✅ `POST /v1/messages/send_list_helpers` - Lista
- ✅ `POST /v1/messages/send_poll` - Enquete
- ✅ `POST /v1/messages/send_carousel_helpers` - Carrossel

### ⚠️ Requisitos

1. **Evolution API deve estar compilada**:
   ```bash
   cd ../../ap.api/evolution-api
   npm run build
   ```

2. **Variável de ambiente configurada**:
   ```env
   EVOLUTION_API_PATH=../../ap.api/evolution-api
   ```

3. **Evolution API configurada**:
   - Banco de dados configurado
   - Variáveis de ambiente da Evolution API configuradas

### 🔧 Melhorias Implementadas

1. **Importação Inteligente**:
   - Tenta importar da pasta `dist/` primeiro (compilado)
   - Fallback para TypeScript se necessário
   - Mensagens de erro claras

2. **Tratamento de QR Code**:
   - Suporta múltiplos formatos de QR code
   - Conversão automática quando necessário
   - Cache de QR codes

3. **Validação Robusta**:
   - Verifica se instância existe
   - Verifica status de conexão
   - Mensagens de erro descritivas

### 📝 Notas Importantes

1. **Compatibilidade**: A interface de API permanece a mesma, facilitando migração
2. **Performance**: O adaptador cacheia módulos da Evolution API
3. **Erros**: Todos os erros são tratados e retornam mensagens claras
4. **Logs**: Erros são logados no console para debugging

### 🚀 Próximos Passos

1. Compilar a Evolution API
2. Configurar `.env` com `EVOLUTION_API_PATH`
3. Testar criação de instância
4. Testar envio de mensagens
5. Verificar logs em caso de erros
