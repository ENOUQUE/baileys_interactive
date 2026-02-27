# Guia de Troubleshooting - Integração Evolution API

## Problemas Comuns e Soluções

### 1. Erro: "Evolution API não encontrada"

**Causa**: O caminho para a Evolution API está incorreto.

**Solução**:
1. Verifique se a Evolution API está no caminho especificado
2. Ajuste a variável `EVOLUTION_API_PATH` no arquivo `.env`:
   ```env
   EVOLUTION_API_PATH=../../ap.api/evolution-api
   ```
3. Use caminho absoluto se necessário:
   ```env
   EVOLUTION_API_PATH=C:/Users/ALFA/OneDrive/Área de Trabalho/ap.api/evolution-api
   ```

### 2. Erro: "Não foi possível importar TypeScript diretamente"

**Causa**: A Evolution API precisa estar compilada ou você precisa usar tsx/ts-node.

**Solução**:
1. Compile a Evolution API primeiro:
   ```bash
   cd ../../ap.api/evolution-api
   npm run build
   ```
2. Ou instale tsx no projeto atual:
   ```bash
   npm install -D tsx
   ```

### 3. Erro: "Módulos da Evolution API não foram encontrados"

**Causa**: A estrutura da Evolution API mudou ou não está compilada.

**Solução**:
1. Verifique se a Evolution API está compilada (pasta `dist/` existe)
2. Verifique se o arquivo `dist/api/server.module.js` existe
3. Recompile a Evolution API se necessário

### 4. Erro ao criar instância

**Causa**: A Evolution API não está configurada corretamente (banco de dados, etc.).

**Solução**:
1. Certifique-se de que a Evolution API está rodando e configurada
2. Verifique as configurações do banco de dados na Evolution API
3. Verifique os logs da Evolution API para mais detalhes

### 5. QR Code não aparece

**Causa**: O QR code pode estar em formato diferente ou a instância não foi criada corretamente.

**Solução**:
1. Aguarde alguns segundos após criar a instância
2. Tente obter o QR code novamente: `GET /v1/instances/:name/qr`
3. Verifique os logs para ver se há erros

### 6. Mensagens não são enviadas

**Causa**: A instância não está conectada ou os métodos da Evolution API mudaram.

**Solução**:
1. Verifique se a instância está conectada: `GET /v1/instances/:name`
2. O status deve ser `connected` (não `qr` ou `disconnected`)
3. Verifique os logs para erros específicos

## Verificação Rápida

Execute estes comandos para verificar se tudo está configurado:

```bash
# 1. Verificar se a Evolution API existe
ls ../../ap.api/evolution-api

# 2. Verificar se está compilada
ls ../../ap.api/evolution-api/dist

# 3. Verificar variáveis de ambiente
cat .env | grep EVOLUTION_API_PATH

# 4. Testar a API
curl http://localhost:8787/health
```

## Estrutura Esperada

```
botoes/
├── baileys_interactive/
│   ├── src/
│   │   ├── services/
│   │   │   └── evolution-adapter.ts  ← Adaptador Evolution API
│   │   ├── routes/
│   │   │   ├── instances.ts          ← Rotas atualizadas
│   │   │   └── messages.ts           ← Rotas atualizadas
│   │   └── config.ts                 ← Config com EVOLUTION_API_PATH
│   └── .env                           ← Configurações
└── ap.api/
    └── evolution-api/
        ├── src/                       ← Código fonte
        └── dist/                      ← Código compilado (deve existir)
```

## Próximos Passos se Ainda Não Funcionar

1. **Verifique os logs**: Os erros detalhados aparecem no console
2. **Teste a Evolution API separadamente**: Certifique-se de que ela funciona sozinha
3. **Use modo desenvolvimento**: Execute com `npm run dev` para ver erros em tempo real
4. **Verifique a versão**: Certifique-se de que está usando versões compatíveis

## Suporte

Se os problemas persistirem:
1. Verifique a documentação da Evolution API: https://github.com/EvolutionAPI/evolution-api
2. Verifique os logs detalhados no console
3. Certifique-se de que todas as dependências estão instaladas
