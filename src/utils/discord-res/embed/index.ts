import { Interaction, EmbedBuilder } from 'discord.js';

export const embedBuilder = ( title: string, desc: string, success?: boolean, err?: boolean, warn?: boolean) => {
    const embed = new EmbedBuilder();
    if (err) {
        embed.setTitle(`Error: ${title}`);
        embed.setDescription(desc);
        embed.setColor("#FF0000");
    } else if (warn){
        embed.setTitle(`Warning: ${title}`);
        embed.setDescription(desc);
        embed.setColor('#ffff00');
    } else if (success){
        embed.setTitle(title);
        embed.setDescription(desc);
        embed.setColor('#7CFC00');
    } else {
        embed.setTitle(title);
        embed.setDescription(desc);
        embed.setColor('#00FFFF');
    }
    return embed;
}

 