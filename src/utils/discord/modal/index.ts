import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, Interaction, AnyComponentBuilder } from 'discord.js';
import getError from '../../get-error';

const loginModalBuilder = (interaction: Interaction) => {
  try {
    const modal = new ModalBuilder()
      .setCustomId('login')
      .setTitle('Login to scrape your follow list')

    const username = new TextInputBuilder()
      .setCustomId('username')
      .setLabel('Username')
      .setStyle(TextInputStyle.Short)
      .setMinLength(1)
      .setMaxLength(30)
      .setPlaceholder('username')
      .setRequired(true)

    const password = new TextInputBuilder()
      .setCustomId('password')
      .setLabel('Password')
      .setStyle(TextInputStyle.Short)
      .setMinLength(1)
      .setMaxLength(30)
      .setPlaceholder('password (i recommend using a temp password)')
      .setRequired(true)

    const fisrtRow = new ActionRowBuilder<TextInputBuilder>().addComponents(username);
    const secondRow = new ActionRowBuilder<TextInputBuilder>().addComponents(password);

    const actionRow: ActionRowBuilder<TextInputBuilder>[] = [fisrtRow, secondRow];

    modal.addComponents(...actionRow);

    return modal;

  } catch (err) {
    const errMsg = getError(err);
    throw new Error(errMsg);
  }
}

export default loginModalBuilder;