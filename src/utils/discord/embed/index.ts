import { EmbedBuilder } from 'discord.js';

type embedBuilderType = {
    title: string;
    desc: string;
    image?: string | null;
    success?: boolean;
    err?: boolean;
    warn?: boolean;
    other?: boolean;
}

// embed builder function
const embedBuilder = ({ title, desc, image, success, err, warn, other }: embedBuilderType) => {
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
        embed.setColor('#800080');
        embed.setImage(image);
    } else {
        embed.setTitle(title);
        embed.setDescription(desc);
        embed.setColor('#00FFFF');
        embed.setImage(image);
    }
    return embed;
}

export default embedBuilder;