// --- 1. SITE FALSO PARA O RENDER (OBRIGATÓRIO) ---
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}`);
  res.send('Ticket Bot Online 🎫');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Site falso rodando na porta: ${port}`);
});

// --- 2. CÓDIGO DO BOT DE TICKET ---
require('dotenv').config();
const { 
    Client, GatewayIntentBits, Partials, 
    EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, 
    ModalBuilder, TextInputBuilder, TextInputStyle, 
    StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
    ChannelType, PermissionsBitField 
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Configuração Temporária (Reseta se o bot reiniciar, mas o painel publicado fica)
let ticketConfig = {
    embedTitle: "Central de Suporte",
    embedDesc: "Clique no botão abaixo para abrir um ticket de atendimento.",
    embedColor: 0x5865F2, 
    btnLabel: "Abrir Ticket",
    btnEmoji: "🎫"
};

client.once('ready', async () => {
    console.log(`✅ ${client.user.tag} está online!`);
    
    // Registro Rápido usando a variável MAIN_GUILD do Render
    const guildId = process.env.MAIN_GUILD;
    if (guildId) {
        const guild = client.guilds.cache.get(guildId);
        if (guild) {
            await guild.commands.set([{
                name: 'painel',
                description: 'Abre o menu de configuração do Ticket'
            }]);
            console.log(`✅ Comando /painel registrado em: ${guild.name}`);
        }
    } else {
        console.log("⚠️ MAIN_GUILD não configurado no Render. O comando pode demorar para aparecer.");
        await client.application.commands.set([{
            name: 'painel',
            description: 'Abre o menu de configuração do Ticket'
        }]);
    }
});

client.on('interactionCreate', async interaction => {
    
    // --- COMANDO /PAINEL ---
    if (interaction.isChatInputCommand() && interaction.commandName === 'painel') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
            return interaction.reply({ content: '❌ Apenas admins.', ephemeral: true });

        await enviarPainelConfig(interaction);
    }

    // --- MENU DROP-DOWN ---
    if (interaction.isStringSelectMenu() && interaction.customId === 'menu_config') {
        const opcao = interaction.values[0];

        if (opcao === 'cfg_msg') {
            const modal = new ModalBuilder().setCustomId('modal_msg').setTitle('Configurar Mensagem');
            const inputTitle = new TextInputBuilder().setCustomId('in_title').setLabel("Título do Painel").setValue(ticketConfig.embedTitle).setStyle(TextInputStyle.Short);
            const inputDesc = new TextInputBuilder().setCustomId('in_desc').setLabel("Descrição").setValue(ticketConfig.embedDesc).setStyle(TextInputStyle.Paragraph);
            modal.addComponents(new ActionRowBuilder().addComponents(inputTitle), new ActionRowBuilder().addComponents(inputDesc));
            await interaction.showModal(modal);
        }

        if (opcao === 'cfg_btn') {
            const modal = new ModalBuilder().setCustomId('modal_btn').setTitle('Configurar Botão');
            const inputLabel = new TextInputBuilder().setCustomId('in_label').setLabel("Texto do Botão").setValue(ticketConfig.btnLabel).setStyle(TextInputStyle.Short);
            const inputEmoji = new TextInputBuilder().setCustomId('in_emoji').setLabel("Emoji (ex: 🎫)").setValue(ticketConfig.btnEmoji).setStyle(TextInputStyle.Short);
            modal.addComponents(new ActionRowBuilder().addComponents(inputLabel), new ActionRowBuilder().addComponents(inputEmoji));
            await interaction.showModal(modal);
        }

        if (opcao === 'cfg_publicar') {
            try {
                await interaction.deferUpdate(); 
                const finalEmbed = new EmbedBuilder()
                    .setTitle(ticketConfig.embedTitle)
                    .setDescription(ticketConfig.embedDesc)
                    .setColor(ticketConfig.embedColor)
                    .setFooter({ text: 'Sistema de Tickets' })
                    .setThumbnail(client.user.displayAvatarURL());

                const finalBtn = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('abrir_ticket_action')
                        .setLabel(ticketConfig.btnLabel)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(ticketConfig.btnEmoji) 
                );

                await interaction.channel.send({ embeds: [finalEmbed], components: [finalBtn] });
                await interaction.editReply({ content: `✅ **Painel publicado com sucesso!**`, components: [], embeds: [] });
            } catch (erro) {
                console.log(erro);
                await interaction.followUp({ content: `❌ Erro ao enviar. Verifique permissões ou emoji inválido.`, ephemeral: true });
            }
        }
    }

    // --- MODALS (SALVAR TEXTO) ---
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'modal_msg') {
            ticketConfig.embedTitle = interaction.fields.getTextInputValue('in_title');
            ticketConfig.embedDesc = interaction.fields.getTextInputValue('in_desc');
            await interaction.reply({ content: '✅ Texto atualizado!', ephemeral: true });
        }
        if (interaction.customId === 'modal_btn') {
            ticketConfig.btnLabel = interaction.fields.getTextInputValue('in_label');
            ticketConfig.btnEmoji = interaction.fields.getTextInputValue('in_emoji');
            await interaction.reply({ content: '✅ Botão atualizado!', ephemeral: true });
        }
    }

    // --- ABRIR TICKET (LÓGICA PRINCIPAL) ---
    if (interaction.isButton() && interaction.customId === 'abrir_ticket_action') {
        const existingChannel = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id);
        if (existingChannel) return interaction.reply({ content: `❌ Você já tem um ticket aberto: ${existingChannel}`, ephemeral: true });

        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            topic: interaction.user.id,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                { id: client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
                // Dica: Adicione aqui o ID do cargo de suporte se quiser que eles vejam também
            ]
        });

        // MENSAGEM DENTRO DO TICKET (A que você personalizou)
        const ticketEmbed = new EmbedBuilder()
            .setDescription(`Olá ${interaction.user}, descreva seu problema, ou caso for adquirir, envie seu webhook, e diga se quer free ou premium. Aguarde.`)
            .setColor(0x00FF00);

        const closeBtn = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('fechar_tkt').setLabel('Encerrar Atendimento').setStyle(ButtonStyle.Danger).setEmoji('🔒')
        );

        await channel.send({ content: `${interaction.user}`, embeds: [ticketEmbed], components: [closeBtn] });
        await interaction.reply({ content: `✅ Ticket criado: ${channel}`, ephemeral: true });
    }

    // --- FECHAR TICKET ---
    if (interaction.isButton() && interaction.customId === 'fechar_tkt') {
        interaction.reply('🔒 O ticket será fechado em 5 segundos...');
        setTimeout(() => interaction.channel.delete(), 5000);
    }
});

async function enviarPainelConfig(interaction) {
    const embed = new EmbedBuilder()
        .setAuthor({ name: "Configuração do Ticket", iconURL: interaction.client.user.displayAvatarURL() })
        .setDescription(`Use o menu abaixo para personalizar o painel antes de postar.`)
        .addFields({ name: 'Atual', value: `Título: ${ticketConfig.embedTitle}\nBotão: ${ticketConfig.btnLabel}`, inline: false })
        .setColor(0x2B2D31);

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('menu_config')
        .setPlaceholder('Selecione uma opção')
        .addOptions(
            new StringSelectMenuOptionBuilder().setLabel('Editar Texto').setDescription('Mude título e descrição').setValue('cfg_msg').setEmoji('📝'),
            new StringSelectMenuOptionBuilder().setLabel('Editar Botão').setDescription('Mude nome e emoji').setValue('cfg_btn').setEmoji('🔘'),
            new StringSelectMenuOptionBuilder().setLabel('Publicar').setDescription('Postar no canal').setValue('cfg_publicar').setEmoji('🚀')
        );

    const row = new ActionRowBuilder().addComponents(selectMenu);
    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}

client.login(process.env.BOT_TOKEN);
