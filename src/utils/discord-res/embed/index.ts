import { Interaction, EmbedBuilder } from 'discord.js';

// embed builder function
export const embedBuilder = ( title: string, desc: string, image?: string | null, success?: boolean, err?: boolean, warn?: boolean, other?: boolean) => {
    const embed = new EmbedBuilder();

    if (!image || image === null) {
        image = 'https://i.imgur.com/2t1vVZu.png';
    }

    if (err) {
        embed.setTitle(`${title}`);
        embed.setDescription(desc);
        embed.setColor("#FF0000");
    } else if (warn){
        embed.setTitle(`${title}`);
        embed.setDescription(desc);
        embed.setColor('#ffff00');
        embed.setImage(image);
    } else if (success){
        embed.setTitle(title);
        embed.setDescription(desc);
        embed.setColor('#7CFC00');
        embed.setImage(image);
    } else if (other){
        embed.setTitle(title);
        embed.setDescription(desc);
        embed.setColor('#FFA500');
        embed.setImage(image);
    } else {
        embed.setTitle(title);
        embed.setDescription(desc);
        embed.setColor('#00FFFF');
        embed.setImage(image);
    }
    return embed;
}

 