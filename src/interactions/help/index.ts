import getError from "../../utils/get-error";
import { CommandInteraction } from "discord.js";
import embedBuilder from "../../utils/discord/embed";

export const helpCmd = async (i: CommandInteraction) => {
    try {
        const { options } = i;

        const about = options.get('about')
        const privacy = options.get('privacy');
        const updated = options.get('updated');
        const checkFollow = options.get('check-follow');
        const error = options.get('error');
        
        switch (true) {
            case about !== null:
                return i.reply({embeds: [embedBuilder({ title: 'About', desc: `This is an open-source bot to check if the manga you're reading is still updated on MangaDex. You can find the source code [here](https://github.com/PhishWasHere/serialised). \nThe bot uses Manganato as a source, so if something isn't updated on Manganato, the bot will assume that the manga isn't updated anywhere.`, other: true })]});
            break;
          
            case privacy !== null:
                return i.reply({embeds: [embedBuilder({ title: 'Privacy', desc: `This bot does not store any sensitive user data; however, if you plan to use the check-follow command, I would recommend setting up a temporary MangaDex password. The only data that is stored is the data that is stored by Discord.`, other: true })]});
            break;
          
            case updated !== null:
                return i.reply({embeds: [embedBuilder({ title: 'Updated', desc: `This command checks if a manga is updated on MangaDex. You can use this command by using '/updated <title>'.`, other: true })]});
            break;
          
            case checkFollow !== null:
                return i.reply({embeds: [embedBuilder({ title: 'Check Follow', desc: `This command checks your follow list on MangaDex to see what is/isn't being updated. To use this command, you will need to log in to your MangaDex account (the MD API doesn't give follow lists unless a user is signed in). \nIf you're concerned about your data and privacy, use /help <privacy>.`, other: true })]});
            break;
          
            case error !== null:
                return i.reply({embeds: [embedBuilder({ title: `Error's`, desc: `A common error you will encounter is that a few manga will return errors. \nOften, this happens if MangaDex doesnt return an expected value when the bot tries to get a chapter number.`, other: true })]});
            break;
          
            default:
              return i.reply({embeds: [embedBuilder({ title: 'Help', desc: `This is an open-source bot to check if the manga you're reading is still updated on MangaDex. You can find the source code [here](https://github.com/PhishWasHere/serialised) \nYou can select an option by entering anything in the option field (e.g., /help <about: anything>).`, other: true })]});
            break;
          } 

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};