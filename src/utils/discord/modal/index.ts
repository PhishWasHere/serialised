import { Modal, TextInputComponent } from 'discord-modals';
import { Interaction } from 'discord.js';
import getError from '../../get-error';

const modalBuilder = (interaction: Interaction) => {
    try {
        const modal = new Modal()
        .setCustomId('login')
        .setTitle('Login to scrape your follow list')
        .addComponents(
          new TextInputComponent()
            .setCustomId('username')
            .setLabel('Username')
            .setStyle('LONG')
            .setMinLength(1)
            .setMaxLength(30)
            .setPlaceholder('username')
            .setRequired(true)
        )
        .addComponents(
          new TextInputComponent()
            .setCustomId('password')
            .setLabel('Password')
            .setStyle('LONG')
            .setMinLength(1)
            .setMaxLength(30)
            .setPlaceholder('password (i recommend using a temp password)')
            .setRequired(true)
        )
        return modal;

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
}
export default modalBuilder;